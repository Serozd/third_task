var GameManager = artifacts.require("GameManager");
var RockPaperScissors = artifacts.require("RockPaperScissors");
const expectedExceptionPromise = require("./expected_exception_testRPC_and_geth.js");
const sha3 = require("browserify-sha3");

contract('GameManager', function(accounts) {
    var instance;

    var password1 = '0;randomstring';
    var password1 = password1.length ==32 ? password1 : password1 + Array(32- password1.length + 1).join(String.fromCharCode(0));
    var password1_hash = (new sha3.SHA3Hash(256)).update(password1).digest();

    var password2 = '1;randomstring';
    var password2 = password2.length ==32 ? password2 : password2 + Array(32- password2.length + 1).join(String.fromCharCode(0));
    var password2_hash = (new sha3.SHA3Hash(256)).update(password2).digest();


    beforeEach(function() {
        return GameManager.new({from: accounts[0]}).then(function(contract) {
            instance = contract;
        });
    });

    var stage1 = function(){
        return instance.charge({from: accounts[1], value: web3.toWei(0.1)}).then(
            function() {
                return instance.charge({from: accounts[2], value: web3.toWei(0.1)});
            }).then(function() {
                return instance.propose(accounts[2], web3.toWei(0.1), {from: accounts[1]});
            }).then(function(gameid) {
                return instance.acceptGame(0,{from: accounts[2]}).then(function() {
                    return instance.createGame(0, {from: accounts[0]});
                });
            }).then(function() {
                return instance.gameList(1);
            });
    }

    it("should have 0 eth balance initially", function() {
        return new Promise(function(resolve, reject) {
            resolve(web3.eth.getBalance(instance.address));
        }).then(function(balance) {
            assert.equal(balance.valueOf(), 0, "should have 0 eth balance initially");
        });
    });

    it("should charge eth balance for user", function() {
        return instance.charge({from: accounts[1], value: web3.toWei(0.1)}).then(
            function() {
                return instance.balances(accounts[1]);
            }).then(function(balance) {
                assert.equal(balance[0].valueOf(), web3.toWei(0.1), "should have 0.1 eth");
            });
    });

    it("should froze balance after game start", function() {
        return stage1().then(function (game) {
                assert.equal(game[1].valueOf(), web3.toWei(0.1), "should have 0.1 eth locked");
            });
    });

    it("should unlock funds after winner resolved", function() {
        return stage1().then(function (game) {
                return RockPaperScissors.at(game[0]);
            }).then(function(inst) {
                return inst.play(password1_hash, {from: accounts[1]}).then(function() {
                    return inst.play(password2_hash, {from: accounts[2]});
                }).then(function() {
                    return inst.reveal.sendTransaction(password2, {from: accounts[2]});
                }).then(function() {
                    return inst.reveal.sendTransaction(password1, {from: accounts[1]});
                });
            }).then(function() {
                return instance.collectWinnings(1);
            }).then(function() {
                return instance.gameList(1);
            }).then(function(game) {
                assert.equal(game[2], true, "should be collected");
            });
    });
});

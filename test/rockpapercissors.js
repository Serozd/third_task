var RockPaperScissors = artifacts.require("RockPaperScissors");
const expectedExceptionPromise = require("./expected_exception_testRPC_and_geth.js");
const sha3 = require("browserify-sha3");

contract('RockPaperScissors', function(accounts) {
    var instance;
    var password1 = '0;randomstring';
    var password1 = password1.length ==32 ? password1 : password1 + Array(32- password1.length + 1).join(String.fromCharCode(0));
    var password1_hash = (new sha3.SHA3Hash(256)).update(password1).digest();

    var password2 = '1;randomstring';
    var password2 = password2.length ==32 ? password2 : password2 + Array(32- password2.length + 1).join(String.fromCharCode(0));
    var password2_hash = (new sha3.SHA3Hash(256)).update(password2).digest();

    beforeEach(function() {
        return RockPaperScissors.new(accounts[1], accounts[2],{from: accounts[0]}).then(function(contract) {
            instance = contract;
        });
    });


    it("should have 0 eth balance initially", function() {
        return new Promise(function(resolve, reject) {
            resolve(web3.eth.getBalance(instance.address));
        }).then(function(balance) {
            assert.equal(balance.valueOf(), 0, "should have 0 eth balance initially");
        });
    });


    it("should have second phase after 2 moves", function() {
        return instance.play(password1_hash, {from: accounts[1], value: web3.toWei(0.1)}).then(function() {
            return instance.play(password2_hash, {from: accounts[2], value: web3.toWei(0.1)})
        }).then(function() {
            return instance.phase.call();
        }).then(function(value) {
            assert.equal(value.valueOf(), true, "should have second phase");
        });
    });

    it("should resolve winner after second phase", function() {
        
        return instance.play(password1_hash, {from: accounts[1], value: web3.toWei(0.1)}).then(function() {
            return instance.play(password2_hash, {from: accounts[2], value: web3.toWei(0.1)});
        }).then(function() {
            return instance.reveal.sendTransaction(password2, {from: accounts[2]});
        }).then(function() {
            return instance.reveal.sendTransaction(password1, {from: accounts[1]});
        }).then(function() {
            return instance.resolveWinner();
        }).then(function (value) {
            assert.equal(value.valueOf(), -1, 'player one should lose');
        });
    });
});
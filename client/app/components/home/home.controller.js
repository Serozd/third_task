import * as sha3 from "browserify-sha3";
import * as contract from '../../../../build/contracts/RockPaperScissors.json';
import * as truffleContract from 'truffle-contract';
import * as web3 from 'web3';
import { Promise } from 'bluebird';

web3.providers.HttpProvider.prototype.sendAsync = web3.providers.HttpProvider.prototype.send;

class HomeController {
  constructor() {
    this.name = 'home';
    this.vote = '';
    this.voteMapping = {r:0, p:1, s:2};
    this.instanceAddress = '';
    this.sourceAddress = '';
    this.rpcProviderUrl = '';
    this.password  = '';
    this.passwordHash = '';

  }

  createRandomPassword = () => {
    let a = '';
    for (let i = 0; i < 4; i++) {
      a += Math.random().toString(36).substring(7);
     } 
    this.randomPassword = a;
  }

  delay = (t, v) => {
        return new Promise(function(resolve) { 
	        setTimeout(resolve.bind(null, v), t)
	    });
  }

  waitForOponent = (instance) => {
  	var self = this;
  	return this.delay(1000).then(() => {
  		return instance.phase({from:self.sourceAddress});
  	}).then((phase) => {
		if(phase.valueOf() === true ){
			return instance.reveal(self.passwordHash, {from: self.sourceAddress});
		} else {
			return self.waitForOponent(instance);
		}
	})
  }

  submit = () => {
  	let web3p = Promise.promisify(web3.default);
    let RockPaperScissors = truffleContract.default(contract);
    var provider = new Promise.promisify(web3.providers.HttpProvider).call(this.rpcProviderUrl);
    var Web3 = web3p.call(provider);
    RockPaperScissors.setProvider(provider);
    let self = this;
    let password1 = str(this.voteMapping[this.vote]) + ";" + this.createRandomPassword();
    password1 = password1.length ==32 ? password1 : password1 + Array(32- password1.length + 1).join(String.fromCharCode(0));
    this.password = password1;
    var password1_hash = (new sha3.SHA3Hash(256)).update(password1).digest();
    this.passwordHash = (new sha3.SHA3Hash(256)).update(password1).digest('hex');
    RockPaperScissors.at(self.instanceAddress).then((instance) => {
    		return instance.play(password1_hash, {from: self.sourceAddress}).then(() => {
	    		return instance.phase({from:self.sourceAddress});
	    	}).then((phase) => {
	    		if(phase.valueOf() === true ){
	    			return instance.reveal(self.passwordHash, {from: self.sourceAddress});
	    		} else {
	    			return self.waitForOponent(instance);
	    		}
	    	});
    	});
  }
}

export default HomeController;

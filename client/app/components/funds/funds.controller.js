import * as contract from '../../../../build/contracts/GameManager.json';
import * as truffleContract from 'truffle-contract';
import * as web3 from 'web3';
import { Promise } from 'bluebird';



class FundsController {
  constructor() {
    this.name = 'funds';
    this.availableBalance = 0;
    this.frozenBalance = 0;
    this.chargeAmount = 0;
    this.gameId =-1;
    this.sourceAddress = '';
    this.instanceAddress = '';
	this.rpcProviderUrl = '';
  }

  getAvailableBalance = () => {
  	let web3p = Promise.promisify(web3.default);
    let GameManager = truffleContract.default(contract);
    var provider = new Promise.promisify(web3.providers.HttpProvider).call(this.rpcProviderUrl);
    var Web3 = web3p.call(provider);
    GameManager.setProvider(provider);
    let self = this;
    GameManager.at(self.instanceAddress).then((instance) => {
    	return instance.balances(self.sourceAddress, {from: self.sourceAddress}).then((value) =>{
    		self.$scope.$apply(() =>{
  			self.availableBalance = value.balance;
  			self.frozenBalance = value.frozenBalance;
  		});
    	});
    });
  }

  withdraw = () => {
  	let web3p = Promise.promisify(web3.default);
    let GameManager = truffleContract.default(contract);
    var provider = new Promise.promisify(web3.providers.HttpProvider).call(this.rpcProviderUrl);
    var Web3 = web3p.call(provider);
    GameManager.setProvider(provider);
    let self = this;
    GameManager.at(self.instanceAddress).then((instance) => {
    	return instance.withdraw({from: self.sourceAddress}).then(() =>{
    		console.log('funds withdrawed');
    	});
    });
  }

  charge = () => {
    web3.providers.HttpProvider.prototype.sendAsync = web3.providers.HttpProvider.prototype.send;
    // let web3p = Promise.promisify(web3.default);
    let GameManager = truffleContract.default(contract);
    var provider = new web3.providers.HttpProvider(this.rpcProviderUrl);
    // var Web3 = web3.default(provider);
    GameManager.setProvider(provider);
    let self = this;
    GameManager.at(self.instanceAddress).then((instance) => {
      return instance.charge({from: self.sourceAddress, value: web3.utils.toWei(self.chargeAmount)}).then(() =>{
        console.log('funds added');
      });
    });
  }

  collect = () => {
    let web3p = Promise.promisify(web3.default);
    let GameManager = truffleContract.default(contract);
    var provider = new Promise.promisify(web3.providers.HttpProvider).call(this.rpcProviderUrl);
    var Web3 = web3p.call(provider);
    GameManager.setProvider(provider);
    let self = this;
    GameManager.at(self.instanceAddress).then((instance) => {
      return instance.collectWinnings(self.gameId, {from: self.sourceAddress}).then(() =>{
        console.log('winnings collected');
      });
    });
  }
}

export default FundsController;

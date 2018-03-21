import * as contract from '../../../../build/contracts/GameManager.json';
import * as truffleContract from 'truffle-contract';
import * as web3 from 'web3';
import { Promise } from 'bluebird';


class AcceptController {
  constructor() {
    this.name = 'accept';
    this.sourceAddress = '';
    this.rpcProviderUrl = '';
    this.instanceAddress = '';
    this.proposalId = -1;
  }

  accept = () => {
  	let web3p = Promise.promisify(web3.default);
    let GameManager = truffleContract.default(contract);
    var provider = new Promise.promisify(web3.providers.HttpProvider).call(this.rpcProviderUrl);
    var Web3 = web3p.call(provider);
    GameManager.setProvider(provider);
    let self = this;
    GameManager.at(self.instanceAddress).then((instance) => {
    	return instance.acceptGame(self.proposalId, {from: self.sourceAddress});
    }).then(() => {
    	self.$scope.$apply(() =>{
  			console.log("proposal accepted");
  		});
    });
  }
}

export default AcceptController;

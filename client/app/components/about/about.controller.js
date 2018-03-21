import * as contract from '../../../../build/contracts/GameManager.json';
import * as truffleContract from 'truffle-contract';
import * as web3 from 'web3';
import { Promise } from 'bluebird';



class AboutController {
  constructor($scope) {
    "ngInject";
    this.$scope = $scope;
    this.name = 'about';
    this.sourceAddress = '';
    this.rpcProviderUrl = '';
    this.instanceAddress = '';
    this.player2 = '';
    this.bet = 0;
    this.proposalId = -1;
  }

  delay = (t, v) => {
        return new Promise(function(resolve) { 
          setTimeout(resolve.bind(null, v), t)
      });
  }

  waitForOponent = (instance, proposalId) => {
    var self = this;
    return this.delay(1000).then(() => {
      return instance.proposals( proposalId, {from:self.sourceAddress});
    }).then((proposal) => {
    if(proposal.accepted.valueOf() === true ){
      return instance.createGame(proposalId, {from: self.sourceAddress});
    } else {
      return self.waitForOponent(instance, proposalId);
    }
  });
  }

  submit = () => {
  	let web3p = Promise.promisify(web3.default);
    web3p.providers.HttpProvider.prototype.sendAsync = web3p.providers.HttpProvider.prototype.send;
    let GameManager = truffleContract.default(contract);
    var provider = new Promise.promisify(web3.providers.HttpProvider).call(this.rpcProviderUrl);
    var Web3 = web3p.call(provider);
    GameManager.setProvider(provider);
    let self = this;
    GameManager.at(self.instanceAddress).then((instance) => {
    	return instance.propose(self.player2, web3.toWei(self.bet), {from: self.sourceAddress}).then((propId) => {
        self.$scope.$apply(() =>{
          self.proposalId = propId;
        });
        console.log("proposal created");
        return self.waitForOponent(instance, propId);
    });
    });
  }
}

AboutController.$inject = ['$scope'];

export default AboutController;

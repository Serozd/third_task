var GameManager = artifacts.require("./GameManager.sol");

module.exports = function(deployer) {
  deployer.deploy(GameManager);
};

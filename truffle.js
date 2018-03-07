var HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic = "abandon ability able about above absent absorb abstract absurd abuse access accident";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      // provider: new HDWalletProvider(mnemonic, "http://127.0.0.1:8545"),
      host: "127.0.0.1",
      port: 7545,
      gas: 4612388,
      gasProce: 100000000,
      network_id: 42 // Match any network id

    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
};

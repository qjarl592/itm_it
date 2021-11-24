const path = require("path");

const HDWalletProvider = require('@truffle/hdwallet-provider');
const infuraKey = 'e2559d731c1948ccb2f9df34ac13b9d9'

const fs = require('fs')
const mnemonic = fs.readFileSync('.secret').toString().trim();

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "5777",       // Any network (default: none)
    },
    ropsten: {
      provider: () => new HDWalletProvider(mnemonic, 'https://ropsten.infura.io/v3/e2559d731c1948ccb2f9df34ac13b9d9'),
      network_id: 3,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    }
  },
  

  compilers: {
    solc: {
      version: "0.8.0" // ex:  "0.4.20". (Default: Truffle's installed solc)
    }
  }
};

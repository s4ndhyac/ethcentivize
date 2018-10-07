// Allows us to use ES6 in our migrations and tests.
require('babel-register')
var HDWalletProvider = require('truffle-hdwallet-provider');
var mnemonic = "tag robust engage obscure hint wolf target amount shed promote priority bacon"

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      gasPrice: 20000000000,
      network_id: '*' // Match any network id
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/d60444d1ac6e4478b110e66a5a7f77f9")
      },
      network_id: 4,
      gasPrice: 10000000000,
    }
  }
}
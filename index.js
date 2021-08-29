const walletUrl = 'wss://eth-rinkeby.alchemyapi.io/v2/REPLACE_ME';
const walletMnemonic = '';

if(walletUrl === 'wss://eth-rinkeby.alchemyapi.io/v2/REPLACE_ME') {
  console.log('Replace walletUrl with your infura/alchemy/local node websocket (not https) endpoint');
  process.exit(-1);
}

if(walletMnemonic === '') {
  console.log('Replace walletMnemonic with 12 word seed which points to an account that has ETH');
  process.exit(-1);
}

console.log('Starting...');

const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');

const wsProvider = new Web3.providers.WebsocketProvider(walletUrl);
HDWalletProvider.prototype.on = wsProvider.on.bind(wsProvider); // so that you can listen to smart contract events (e.g., emit Foo)
const provider = new HDWalletProvider(walletMnemonic, wsProvider);
const web3 = new Web3(provider);

const zeroAddress = '0x0000000000000000000000000000000000000000';

async function start() {
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];

  console.log('Will send transaction...');

  web3.eth.sendTransaction({
    from: account,
    to: zeroAddress,
    value: new web3.utils.BN(1),
  }).on('transactionHash', function(txHash) {
    console.log('https://rinkeby.etherscan.io/tx/' + txHash);
    console.log('done');
    process.exit(0);
  });
}

start();



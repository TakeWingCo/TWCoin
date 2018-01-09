'use strict';

const fs = require('fs');
const assert = require('assert');

const accounts = JSON.parse(fs.readFileSync('accounts.json', 'ascii'));
const contracts = JSON.parse(fs.readFileSync('contracts.json', 'ascii'));

const Web3 = require('web3');
const net = require('net');

// const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:22000'));
const ipcPath = '/home/user/projects/quorum-examples/examples/new-node/qdata/dd/geth.ipc';
const web3 = new Web3(new Web3.providers.IpcProvider(ipcPath, net));

const utils = require('./utils');

async function mintCoins(address, amount) {
  // Load contracts
  let [_bin, abi] = utils.readBinAndAbi('../bin/EvolutionBank');
  const evolutionBank = new web3.eth.Contract(abi, contracts.evolutionBank);

  [_bin, abi] = utils.readBinAndAbi('../bin/CentralBank');
  const centralBank = new web3.eth.Contract(abi, contracts.centralBank);

  [_bin, abi] = utils.readBinAndAbi('../bin/Voters');
  const voters = new web3.eth.Contract(abi, contracts.voters);

  [_bin, abi] = utils.readBinAndAbi('../bin/TokenOwner');
  const tokenOwner = new web3.eth.Contract(abi, contracts.tokenOwner);

  const evolutionBanker0Unlock = await web3.eth.personal.unlockAccount(
    accounts.evolutionBankers[0].address,
    accounts.evolutionBankers[0].password,
  );
  console.log('evolutionBanker0Unlock', evolutionBanker0Unlock);

  let makeMintingOfferEvent = null;
  tokenOwner.once(
    'MakeMintingOffer',
    (err, event) => {
      console.log(err, event);
      makeMintingOfferEvent = event;
    },
  );
  const makeMintingOfferReceipt = await evolutionBank.methods.makeMintingOffer(amount, address)
    .send({ from: accounts.evolutionBankers[0].address, gas: 2000000, gasPrice: '0' });
  console.log('makeMintingOfferReceipt', makeMintingOfferReceipt);

  assert.ok(makeMintingOfferEvent);
  console.log('makeMintingOfferEvent', makeMintingOfferEvent);
  const offerId = makeMintingOfferEvent.returnValues.id;
  assert.equal(makeMintingOfferEvent.returnValues.value, amount);
  assert.equal(makeMintingOfferEvent.returnValues.to, address);

  const centralBanker0Unlock = await web3.eth.personal.unlockAccount(
    accounts.centralBankers[0].address,
    accounts.centralBankers[0].password,
  );
  console.log('centralBanker0Unlock', centralBanker0Unlock);

  let acceptByCentralBankerEvent = null;
  tokenOwner.once(
    'AcceptOffer',
    (err, event) => {
      console.log(err, event);
      acceptByCentralBankerEvent = event;
    },
  );
  const acceptByCentralBankerReceipt = await centralBank.methods.acceptOffer(offerId)
    .send({ from: accounts.centralBankers[0].address, gas: 2000000, gasPrice: '0' });
  console.log('acceptByCentralBankerReceipt', acceptByCentralBankerReceipt);
  console.log('acceptByCentralBankerEvent', acceptByCentralBankerEvent);
  assert.ok(acceptByCentralBankerEvent);
  assert.equal(acceptByCentralBankerEvent.returnValues.id, offerId);
  // assert.equal(
  //   acceptByCentralBankerEvent.returnValues.acceptor,
  //   accounts.centralBankers[0].address, // FIXME: possibly fix contract
  // );

  const voter0Unlock = await web3.eth.personal.unlockAccount(
    accounts.voters[0].address,
    accounts.voters[0].password,
  );
  console.log('voter0Unlock', voter0Unlock);

  let acceptByVoterEvent = null;
  tokenOwner.once(
    'AcceptOffer',
    (err, event) => {
      console.log(err, event);
      acceptByVoterEvent = event;
    },
  );
  const acceptByVoterReceipt = await voters.methods.acceptOffer(offerId)
    .send({ from: accounts.voters[0].address, gas: 2000000, gasPrice: '0' });
  console.log('acceptByVoterReceipt', acceptByVoterReceipt);
  console.log('acceptByVoterEvent', acceptByVoterEvent);
  assert.ok(acceptByVoterEvent);
  assert.equal(acceptByVoterEvent.returnValues.id, offerId);
  // assert.equal(
  //   acceptByVoterEvent.returnValues.acceptor,
  //   accounts.centralBankers[0].address, // FIXME: possibly fix contract
  // );

  const executeReceipt = await tokenOwner.methods.executeOffer(offerId)
    .send({ from: accounts.voters[0].address, gas: 2000000, gasPrice: '0' });
  console.log('executeReceipt', executeReceipt);
  assert.equal(executeReceipt.events.ExecuteOffer.returnValues.id, offerId);
  assert.equal(executeReceipt.events.ExecuteOffer.returnValues.result, true);

  console.log('token', await tokenOwner.methods.token().call({ gas: 2e6 }));
  console.log('evolutionBank', await tokenOwner.methods.evolutionBank().call({ gas: 2e6 }));

  console.log('Minting is OK');
}

module.exports.mintCoins = mintCoins;

async function test(amount) {
  const futureCoinOwner = await web3.eth.personal.newAccount('password');
  await mintCoins(futureCoinOwner, amount);
  console.log(`Minted ${amount} to address ${futureCoinOwner}`);
}

if (require.main === module) {
  test(1000000)
    .then((_result) => {})
    .catch(err => console.error('test error:', err));
}

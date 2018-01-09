'use strict';

const fs = require('fs');
const assert = require('assert');

const accounts = JSON.parse(fs.readFileSync('accounts.json', 'ascii'));
const contracts = JSON.parse(fs.readFileSync('contracts.json', 'ascii'));

const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:22000'));

/*
web3 = new Web3();
var net = require('net');
web3.setProvider(new web3.providers.IpcProvider("/home/geth/work/geth.ipc", net));
*/

/**
 * Basic test of BlackList contract.
 *
 * Create new account, check it is not banned, add it to black list
 * and check it is banned after.
 *
 * @returns {Promise<void>}
 */
async function testBlackList() {
  const someUserAddress = await web3.eth.personal.newAccount('password');

  const someUserUnlock = await web3.eth.personal.unlockAccount(someUserAddress, 'password');
  console.log('unlock', someUserUnlock);

  const blackListAbi = JSON.parse(fs.readFileSync('../bin/BlackList.abi', 'ascii'));
  const blackList = new web3.eth.Contract(blackListAbi, contracts.blackList);

  const inBlackListBefore = await blackList.methods.inBlackList(someUserAddress).call();
  assert.ok(!inBlackListBefore);

  const voter0 = accounts.voters[0];
  console.log('voter0', voter0);
  const unlockVoter0 = await web3.eth.personal
    .unlockAccount(voter0.address, voter0.password);
  console.log('unlockVoter1', unlockVoter0);

  const makeAdditionOfferReceipt = await blackList.methods.makeAdditionOffer(someUserAddress)
    .send({ from: voter0.address, gas: 1000000 })
    .on('transactionHash', (transactionHash) => {
      console.log('transactionHash', transactionHash);
    });
  console.log('makeAdditionOfferReceipt', makeAdditionOfferReceipt);

  const additionOfferId = makeAdditionOfferReceipt.events.MakeAdditionOffer.returnValues.id;

  const vote1Receipt = await blackList.methods.voteForOffer(additionOfferId)
    .send({ from: voter0.address });
  console.log('vote1Receipt', vote1Receipt);

  const voter1 = accounts.voters[1];
  const unlockVoter1 = await web3.eth.personal
    .unlockAccount(voter1.address, voter1.password);
  console.log('unlockVoter1', unlockVoter1);

  const vote2Receipt = await blackList.methods.voteForOffer(additionOfferId)
    .send({ from: voter1.address });
  console.log('vote2Receipt', vote2Receipt);

  const executeOfferReceipt = await blackList.methods.executeOffer(additionOfferId)
    .send({ from: voter1.address });
  console.log('executeOfferReceipt', executeOfferReceipt);

  const inBlackListAfter = await blackList.methods.inBlackList(someUserAddress).call();
  assert.ok(inBlackListAfter);

  console.log('test OK');
}

testBlackList()
  .then((_result) => {});

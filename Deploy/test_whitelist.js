'use strict';

const fs = require('fs');
const assert = require('assert');
const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:22000'));

const accounts = JSON.parse(fs.readFileSync('accounts.json', 'ascii'));

const contracts = JSON.parse(fs.readFileSync('contracts.json', 'ascii'));

/*
web3 = new Web3();
var net = require('net');
web3.setProvider(new web3.providers.IpcProvider("/home/geth/work/geth.ipc", net));
*/

/**
 * Basic test of WhiteList contract.
 *
 * Create new account, check it is not in the white list, add it there
 * and check it is present in white list.
 *
 * @returns {Promise<void>}
 */
async function testWhiteList() {
  const someUserAddress = await web3.eth.personal.newAccount('password');
  const someUserPassword = 'password';
  const { address: firstMaker, password: firstMakerPassword } = accounts.makers[0];

  const someUserUnlock = await web3.eth.personal.unlockAccount(someUserAddress, someUserPassword);
  console.log('someUserUnlock', someUserUnlock);

  const UnlockOfFirstMaker = await web3.eth.personal.unlockAccount(firstMaker, firstMakerPassword);
  console.log('maker1Unlock', UnlockOfFirstMaker);

  const whiteListAbi = JSON.parse(fs.readFileSync('../bin/WhiteList.abi', 'ascii'));
  const whiteList = new web3.eth.Contract(whiteListAbi, contracts.whiteList);

  const inWhiteListBefore = await whiteList.methods.inWhiteList(someUserAddress).call();
  assert.ok(!inWhiteListBefore);

  const addInToWhiteListReceipt = await whiteList.methods.addInToWhiteList(someUserAddress)
    .send({ from: firstMaker, gas: 2000000 })
    .on('transactionHash', (transactionHash) => {
      console.log('transactionHash', transactionHash);
    });
  console.log('addInToWhiteListReceipt', addInToWhiteListReceipt);

  assert.equal(
    addInToWhiteListReceipt.events.AdditionInToWhiteList.returnValues.registrar,
    firstMaker,
  );
  assert.equal(
    addInToWhiteListReceipt.events.AdditionInToWhiteList.returnValues.object,
    someUserAddress,
  );

  const inWhiteListAfter = await whiteList.methods.inWhiteList(someUserAddress).call();
  assert.ok(inWhiteListAfter);

  console.log('test OK');
}

testWhiteList()
  .then((_result) => {})
  .catch(err => console.error('testWhiteList error:', err));

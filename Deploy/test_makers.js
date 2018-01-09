'use strict';

const fs = require('fs');
const assert = require('assert');

const predefinedAccounts = JSON.parse(fs.readFileSync('accounts.json', 'ascii'));
const contracts = JSON.parse(fs.readFileSync('contracts.json', 'ascii'));

const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:22000'));

/*
web3 = new Web3();
var net = require('net');
web3.setProvider(new web3.providers.IpcProvider("/home/geth/work/geth.ipc", net));
*/

/**
 * Basic test of makers contract.
 *
 * Test that predefined addresses of makers are present in the contract.
 *
 * @returns {Promise<void>}
 */
async function testMakersPredefinedAddresses(makersContract) {
  const promises = [];
  for (let iMaker = 0; iMaker < predefinedAccounts.makers.length; iMaker += 1) {
    const makerAddress = predefinedAccounts.makers[iMaker].address;
    console.log('makerAddress', makerAddress);
    promises.push(makersContract.methods.isMaker(makerAddress).call({ gas: 10000000 }));
  }
  const results = await Promise.all(promises);
  console.log(results);
  for (let iMaker = 0; iMaker < predefinedAccounts.makers.length; iMaker += 1) {
    assert.ok(results[iMaker]);
  }
  console.log('predefined maker addresses are OK');
}

/**
 * Basic test of makers contract.
 *
 * Test that predefined enodes of makers are present in the contract.
 *
 * @returns {Promise<void>}
 */
async function testMakersPredefinedEnodes(makersContract) {
  const promises = [];
  for (let iMaker = 0; iMaker < predefinedAccounts.makers.length; iMaker += 1) {
    const makerEnode = predefinedAccounts.makers[iMaker].enode;
    promises.push(makersContract.methods.isMakerEnode(makerEnode).call({ gas: 10000000 }));
  }
  const results = await Promise.all(promises);
  console.log(results);
  for (let iMaker = 0; iMaker < predefinedAccounts.makers.length; iMaker += 1) {
    assert.ok(results[iMaker]);
  }
  console.log('predefined maker enodes are OK');
}

/**
 * Launcher of tests
 *
 * @returns {Promise<void>}
 */
async function testMakers() {
  // const someUserAddress = await web3.eth.personal.newAccount('password');
  // const someUserUnlock = await web3.eth.personal.unlockAccount(someUserAddress, 'password');
  // console.log('unlock', someUserUnlock);

  const makersAbi = JSON.parse(fs.readFileSync('../bin/Makers.abi', 'ascii'));
  const makersContract = new web3.eth.Contract(makersAbi, contracts.makers);

  await testMakersPredefinedAddresses(makersContract);
  await testMakersPredefinedEnodes(makersContract);
}

testMakers()
  .then((_result) => {})
  .catch(err => console.error('testMakers error:', err));

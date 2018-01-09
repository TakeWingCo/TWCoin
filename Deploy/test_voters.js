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
 * Basic test of voters contract.
 *
 * Test that predefined addresses of voters are present in the contract.
 *
 * @returns {Promise<void>}
 */
async function testVotersPredefinedAddresses(votersContract) {
  const promises = [];
  for (let iVoter = 0; iVoter < accounts.voters.length; iVoter += 1) {
    const voterAddress = accounts.voters[iVoter].address;
    console.log('voterAddress', voterAddress);
    promises.push(votersContract.methods.isVoter(voterAddress).call({ gas: 10000000 }));
  }
  const results = await Promise.all(promises);
  console.log(results);
  for (let iVoter = 0; iVoter < accounts.voters.length; iVoter += 1) {
    assert.ok(results[iVoter]);
  }
  console.log('predefined voter addresses are OK');
}

/**
 * Basic test of voters contract.
 *
 * Test that predefined enodes of voters are present in the contract.
 *
 * @returns {Promise<void>}
 */
async function testVotersPredefinedEnodes(votersContract) {
  const promises = [];
  for (let iVoter = 0; iVoter < accounts.voters.length; iVoter += 1) {
    const voterEnode = accounts.voters[iVoter].enode;
    promises.push(votersContract.methods.isVoterEnode(voterEnode).call({ gas: 10000000 }));
  }
  const results = await Promise.all(promises);
  console.log(results);
  for (let iVoter = 0; iVoter < accounts.voters.length; iVoter += 1) {
    assert.ok(results[iVoter]);
  }
  console.log('predefined voter enodes are OK');
}

/**
 * Launcher of tests
 *
 * @returns {Promise<void>}
 */
async function testVoters() {
  // const someUserAddress = await web3.eth.personal.newAccount('password');
  // const someUserUnlock = await web3.eth.personal.unlockAccount(someUserAddress, 'password');
  // console.log('unlock', someUserUnlock);

  const votersAbi = JSON.parse(fs.readFileSync('../bin/Voters.abi', 'ascii'));
  const votersContract = new web3.eth.Contract(votersAbi, contracts.voters);

  await testVotersPredefinedAddresses(votersContract);
  await testVotersPredefinedEnodes(votersContract);
}

testVoters()
  .then((_result) => {})
  .catch(err => console.error('testVoters error:', err));

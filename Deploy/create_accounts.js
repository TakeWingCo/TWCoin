'use strict';

const fs = require('fs');

const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:22000'));

async function createAccount(password) {
  const address = await web3.eth.personal.newAccount(password);
  return { address, password };
}

/**
 * Hardcoded enodes for first five nodes from standard 7nodes example.
 * Enode is 64 bytes (512 bits) that are divided into two blocks
 * of 32 bytes. This division is made because Solidity has type
 * bytes32 but does not have bytes64.
 *
 * @type {*[]}
 */
const enodesOf7Nodes = [
  [
    '0xac6b1096ca56b9f6d004b779ae3728bf83f8e22453404cc3cef16a3d9b96608b',
    '0xc67c4b30db88e0a5a6c6390213f7acbe1153ff6d23ce57380104288ae19373ef',
  ],
  [
    '0x0ba6b9f606a43a95edc6247cdb1c1e105145817be7bcafd6b2c0ba15d58145f0',
    '0xdc1a194f70ba73cd6f4cdd6864edc7687f311254c7555cc32e4d45aeb1b80416',
  ],
  [
    '0x579f786d4e2830bbcc02815a27e8a9bacccc9605df4dc6f20bcc1a6eb391e722',
    '0x5fff7cb83e5b4ecd1f3a94d8b733803f2f66b7e871961e7b029e22c155c3a778',
  ],
  [
    '0x3d9ca5956b38557aba991e31cf510d4df641dce9cc26bfeb7de082f0c07abb6e',
    '0xde3a58410c8f249dabeecee4ad3979929ac4c7c496ad20b8cfdd061b7401b4f5',
  ],
  [
    '0x3701f007bfa4cb26512d7df18e6bbd202e8484a6e11d387af6e482b525fa2554',
    '0x2d46ff9c99db87bd419b980c24a086117a397f6d8f88e74351b41693880ea0cb',
  ],
];

async function createAccounts() {
  const accounts = {};

  // Parallel creation of accounts may cause geth crash.
  // Hence here accounts are created serially.

  accounts.initialDeployer = await createAccount('password1');
  accounts.regulator = await createAccount('password2');

  const voter1 = await createAccount('password3');
  const voter2 = await createAccount('password4');
  const voter3 = await createAccount('password5');

  const maker1 = await createAccount('password6');
  const maker2 = await createAccount('password7');

  [
    voter1.enode,
    voter2.enode,
    voter3.enode,
    maker1.enode,
    maker2.enode,
  ] = enodesOf7Nodes;

  accounts.voters = [voter1, voter2, voter3];
  accounts.makers = [maker1, maker2];

  const centralBanker1 = await createAccount('password8');
  const centralBanker2 = await createAccount('password9');
  const centralBanker3 = await createAccount('password10');

  accounts.centralBankers = [centralBanker1, centralBanker2, centralBanker3];

  const evolutionBanker1 = await createAccount('password11');
  const evolutionBanker2 = await createAccount('password12');
  const evolutionBanker3 = await createAccount('password13');

  accounts.evolutionBankers = [evolutionBanker1, evolutionBanker2, evolutionBanker3];

  const accountsString = JSON.stringify(accounts, null, 2);
  console.log('Accounts content:\n');
  console.log(accountsString);
  console.log('\nWriting object to "accounts.json"');

  fs.writeFileSync('accounts.json', accountsString);
}

createAccounts()
  .then((_result) => {});

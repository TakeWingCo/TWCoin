'use strict';

const fs = require('fs');
const Web3 = require('web3');
const assert = require('assert');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:22000'));

const accounts = JSON.parse(fs.readFileSync('accounts.json', 'ascii'));

/*
web3 = new Web3();
var net = require('net');
web3.setProvider(new web3.providers.IpcProvider("/home/geth/work/geth.ipc", net));
*/

const utils = require('./utils');

const { deployContract, readBinAndAbi } = utils;

/*
async function setupMakers(makersContract, makers, voters) {
  for (let iVoter = 0; iVoter < voters.length; iVoter += 1) {
    // eslint-disable-next-line no-await-in-loop
    const voterUnlock = await web3.eth.personal
      .unlockAccount(voters[iVoter].address, voters[iVoter].password);
    console.log(`votes[${iVoter}] unlock ${voterUnlock}`);
  }

  for (let iMaker = 0; iMaker < makers.length; iMaker += 1) {
    const makerAddress = makers[iMaker].address;
    // eslint-disable-next-line no-await-in-loop
    const makeAdditionOfferReceipt = await makersContract
      .methods.makeAdditionOffer(makerAddress, [0, 0])
      .send({ from: voters[0].address, gas: 1000000 });
    console.log('makeAdditionOfferReceipt', makeAdditionOfferReceipt);

    assert.equal(
      makeAdditionOfferReceipt.events.MakeAdditionOffer.returnValues.object,
      makerAddress,
    );
    const additionId = makeAdditionOfferReceipt.events.MakeAdditionOffer.returnValues.id;

    for (let iVoter = 0; iVoter < voters.length; iVoter += 1) {
      const voterAddress = voters[iVoter].address;
      // eslint-disable-next-line no-await-in-loop
      const voteReceipt = await makersContract
        .methods.voteForOffer(additionId)
        .send({ from: voterAddress, gas: 1000000 });
      console.log(voteReceipt, voteReceipt);
      assert.equal(voteReceipt.events.VoteForOffer.id, additionId);
      assert.equal(voteReceipt.events.VoteForOffer.voter, voterAddress);
    }
    // eslint-disable-next-line no-await-in-loop
    const executeReceipt = await makersContract
      .methods.executeOffer(additionId)
      .send({ from: voters[0].address, gas: 1000000 });
    console.log(executeReceipt, executeReceipt);
    assert.equal(executeReceipt.events.ExecuteOffer.returnValues.id, makerAddress);
    assert.ok(executeReceipt.events.ExecuteOffer.result);
  }
}
*/

function validateAccounts() {
  function checkSimpleAccount(account) {
    assert.ok('address' in account, 'Account does not have address');
    assert.ok(
      account.address.length === 42,
      'Address length should be 40 hex digits prepened with 0x',
    );
    assert.ok('password' in account, 'Account does not have password');
  }
  function checkAccountWithEnode(account) {
    checkSimpleAccount(account);
    assert.ok('enode' in account, `Account ${account.address} must have enode`);
    assert.ok(
      Array.isArray(account.enode) && account.enode.length === 2,
      `Account ${account.address} must be array of length 2`,
    );
    console.log(account.enode[0]);
    console.log(account.enode[1]);
    assert.ok(
      account.enode[0].length === 66 && account.enode[1].length === 66,
      `Account ${account.address} enode array elements must be 64 hex digits prepended by 0x`,
    );
  }

  const accountFields = ['initialDeployer', 'regulator'];
  for (let i = 0; i < accountFields.length; i += 1) {
    checkSimpleAccount(accounts[accountFields[i]]);
  }
  const simpleAccountLists = ['centralBankers', 'evolutionBankers'];
  for (let i = 0; i < simpleAccountLists.length; i += 1) {
    const accountList = accounts[simpleAccountLists[i]];
    for (let j = 0; j < accountList.length; j += 1) {
      checkSimpleAccount(accountList[j]);
    }
  }
  const listOfAccountsWithEnodes = ['voters', 'makers'];
  for (let i = 0; i < listOfAccountsWithEnodes.length; i += 1) {
    const accountList = accounts[listOfAccountsWithEnodes[i]];
    for (let j = 0; j < accountList.length; j += 1) {
      checkAccountWithEnode(accountList[j]);
    }
  }
}

async function deployCryptoSomEcosystem() {
  const initialDeployer = accounts.initialDeployer.address;

  const unlock = await web3.eth.personal
    .unlockAccount(initialDeployer, accounts.initialDeployer.password);
  console.log('initialDeployer unlock', unlock);

  let [bin, abi] = readBinAndAbi('../bin/Cryptosom');
  let undeployedContract = new web3.eth.Contract(abi);
  const cryptoSom = await deployContract(undeployedContract, bin, initialDeployer, []);

  [bin, abi] = readBinAndAbi('../bin/Voters');
  undeployedContract = new web3.eth.Contract(abi);
  const votersAddresses = [];
  const votersEnodes = [];
  for (let i = 0; i < accounts.voters.length; i += 1) {
    votersAddresses.push(accounts.voters[i].address);
    votersEnodes.push(accounts.voters[i].enode[0]);
    votersEnodes.push(accounts.voters[i].enode[1]);
  }
  console.log('voterAddresses', votersAddresses);
  console.log('voterEnodes', votersEnodes);
  assert.equal(votersEnodes.length, 2 * votersAddresses.length);
  const voters = await deployContract(
    undeployedContract,
    bin,
    initialDeployer,
    [votersAddresses, votersEnodes],
  );

  [bin, abi] = readBinAndAbi('../bin/CentralBank');
  undeployedContract = new web3.eth.Contract(abi);
  const centralBank = await deployContract(
    undeployedContract,
    bin, initialDeployer,
    [accounts.centralBankers.map(account => account.address)],
  );

  [bin, abi] = readBinAndAbi('../bin/EvolutionBank');
  undeployedContract = new web3.eth.Contract(abi);
  const evolutionBank = await deployContract(
    undeployedContract,
    bin,
    initialDeployer,
    [accounts.evolutionBankers.map(account => account.address)],
  );

  [bin, abi] = readBinAndAbi('../bin/TokenOwner');
  undeployedContract = new web3.eth.Contract(abi);
  const tokenOwner = await deployContract(
    undeployedContract, bin, initialDeployer,
    [centralBank.options.address, voters.options.address,
      evolutionBank.options.address, cryptoSom.options.address],
  );

  [bin, abi] = readBinAndAbi('../bin/Makers');
  undeployedContract = new web3.eth.Contract(abi);
  const makersAddresses = [];
  const makersEnodes = [];
  for (let i = 0; i < accounts.makers.length; i += 1) {
    makersAddresses.push(accounts.makers[i].address);
    makersEnodes.push(accounts.makers[i].enode[0]);
    makersEnodes.push(accounts.makers[i].enode[1]);
  }
  console.log('makersAddresses', makersAddresses);
  console.log('makersEnodes', makersEnodes);
  assert.equal(makersEnodes.length, 2 * makersAddresses.length);
  const makers = await deployContract(
    undeployedContract,
    bin,
    initialDeployer,
    [voters.options.address, makersAddresses, makersEnodes],
  );

  [bin, abi] = readBinAndAbi('../bin/BlackList');
  undeployedContract = new web3.eth.Contract(abi);
  const blackList = await deployContract(
    undeployedContract,
    bin,
    initialDeployer,
    [voters.options.address],
  );

  [bin, abi] = readBinAndAbi('../bin/WhiteList');
  undeployedContract = new web3.eth.Contract(abi);
  const whiteList = await deployContract(
    undeployedContract,
    bin,
    initialDeployer,
    [makers.options.address],
  );

  const unlockCentralBanker0 = await web3.eth.personal
    .unlockAccount(accounts.centralBankers[0].address, accounts.centralBankers[0].password);
  console.log('unlockCentralBanker0', unlockCentralBanker0);

  const unlockEvolutionBanker0 = await web3.eth.personal
    .unlockAccount(accounts.evolutionBankers[0].address, accounts.evolutionBankers[0].password);
  console.log('unlockEvolutionBanker0', unlockEvolutionBanker0);

  const unlockVoter0 = await web3.eth.personal
    .unlockAccount(accounts.voters[0].address, accounts.voters[0].password);
  console.log('unlockVoter0', unlockVoter0);

  // Await for all contract setup transactions.
  const postDeployTransactions = await Promise.all([
    cryptoSom.methods.transferOwnership(tokenOwner.options.address)
      .send({ from: initialDeployer, gas: 2e6, gasPrice: '0' }),
    centralBank.methods.setTokenOwnerContract(tokenOwner.options.address)
      .send({ from: accounts.centralBankers[0].address, gas: 2e6, gasPrice: '0' }),
    evolutionBank.methods.setTokenOwnerContract(tokenOwner.options.address)
      .send({ from: accounts.evolutionBankers[0].address, gas: 2e6, gasPrice: '0' }),
    voters.methods.setTokenOwnerContract(tokenOwner.options.address)
      .send({ from: accounts.voters[0].address, gas: 2e6, gasPrice: '0' }),
  ]);

  for (let i = 0; i < postDeployTransactions.length; i += 1) {
    console.log(`postDeployTransactions[${i}]`, postDeployTransactions[i]);
  }

  [bin, abi] = readBinAndAbi('../bin/Tender');
  undeployedContract = new web3.eth.Contract(abi);
  const lastDate = 1514754000; // 2018.01.01
  const tender = await deployContract(
    undeployedContract, bin, initialDeployer,
    [lastDate, accounts.regulator.address, cryptoSom.options.address],
  );

  fs.writeFileSync(
    'contracts.json',
    JSON.stringify(
      {
        cryptoSom: cryptoSom.options.address,
        voters: voters.options.address,
        centralBank: centralBank.options.address,
        evolutionBank: evolutionBank.options.address,
        tokenOwner: tokenOwner.options.address,
        tender: tender.options.address,
        makers: makers.options.address,
        blackList: blackList.options.address,
        whiteList: whiteList.options.address,
      },
      null, 2,
    ),
  );
}

validateAccounts();
deployCryptoSomEcosystem()
  .then(_result => console.log('main exited normally'))
  .catch(err => console.error('main exited with error', err));

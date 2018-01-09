'use strict';

const fs = require('fs');
const assert = require('assert');

const accounts = JSON.parse(fs.readFileSync('accounts.json', 'ascii'));
const contracts = JSON.parse(fs.readFileSync('contracts.json', 'ascii'));

const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:22000'));

const utils = require('./utils');
const mintCoins = require('./mint_coins');

/*
web3 = new Web3();
var net = require('net');
web3.setProvider(new web3.providers.IpcProvider("/home/geth/work/geth.ipc", net));
*/

/**
 * Basic test of tender contract.
 *
 * create tender creator account
 *
 * mint coins (long minting multisignature in function) to tender creator
 *
 * Tender organizator deploys Tender contract. Arguments are lats date of
 * tender, regulator address and Cryptosom address.
 *
 * Tender creator allows tender to spend his money
 *
 * Create account candidate1;
 *
 * Candidate1 makes offer with Tender.makeOffer(1000);
 *
 * Create accounts expenditure1, expenditure2;
 *
 * Candidate1 makes Tender.addExpenditure(1000);
 *
 * Regulator makes Tender.acceptByRegulator();
 *
 * Tender creator makes Tender.acceptOffer();
 *
 * Candidate1 makes Tender.spend();
 *
 * @returns {Promise<void>}
 */
async function testTender() {
  // Create tender creator
  const tenderCreator = await web3.eth.personal.newAccount('password');
  console.log('= Creating account tenderCreator:', tenderCreator, '=');
  const tenderCreatorUnlock = await web3.eth.personal.unlockAccount(tenderCreator, 'password');
  console.log('tenderCreatorUnlock', tenderCreatorUnlock);

  console.log('=== START MINTING ===');
  await mintCoins.mintCoins(tenderCreator, 1000000);
  console.log('=== END MINTING ===');

  console.log('= Deploying tender contract... =');
  let [bin, abi] = utils.readBinAndAbi('../bin/Tender');
  const undeployedContract = new web3.eth.Contract(abi);
  const lastDate = 1546290000 * 1e9; // 2019.01.01
  const tender = await utils.deployContract(
    undeployedContract, bin, tenderCreator,
    [lastDate, accounts.regulator.address, contracts.cryptoSom],
  );

  [bin, abi] = utils.readBinAndAbi('../bin/Cryptosom');
  const cryptoSom = new web3.eth.Contract(abi, contracts.cryptoSom);

  console.log('= Approving tender for spending 1000 coins... (cryptoSom.approve) =');
  const approveReceipt = await cryptoSom.methods.approve(tender.options.address, 1000)
    .send({ from: tenderCreator, gas: 2000000, gasPrice: '0' });
  console.log('approveReceipt', approveReceipt);
  assert.equal(approveReceipt.events.Approval.returnValues._value, 1000);
  assert.equal(approveReceipt.events.Approval.returnValues._owner, tenderCreator);
  assert.equal(approveReceipt.events.Approval.returnValues._spender, tender.options.address);

  const candidate1 = await web3.eth.personal.newAccount('password');
  console.log('= Creating account candidate1:', candidate1, '=');
  const candidate1Unlock = await web3.eth.personal.unlockAccount(candidate1, 'password');
  console.log('candidate1Unlock', candidate1Unlock);

  console.log('= Candidate1 offers his services for 1000 coins (tender.makeOffer) =');
  const makeOfferReceipt = await tender.methods.makeOffer(1000)
    .send({ from: candidate1, gas: 2000000, gasPrice: '0' });
  console.log(makeOfferReceipt);
  const offerId = makeOfferReceipt.events.MakeOffer.returnValues.id;
  assert.equal(makeOfferReceipt.events.MakeOffer.returnValues.principal, 1000);
  assert.equal(makeOfferReceipt.events.MakeOffer.returnValues.executor, candidate1);

  const executor1 = await web3.eth.personal.newAccount('password');
  console.log('= Creating account executor1 for executing part of tender =', executor1);

  console.log('= Adding possibility to spend 800 coins for paying executor1 for his part of work =');
  const addExpenditureReceipt = await tender.methods.addExpenditure(offerId, 'mainNeeds', 800, [executor1])
    .send({ from: candidate1, gas: 1000000, gasPrice: '0' });
  const expenditureId = addExpenditureReceipt.events.AddExpenditure.returnValues.id;
  assert.equal(addExpenditureReceipt.events.AddExpenditure.returnValues.offerId, offerId);
  assert.equal(addExpenditureReceipt.events.AddExpenditure.returnValues.principal, 800);
  assert.equal(addExpenditureReceipt.events.AddExpenditure.returnValues.name, 'mainNeeds');

  // Regulator makes Tender.acceptByRegulator();
  const regulatorUnlock = await web3.eth.personal.unlockAccount(
    accounts.regulator.address,
    accounts.regulator.password,
  );
  console.log('regulatorUnlock', regulatorUnlock);
  console.log('= Tender regulator accepts offer of candidate1 as valid offer (tender.acceptByRegulator)=');
  const acceptByRegulatorReceipt = await tender.methods.acceptByRegulator(offerId)
    .send({ from: accounts.regulator.address, gas: 1000000, gasPrice: '0' });
  assert.equal(acceptByRegulatorReceipt.events.AcceptByRegulator.returnValues.offerId, offerId);

  console.log('= Tender creator accepts offer of candidate1 as winner of tender (tender.acceptOffer) =');
  const acceptOfferReceipt = await tender.methods.acceptOffer(offerId)
    .send({ from: tenderCreator, gas: 2000000, gasPrice: '0' });
  console.log('acceptOfferReceipt', acceptOfferReceipt);
  assert.equal(acceptOfferReceipt.events.AcceptOffer.returnValues.offerId, offerId);

  console.log('= Try to spend to executor1 work more that planned... should fail =');
  const trySpendReceipt = await tender.methods.spend(expenditureId, executor1, 801)
    .send({ from: tenderCreator, gas: 1000000, gasPrice: '0' });
  console.log('trySpendReceipt', trySpendReceipt);
  assert.equal(trySpendReceipt.events.Spend, undefined);

  console.log('= Try to spend to executor1 work planned amount... should pass =');
  const spendReceipt = await tender.methods.spend(expenditureId, executor1, 800)
    .send({ from: tenderCreator, gas: 1000000, gasPrice: '0' });
  console.log('spendReceipt', spendReceipt);
  assert.equal(spendReceipt.events.Spend.returnValues.offerId, offerId);
  assert.equal(spendReceipt.events.Spend.returnValues.expenditureId, expenditureId);
  assert.equal(spendReceipt.events.Spend.returnValues.to, executor1);
  assert.equal(spendReceipt.events.Spend.returnValues.value, 800);

  console.log('Tender tests are OK');
}

testTender()
  .then((_result) => {})
  .catch(err => console.error('testVoters error:', err));

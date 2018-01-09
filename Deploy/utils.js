'use strict';

const fs = require('fs');

function readBinAndAbi(filenamePrefix) {
  const binFile = `${filenamePrefix}.bin`;
  const abiFile = `${filenamePrefix}.abi`;

  const bin = fs.readFileSync(binFile, 'ascii');
  const abi = JSON.parse(fs.readFileSync(abiFile, 'ascii'));

  return [bin, abi];
}

async function deployContract(contract, binData, account, constructorArgs) {
  const contractInstance = await contract.deploy({
    data: (`0x${binData}`),
    arguments: constructorArgs,
  }).send({
    from: account,
    gas: 1e7,
    gasPrice: '0',
  })
    // .on('error', function(error){ console.log('on_error', error);})
    .on('transactionHash', (transactionHash) => { console.log('on_transactionHash', transactionHash); })
    .on('receipt', (receipt) => {
      console.log('receipt:', receipt); // contains the new contract address
      console.log('contract address:', receipt.contractAddress); // contains the new contract address
    });
    // .on('confirmation', function(confirmationNumber, receipt){
    //   console.log('on_confirmation', confirmationNumber, receipt);
    // });

  console.log('then', contractInstance.options.address);

  return contractInstance;
}

module.exports.readBinAndAbi = readBinAndAbi;
module.exports.deployContract = deployContract;

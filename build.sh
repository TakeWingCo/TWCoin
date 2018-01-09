#!/usr/bin/env bash

set -u
set -e

TARGETS='
Contracts/Tokens/TWCoin.sol

Contracts/Tokens/TokenOwner.sol

Contracts/Infrastructure/BlackList.sol
Contracts/Infrastructure/Tender.sol
Contracts/Infrastructure/TransferMatrix.sol
Contracts/Infrastructure/WhiteList.sol
Contracts/Infrastructure/BlackList.sol

Contracts/Organizations/Banks/CentralBank.sol
Contracts/Organizations/Banks/EvolutionBank.sol
Contracts/Organizations/Makers.sol
Contracts/Organizations/Voters.sol

Contracts/Owned.sol
'

for SOLIDITY_FILE in $TARGETS
do
    echo compiling "$SOLIDITY_FILE"
#    TEMP="bin/`basename $SOLIDITY_FILE`"
    TEMP=temp.sol
    python3 Build/solc_precompile.py "$SOLIDITY_FILE" > "$TEMP"
    solc --bin --abi --overwrite -o bin "$TEMP"
done

echo all contracts were compiled

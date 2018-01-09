![TWCoin logo](TWCoinLogo.png)

# TWCoin National digital currency technology

## Contents

* Description
* Smart contracts
* Tests
* Used technologies
* Docs
* Build
* Deploy
* License

## Description

Smart contracts of TWCoin blockchain ecosystem is the system of smart contracts, which implement model of digital economy and goverment. This includes technical smart contracs (for blockchain and consensus working like White and Black lists), smart contracts of digital goverment (for example CentralBank contract) and digital economy (like TWCoin contract), also set of basic user contracts (for example basic private contract) etc.

## Smart contracts

Ecosystem contains three main groups of smart contracts:

* Technical smart contracts
* Smart contracts of digital goverment and economy
* Basic user smart contracts

### Technical smart contracts

It's mainly smart contracts used in consensus work:

* Smart contracts for block making (this regulates list of masternodes, editing that and some rules of consensus)
* Smart contracts for block voting (this regulates transaction finality and block adoption)
* White list contract (this regulates who can execute transactions in system)
* Black list contract (this regulates banned addresses and nodes)

Also this contains some basic system contracts:

* Transfer matrix contract (contains transfer rules)
* Voting contracts (contains voting rules)

### Smart contracts of digital goverment and economy

There are all smart contracts used for current state insitutes imitation:

* TWCoin contract (base cryptocurrency in system)
* Central Bank contract
* Commercial bank contracts
* Tender contracts
* etc

### Basic user smart contracts

Set of standard contracts for users:

* Wallets
* Base private contracts
* Templates
* etc

## Tests

Tests in /Tests written on TS/JS.

## Used technologies

Forked platform - Quorum with ZSL
Smart contracts programming language - Solidity 0.4.10 - 0.4.18
Tests - TS/JS
Docs - Markdown/rst

## Docs

Docs in /Docs.
It contains:

* Deploy (deploing docs)
* InterfaceSpecification (smart contracts interface specs)
* ProjectSpecs (removed)
* UML (removed)

## Build

To install solidity compiler, follow intructions in
[solc docs](http://solidity.readthedocs.io/en/develop/installing-solidity.html#binary-packages)
or use official PPA on Ubuntu:

```bash
sudo add-apt-repository ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install solc
```

For building all contracts to the `bin` directory, use build.sh script.

```bash
./build.sh
```

New versions of solc can output warnings due to differences in version of Solidity
language but contracts are compiled correctly. 

## Deploy

All contract deployment, post-deployment setup and tests are in `Deploy` directory.
See further info on deploying contracts and running tests in `Deploy/README.md`

## License

Creative Commons Attribution-NonCommercial 3.0 Unported

Parts of ZToken library included in this project are licensed
under Apache License 2.0.
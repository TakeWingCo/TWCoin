# Contract deployment and tests

This instructions are for testing version of TWCoin ecosystem only.
Real production system requires different rules and more secure rules
for account creation and management.

## Dependencies

First of all, contracts should be compiler with `build.sh`
from repository root.

For deploying contracts, you need to install Node.js 8 and
web3js library.

Node.js 8 installation instructions can be found at https://nodejs.org/en/download/
For installing on Ubuntu and Debian official instructions are

```bash
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```

To install required libraries, invoke node package manager in this directory

```bash
npm install
```

## Note about accounts.json

For easy testing of contracts one needs all interacting accounts
to exist on developer node and be available for sending transactions.

For testing of permissioned mining (restriction of making blocks
to Makers and checking blocks by Voters) one needs to manage Makers and
Voters list locally and test behavior of actual nodes in test cluster.

Hence accounts.json is generated with account addresses (160 bits)
that are created locally and enodes (512 bits) that are hardcoded.
Nodes 1-3 from 7nodes example environment
are hardcoded as Voters and 4-5 as Makers.
This layout is used at the contract deployment time for population
initial Makers and Voters lists.

This instructions are for testing version of TWCoin ecosystem only.

## Contracts deployment and setup

```bash
# Create test accounts and write them to accounts.json
nodejs create_accounts.js

# Deploy contracts, perform setup transactions,
# write contract addresses to contracts.json
nodejs deploy_contracts.js
```

## Testing contracts


```bash
# Test Voters contract
nodejs test_voters.js
# Test Makers contract
nodejs test_makers.js
# Test WhiteList contract
nodejs test_voters.js
# Test BlackList contract
nodejs test_makers.js

# Test TWCoin minting
nodejs mint_coins.js
# Test tender procedure
npdejs test_tender.js
```

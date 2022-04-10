# Solidity Challenge #1 | USDT Reward distribution smart contract

Implement and deploy an ERC-20 token (Called Wtoken) contract and a reward distribution contract.

The reward contract is supposed to receive some USDT token every 24 hours; users should be able to send their ERC-20 token to the reward contract and based on the amount they send to the reward contract and the time they sent their token should be incentivized from the USDT that has been sent to the contract.


### Scenario 1

User A sends 10 Wtoken to the reward contract and user B sends 90 Wtoken to the reward contract, user C sends 100 Wtoken a day later. USD rewards should be distributed as follows:

1. user A should receive 100 USDT 

2. user B should receive 900 USDT 

3. user C should receive 0 UST

### Scenario 2

One day later the contract receives another 1000 USDT, the reward distribution should be: 

1. user A should receive 50 USDT 

2. user B should receive 450 USDT 

3. user C should receive 500 UST

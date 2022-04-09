# USDT Reward distribution smart contract

Using Ropsten, implement and deploy an ERC-20 token (Called Wtoken) contract and a reward distribution contract: 

The reward contract is supposed to receive some USDT token every 24 hours; users should be able to send their ERC-20 token to the reward contract and based on the amount they send to the reward contract and the time they sent their token should be incentivized from the USDT that has been sent to the contract.



User A sends 10 Wtoken to the reward contract and user B sends 90 Wtoken to the reward contract, user C sends 100 Wtoken a day later. The contract receives 1000USDT, therefore, 

user A should receive 100 USDT 

user B should receive 900 USDT 

user C should receive 0 UST

one day later the contract receives another 1000 USDT, the reward distribution should be: 

user A should receive 50 USDT 

user B should receive 450 USDT 

user C should receive 500 UST
#   R e w a r d - d i s t r i b u t i o n  
 
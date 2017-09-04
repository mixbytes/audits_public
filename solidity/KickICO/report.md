# Smart-contract audit for project KickICO by MixBytes team

##### Repositary address: https://github.com/kickico/contracts/
Version commit, used in audit: https://github.com/kickico/contracts/commit/abd93bcce948071af24dad4c35439202abf92b7c

## Issues classification:
##### CRITICAL: problems, leading to stealing funds from any of participants, or making them unaccessible by anyone
##### SEVERE: problems, that can cause stop, freese, broke internal logic of contract
##### WARNING: non-critical problems, that cannot broke contract, but still present
##### NOTE: everything except above


## Found issues:

### [CRITICAL] 

#####   1. https://github.com/kickico/contracts/blob/abd93bcce948071af24dad4c35439202abf92b7c/src/token.sol#L363
Function: function issue(address _to, uint256 _amount) public onlyOwner validAddress(_to) notThis(_to)

Missed call to addIndex(_to) will lead to lose tokens by investor 


#### [SEVERE]
#####   2. https://github.com/kickico/contracts/blob/abd93bcce948071af24dad4c35439202abf92b7c/src/token.sol#L224 
Function: function addDividendsForAddress(address _address) internal

Missed addition to _totalSupply, or substraction from balances[this]. Precision loss in division should de correcltly handled
    
##### 3. https://github.com/kickico/contracts/blob/abd93bcce948071af24dad4c35439202abf92b7c/src/token.sol#L304 
Function: function transferFrom(address _from, address _to, uint256 _value) transfersAllowed returns (bool success)

Must be "now < dividends[currentDividendIndex].time" instead of "now >= dividends[currentDividendIndex].time", or, else
    dividends will be payed too early
    
##### 4. https://github.com/kickico/contracts/blob/abd93bcce948071af24dad4c35439202abf92b7c/src/crowdsale.sol#L215
"if (amount >= bonuses[i] && (amount < bonuses[i + 1] || i == bonuses.length - 1)) {" 

must be written as

"if (amount >= bonuses[i] && (i == bonuses.length - 1 || amount < bonuses[i + 1])) {"
    
or we'll have out of bounds when "i == bonuses.length - 1"


#### [WARNING]
##### 5. https://github.com/kickico/contracts/blob/abd93bcce948071af24dad4c35439202abf92b7c/src/token.sol#L233 
Function: function addDividendsForAddress(address _address) internal

If "now()" is in period "k + 2", and calculateDividends for period "k + 1" is missed (last dividends was payed only for "k"-s period),

new account (created by fact in "k+2") will receive dividends for "k+1", because its calculatedDividendsIndex[_address] will be "k", 
    potentialy, it will lead to give extra money to inverstor 


#### [NOTES]
#####   6. https://github.com/kickico/contracts/blob/abd93bcce948071af24dad4c35439202abf92b7c/src/token.sol#L186  
Function: function balanceOf(address _owner) constant returns (uint256 balance)

Is it right that balanceOf doesn't use agingBalanceOf[_address][0]?
    
##### 7. https://github.com/kickico/contracts/blob/abd93bcce948071af24dad4c35439202abf92b7c/src/token.sol#L194
Function: function addAgingTimesForPool(address poolAddress, uint256 agingTime) onlyOwner

If owner will send wrong AgingTime, and it will be less than last, it will make contract stuck 

##### 8. https://github.com/kickico/contracts/blob/abd93bcce948071af24dad4c35439202abf92b7c/src/token.sol#L209
Function: function calculateDividends:

Is this function callable by anyone, not only owner?

    
##### 9. https://github.com/kickico/contracts/blob/abd93bcce948071af24dad4c35439202abf92b7c/src/crowdsale.sol#L48
This function is missed in token.sol

##### 10. https://github.com/kickico/contracts/blob/abd93bcce948071af24dad4c35439202abf92b7c/src/crowdsale.sol#L266
Function: function isReachedThreshold() internal returns (bool reached)

Why pricePerTokenInWei is used here? This fragment will work, but only because pricePerTokenInWei is much less than other values

##### 11. https://github.com/kickico/contracts/blob/abd93bcce948071af24dad4c35439202abf92b7c/src/crowdsale.sol#L216
Function: function processPayment(address from, uint amount, bool isCustom) internal

In both cases, when i=14 and i=15 bonus is the same, price is discounted by 0.925(925)




### CONCLUSION
    
Audited contracts were fixed, and successfully deployed. ICO started and now is in progress. 


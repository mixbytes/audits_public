# Smart-contract audit for KickICO project by MixBytes team

##### Repository address: https://github.com/kickico/contracts/
Version commit used in the audit: https://github.com/kickico/contracts/commit/abd93bcce948071af24dad4c35439202abf92b7c

## Issues classification:
##### CRITICAL: problems leading to stealing funds from any of the participants, or making them inaccessible by anyone
##### SEVERE: problems that can stop, freeze or break the internal logic of the contract
##### WARNING: non-critical problems that cannot break the contract, but still are present
##### NOTE: any other issues


## Found issues:

### [CRITICAL] 

#####   1. https://github.com/kickico/contracts/blob/abd93bcce948071af24dad4c35439202abf92b7c/src/token.sol#L363
Function: function issue(address _to, uint256 _amount) public onlyOwner validAddress(_to) notThis(_to)

Missed call to addIndex(_to) will result in token losses by investors


#### [SEVERE]
#####   2. https://github.com/kickico/contracts/blob/abd93bcce948071af24dad4c35439202abf92b7c/src/token.sol#L224 
Function: function addDividendsForAddress(address _address) internal

Missed addition to _totalSupply, or substraction from balances[this]. Precision loss during division should be handled appropriately.
    
##### 3. https://github.com/kickico/contracts/blob/abd93bcce948071af24dad4c35439202abf92b7c/src/token.sol#L304 
Function: function transferFrom(address _from, address _to, uint256 _value) transfersAllowed returns (bool success)

Must be "now < dividends[currentDividendIndex].time" instead of "now >= dividends[currentDividendIndex].time", otherwise dividends will be paid too early
    
##### 4. https://github.com/kickico/contracts/blob/abd93bcce948071af24dad4c35439202abf92b7c/src/crowdsale.sol#L215
"if (amount >= bonuses[i] && (amount < bonuses[i + 1] || i == bonuses.length - 1)) {" 

must be written as

"if (amount >= bonuses[i] && (i == bonuses.length - 1 || amount < bonuses[i + 1])) {"
    
or we'll run out of bounds when "i == bonuses.length - 1"


#### [WARNING]
##### 5. https://github.com/kickico/contracts/blob/abd93bcce948071af24dad4c35439202abf92b7c/src/token.sol#L233 
Function: function addDividendsForAddress(address _address) internal

If "now()" is in period "k + 2", and calculateDividends for period "k + 1" is missed (last dividends were paid only for "k"-s period),

new account (actually created in "k+2") will receive dividends for "k+1", because its calculatedDividendsIndex[_address] will be "k", and potentially, it will result in extra profit for the investor


#### [NOTES]
#####   6. https://github.com/kickico/contracts/blob/abd93bcce948071af24dad4c35439202abf92b7c/src/token.sol#L186  
Function: function balanceOf(address _owner) constant returns (uint256 balance)

Is it right that balanceOf doesn't use agingBalanceOf[_address][0]?
    
##### 7. https://github.com/kickico/contracts/blob/abd93bcce948071af24dad4c35439202abf92b7c/src/token.sol#L194
Function: function addAgingTimesForPool(address poolAddress, uint256 agingTime) onlyOwner

If the owner sends wrong AgingTime, and it is shorter than the last one, it will make contract stuck

##### 8. https://github.com/kickico/contracts/blob/abd93bcce948071af24dad4c35439202abf92b7c/src/crowdsale.sol#L48
This function is missed in token.sol

##### 9. https://github.com/kickico/contracts/blob/abd93bcce948071af24dad4c35439202abf92b7c/src/crowdsale.sol#L266
Function: function isReachedThreshold() internal returns (bool reached)

Why pricePerTokenInWei is used here? This fragment will work, but only because pricePerTokenInWei is much less than other values

##### 10. https://github.com/kickico/contracts/blob/abd93bcce948071af24dad4c35439202abf92b7c/src/crowdsale.sol#L216
Function: function processPayment(address from, uint amount, bool isCustom) internal

In both cases, when i=14 and i=15 bonus is the same, price is discounted by 0.925(925)




### CONCLUSION
    
Audited contracts were fixed and successfully deployed. The ICO has raised $22 million.


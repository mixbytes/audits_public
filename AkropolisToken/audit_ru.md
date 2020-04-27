### CRITICAL

None found


### MAJOR

##### 1. Collision of storage layouts of TokenProxy and AkropolisToken

The problem is illustrated by the `test/TestProxySlotCollision.js` (works for commit 3ad8eaa6f2849dceb125c8c614d5d61e90d465a2).

As can be seen, collision almost haven't happened because `paused` and `locked` flags was packed by solidity compiler and don't collide with other fields and slot for whitelist is not used (because mappings are implemented in such way). But there is collision of `bool whitelisted` and `decimals` fields.

A simple solution is to use "unique" slot locations for each field (except shared base contract fields) derived via `keccak256`, for example: https://github.com/poanetwork/poa-network-consensus-contracts/blob/0c175cb98dac52201342f4e5e617f89a184dd467/contracts/KeysManager.sol#L185.
In this case we also recommend to include contract name into hash function invocation, and use `abi.encode` in place of `abi.encodePacked`, like this: `uintStorage[keccak256(abi.encode("TokenProxy", "decimals"))] = decimals`.

Fixed in [79565a3](https://github.com/akropolisio/AkropolisToken/commit/79565a351c74d7fc668ef96927a68876521e37df)


### WARNING

##### 1. https://github.com/akropolisio/AkropolisToken/blob/3ad8eaa6f2849dceb125c8c614d5d61e90d465a2/contracts/helpers/Lockable.sol#L25

Переменная названа обратно своему смыслу, логично ожидать название `unlocked`. В обычных ситуациях названия переменных не столь критичны, но в данном случае при дальнейшей поддержке этого кода есть риск случайного изменения логики на прямо противоположную.

Fixed in [28a4153](https://github.com/akropolisio/AkropolisToken/commit/28a415392489a1a88073c3d0fd22b141f4d3170e)

##### 2. https://github.com/akropolisio/AkropolisToken/blob/3ad8eaa6f2849dceb125c8c614d5d61e90d465a2/contracts/token/AkropolisToken.sol#L41

Результат вызова функции базового контракта игнорируется, а функция всегда возвращает `false`. Любые пользователи контракта `AkropolisToken`, включая прочие смарт-контракты, проверяющие результат работы функции, будут считать ее вызовы неудачными. Скорее всего, забыто `return super.approve(...)`.

Исправлено в [7dee846](https://github.com/akropolisio/AkropolisToken/commit/7dee8462095656f0bc70617692568180bf2d8f47)

##### 3. https://github.com/akropolisio/AkropolisToken/blob/3ad8eaa6f2849dceb125c8c614d5d61e90d465a2/contracts/token/AkropolisToken.sol#L75

Результат вызова функции базового контракта игнорируется, а функция всегда возвращает `false`. Любые пользователи контракта `AkropolisToken`, включая прочие смарт-контракты, проверяющие результат работы функции, будут считать ее вызовы неудачными. Скорее всего, забыто `return super.transfer(...)`.

Исправлено в [7dee846](https://github.com/akropolisio/AkropolisToken/commit/7dee8462095656f0bc70617692568180bf2d8f47)

##### 4. https://github.com/akropolisio/AkropolisToken/blob/3ad8eaa6f2849dceb125c8c614d5d61e90d465a2/contracts/token/AkropolisToken.sol#L92

Результат вызова функции базового контракта игнорируется, а функция всегда возвращает `false`. Любые пользователи контракта `AkropolisToken`, включая прочие смарт-контракты, проверяющие результат работы функции, будут считать ее вызовы неудачными. Скорее всего, забыто `return super.transferFrom(...)`.

Исправлено в [7dee846](https://github.com/akropolisio/AkropolisToken/commit/7dee8462095656f0bc70617692568180bf2d8f47)

##### 5. https://github.com/akropolisio/AkropolisToken/blob/3ad8eaa6f2849dceb125c8c614d5d61e90d465a2/contracts/token/AkropolisToken.sol#L11

Функция `approve` не отключена по-умолчанию, как говорится в комментарии. Более того, вопреки тому, что говорится в [этом комментарии](https://github.com/akropolisio/AkropolisToken/blob/3ad8eaa6f2849dceb125c8c614d5d61e90d465a2/contracts/token/AkropolisToken.sol#L36) функция `approve` не заблокирована каким-либо отдельным механизмом или флагом. Она разрешена общим механизмом паузы, применяющимся также для функций `increaseApproval`, `decreaseApproval`, `transfer`, `transferFrom`. Модификатор `whenUnlocked` был удален в коммите
[434aab](https://github.com/akropolisio/AkropolisToken/commit/434aab02463cdf7a0a8a2b0f025186168d6c8549).

Fixed in [28a4153](https://github.com/akropolisio/AkropolisToken/commit/28a415392489a1a88073c3d0fd22b141f4d3170e)


### COMMENT

##### 1. https://github.com/akropolisio/AkropolisToken/blob/3ad8eaa6f2849dceb125c8c614d5d61e90d465a2/contracts/upgradeability/DelayedUpgradeabilityProxy.sol#L17

Рекомендуем объявить `UPGRADE_DELAY` как constant. Это предотвратит случайное изменение и сэкономит газ.

##### 2. Solidity 0.5

Рекомендуем обновить компилятор до версии 0.5 или выше, т.к. в версии 0.5 исправлены ошибки, а также введено много правок и проверок, способствующих написанию безопасного кода.


## CONCLUSION 

Использование механизма прокси-контрактов в Solidity и EVM имеет свои сопутствующие риски. Была выявлена и исправлена одна связанная с этим проблема. Также был исправлен ряд замечаний. В остальном код хорошо структурирован и чисто написан. Версия https://github.com/akropolisio/AkropolisToken/tree/c52f938296e37716432265655528175b748df174 (ветка development) не имеет известных нам уязвимостей и потенциальных проблемных мест.


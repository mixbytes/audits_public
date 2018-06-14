# Аудит смартконтрактов PoPA

###### Контракт

Адрес контракта, для которого проводился аудит: 
[https://github.com/poanetwork/poa-popa/tree/e259cec1fcfcfdff30a52bffb395d845c774855b/blockchain/contracts](https://github.com/poanetwork/poa-popa/tree/e259cec1fcfcfdff30a52bffb395d845c774855b/blockchain/contracts), 
[https://github.com/poanetwork/poa-popa/tree/e259cec1fcfcfdff30a52bffb395d845c774855b/web-dapp/server-lib](https://github.com/poanetwork/poa-popa/tree/e259cec1fcfcfdff30a52bffb395d845c774855b/web-dapp/server-lib)

## Классификация выявленных проблем

##### КРИТИЧНЫЕ - возможность кражи эфира/токенов или их блокировки без возможности восстановления доступа или иной потери эфира/токенов, причитающихся какой-либо стороне, например дивидендов.

##### СЕРЬЕЗНЫЕ - возможность нарушений работы контракта, при которых для восстановления его корректной работы необходима модификация состояния контракта вручную или его полная замена.

##### ПРЕДУПРЕЖДЕНИЯ - возможность нарушения запланированной логики контракта или возможность организации DoS-атаки на контракт.

##### ЗАМЕЧАНИЯ - все остальные замечания.

## Методика аудита

Код контракта просматривается вручную на наличие известных уязвимостей, ошибок в логике, соответствие WhitePaper. При необходимости на сомнительные моменты пишутся unit-тесты.

## Выявленные проблемы (Solidity)

### [КРИТИЧНЫЕ]

- не выявлено

### [СЕРЬЕЗНЫЕ]

- не выявлено

### [ПРЕДУПРЕЖДЕНИЯ]

##### 1. [ProofOfPhysicalAddress.sol#L44-L46](https://github.com/poanetwork/poa-popa/blob/d28f182b8239fb9351e7e6cacb6f363b8d5ae06a/blockchain/contracts/ProofOfPhysicalAddress.sol#L44-L46)

Счетчики `totalUsers`, `totalAddresses` и `totalConfirmed` только увеличиваются, но никогда не уменьшаются. Логично было бы их уменьшать при удалении адресов и пользователей.

*Так было сделано, поскольку предыдущая версия ERC780 позволяла пользователю удалить `claim` о себе в обход смарт-контракта, так что мы не могли бы быть уверены в точности этих цифр, если бы учитывали удаления. В новой версии это учтено, [PR 136](https://github.com/poanetwork/poa-popa/pull/136).*

### [ЗАМЕЧАНИЯ]

##### 1. [https://github.com/ethereum/EIPs/issues/780](https://github.com/ethereum/EIPs/issues/780) контракт EthereumClaimsRegistry.sol обновился по сравнению с тем что используется в аудируемом коде.

В новой версии сошлись на том, что `removeClaim` может вызывать `issuer`, но не `subject`. Мотивация такая: если `claim` содержит недостоверную информацию, `subject` может опубликовать встречный `claim` от своего имени и дальше уже вопрос доверия. В то же время если `subject` просто хочет удалить свои данные, то `removeClaim` этому не поможет, поскольку информацию все еще можно достать из истории изменений.

В коде контракта удаление claim-а subject-ом не используется, но в тестах проверяется.

```javascript
--- EthereumClaimsRegistry.sol	2018-05-10 11:19:04.459670819 +0300
+++ EthereumClaimsRegistry-EIP780-20180510.sol	2018-05-10 11:22:10.510566403 +0300
@@ -1,6 +1,3 @@
-pragma solidity 0.4.19;
-
-
 contract EthereumClaimsRegistry {
 
     mapping(address => mapping(address => mapping(bytes32 => bytes32))) public registry;
@@ -18,24 +15,23 @@
         bytes32 indexed key,
         uint removedAt);
 
-    // create or update claims
-    function setClaim(address subject, bytes32 key, bytes32 value) external {
+    // create or update clams
+    function setClaim(address subject, bytes32 key, bytes32 value) public {
         registry[msg.sender][subject][key] = value;
-        ClaimSet(msg.sender, subject, key, value, now);
+        emit ClaimSet(msg.sender, subject, key, value, now);
     }
 
-    function setSelfClaim(bytes32 key, bytes32 value) external {
-        registry[msg.sender][msg.sender][key] = value;
-        ClaimSet(msg.sender, msg.sender, key, value, now);
+    function setSelfClaim(bytes32 key, bytes32 value) public {
+        setClaim(msg.sender, key, value);
     }
 
-    function removeClaim(address issuer, address subject, bytes32 key) external {
-        require(msg.sender == issuer || msg.sender == subject);
-        delete registry[issuer][subject][key];
-        ClaimRemoved(msg.sender, subject, key, now);
+    function getClaim(address issuer, address subject, bytes32 key) public view returns(bytes32) {
+        return registry[issuer][subject][key];
     }
 
-    function getClaim(address issuer, address subject, bytes32 key) external view returns(bytes32) {
-        return registry[issuer][subject][key];
+    function removeClaim(address issuer, address subject, bytes32 key) public {
+        require(msg.sender == issuer);
+        delete registry[issuer][subject][key];
+        emit ClaimRemoved(msg.sender, subject, key, now);
     }
 }
```

*Обновлено в [PR 136](https://github.com/poanetwork/poa-popa/pull/136).*

##### 2. [ProofOfPhysicalAddress.sol#L98](https://github.com/poanetwork/poa-popa/blob/d28f182b8239fb9351e7e6cacb6f363b8d5ae06a/blockchain/contracts/ProofOfPhysicalAddress.sol#L98)

При передаче в `userAddressConfirmed` значения `addressIndex` большего, чем длина массива `physicalAddresses`, будет exception. В функции есть проверка существования user-а:

```javascript
require(userExists(wallet))
```

Но существование нужного индекса в массиве не гарантируется. Если считать, что вызывающая функция проверила существование индекса (`userAddressByCreationBlock` это делает), тогда не нужен и `require`. Иначе надо проверять и размер массива.

Как вариант можно сделать helper-функции internal, но тогда сломаются тесты.

*Проверка добавлена в [PR 138](https://github.com/poanetwork/poa-popa/pull/138).*

##### 3. [ProofOfPhysicalAddress.sol#L200](https://github.com/poanetwork/poa-popa/blob/d28f182b8239fb9351e7e6cacb6f363b8d5ae06a/blockchain/contracts/ProofOfPhysicalAddress.sol#L200)

Функция `userAddress` так же как `userAddressConfirmed` не проверяет существования индекса перед обращением к элементу массива.

*Проверка добавлена в [PR 138](https://github.com/poanetwork/poa-popa/pull/138).*

##### 4. [ProofOfPhysicalAddress.sol#L214](https://github.com/poanetwork/poa-popa/blob/d28f182b8239fb9351e7e6cacb6f363b8d5ae06a/blockchain/contracts/ProofOfPhysicalAddress.sol#L214)

`userAddressInfo` - в этой функции такая же проблема, не проверяется существование индекса.

*Проверка добавлена в [PR 138](https://github.com/poanetwork/poa-popa/pull/138).*

https://github.com/poanetwork/poa-popa/blob/e259cec1fcfcfdff30a52bffb395d845c774855b/blockchain/contracts/ProofOfPhysicalAddress.sol 
В функциях рекомендуется использовать спецификаторы view или pure вместо constant.

Поменяли https://github.com/poanetwork/poa-popa/pull/156

##### 5. [ProofOfPhysicalAddress.sol#L97](https://github.com/poanetwork/poa-popa/blob/e259cec1fcfcfdff30a52bffb395d845c774855b/blockchain/contracts/ProofOfPhysicalAddress.sol#L97)

Здесь и далее рекомендуется вынести проверку `require(userExists(wallet));` в виде модификатора.

*Уже сделано в [PR 127](https://github.com/poanetwork/poa-popa/pull/127)*

##### 6. [ProofOfPhysicalAddress.sol#L104](https://github.com/poanetwork/poa-popa/blob/e259cec1fcfcfdff30a52bffb395d845c774855b/blockchain/contracts/ProofOfPhysicalAddress.sol#L104)

Перед декодированием рекомендуется добавить проверку, что claim существует: `if (0 == claim) return false;`.

*Добавлено в [PR 151](https://github.com/poanetwork/poa-popa/pull/151)*

##### 7. [ProofOfPhysicalAddress.sol#L225](https://github.com/poanetwork/poa-popa/blob/e259cec1fcfcfdff30a52bffb395d845c774855b/blockchain/contracts/ProofOfPhysicalAddress.sol#L225) 

Рекомендуется добавить выше `require(userAddressConfirmed(wallet, ai));`, иначе здесь будет декодирование заведомо нулевого claim.

*Тогда будет исключение, если адрес не подтвержден, хотя метод не подразумевает, что адрес обязательно подтвержден - он просто возвращает информацию. Возможно, следует сделать так?*

```solidity
confirmationBlock = 0;
if (userAddressConfirmed(wallet, addressIndex)) {
    confirmationBlock = PhysicalAddressClaim.decodeConfirmation(...)
}
return ( ….name, ….creationBlock, confirmationBlock, ….keccakIdentifier)
```

Я бы сделал более точечно:

```solidity
bytes32 claim = registry.getClaim(
   address(this),
   wallet,
   users[wallet].physicalAddresses[addressIndex].keccakIdentifier);
return (
   users[wallet].physicalAddresses[addressIndex].name,
   users[wallet].physicalAddresses[addressIndex].creationBlock,
   uint256(claim) != 0 ? PhysicalAddressClaim.decodeConfirmation(claim) : 0,
   users[wallet].physicalAddresses[addressIndex].keccakIdentifier
);
```

*Добавили [PR 159](https://github.com/poanetwork/poa-popa/pull/159)*

##### 8. [ProofOfPhysicalAddress.sol#L100](https://github.com/poanetwork/poa-popa/blob/e259cec1fcfcfdff30a52bffb395d845c774855b/blockchain/contracts/ProofOfPhysicalAddress.sol#L100)

С т.з. логики, заложенной в код, это условие никогда не выполняется. Для проверки самосогласованности кода его рекомендуется заменить на `assert(keccakIdentifier != 0x0)`.

*Добавлено в [PR 152](https://github.com/poanetwork/poa-popa/pull/152)*

##### 9. [ProofOfPhysicalAddress.sol#L309](https://github.com/poanetwork/poa-popa/blob/e259cec1fcfcfdff30a52bffb395d845c774855b/blockchain/contracts/ProofOfPhysicalAddress.sol#L309)

Алгоритм с O(N) сложностью по записи данных в блокчейн. Можно заменить текущий алгоритм (сдвиг элементов массива начиная с `index + 1`) на перемещение последнего элемента (с индексом `length - 1`) на позицию `index`, если `index != length - 1`. Это даст алгоритм с O(1) сложностью по записи данных в блокчейн.

*Сделано [PR 154](https://github.com/poanetwork/poa-popa/pull/154)*

##### 10. [ProofOfPhysicalAddress.sol#L331](https://github.com/poanetwork/poa-popa/blob/e259cec1fcfcfdff30a52bffb395d845c774855b/blockchain/contracts/ProofOfPhysicalAddress.sol#L331)

На [диаграмме](https://github.com/poanetwork/poa-popa/tree/e259cec1fcfcfdff30a52bffb395d845c774855b#proof-of-physical-address-popa) указано, что confirmation code отправляется из DApp web напрямую в смарт-контракт, минуя DApp server. Однако в коде требуется подпись DApp server.

*Исправлено в [https://github.com/poanetwork/wiki/commit/052db2902f3f9f62b4bf22446070270008a83b0f](https://github.com/poanetwork/wiki/commit/052db2902f3f9f62b4bf22446070270008a83b0f) (картинка берется из wiki-репозитория)*


### [ПРЕДЛОЖЕНИЯ]

##### 1. Ввести явное ограничение на количество возможных физических адресов для одного акаунта.

Сейчас работа со списком адресов во всех местах сделана через перебор массива. Размер переменной под счетчик везде uint256, и учитывая то что добавление адреса происходит через офлайн-почту, переполнения вроде бы не произойдет. Но на случай выявления проблем безопасности в других частях системы предлагаем добавить явное ограничение количества адресов в списке и/или возможность дропнуть длину массива адресов до этой максимальной длины в случае переполнения.

*Проверка добавлена в [PR 137](https://github.com/poanetwork/poa-popa/pull/137).*

## Выявленные проблемы (JavaScript)

### [КРИТИЧНЫЕ]

- не выявлено

### [СЕРЬЕЗНЫЕ]

Есть возможность бесплатно расходовать API-запросы к сервису отправки почты, а также организовать атаку отказа в обслуживании сервиса отправки почты. Вектор атаки следующий:

1. Атакующий отправляет `N` запросов `/prepareRegTx` и получает `N` ключей сессий `sk_1 .. sk_N` и `N` данных для отправки транзакций в контракт PoPA.
2. Однако атакующий отправляет только первую транзакцию в контракт PoPA и дожидается ее майнинга, получая `txId_1`. Остальные транзакции не отправляются.
3. Атакующий N раз вызывает `/notifyRegTx`, для каждого вызова используя разный `sk` с шага 1, но для всех вызовов используя одинаковый `txId = txId_1`: `data_i = {wallet: wallet, txId: txId_1, sessionKey: sk_i}`.
4. В результате DApp server успешно найдет N сессий, заблокирует их, для каждой из них найдет валидную транзакцию, извлечет соответствующий адрес и отправит на один и тот же адрес N открыток.

Самый простой способ исправить проблему - сохранять в сессию `data` транзакций и сверять его с таковым в блокчейне наравне с параметрами транзакции `to` и `from`. Это также исключит проблему недостаточности проверок `to` и `from` (атакующий может посылать транзакции с `value = 0`, но правильными `to` и `from`). Однако в целом рекомедуется оформить опрос блокчейна и отправку почты в виде фонового процесса на DApp server без участия пользователя, т.е. исключить передачу данных через ненадежный источник. 

*Клиент: Кажется вариант с `data` не будет работать (возможно я не так понял) - при вызове `/prepareRegTx` транзакция еще неизвестна, в `sessionKey` запоминается только код подтверждения в открытом виде, чтобы потом отправить в открытке. Может быть на сервере в редисе хранить в течение какого-то времени (скажем 1 часа) список обработанных транзакций. В код обработки транзакции добавить следующие проверки - (1) транзакции еще нет в списке (2) если нет в списке, то ее блок был замайнен в раньше, чем 1 час назад.*

Параметр data (входные данные транзакции), известен (по крайней мере, все его составляющие), и оно подписывается ключом сервера. Нужно проверить, что с сессией Х переданы эти самые параметры, как есть (abi-закодировав их). Знать id транзакции не нужно на этапе `/prepareRegTx`.

Есть альтернатива - запомнить в сессии подпись [prepare_reg_tx.js#L60-L62](https://github.com/poanetwork/poa-popa/blob/e259cec1fcfcfdff30a52bffb395d845c774855b/web-dapp/routes/prepare_reg_tx.js#L60-L62). Подсунуть одну и ту же транзакцию в разные сессии теперь атакующий не сможет - не сойдутся подписи транзакции с сохраненной в сессии (а она каждый раз разная, т.к. в подписываемых параметрах есть случайное значение confirmation code). Но придется повозиться с abi-декодированием input транзакции.

*[PR 178](https://github.com/poanetwork/poa-popa/pull/178)*

### [ПРЕДУПРЕЖДЕНИЯ]

##### 1. [recalc_price.js#L24](https://github.com/poanetwork/poa-popa/blob/e259cec1fcfcfdff30a52bffb395d845c774855b/web-dapp/server-lib/recalc_price.js#L24)

Довольно опасно оставлять подобный код в таком виде, т.к. если в конфиге будет закомментировано `priceWei`, он начнет работу в production. Предлагается добавить

```javascript
if (process.env.NODE_ENV !== 'test')
    throw new Error(‘not implemented’);
```

*[PR 171](https://github.com/poanetwork/poa-popa/pull/171)*

##### 2. [notifyRegTx.js#L119](https://github.com/poanetwork/poa-popa/blob/e259cec1fcfcfdff30a52bffb395d845c774855b/web-dapp/controllers/notifyRegTx.js#L119)

Состояние гонок (race condition) в ходе чтения-записи лимита открыток текущего дня, которое может привести к превышению установленного лимита на отправку открыток. Предположим, `postcard_limiter.get()` равно 9, а `postcard_limiter.MAX_POSTCARDS_PER_DAY` равно 10. Если несколько запросов друг за другом прочитают 9 из базы, для всех из них `postcard_limiter.canSend()` вернет истину, и они отправят запросы в `post_api.create_postcard`. Вероятно, только после этого они выполнят `postcard_limiter.inc()`, т.к. взаимный порядок выполнения callback’ов разных запросов не гарантируется.

Рекомендуется использовать строгий механизм синхронизации, например семафор.

*[PR 179](https://github.com/poanetwork/poa-popa/pull/179)*

##### 3. [notifyRegTx.js#L51](https://github.com/poanetwork/poa-popa/blob/e259cec1fcfcfdff30a52bffb395d845c774855b/web-dapp/controllers/notifyRegTx.js#L51)

Здесь сессия будет заблокирована, причем методом переименования ключа в session store. Однако не существует как таковой операции разблокирования сессии. Это ведет к тому, что при возникновении любых ошибок, в т.ч. не фатальных, пользователь никогда больше не сможет обратиться к этой сессии, т.о. потеряет плату, уплаченную в контракт PoPA, не получив результата.

Блокировка сессии нужна, без нее пользователь сможет отправить себе несколько открыток. Рекомендуется реализовать автоматическое снятие блокировки в конце обработки запроса. При хранении данных вне процесса веб-сервера также рекомендуется учесть возможность рестарта и падения веб-сервера - в этом случае потребуется автоматическое снятие блокировок (блокировка переименованием ключа уже не подойдет).

*[PR 180](https://github.com/poanetwork/poa-popa/pull/180)*

### [ЗАМЕЧАНИЯ]

##### 1. [req_id.js#L19](https://github.com/poanetwork/poa-popa/blob/e259cec1fcfcfdff30a52bffb395d845c774855b/web-dapp/server-lib/req_id.js#L19)

Прежде чем извлекать хост из пары хост:порт сначала нужно разбить значение заголовка на хосты, т.е. проще говоря, поменять блоки кода, начинающиеся на строках 19 и 22, местами. Иначе могут быть ошибочно отброшены хосты, например для такого значения: `192.168.0.10:50000, 37.10.5.2`.

*Добавлено в [PR 172](https://github.com/poanetwork/poa-popa/pull/172).*

##### 2. [redis.js#L74](https://github.com/poanetwork/poa-popa/blob/e259cec1fcfcfdff30a52bffb395d845c774855b/web-dapp/server-lib/session-stores/redis.js#L74)

Не дожидаемся завершения команды DEL перед тем, как успешно завершить Promise.

*Исправлено в [PR 173](https://github.com/poanetwork/poa-popa/pull/173).*

##### 3. [prepareRegTx.js#L15](https://github.com/poanetwork/poa-popa/blob/e259cec1fcfcfdff30a52bffb395d845c774855b/web-dapp/controllers/prepareRegTx.js#L15)

Здесь и далее рекомендуется установить максимальную длину для строк, введенных пользователем, например 500 символов.

*Клиент: Добавлено ограничение на общий размер POST body, срабатывающий еще до парсинга, в [PR 174](https://github.com/poanetwork/poa-popa/pull/174).*

Как вариант. Мотивация - защититься от заведомо больших данных, напр. адреса размером мегабайт. На них алгоритмы, условно считаемые O(1), станут O(N) и могут доставить как минимум мелкие неудобства.

# Аудит смартконтрактов проекта refactor

###### Репозиторий с кодом: https://github.com/refactorteam/Crowdsale-Contracts

Версия контрактов, для которых проводился аудит: https://github.com/refactorteam/Crowdsale-Contracts/tree/144b38652a5ed501b5d3f6e9256c9067bba71b1d

Версия доработок: https://github.com/refactorteam/Crowdsale-Contracts/tree/cedc5ff105e332b7fa1aa1e23600d4d91453a901
(https://github.com/refactorteam/Crowdsale-Contracts/compare/144b38652a5ed501b5d3f6e9256c9067bba71b1d...cedc5ff105e332b7fa1aa1e23600d4d91453a901)


## Классификация выявленных проблем

##### КРИТИЧНЫЕ - возможность кражи эфира/токенов или их блокировки без возможности восстановления доступа или иной потери эфира/токенов, причитающихся какой-либо стороне, например дивидендов.
##### СЕРЬЕЗНЫЕ - возможность нарушений работы контракта, при которых для восстановления его корректной работы необходима модификация состояния контракта вручную или его полная замена.
##### ПРЕДУПРЕЖДЕНИЯ - возможность нарушения запланированной логики контракта или возможность организации DoS-атаки на контракт."
##### ЗАМЕЧАНИЯ - все остальные замечания.


## Методика аудита

Код контракта просматривается вручную на наличие известных уязвимостей, ошибок в логике, соответствие WhitePaper. При необходимости на сомнительные моменты пишутся юниттесты.



## Выявленные проблемы

### [КРИТИЧНЫЕ]

- не выявлено

### [СЕРЬЕЗНЫЕ]

##### 1. https://github.com/refactorteam/Crowdsale-Contracts/blob/144b38652a5ed501b5d3f6e9256c9067bba71b1d/REFACTOR%20TOKEN.sol#L197 

В технических характеристиках токена указано, что контракт токена должен иметь функцию "сожжения". Такая функция реализована, но сжигать можно только свои собственные токены. Судя по тех. характеристикам (остаток нераспроданных токенов можно будет вручную «сжечь» в конце всех мероприятий) должна быть функция сжигания токенов организаторами. Таким образом в текущей версии контракта нераспроданные токены останутся на контракте crowdsale без возможности вывода.

### [ПРЕДУПРЕЖДЕНИЯ]

##### 1. https://github.com/refactorteam/Crowdsale-Contracts/blob/144b38652a5ed501b5d3f6e9256c9067bba71b1d/REFACTOR%20TOKEN.sol#L108
 
В используемой версии контракта StandardToken из библиотеки Zeppelin Solidity была найдена ошибка ошибка https://github.com/OpenZeppelin/zeppelin-solidity/issues/375 , позволяющая генерировать ложное событие о переводе самому себе любого количества токенов, даже превышающющего имеющиеся.

##### 2. https://github.com/refactorteam/Crowdsale-Contracts/blob/144b38652a5ed501b5d3f6e9256c9067bba71b1d/REFACTOR%20TOKEN.sol#L283

Вероятно, в формуле лишнее деление на `1 ether`. при текущей формуле, чтобы установить цену токена в 1 доллар, нужно вызвать метод setRate с параметром 300*10^18. Лучше реализовать rate без такого количества нулей, чтобы было меньше возможностей ошибиться.

Реализовано в https://github.com/refactorteam/Crowdsale-Contracts/commit/cedc5ff105e332b7fa1aa1e23600d4d91453a901

##### 3. https://github.com/refactorteam/Crowdsale-Contracts/blob/144b38652a5ed501b5d3f6e9256c9067bba71b1d/REFACTOR%20TOKEN.sol#L202
Рекомендуем добавить также генерацию события:
```
Transfer(burner, 0, _value);
```
для того, чтобы кошельки, etherscan.io и прочие клиенты увидели факт изменения баланса. Без этого, многие инвесторы просто не увидят свои токены в кошельках.

Похожая проблема есть и в конструкторе токена, https://github.com/refactorteam/Crowdsale-Contracts/blob/144b38652a5ed501b5d3f6e9256c9067bba71b1d/REFACTOR%20TOKEN.sol#L219 , там следует добавить:
```
Transfer(0, ADDRESS_FOR_TOKENS, INITIAL_SUPPLY);
```


### [ЗАМЕЧАНИЯ]

**1**. Используется не самая последняя версия библиотеки Zeppelin Solidity. Изменения в новой версии:

  * исправлена ошибка в ф-ции transferFrom контракта StandardToken (см. п.1. предупреждений)
  * в функциях контрактов явно указаны модификаторы видимости
  * оптимизация в функции mul из SafeMath, немного уменьшающая потребление газа
  * в контрактах BasicToken, StandardToken, BurnableToken в функциях transfer, transferFrom и burn добавлены проверки входных параметров, не сжигающие весь газ при неудаче: проверка на перевод на нулевой контракт и на то, что значение для перевода/сжигания меньше баланса и допустимой для перевода суммы

##### 2. https://github.com/refactorteam/Crowdsale-Contracts/blob/144b38652a5ed501b5d3f6e9256c9067bba71b1d/REFACTOR%20TOKEN.sol#L215

Поле digits в токене обычно делают типа uint8, это поле не описано в ERC20, но было предложено в ERC223 (https://github.com/ethereum/eips/issues/223). В примере на ethereum.org (https://ethereum.org/token) и в библиотеке Zeppelin Solidity в примере (https://github.com/OpenZeppelin/zeppelin-solidity/pull/490) используется именно uint8

Реализовано в https://github.com/refactorteam/Crowdsale-Contracts/commit/cedc5ff105e332b7fa1aa1e23600d4d91453a901

##### 3. https://github.com/refactorteam/Crowdsale-Contracts/blob/144b38652a5ed501b5d3f6e9256c9067bba71b1d/REFACTOR%20TOKEN.sol#L209
 
 В технических характеристиках токена указано, что контракт токена должен иметь такие функции как "Передача прав владельца" и "Являются Ownable". Для контракта токена это не сделано, но может понадобиться, если будет добавлена функция сжигания токенов в контракте самого токена.

**4.** В механике работы контракта есть упоминание «срока годности» контракта (который составляет 365 дней). Это не реализовано.

**5.** В комментариях к тех. описанию написано, почему не была реализована подпись тремя людьми действий с контрактами. Обычно, чтобы эти минусы были неактуальны, делают возможным совершать действия, подписанные не всеми владельцами. Например, подписанные двумя владельцами из трех.

**6.** В комментариях к тех. описанию написано, почему не было реализовано распределение средств на кошельки. Но узнать баланс любого адреса довольно просто: http://solidity.readthedocs.io/en/develop/units-and-global-variables.html#address-related

##### 7.  https://github.com/refactorteam/Crowdsale-Contracts/blob/144b38652a5ed501b5d3f6e9256c9067bba71b1d/REFACTOR%20TOKEN.sol#L281

Нет проверки на количество переданного эфира, можно купить 0 токенов.

Реализовано в https://github.com/refactorteam/Crowdsale-Contracts/commit/cedc5ff105e332b7fa1aa1e23600d4d91453a901

##### 8. https://github.com/refactorteam/Crowdsale-Contracts/blob/144b38652a5ed501b5d3f6e9256c9067bba71b1d/REFACTOR%20TOKEN.sol#L221
##### https://github.com/refactorteam/Crowdsale-Contracts/blob/144b38652a5ed501b5d3f6e9256c9067bba71b1d/REFACTOR%20TOKEN.sol#L270

 Заглушки ADDRESS_FOR_TOKENS, ADDRESS_FOR_ETH, START_DATETIME - плохая практика, т.к. потребует модификации кода перед развертыванием, что чревато ошибками.

##### 9. https://github.com/refactorteam/Crowdsale-Contracts/blob/144b38652a5ed501b5d3f6e9256c9067bba71b1d/REFACTOR%20TOKEN.sol#L236 

modifier onlyOwner избыточен в Crowdsale

##### 10. https://github.com/refactorteam/Crowdsale-Contracts/blob/144b38652a5ed501b5d3f6e9256c9067bba71b1d/REFACTOR%20TOKEN.sol#L271

Бессмысленная строчка. Кроме того, rate по-умолчанию равняется 0 и его установка не контролируется перед/во время начала crowdsale - это чревато тем, что если забыть или не успеть его установить, пройдут платежи, за которые будет начислено по 0 токенов. 

Необходимо указать в инструкции о необходимости задать rate в этой строке до деплоя контракта и выделить визуально.


Реализовано в https://github.com/refactorteam/Crowdsale-Contracts/commit/cedc5ff105e332b7fa1aa1e23600d4d91453a901
 
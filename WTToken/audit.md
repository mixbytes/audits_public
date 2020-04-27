# Аудит смартконтрактов проекта 0xde36e50674078fadb52ce1fd2121158fbd01cf86

###### Контракт 

Адрес контракта, для которого проводился аудит: https://etherscan.io/address/0xde36e50674078fadb52ce1fd2121158fbd01cf86#code

## Классификация выявленных проблем

##### КРИТИЧНЫЕ - возможность кражи эфира/токенов или их блокировки без возможности восстановления доступа или иной потери эфира/токенов, причитающихся какой-либо стороне, например дивидендов.
##### СЕРЬЕЗНЫЕ - возможность нарушений работы контракта, при которых для восстановления его корректной работы необходима модификация состояния контракта вручную или его полная замена.
##### ПРЕДУПРЕЖДЕНИЯ - возможность нарушения запланированной логики контракта или возможность организации DoS-атаки на контракт.

##### ЗАМЕЧАНИЯ - все остальные замечания.


## Методика аудита

Код контракта просматривается вручную на наличие известных уязвимостей, ошибок в логике, соответствие WhitePaper. При необходимости на сомнительные моменты пишутся юниттесты.



## Выявленные проблемы

### [КРИТИЧНЫЕ]

- не выявлено

### [СЕРЬЕЗНЫЕ]

- не выявлено


### [ПРЕДУПРЕЖДЕНИЯ]

##### 1. Строка: 151

Есть возможность сделать approve на transfer нуля токенов не только в случае, когда мы хотим изменить значение allowed количества
токенов. Предлагаем сделать проверку:

```
if (_value == 0 && allowed[msg.sender][_spender] == 0) revert();
```

##### 2. Строка: 123

Выражение *_addr = _addr;* кажется избыточным.


##### 3. Строка: 145

Рекомендация: добавить модификаторо *onlyPayloadSize(2 \* 32)* к методу *approve* тоже.


##### 4. Строка: 441

Возможно, стоит увеличить *previligedBalances[_to]* в этом методе?
Также, сейчас не очень понятна логика работы привелигированных балансов и ее отличие от обычных балансов.
Возможно, стоит добавить событие PreviligedTransfer?


##### 5. Строка: 370

Любой может сжечь токены.
Если команда планировала использовать функцию *burn()* для единоразового сжигания токенов — это может быть проблемой.


### [ЗАМЕЧАНИЯ]

##### 1. Строки: 451, 463, 436

Рекомендация заменить *public* на *extrenal*. Это позволит сэкономить газ.
https://medium.com/@gus_tavo_guim/public-vs-external-functions-in-solidity-b46bcf0ba3ac

##### 2. Строка: 284

Рекомендация добавить проверку:

```
assert(_upgradeMaster != address(0));
```

##### 3. Строка: 2418

Рекомендация добавить проверку:

```
assert(_owner != address(0));
```

##### 4. Строка: 214

Прежде чем вызывать safe-функции следует провалидировать пользовательский ввод с помощью require/revert - т.к. иначе в случае ошибочного пользовательского ввода весь газ, отведенный пользователем для транзакции, будет сожжен в силу наличия assert внутри safe-функций. Вообще говоря в ходе штатной работы контракта управление никогда не должно доходить до assert.

##### 5. Строка: 431

Нейминг: Параметр назван “_owner?. Но, по факту — это просто любой пользователь.

## Резюме

Не найдено проблем, которые могут привести к краже средств, токенов, либо остановке работы контракта.
Найденные замечания в основном касаются удобства использования и снижения риска пользовательских ошибок, а также ошибок клиентских библиотек.



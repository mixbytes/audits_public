# Аудит смарт-контрактов моста проекта POA Network

###### Контракт

Адрес контракта, для которого проводился аудит: https://github.com/poanetwork/poa-parity-bridge-contracts/tree/d796891477e15823c7bdd5b0b2f9a38e10f17b94/contracts

## Классификация выявленных проблем

##### КРИТИЧНЫЕ - возможность кражи эфира/токенов или их блокировки без возможности восстановления доступа или иной потери эфира/токенов, причитающихся какой-либо стороне, например дивидендов.
##### СЕРЬЕЗНЫЕ - возможность нарушений работы контракта, при которых для восстановления его корректной работы необходима модификация состояния контракта вручную или его полная замена.
##### ПРЕДУПРЕЖДЕНИЯ - возможность нарушения запланированной логики контракта или возможность организации DoS-атаки на контракт.
##### ЗАМЕЧАНИЯ - все остальные замечания.


## Методика аудита

Код контракта просматривается вручную на наличие известных уязвимостей, ошибок в логике, соответствие WhitePaper. При необходимости на сомнительные моменты пишутся юнит-тесты.

## Выявленные проблемы

### [КРИТИЧНЫЕ]

- не выявлено

### [СЕРЬЕЗНЫЕ]

##### 1. [U_BridgeValidators.sol: 37](https://github.com/poanetwork/poa-parity-bridge-contracts/blob/d796891477e15823c7bdd5b0b2f9a38e10f17b94/contracts/upgradeable_contracts/U_BridgeValidators.sol#L37)
Не выполняется проверки того, что удаляемый _validator действительно являлся валидатором. Если в конкретном случае это было не так, validatorCount() перестанет соответствовать истинному числу валидаторов. Ситуацию можно будет исправить только с помощью обновления кода контракта.

*Исправлено в [40a07ebd12bc2cc0716d4a1eb8004d979619907d](https://github.com/poanetwork/poa-bridge-contracts/commit/40a07ebd12bc2cc0716d4a1eb8004d979619907d).*

##### 2. [U_ForeignBridge.sol: 124, 139](https://github.com/poanetwork/poa-parity-bridge-contracts/blob/d796891477e15823c7bdd5b0b2f9a38e10f17b94/contracts/upgradeable_contracts/U_ForeignBridge.sol#L124)
Следует использовать hash вместо hashSender - иначе число signed для данного message никогда не станет больше 1, т.к. в hashSender включается msg.sender. Скорее всего, hashSender следует использовать только для исключения двойных подписей одним и тем же валидатором (в вызовах messagesSigned и setMessagesSigned).

*Исправлено в [PR 21](https://github.com/poanetwork/poa-bridge-contracts/pull/21).*

##### 3. [U_ForeignBridge.sol: 103](https://github.com/poanetwork/poa-parity-bridge-contracts/blob/d796891477e15823c7bdd5b0b2f9a38e10f17b94/contracts/upgradeable_contracts/U_ForeignBridge.sol#L103)
При увеличении числа требуемых подписей валидаторов возможна неоднократная выдача токенов: 
1) Предположим, что requiredSignatures равнялось 2, пришла подпись от второго валидатора — сгенерировали токены для recepient;
2) В контракте validatorContract подняли requiredSignatures до 3;
3) Один из валидаторов, вероятно злонамеренный, еще не подписывавших данный transactionHash, отправляет подпись;
4) Код генерации токенов снова вызывается, т.к. signed стало равно 3, и в то же время оказалось равно requiredSignatures.

*Был добавлен метод `isAlreadyProcessed`. Обсуждение решения досутпно в  [PR 20](https://github.com/poanetwork/poa-bridge-contracts/pull/20).*

##### 4. [U_ForeignBridge.sol: 143](https://github.com/poanetwork/poa-parity-bridge-contracts/blob/d796891477e15823c7bdd5b0b2f9a38e10f17b94/contracts/upgradeable_contracts/U_ForeignBridge.sol#L143)
При увеличении числа требуемых подписей валидаторов возможна неоднократная генерация события `CollectedSignatures` для данного сообщения.

*Дискуссиия и исправление доступны в [PR 20](https://github.com/poanetwork/poa-bridge-contracts/pull/20).*

### [ПРЕДУПРЕЖДЕНИЯ]

##### 1. [Helpers.sol: 49](https://github.com/poanetwork/poa-parity-bridge-contracts/blob/d796891477e15823c7bdd5b0b2f9a38e10f17b94/contracts/libraries/Helpers.sol#L49)
Квадратичная сложность алгоритма — в общем случае рискуем натолкнуться на лимит газа блока. Рекомендуем либо организовать hash map, либо балансированное бинарное дерево поиска, расположенное на массиве.

*Диалог с заказчиком:*
Аудитор: Можно устроить mapping библиотеке, делая sload/sstore по адресу хэш(id функции, id вызова, id мапы, ключ). Но жалко газа, т.к. потребуется 20к * длина_массива.
Поэтому лучше делать в memory. Но здесь память уже ограничена, и готовых рецептов сходу не видно. Экосистема еще не дозрела ни до аллокатора, ни до стандартной библиотеки структур.
Вероятно, самый быстрый вариант — ограничить число валидаторов и посчитать потребляемый газ в худшем случае.

Заказчик: Я провел небольшой эксперимент: [Ссылка](https://gist.github.com/akolotov/14fddcec8afaa33e786f3d5274bae2db).
Даже при 20 элементах массива, в транзакции потребилось 140 тыс. газа. Поэтому я не думаю, что изначальный комментарий из документа хоть сколько критичный. У нас вряд ли будет больше 15 валидаторов.
При реализации AVL-tree для работы с такими небольшими объемами данных у нас будут все равно сильные накладные расходы на вставку элементов, поскольку каждая вставка будет подразумевать перебалансировку дерева: ведь чаще всего у нас будет сценарий подписей в массиве без дубликатов, т.е. вставки будут делаться для каждого элемента все равно.
Действительно обход для поиска какого-то элемента (на дубликат) будет сокращаться до 5 элементов, вместо 19, как в нашем случае. Но появятся накладные расходы на реализацию такого дерева с использованием массива, а это не очень тривиально даже не для сбалансированного дерева.
В итоге мы может и выиграем два-три десятка тысяч газа, если валидаторов будет много, но, скорее всего, мы наоборот проиграем для случаев, когда валидаторов 5-7.
Ну и в любом случае проиграем с точки зрения читабельности кода. Вот пример реализации дерева: [OrderStatisticTree.sol](https://raw.githubusercontent.com/drcode/ethereum-order-statistic-tree/master/OrderStatisticTree.sol) (смотреть методы начиная с insert). Но в нашем случае оно было бы еще сложнее, поскольку было бы реализовано поверх массивов, а не поверх хэшмапов.

*В итоге решили оставить ез изменений, пока количество валидаторов не будет значительно большим.*

##### 2. [U_BridgeValidators.sol: 14](https://github.com/poanetwork/poa-parity-bridge-contracts/blob/d796891477e15823c7bdd5b0b2f9a38e10f17b94/contracts/upgradeable_contracts/U_BridgeValidators.sol#L14)
Поскольку контракт инициализируется первым любым участником сети, вызвавшим `initialize`, то для безопасности следует после отсылки транзакции инициализации (например, здесь — [3_upgradeable_deployment.js: 33](https://github.com/poanetwork/poa-parity-bridge-contracts/blob/d796891477e15823c7bdd5b0b2f9a38e10f17b94/migrations/3_upgradeable_deployment.js#L33)) убедиться, что она завершилась успешно. То же самое касается инстанцирования всех прочих upgradeable-контрактов —  `HomeBridge`, `ForeignBridge`.

*Добавлено в TODO.*

##### 3. [Helpers.sol: 46](https://github.com/poanetwork/poa-parity-bridge-contracts/blob/d796891477e15823c7bdd5b0b2f9a38e10f17b94/contracts/libraries/Helpers.sol#L46)
Здесь возможен бесконечный цикл из-за переполнения счетчика цикла типа `uint8` при `requiredSignatures` большем либо равном 256.

*Исправлено в [69b97796f684ecde0261e32a413bf5dbf3b3f11c](https://github.com/poanetwork/poa-bridge-contracts/commit/69b97796f684ecde0261e32a413bf5dbf3b3f11c).*

### [ЗАМЕЧАНИЯ]

##### 1. [Helpers.sol: 50](https://github.com/poanetwork/poa-parity-bridge-contracts/blob/d796891477e15823c7bdd5b0b2f9a38e10f17b94/contracts/libraries/Helpers.sol#L50)
Действительно ли использование `false` правильно здесь? Просится либо `require` (не `assert` т.к. входные параметры вызова формируются неподконтрольным кодом), либо игнорирование дублей без прекращения работы функции, с подсчетом числа уникальных подписей.

*Fixed at master [Message.sol: 103](https://github.com/poanetwork/poa-bridge-contracts/blob/8cf94e4b8b9651d163f15a135ea7f8841b5d2d46/contracts/libraries/Message.sol#L103)*

##### 2. [Message.sol: 27](https://github.com/poanetwork/poa-parity-bridge-contracts/blob/d796891477e15823c7bdd5b0b2f9a38e10f17b94/contracts/libraries/Message.sol#L27)
Рекомендуется явно наложить маску на интересующие биты с помощью `and(mload(add(message, 20)), 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF)`.

*Заказчик: mload же 32 байта читает? хочу понять зачем это.*

*Аудитор: В комментариях в коде говорится, что да, захватываем кусок соседнего поля, но там всегда нули, потому что ... . И здесь речь как раз о том, чтобы не надеяться, что там будут нули, а явно это гарантировать, наложив маску. Можно читать 20 байт так, можно захватить следующее поле и выполнить сдвиг на 12 байт вправо.*

*Исправлено в [PR 21](https://github.com/poanetwork/poa-bridge-contracts/pull/21)*

##### 3. [Proxy.sol: 30](https://github.com/poanetwork/poa-parity-bridge-contracts/blob/d796891477e15823c7bdd5b0b2f9a38e10f17b94/contracts/upgradeability/Proxy.sol#L30)
Не обновляется значение указателя на свободную память. Рекомендуется добавить `mstore(0x40, add(ptr, size))`.

*Исправлено в [PR 21](https://github.com/poanetwork/poa-bridge-contracts/pull/21)*

##### 4. [U_BridgeValidators.sol: 14](https://github.com/poanetwork/poa-parity-bridge-contracts/blob/d796891477e15823c7bdd5b0b2f9a38e10f17b94/contracts/upgradeable_contracts/U_BridgeValidators.sol#L14)
Рекомендуем добавить проверку в метод initialize: `require(owner != address(0));`.

*Исправлено в [master](https://github.com/poanetwork/poa-bridge-contracts/blob/8cf94e4b8b9651d163f15a135ea7f8841b5d2d46/contracts/upgradeable_contracts/U_BridgeValidators.sol#L18).*

##### 5. [U_BridgeValidators.sol: 20](https://github.com/poanetwork/poa-parity-bridge-contracts/blob/d796891477e15823c7bdd5b0b2f9a38e10f17b94/contracts/upgradeable_contracts/U_BridgeValidators.sol#L20)
Первое условие избыточно, т.к. метод `addValidator` дублирует его. Вторую проверку лучше внести в метод `addValidator`, чтобы инкапсулировать проверку внутри.

*Переделано в [master](https://github.com/poanetwork/poa-bridge-contracts/blob/8cf94e4b8b9651d163f15a135ea7f8841b5d2d46/contracts/upgradeable_contracts/U_BridgeValidators.sol#L14).*

##### 6. [U_BridgeValidators.sol: 28](https://github.com/poanetwork/poa-parity-bridge-contracts/blob/d796891477e15823c7bdd5b0b2f9a38e10f17b94/contracts/upgradeable_contracts/U_BridgeValidators.sol#L28)
Контроль пользовательского ввода рекомендуем делать с помощью `require`. `assert` рекомендуем применять сугубо для контроля самосогласованности кода.

*Исправлено в [PR 21](https://github.com/poanetwork/poa-bridge-contracts/pull/21).*

##### 7. [POA20.sol: 46](https://github.com/poanetwork/poa-parity-bridge-contracts/blob/d796891477e15823c7bdd5b0b2f9a38e10f17b94/contracts/POA20.sol#L46)
Может быть объявлена как `view`.

*Исправлено в [PR 21](https://github.com/poanetwork/poa-bridge-contracts/pull/21).*

##### 8. [POA20.sol: 31](https://github.com/poanetwork/poa-parity-bridge-contracts/blob/d796891477e15823c7bdd5b0b2f9a38e10f17b94/contracts/POA20.sol#L31)
Нет необходимости использовать механизм `super`, т.к. функция не переопределяет функцию родительского контракта `transfer`.

*Исправлено в [PR 21](https://github.com/poanetwork/poa-bridge-contracts/pull/21).*

##### 9. [POA20.sol: 31](https://github.com/poanetwork/poa-parity-bridge-contracts/blob/d796891477e15823c7bdd5b0b2f9a38e10f17b94/contracts/POA20.sol#L31)
Не проверяется результат выполнения `transfer`. Спецификация ERC20 говорит: “NOTE: An important point is that callers should handle false from returns (bool success). Callers should not assume that false is never returned!”. В текущем коде по факту всегда возвращается `true`, однако закладываться на это — значит закладывать скрытую проблему в код, которая может проявить себя в будущем.

*Исправлено в [PR 21](https://github.com/poanetwork/poa-bridge-contracts/pull/21).*

##### 10. [POA20.sol: 43](https://github.com/poanetwork/poa-parity-bridge-contracts/blob/d796891477e15823c7bdd5b0b2f9a38e10f17b94/contracts/POA20.sol#L43)
Не обрабатывается результат работы `onTokenTransfer`. Впрочем, похоже и сам автор спецификации ERC677 не знает зачем эта функция возвращает булево значение, и как его обрабатывать.

*Вопрос от заказчика: и что делать? Также дайте знать если нам лучше уйти в ERC827*

*Ответ аудитора: Если есть булево возвращаемое значение, рекомендуем делать require.
Что касается ERC827, оно еще активно патчится и обсуждается, не далее как неделю назад: https://github.com/ethereum/EIPs/issues/827#issuecomment-381966457. То же касается любого не-ERC20 стандарта токена на данный момент.
Для токена нашего проекта Smartz мы выбрали следующее решение: https://github.com/smartzplatform/sale/blob/master/contracts/token/TokenWithApproveAndCallMethod.sol.*

*Исправлено в [PR 21](https://github.com/poanetwork/poa-bridge-contracts/pull/21).*

##### 11. [U_ForeignBridge.sol: 45](https://github.com/poanetwork/poa-parity-bridge-contracts/blob/d796891477e15823c7bdd5b0b2f9a38e10f17b94/contracts/upgradeable_contracts/U_ForeignBridge.sol#L45)
Проверка `require(address(erc677token()) != address(0x0));` является избыточной, т.к. мы делаем это проверку при назначении токена. Может быть заменена на `assert`.

*Изменено в [PR 21](https://github.com/poanetwork/poa-bridge-contracts/pull/21).*

##### 12. [U_ForeignBridge.sol: 50](https://github.com/poanetwork/poa-parity-bridge-contracts/blob/d796891477e15823c7bdd5b0b2f9a38e10f17b94/contracts/upgradeable_contracts/U_ForeignBridge.sol#L50)
Логика расходится с описанием. Событие `Withdraw` генерируется немедленно после перевода токенов на foreign bridge, в то время как на странице [README.md](https://github.com/poanetwork/bridge-ui/blob/b552b053bd2d01a7fa4243f138448258174f4871/README.md) сказано, что это происходит после валидации транзакции (валидаторами? Или имеется ввиду майнинг транзакции?): “When the transaction is validated, the user should expect to see a Withdrawal Event on the Foreign Network (right-side - Ethereum Foundation).”. То же касается передачи по мосту в обратную сторону.

##### 13. [U_ForeignBridge.sol: 49](https://github.com/poanetwork/poa-parity-bridge-contracts/blob/d796891477e15823c7bdd5b0b2f9a38e10f17b94/contracts/upgradeable_contracts/U_ForeignBridge.sol#L49)
Из документации в [README.md](https://github.com/poanetwork/bridge-ui/blob/b552b053bd2d01a7fa4243f138448258174f4871/README.md) может показаться, что токены, переведенные на foreign bridge, сжигаются после сбора необходимого числа подписей. Однако, фактически они сжигаются сразу после перевода их пользователем на баланс контракта foreign bridge.

*Добавлено в TODO.*

##### 14. [U_HomeBridge.sol: 22](https://github.com/poanetwork/poa-parity-bridge-contracts/blob/d796891477e15823c7bdd5b0b2f9a38e10f17b94/contracts/upgradeable_contracts/U_HomeBridge.sol#L22)
Рекомендуем внести проверки: `require(_homeDailyLimit > 0);` в соответствующую функцию *setHomeDailyLimit*. Аналогично для контракта *U_ForeignBridge*.

*Исправлено в [master](https://github.com/poanetwork/poa-bridge-contracts/blob/8cf94e4b8b9651d163f15a135ea7f8841b5d2d46/contracts/upgradeable_contracts/U_HomeBridge.sol#L25).*

### [ПРЕДЛОЖЕНИЯ]

##### 1. Базовый контракт для `HomeBridge` и `ForeignBridge`
Часть кода `HomeBridge` и `ForeignBridge` (работа с дневным лимитом, часть инициализации) можно вынести в общий базовый контракт.

*Заказчик согласен. Отложено на будующее.*

##### 2. [Ownable.sol: 41](https://github.com/poanetwork/poa-parity-bridge-contracts/blob/d796891477e15823c7bdd5b0b2f9a38e10f17b94/contracts/upgradeable_contracts/Ownable.sol#L41)
Рекомендуем перенести проверку `newOnwer != address(0)` в функцию `setOwner`.

*Не реализовано. Комментарий заказчика: transferOwnership уже это делает, а в контракте BridgeValidators используется setOwner, потому что нельзя использовать transferOwnership*

##### 3. [U_ForeignBridge.sol: 120](https://github.com/poanetwork/poa-parity-bridge-contracts/blob/d796891477e15823c7bdd5b0b2f9a38e10f17b94/contracts/upgradeable_contracts/U_ForeignBridge.sol#L120) и [U_HomeBridge.sol: 62](https://github.com/poanetwork/poa-parity-bridge-contracts/blob/d796891477e15823c7bdd5b0b2f9a38e10f17b94/contracts/upgradeable_contracts/U_HomeBridge.sol#L62)
Рекомендуем эту, хоть и тривиальную, валидацию сообщений вынести в `library Message` как в единую точку, ответственную за десериализацию сообщений. Можно предложить сделать десериализацию одной функцией, возвращающей несколько значений, а также выполняющей валидацию.

*Исправлено в [PR 20](https://github.com/poanetwork/poa-bridge-contracts/pull/20)*

##### 4. [UpgradeabilityProxy.sol: 24](https://github.com/poanetwork/poa-parity-bridge-contracts/blob/d796891477e15823c7bdd5b0b2f9a38e10f17b94/contracts/upgradeability/UpgradeabilityProxy.sol#L24)
Стоит сделать механизм контроля версий, предотвращающий обновление на более старую версию.

*Закачик: в данном случае это просто стринг для удобства показа. по сути это никак не влияет. Стринги к сожалению нельзя сравнивать в солидити.*

*Аудитор: Это понятно, но можно сделать числом. Делать по semver, наверное, будет слишком. Подобно тому, как системы миграций не дают накатить более старую миграцию, есть смысл контролировать возрастание версии.*

*Исправлено в [master](https://github.com/poanetwork/poa-bridge-contracts/blob/8cf94e4b8b9651d163f15a135ea7f8841b5d2d46/contracts/upgradeable_contracts/U_BridgeValidators.sol#L18).*

##### 5. [U_HomeBridge.sol: 29](https://github.com/poanetwork/poa-parity-bridge-contracts/blob/d796891477e15823c7bdd5b0b2f9a38e10f17b94/contracts/upgradeable_contracts/U_HomeBridge.sol#L29)
Рекомендуем убедиться, что `msg.data.length == 0` — что пользователем/клиентским ПО не была ошибочно вызвана другая, несуществующая функция, а производится именно перевод эфира без параметров.

*Исправлено в [PR 21](https://github.com/poanetwork/poa-bridge-contracts/pull/21).*

##### 6. [U_BridgeValidators.sol: 28](https://github.com/poanetwork/poa-parity-bridge-contracts/blob/d796891477e15823c7bdd5b0b2f9a38e10f17b94/contracts/upgradeable_contracts/U_BridgeValidators.sol#L28)
Можно использовать более специфичную функцию: `require(!isValidator(_validator));`.

*Исправлено в [PR 20](https://github.com/poanetwork/poa-bridge-contracts/pull/20).*

##### 7. [U_ForeignBridge.sol: 78](https://github.com/poanetwork/poa-parity-bridge-contracts/blob/d796891477e15823c7bdd5b0b2f9a38e10f17b94/contracts/upgradeable_contracts/U_ForeignBridge.sol#L78)
Здесь и в прочих подобных местах. Если функция будет вызываться исключительно внешними вызовами (external call), рекомендуем заменить модификатор видимости `public` на `external`. Во-первых, тем самым мы более точно описываем для компилятора то, как задумали работу системы контрактов. Например, случайный внутренний вызов external функции в контракте либо контракте-наследнике вызовет ошибку компиляции и потребует либо убрать вызов, либо пересмотреть роль функции в системе контрактов. По сути это схоже с использованием спецификатора const в некоторых языках программирования. Во-вторых, это сэкономит немного газа (https://medium.com/@gus_tavo_guim/public-vs-external-functions-in-solidity-b46bcf0ba3ac).

*Во многом исправлено в [PR 21](https://github.com/poanetwork/poa-bridge-contracts/pull/21).*

##### 8. Реализовать обновляемость (upgradability) контрактов другим способом. 
Минусы текущей реализации:
- Нет поддержки на уровне IDE и компилятора — так, например, ошибка в строковом литерале, который на самом деле обозначает переменную, будет незамечена (напр., если ошибиться в написании gasLimitDepositRelay здесь: [U_ForeignBridge.sol: 79](https://github.com/poanetwork/poa-parity-bridge-contracts/blob/d796891477e15823c7bdd5b0b2f9a38e10f17b94/contracts/upgradeable_contracts/U_ForeignBridge.sol#L79))
- При использовании комплексных типов данных, когда хэш элемента стораджа строится из нескольких составляющих, не производится должной изоляции, как результат может возникнуть коллизия, например: `boolStorage(keccak256(“foo”, “bar”))` и `boolStorage(keccak256(“fooba”, “r”))` коллизируют.
- Закладываемся на неизменность текущего layout полей контракта (прежде всего речь о слотах для полей EternalStorage) solidity.
Неудобства на этапе инстанцирования контрактов: приходится пользоваться функцией без контроля доступа вместо конструктора.

Предлагаемый вариант: каждая версия контракта имеет свой storage, и подтягивает по-необходимости данные из storage предыдущей версии. Иллюстрация предлагаемого варианта решения приведена в файле `UpgradableBridge.sol` с тестом `UpgradableBridge.js`.

Минусы предлагаемого варианта:
- Нет возможности гарантировать наперед полное “отключение” версии контракта при обновлении от ее storage, который потребуется следующей версии (напр. если где-то забыть модификатор onlyProxy). Возможна ситуация, когда версия сможет продолжить функционировать (хоть уже и не влияя на мост) и повреждать свой storage.
- Вероятно, больший расход газа.

*Заказчик имеет опыт применения рекомендованного решения и говорит о сложностях в миграции данных.*

### [РЕЗЮМЕ]

Выявлены проблемы, препятствующие работе, и требующие устранения. Возможности кражи средств или токенов третьими лицами не выявлено. Также выявлен ряд потенциально опасных конструкций, и даны рекомендации с учетом того, что код будет дорабатываться и развиваться.

На момент 28.04.2018 все необходимые правки были внесены.

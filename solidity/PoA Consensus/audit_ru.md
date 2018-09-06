### [КРИТИЧНЫЕ]

Не найдены

### [СЕРЬЕЗНЫЕ]

##### 1. [ValidatorMetadata.sol#L131](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/ValidatorMetadata.sol#L131)

Устаревший механизм голосования нужно убрать. К его минусам относятся, во-первых, невозможность голосовать против и т.о. как-либо отменить предложенный адрес прокси, во-вторых, низкий и зафиксированный в виде константы (`3`) порог принятия решения.

*Исправлено в [PR 150](https://github.com/poanetwork/poa-network-consensus-contracts/pull/150).*

##### 2. [VotingToChangeMinThreshold.sol#L98](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/VotingToChangeMinThreshold.sol#L98)

При увеличении порога голосования за смену ключей, а также при удалении voting key ([KeysManager.sol#L454](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/KeysManager.sol#L454)) не проверяется, что суммарное количество voting key, оставшихся в системе, все еще больше текущего порога и голосования в принципе могут быть завершены (см. [VotingToChange.sol#L229](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/abstracts/VotingToChange.sol#L229)). В результате этого, может произойти отказ в обслуживании.

*Клиент: да, у нас заведено [issue на эту тему](https://github.com/poanetwork/poa-network-consensus-contracts/issues/154) - предполагается, что если порог окажется выше кол-ва валидаторов, то можно будет устроить голосование за смену имплементации  `BallotsStorage`, в котором хранится это значение порога, т.к. голосование за смену имплементации в таких случаях не блокируется. Прокомментируйте, пожалуйста, если вы все равно видите проблему с учетом сказанного. Я думаю решить этот issue после проведения хард-форка, чтобы сейчас сэкономить время. Также на этапе создания голосования за смену порога у нас есть такая проверка на кол-во валидаторов: [VotingToChangeMinThreshold.sol#L21](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/VotingToChangeMinThreshold.sol#L21) - правда, это проверка на количествово mining keys, а не voting keys, но у нас не бывает валидаторов с пустым voting key (теоретически и технически могут быть, но это маловероятно).*

Да, все так. Плюс, количество голосующих, равное уже упомянутому `getProxyThreshold`, также является необходимым для успешного завершения голосования за смену реализации `BallotsStorage`. Критических проблем нет, остальные вы видите и вам оценивать их вероятности и принимать решения.

*Клиент: насчет `getProxyThreshold` - если возникнет ситуация с нехваткой ключей для успешной финализации голосования за смену имплементации `BallotsStorage`, то валидаторы смогут создать новое такое же голосование, в котором будет записано актуальное значение proxyThreshold, которого будет достаточно, чтобы финализировать новое голосование.*

### [ПРЕДУПРЕЖДЕНИЯ]

##### 1. [BallotsStorage.sol#L101](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/BallotsStorage.sol#L101)

Если наберется > 200 валидаторов, `getBallotLimitPerValidator` начнет возвращать ноль. Эта функция используется в функции `withinLimit`, а значит никто не сможет больше создавать новые ballot-ы - все изменения заблокируются.

Данная проблема сейчас не актуальна благодаря ошибке в реализации модификатора [`withinLimit`](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/abstracts/VotingToChange.sol#L136) где вместо `<=` должно быть `<`, иначе разрешается превышать лимит на 1 при вызовах [`_createBallot`](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/abstracts/VotingToChange.sol#L181). Если эту ошибку исправить, будет блокировка возможности голосований за изменения при достижении числа валидаторов 200.

*Исправлено в [PR 146](https://github.com/poanetwork/poa-network-consensus-contracts/pull/146).*

##### 2. [VotingToChange.sol#L94](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/abstracts/VotingToChange.sol#L94)

Здесь импортируются числа открытых голосований только для текущих валидаторов. Если валидатор открыл голосование, затем перестал быть действующим валидатором (`poa.currentValidators`), и затем был произведен вызов `migrateBasicAll`, то голосование данного валидатора не сможет быть закрыто, т.к. будет падать на `assert` при вызове `_decreaseValidatorLimit` в ходе `_finalizeBallot`.

*Исправлено в [PR 145](https://github.com/poanetwork/poa-network-consensus-contracts/pull/145).*

##### 3. [VotingToChangeKeys.sol#L329](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/VotingToChangeKeys.sol#L329)

Существует возможность создать два и более голосований за удаление одного и того же mining key в то время, как данный mining key еще активен. Однако, успешно завершено будет лишь первое из подобных голосований, остальные же останутся в активном состоянии.

*Исправлено в [PR 145](https://github.com/poanetwork/poa-network-consensus-contracts/pull/145).*

##### 4. [KeysManager.sol#L77](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/KeysManager.sol#L77)

`require(poa.getCurrentValidatorsLength() <= maxLimitValidators());` - тут надо поменять `<=` на `<`, иначе получается, что при достигнутом лимите разрешается еще одно добавление.

*Исправлено в [PR 145](https://github.com/poanetwork/poa-network-consensus-contracts/pull/145).*

##### 5. [ValidatorMetadata.sol#L260](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/ValidatorMetadata.sol#L260)

Модификатор public позволяет владельцу voting key использовать любой mining key, в том числе создать запрос на изменение чужих данных или отредактировать чужой запрос до того как он принят.

*Клиент: функция changeRequestForValidator удалена с переносом ее кода в функцию changeRequest в [PR 146](https://github.com/poanetwork/poa-network-consensus-contracts/pull/146).*

##### 6. [ValidatorMetadata.sol#L331](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/ValidatorMetadata.sol#L331)

`uint256 public constant MAX_PENDING_CHANGE_CONFIRMATIONS = 50` - такое определение константы заблокирует возможность вносить изменения в случае если порог (возвращается из `ballotsStorage.getBallotThreshold(metadataChangeThresholdType))` через голосование установят выше 50-ти.

Исправлено в [PR 146](https://github.com/poanetwork/poa-network-consensus-contracts/pull/146).

*Клиент: здесь https://github.com/poanetwork/poa-network-consensus-contracts/pull/164/files#diff-2c00ed73fa555c3fa081a96e5b5893dc было решено вернуть значение 50 в качестве ограничения, чтобы лимитировать итерации циклов здесь https://github.com/varasev/poa-network-consensus-contracts/blob/aa6eab9a28fbc710858b0e020e7f5f69dda8ba17/contracts/ValidatorMetadata.sol#L447 и здесь https://github.com/varasev/poa-network-consensus-contracts/blob/aa6eab9a28fbc710858b0e020e7f5f69dda8ba17/contracts/ValidatorMetadata.sol#L638. Добавленный код учитывает минимальный порог, поэтому если порог будет выше значения 50, блокировка при финализации не произойдет: https://github.com/varasev/poa-network-consensus-contracts/blob/aa6eab9a28fbc710858b0e020e7f5f69dda8ba17/contracts/ValidatorMetadata.sol#L275-L280*

Но фактически ограничение, которое хотели вернуть, обходится https://github.com/varasev/poa-network-consensus-contracts/blob/aa6eab9a28fbc710858b0e020e7f5f69dda8ba17/contracts/ValidatorMetadata.sol#L277-L278

*Клиент: да, его можно обойти, если `minThreshold` больше значения `50`. Но маловероятно, что `minThreshold` будет установлен в такое большое значение при инициализации контракта `BallotsStorage`. Я дополнительно сделаю проверку внутри функции `BallotsStorage.init`, чтобы это значение нельзя было превысить.*

*Улучшения по этому предупреждению выполнены в https://github.com/poanetwork/poa-network-consensus-contracts/pull/166*

##### 7. [KeysManager.sol#L323](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/KeysManager.sol#L323)

Возможно добавление валидатора на 1 больше, чем `maxLimitValidators`?

*Клиент: да, заменил на строгое неравенство: [PR 145](https://github.com/poanetwork/poa-network-consensus-contracts/pull/145).*

Кстати говоря, это еще одно место, где можно создать незакрываемое голосование.

*Клиент: да, точно. Надо будет добавить проверку на кол-во валидаторов при создании голосования. Маловероятно, что в системе будет достигнуто 2 тыс. валидаторов, но все же.*

Нет, в простом виде проверка при создании - не подойдет, я писал об этом в последнем замечании. Если ее делать, то сразу нужно заводить счетчик ожидаемых к добавлению валидаторов, и суммировать его с текущим числом при проверке условия.

*Клиент: мы решили не добавлять такую проверку, т.к. ситуация с кол-вом валидаторов, равным 2000, маловероятна. Чтобы не усложнять код для обработки такого маловероятного события. Решение вопроса с нефинализируемыми голосованиями описано в замечании № 9.*

##### 8. [KeysManager.sol#L263](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/KeysManager.sol#L263)

Возможно превышение `maxLimitValidators`, если какие-то из initial keys будут использованы уже после достижения `maxLimitValidators` посредством `addMiningKey`.

*Исправлено в [PR 153](https://github.com/poanetwork/poa-network-consensus-contracts/pull/153).*

##### 9. [VotingTo.sol#L191](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/abstracts/VotingTo.sol#L191)

В некоторых местах кода, выполняющих чтение истории mining-ключей, существуют лимиты чтения истории (напр. также здесь [KeysManager.sol#L181](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/KeysManager.sol#L181)), причем разные. Однако, не существует лимита на запись истории mining-ключей. Это означает, что при достижении указанных лимитов, чтение истории перестанет возвращать корректные данные. Достижение лимитов может произойти в результате действий атакующего, а также, с какой-то крайне малой вероятностью, в ходе штатной эксплуатации. Рекомендуем установить лимиты на чтение и запись повсеместно одинаковыми.

*Клиент: если просто поставить лимит на запись, функция `VotingToChangeKeys.checkIfMiningExisted` будет вести себя так же, как и сейчас - возвращать false для ключа, который был создан более 25 обменов назад. Я правильно понимаю, что вы предлагаете запрещать swap mining key, если лимит достигнут? Насчет функции `KeysManager.migrateMiningKey` - она теперь будет брать значение такого же лимита из public-getter'а maxOldMiningKeysDeepCheck(): [PR 156](https://github.com/poanetwork/poa-network-consensus-contracts/pull/156/files#diff-7b2957c0b674ce4e78e903e367828aa6).*

Да, получается что так - лимит в 25 смен ключей. Вам виднее насколько это будет мешать. Альтернативы есть (строить дерево, фильтр Блума, ...), но они относительно громоздки.

*Клиент: я думаю, мы оставим текущую реализацию с текущими лимитами.*

##### 10. [PoaNetworkConsensus.sol#L78](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/PoaNetworkConsensus.sol#L78)

Рекомендуем добавить проверку того, что валидатор `currentValidators[i]` не был добавлен ранее. Иначе, часть ячеек в `currentValidators` и `pendingList` окажутся занятыми навсегда, а `getCurrentValidatorsLength` и `getCurrentValidatorsLengthWithoutMoC` будут возвращать завышенные числа.

*Исправлено в [PR 156](https://github.com/poanetwork/poa-network-consensus-contracts/pull/156).*

##### 11. Глобальные лимиты голосований

В документации https://github.com/poanetwork/wiki/wiki/Ballots-Overview.-Life-cycle-and-limits#limits упоминаются глобальные лимиты голосований (напр. “Validator Management Ballot: 9 active ballots at one time”). В аудируемой версии кода их нет, но если они будут реализованы, то они не только не защитят от спама, но и в купе с проблемой незакрываемых голосований могут привести к глобальному отказу в обслуживании.

*Клиент: да, это устаревшая информация в документации (исправим). Вместо глобальных лимитов у нас используются лимиты по каждому валидатору, вычисляемые в функции `BallotsStorage.getBallotLimitPerValidator`: [BallotsStorage.sol#L135-L145](https://github.com/poanetwork/poa-network-consensus-contracts/blob/fd2b2c6c2f4a4b1b5bdacd4f9510397e3c5124fa/contracts/BallotsStorage.sol#L135-L145). Решение проблемы нефинализируемых голосований описано в замечании № 9. Прошу прокомментировать, видите ли вы проблемы с защитой от спама в текущей реализации, которая опирается на `BallotsStorage.getBallotLimitPerValidator`?*

Здесь проблем не видим.

##### 12. Документация

В документации https://github.com/poanetwork/wiki/wiki/POA-Network-Whitepaper#creating-a-new-ballot на диаграмме есть комментарий, что метод контракта ищет голосования готовые к завершению и финализирует их, но в коде этого нет. Такой же коментарий есть на следующей диаграме https://github.com/poanetwork/wiki/wiki/POA-Network-Whitepaper#voting-on-a-ballot

*Клиент: мы уберем лишнее примечание из диаграмм. Соответствующее issue для этого: https://github.com/poanetwork/wiki/issues/67.*

##### 13. [BlockReward.sol#L71](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/BlockReward.sol#L71)

Проверка `isMiningActive` достаточна только если майнер остался активным в течение всего периода. В ситуации если долго не было reward-ов может оказаться так что майнер уже не активен, но еще не получил награду за предыдущие периоды.

*Клиент: здесь предполагается, что функция reward будет вызываться стабильно раз в 5 секунд. При каждом вызове валидатор (майнер) будет разным (на данный момент в сети 19 валидаторов) - вызов этой функции происходит движком Parity в цикле для всех валидаторов из списка. Когда обработан последний валидатор, вызов начинается с начала списка. Поэтому, например, для 20 валидаторов время ожидания для любого валидатора составит 100 секунд. Если валидатора уже нет, но Parity по какой-то причине вызвал для этого валидатора функцию reward, то произойдет revert. По идее, таких ситуаций быть не должно, т.к. Parity должен оперировать всегда актуальным списком валидаторов. Но require здесь вставлен на всякий случай.*

##### 14. [BlockReward.sol#L115](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/BlockReward.sol#L115)

В функции `rewardHBBFT` в цикле происходит распределение вознаграждений между майнерами, при этом список майнеров перестраивается на ходу. Возможна ситуация в которой распределение вознаграждений начинается по устаревшему списку, а продолжается по обновленному, причем непонятно откуда следует соответствие обновленного списка и списка майнеров которые действительно должны получить награду за свою работу (как на момент вызова функции гарантируется что в списке майнеров именно те майнеры которые сделали работу в определенный период в прошлом).

Одна из вытекающих проблем: если майнер потерял контроль над ключом и сменил его через голосование, возможна ситуация когда вознаграждение уйдет на старый ключ потому что список `hbbftPayoutKeys` давно не обновлялся.

*Клиент: здесь работа построена по следующему принципу. Предполагается, что вознаграждение должны получать все валидаторы по очереди. В самом начале берется список валидаторов. По мере прохождения цикла вознаграждение начисляется каждому валидатору в порядке его номера в массиве. Если цикл идет дальше текущего размера массива валидаторов, то после обработки последнего валидатора в массиве список обновляется, т.к. за время обработки массива с нулевого элемента до последнего состав валидаторов мог поменяться. И обработка начинается с нулевого валидатора уже обновленного списка. Т.е. по сути берется snapshot списка валидаторов и он не меняется, пока этот список не обработан до конца. Как только он обработан до конца, snapshot берется снова. И т.д. Этот контракт у нас пока не до конца проработан - возможно, алгоритм еще поменяется, но нам пока достаточно проаудировать текущую версию его кода. Дайте знать, если вышеописанный алгоритм начисления вам не до конца понятен. У нас есть небольшое описание задачи, по которому была реализована функция: https://github.com/poanetwork/RFC/issues/16*

### [ЗАМЕЧАНИЯ]

##### 1. [KeysManager.sol#L238-L265](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/KeysManager.sol#L238-L265)

Несколько `initialKey` могут использовать один и тот же mining key. В текущей реализации контракта `PoaNetworkConsensus.sol` функция addValidator бросит исключение в этой ситуации, но лучше добавить явную проверку через `successfulValidatorClone`, поскольку это снизит вероятность появления ошибок при внесении изменений. В том числе не придется задумываться что произойдет, если уже создан и инициализирован `KeysMaster`, но `ProxyStorage` еще не инициализирован и `poaNetworkConsensus()` возвращает `address(0)`. Или что произойдет, если голосованием решено сменить `ProxyStorage`, а вместе с ним меняется адрес `EthernalStorageProxy` контракта для `PoaNetworkConsensus`, но миграция данных из `PoaNetworkConsensus` происходит отдельной транзакцией, а между этими событиями вклинился вызов `createKeys`.
Любой `initialKey` может использовать чужой payment key и/или voting key.

*Исправлено в [PR 135](https://github.com/poanetwork/poa-network-consensus-contracts/pull/135).*

##### 2. [KeysManager.sol#L346-L368](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/KeysManager.sol#L346-L368)

В функции `swapMiningKey` можно затереть `miningKey` вместе со всеми остальными ключами, создать бесконечный цикл в цепочке `miningKeyHistory` (фактически убить связь текущего ключа со всеми предыдущими) если атакующий знает только mining key - не проверяется что новый и старый ключи отличаются. В текущей системе контрактов возможность такого вызова исключается, но лучше вставить явную проверку и не полагаться на то что будущие изменения в `VotingToChangeKeys` не позволят проэксплуатировать уязвимость.

*Исправлено в [PR 148](https://github.com/poanetwork/poa-network-consensus-contracts/pull/148).*

##### 3. [ValidatorMetadata.sol#L317](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/ValidatorMetadata.sol#L317)

Линейная сложность при проверке факта голосования. Но длина массива никогда не становится больше трех (прописано в [ValidatorMetadata.sol#L139](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/ValidatorMetadata.sol#L139)), поэтому не страшно.

*Клиент: функции, связанные с изменением адреса `ProxyStorage`, удалены из `ValidatorMetadata` в [PR 150](https://github.com/poanetwork/poa-network-consensus-contracts/pull/150) - эти функции перекочевали из старой версии контракта. Теперь они не нужны, т.к. у нас есть upgradable `ProxyStorage`.*

##### 4. [ValidatorMetadata.sol#L367](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/ValidatorMetadata.sol#L367)

Непосредственное указание целочисленного значения enum - потенциально вызовет проблемы при внесении изменений.

*Исправлено в [PR 149](https://github.com/poanetwork/poa-network-consensus-contracts/pull/149).*

##### 5. [VotingToChangeKeys.sol#L93](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/VotingToChangeKeys.sol#L93)

Нигде после вызова `areBallotParamsValid` не проверяется что `mining key != address(0)`, значит можно создать голосование для добавления, например, voting key для нулевого адреса. Если по какой-то причине такое голосование закончится accept-ом, на этапе финализации будет revert при попытке добавить voting key в `KeysManager` и у данного участника зависнет неудаляемый Ballot.

*Исправлено в [PR 147](https://github.com/poanetwork/poa-network-consensus-contracts/pull/147).*

##### 6. [EternalStorageProxy.sol#L59](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/eternal-storage/EternalStorageProxy.sol#L59)

Не обновляется значение указателя на свободную память. Перед использованием фрагмента памяти рекомендуется аллоцировать его, добавив `mstore(0x40, новый указатель на свободную память)`.

*Клиент: я думаю, мы можем обойтись без указателя на свободную память, как это описано в https://github.com/zeppelinos/zos-lib/issues/70 - я сделал соответствующий PR для его удаления: https://github.com/poanetwork/poa-network-consensus-contracts/pull/151.*

Прокомментировал issue. В двух словах - это опасная практика. Однако, если вообще не использовать "аллокатор" - вопрос снимается.

*Клиент: т.е. в нашем текущем случае можно оставить это решение? [EternalStorageProxy.sol#L58-L75](https://github.com/poanetwork/poa-network-consensus-contracts/blob/cdda8976896f85b4d71e0a28216616cf3e9df385/contracts/eternal-storage/EternalStorageProxy.sol#L58-L75).*

Да.

##### 7. [VotingToChangeKeys.sol#L219](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/VotingToChangeKeys.sol#L219)

В ходе миграции голосования не мигрируются параметры: `NEW_PAYOUT_KEY`, `NEW_VOTING_KEY`.

*Клиент: да, все верно, поскольку миграция предполагается из старой версии контракта, в котором данных параметров нет. Для будущего я добавил миграцию этих параметров в закомментированном виде. Если в будущем будет нужно мигрировать с новой версии контракта на новую, эти строчки будут раскомментированы: [PR 152](https://github.com/poanetwork/poa-network-consensus-contracts/pull/152/files#diff-d4341d108087469a82aa13c606e762ddR228).*

##### 8. [KeysManager.sol#L409](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/KeysManager.sol#L409)

У атакующего существует возможность заставить указывать чужой, уже зарегистрированный voting key на свой mining key. Дальнейшего серьезного развития этого вектора атаки не видно, однако рекомендуется предотвратить эту ситуацию, предварительно проверяя соотв. `miningKeyByVoting` на 0.

*Клиент: проверка добавлена одновременно в KeysManager и VotingToChangeKeys: [PR 152](https://github.com/poanetwork/poa-network-consensus-contracts/pull/152/files#diff-d4341d108087469a82aa13c606e762ddR228).*

Но, кажется, вновь появляется риск незакрываемого голосования.

*Клиент: да, но мы решили, что незакрываемые голосования в подобных случаях - это нормально. Если мы, например, не можем добавить voting-ключ уже несуществующему mining-ключу, то такое голосование не должно финализироваться и должно иметь признак "не финализировано", чтобы было видно, что предполагаемые изменения не применены. Сами случаи таких голосований теоретически по коду возможны, но маловероятны (теперь в том числе благодаря дополнительным проверкам еще при создании голосования). Однако, если вы считаете, что нефинализированные голосования могут представлять какую-то угрозу - просьба прокомментировать.*

Хотя если голосование не финализируется, то не будет вызвана функция _decreaseValidatorLimit, что чревато уменьшением лимита голосований конкретного валидатора. Я подумаю, как лучше сделать.

Глобальных последствий от незакрываемых голосований, напр. DoS'а, не видно.

*Клиент: решение этого вопроса выполнено в следующем замечании № 9.*

##### 9. [VotingToChangeKeys.sol#L116](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/VotingToChangeKeys.sol#L116)

Подобные проверки, обращающиеся к глобальному состоянию, действительны лишь на момент создания голосования. Когда эффекты голосования будут применяться, глобальное состояние может измениться и условия проверок не будут удовлетворены, однако это останется незамеченным. Одно из следствий этого отмечено выше.

*Клиент: да, аналогичные проверки добавлены в KeysManager (на этапе финализации): [PR 152](https://github.com/poanetwork/poa-network-consensus-contracts/pull/152/files#diff-d4341d108087469a82aa13c606e762ddR228).*

Да, теперь проверки есть и это хорошо, но теперь появилось много потенциальных мест, где можно создать незакрываемое голосование. Может быть, вместо того, чтобы бороться с этим множеством, применять эффекты голосования с помощью sub-call и обработки булева кода завершения (напр., в случае `false` просто ставить соотв. информационный флаг в голосовании)?

*Клиент: т.е. вы предлагаете избавиться от revert'ов в KeysManager, и поставить условия if. Если условие не выполняется, то эффекты голосования не применяются, но голосование все равно отмечается, как финализированное. Я правильно понял?*

Не совсем. Я предлагаю revert'ы оставить, но здесь [VotingToChangeKeys.sol#L297](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/VotingToChangeKeys.sol#L297) и во всех подобных местах заменять внешний вызов на конструкцию напр. `keysManager.addMiningKey.value(0)(affectedKey);`, т.е. игнорировать всплывающие исключения.

Когда сейчас сформулировал такую крамолу, сам засомневался. Может быть, как альтернатива - изжить revert'ы из кода, применяющего изменения, и игнорировать изменения, если они не могут быть применены, т.е. просто `return;`.

*Клиент: если рассматривать негативные последствия от нефинализированных голосований, то я вижу только один момент с функцией VotingToChange._decreaseValidatorLimit (описал выше).*

Можно изменить код всех функций KeysManager, которые вызываются из VotingToChangeKeys, так, чтобы они не делали revert, а возвращали false в случае неудачи. Тогда функция финализации не будет делать revert (как это сделано с VotingToManageEmissionFunds) и можно будет обойтись без `prefinalize`.

*Клиент: было решено заменить revert'ы на return'ы, как вы предложили выше. Теперь при финализации голосования, если условия в момент финализации не выполняются, транзакция все равно пройдет, но изменения не будут применены. Это выполнено в [PR 155](https://github.com/poanetwork/poa-network-consensus-contracts/pull/155). Для устранения проблемы с функцией `_decreaseValidatorLimit` в функции `VotingToChange._finalizeBallot` код изменен следующим образом: [diff](https://github.com/poanetwork/poa-network-consensus-contracts/pull/155/files#diff-1b5bd6dd22e70fb3f22f92d5589b038fR217) - т.е. изменение лимита голосования происходит один раз (при первой транзакции финализации). При повторных попытках финализации изменение счетчика не происходит, чтобы нельзя было его накрутить.*

##### 10. [ValidatorMetadata.sol#L279](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/ValidatorMetadata.sol#L279)

Один валидатор может обнулить голосование за изменение метаданных другого валидатора.

*Клиент: функция `changeRequestForValidator` удалена с переносом ее кода в функцию `changeRequest` в [PR 146](https://github.com/poanetwork/poa-network-consensus-contracts/pull/146).*

##### 11. [ValidatorMetadata.sol#L334](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/ValidatorMetadata.sol#L334)

Поскольку при голосовании учитываются voting key, а не mining key, а те, в свою очередь, могут меняться для одного и того же валидатора, существует возможность одному валидатору проголосовать несколько раз.

*Исправлено в [PR 157](https://github.com/poanetwork/poa-network-consensus-contracts/pull/157).*

##### 12. [ValidatorMetadata.sol](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/ValidatorMetadata.sol)

Является ли ожидаемым поведением то, что при изменении mining key валидатора он потеряет свою метаинформацию? Является ли ожидаемым поведением то, что при возвращении существовавшего в прошлом mining key в ряды активных валидаторов, с данным mining key будет автоматически ассоциирована старая метаинформация? Рекомендуем обрабатывать в `ValidatorMetadata` удаление и смену ключа валидатора.

*Исправлено в [PR 158](https://github.com/poanetwork/poa-network-consensus-contracts/pull/158).*

##### 13. [VotingToManageEmissionFunds.sol#L48](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/VotingToManageEmissionFunds.sol#L48)

Поскольку одновременно может существовать только одно голосование по поводу эмиссии, один валидатор может с каким-то ограниченным успехом организовать DoS-атаку на выплату emission funds, постоянно создавая зловредные голосования, напр. на выплату emission funds себе.

*Клиент: если валидатор так сделает, другие валидаторы смогут проголосовать против и исключить его из списка валидаторов (в отдельном голосовании за ключи). Чтобы валидаторам было сложнее сговориться, проголосовавших должно быть 50% + 1 валидатор, как сделано в [PR 160](https://github.com/poanetwork/poa-network-consensus-contracts/pull/160). Если валидатор сделает это ненарочно (например, создал голосование с неправильным адресом отправки средств), у него будет 15 минут, чтобы отменить свое ошибочное голосование. Отмена ошибочного голосования реализована в [PR 168](https://github.com/poanetwork/poa-network-consensus-contracts/pull/168).*

##### 14. `abi.encodePacked`

Формирование ключей в хранилища контрактов через `abi.encodePacked` кажется опасной практикой из-за вероятности коллизии: напр. если для двух разных записей ключи будут формироваться из таких наборов фрагментов [‘foo’, ‘bar’], [‘foob’, ‘ar’], то возникнет коллизия. Рекомендуется использовать `abi.encode`.

*Исправлено в [PR 159](https://github.com/poanetwork/poa-network-consensus-contracts/pull/159).*

##### 15. Enums

В контрактах используется сравнение элементов `enum` на больше-меньше, а также то предположение, что первый элемент `enum`, объявленный в исходном коде, будет конвертироваться именно в `0` и обратно. К сожалению, документация solidity дает крайне мало гарантий относительно аспектов `enum`, и не гарантирует функционирование описанных выше техник. Рекомендуем избегать их.

*Клиент: на практике для Solidity проверено, что первый элемент в enum всегда равен 0, а каждый следующий элемент на 1 больше предыдущего. Так принято в большинстве языков программирования (за исключением языков, которые позволяют явно присваивать значения элементам enum), поэтому мы верим, что этот базовый принцип не поменяется в Solidity в будущем. По крайней мере, в текущей версии 0.4.24 с этим все в порядке. Если в будущем в этом плане что-то изменится, то наши юнит-тесты станут показывать ошибки - мы это увидим и сделаем исправления, если будет нужно.*

##### 16. [EmissionFunds.sol#L49](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/EmissionFunds.sol#L49)

Теоретически, атакующий может забить стек EVM таким образом, что вызов send легитимному получателю не отработает и просто вернет false (подробнее см. https://solidity.readthedocs.io/en/latest/security-considerations.html#callstack-depth), т.о. атакующий может сорвать выплату (при этом, средства остаются в сохранности). Однако, для этого атакующий должен быть валидатором, а его voting key должен быть адресом контракта.

*Клиент: здесь не совсем понятно насчет voting key. Я правильно понимаю, что атакующий должен вызвать функцию `VotingToManageEmissionFunds.finalize` с переполненным стеком? Функция `EmissionFunds.sendFundsTo` может быть вызвана только оттуда.*

Да, правильно понимаете, вызвать с почти переполненным стеком, чтобы вызов finalize обрабатывался, а последующие - нет.

*Клиент: может быть, нам добавить `require(msg.sender == tx.origin);` в функцию `VotingToManagerEmissionFunds._finalize`?*

Думаю, чуть более надежно будет потребовать, чтобы msg.sender не был контрактом.

*Клиент: я так понимаю, для этого можно вызвать asm-функцию extcodesize(msg.sender), правда ее вызов обойдется в 700 газа. Вы случайно не знаете более дешевого решения, как определить, принадлежит ли адрес произвольному контракту?*

Не знаем. 700 газа - в 30 раз меньше платы за пересылку эфира - думаю, ок.

*Исправлено в [PR 165](https://github.com/poanetwork/poa-network-consensus-contracts/pull/165).*

##### 17. [BlockReward.sol#L122](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/BlockReward.sol#L122)

Возможно достижение лимита газа блока из-за записи в storage в ходе `_hbbftRefreshPayoutKeys()`. Непосредственно в коде не видны строгие ограничения на рост `keysNumberToReward`.

*Клиент: здесь предполагается, что функция reward будет вызываться движком Parity (или движком на его основе). В документации Parity написано, что такие функции вызываются от имени специального адреса `0xffffFFFfFFffffffffffffffFfFFFfffFFFfFFfE` и транзакции являются "системными": https://wiki.parity.io/Block-Reward-Contract.html#limitations*

*Я провел эксперимент с помощью https://github.com/varasev/test-block-reward и посмотрел, какое значение у `block.gaslimit` в контракте в момент вызова функции reward. Оно равно `0xFFFF...FFFF` (256 бит). Т.е. самое большое число, которое вмещается в `uint256` (по сути бесконечность).*

*Поэтому можно предположить, что газа неограниченное кол-во для подобных "системных" вызовов, т.к. он реально никем не затрачивается.*

*Также пока не решено, где именно мы будем использовать контракт `RewardByTime` (он сделан на будущее) - будет ли он вызываться подобным образом, или как-то иначе. В любом случае я добавил TODO-комментарий в код контракта, чтобы в будущем не забыть про потенциальное ограничение газа в блоке: [PR 168](https://github.com/poanetwork/poa-network-consensus-contracts/pull/168/files#diff-f4e242d0d44b6094a0517e95d4900577R51).*

##### 18. [BlockReward.sol#L151](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/BlockReward.sol#L151)

Правильно ли, что выплата валидатору происходит всегда, вне зависимости от булева флага `keysManager.isPayoutActive(miningKey)`?

*Клиент: да, если у валидатора нет payout-ключа, то начисление монет должно произойти на его mining-ключ (например, такой случай у Master of Ceremony).*

##### 19. [BallotsStorage.sol#L20](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/BallotsStorage.sol#L20)

Threshold type `MetadataChange` фактически не используется в ходе работы консенсуса (голосования за изменения метаданных построены по-другому).

*Клиент: этот тип порога используется в функции `ValidatorMetadata.getMinThreshold`: [ValidatorMetadata.sol#L366](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/ValidatorMetadata.sol#L366) - это значение порога используется в функции `ValidatorMetadata.finalize`: [ValidatorMetadata.sol#L342](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/ValidatorMetadata.sol#L342)*

Да, снимаем вопрос.

### [ПРЕДЛОЖЕНИЯ]

##### 1. [KeysManager.sol#L109](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/KeysManager.sol#L109) и [KeysManager.sol#L318](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/KeysManager.sol#L318)

Функция `initialKeys` и `getInitialKey` имеют одинаковую сигнатуру и возвращают одинаковый результат. При этом результат функции не ключ, как можно было бы подумать из названия, а статус ключа. Сеттер для этого значения называется `_setInitialKeyStatus`. Предлагается сделать вместо двух функций одну с названием `getInitialKeyStatus`.

*Исправлено в [PR 148](https://github.com/poanetwork/poa-network-consensus-contracts/pull/148).*

##### 2. [VotingTo.sol#L186](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/abstracts/VotingTo.sol#L186)

Используется Функция `hasAlreadyVoted`, которая определяет mining key по voting key через `KeyMaster` и вызывает `hasMiningKeyAlreadyVoted`. А строкой раньше мы уже определили mining key и этот вызов можно заменить сразу на вызов `hasMiningKeyAlreadyVoted`.

*Исправлено в [PR 149](https://github.com/poanetwork/poa-network-consensus-contracts/pull/149).*

##### 3. [VotingToChange.sol#L124-L126](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/abstracts/VotingToChange.sol#L124-L126)

Лучше дополнительно перестраховаться и использовать `SafeMath` для инкремента/декремента счетчика голосов.

*Клиент: я думаю, здесь лучше оставить, как есть, т.к. инкремент/декремент происходит над знаковым `int256`. Progress в данном случае может иметь отрицательное значение - это нормально.*

##### 4. [BlockReward.sol#L88](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/BlockReward.sol#L88)

Функция `rewardHBBFT` вероятно должна быть описана в интерфейсе [IBlockReward](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/interfaces/IBlockReward.sol#L7).

*Клиент: смарт-контракт BlockReward в одном из PR был разделен на две части: RewardByBlock и RewardByTime (каждый со своим интерфейсом): PR 140.*

##### 5. [PoaNetworkConsensus.sol#L168](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/PoaNetworkConsensus.sol#L168)

`delete pendingList[lastIndex]` для массива адресов `pendingList` присвоит значение `address(0)` последнему элементу массива а следующим шагом этот элемент будет отрезан, то есть ресетить его бессмысленно.

*Исправлено в [PR 149](https://github.com/poanetwork/poa-network-consensus-contracts/pull/149).*

##### 6. [PoaNetworkConsensus.sol#L169](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/PoaNetworkConsensus.sol#L169)

Проверка `if (pendingList.length > 0)` в коде функции `removeValidator` выглядит бессмысленной, потому что если `length == 0`, `revert` произойдет выше по коду.

*Исправлено в [PR 149](https://github.com/poanetwork/poa-network-consensus-contracts/pull/149).*

##### 7. [VotingToChangeKeys.sol#L230](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/VotingToChangeKeys.sol#L230)

В случаях, за исключением `_affectedKeyType == uint256(KeyTypes.MiningKey)`, рекомендуется добавить проверку `require(keysManager.isMiningActive(_miningKey));` по аналогии с функциями `_areKeySwapBallotParamsValid` и `_areKeyRemovalBallotParamsValid`.

*Исправлено в [PR 152](https://github.com/poanetwork/poa-network-consensus-contracts/pull/152).*

##### 8. [VotingToChange.sol#L73](https://github.com/poanetwork/poa-network-consensus-contracts/blob/8089b20d6b491acaf08f61ab82242c79b8aac41a/contracts/abstracts/VotingToChange.sol#L73)

Предлагается разграничить миграцию и штатный режим работы, чтобы они не могли выполняться параллельно. В частности, предлагается требовать завершения миграции перед выполнением какого-либо штатного кода голосования.

*Исправлено в [PR 167](https://github.com/poanetwork/poa-network-consensus-contracts/pull/167).*

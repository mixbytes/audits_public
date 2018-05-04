const UpgradableBridgeProxy = artifacts.require("UpgradableBridgeProxy");
const UpgradableBridge = artifacts.require("UpgradableBridge");
const UpgradableBridgeSecondVersion = artifacts.require("UpgradableBridgeSecondVersion");


contract('UpgradableBridge', async function(accounts) {
  it("basic test", async function() {
    const owner = accounts[0];
    const proxy = await UpgradableBridgeProxy.new();

    const v1 = await UpgradableBridge.new(proxy.address);
    await proxy.setImplementation(v1.address, {from: owner});

    assert((await v1.getNumMessagesSigned(web3.sha3('0x12', {encoding: 'hex'}))).eq(0));

    await proxy.process('0x12');
    assert((await v1.getNumMessagesSigned(web3.sha3('0x12', {encoding: 'hex'}))).eq(1));
    await proxy.process('0x12');
    assert((await v1.getNumMessagesSigned(web3.sha3('0x12', {encoding: 'hex'}))).eq(2));

    const v2 = await UpgradableBridgeSecondVersion.new(proxy.address, v1.address);
    await proxy.setImplementation(v2.address, {from: owner});

    assert((await v1.getNumMessagesSigned(web3.sha3('0x12', {encoding: 'hex'}))).eq(2));
    assert((await v2.getNumMessagesSigned(web3.sha3('0x12', {encoding: 'hex'}))).eq(2));

    await proxy.process('0x12');

    assert((await v1.getNumMessagesSigned(web3.sha3('0x12', {encoding: 'hex'}))).eq(2));
    assert((await v2.getNumMessagesSigned(web3.sha3('0x12', {encoding: 'hex'}))).eq(44));
  });
});

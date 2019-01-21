const BalanceSheet = artifacts.require("BalanceSheet")
const AllowanceSheet = artifacts.require("AllowanceSheet")
const AkropolisBaseToken = artifacts.require("AkropolisBaseToken")
const AkropolisToken = artifacts.require("AkropolisToken")
const TokenProxy = artifacts.require("TokenProxy")
const TokenProxyDelayed = artifacts.require("TokenProxyDelayed")

const ZERO_ADDRESS = 0x0000000000000000000000000000000000000000;
const l = console.log;


contract('TestProxySlotCollision', accounts => {
    const owner = accounts[0];

    async function instantiate() {
        // migration 2
        const balances = await BalanceSheet.new({from: owner});
        const allowances = await AllowanceSheet.new({from: owner});

        // migration 3
        const token = await AkropolisToken.new(ZERO_ADDRESS, ZERO_ADDRESS, {from: owner});

        // migration 4
        const proxy = await TokenProxy.new(token.address, balances.address, allowances.address, "Akropolis", 18, "AKT", {from: owner});

        return [token, proxy];
    }

    it('test collision', async function () {
        const [token, proxy] = await instantiate();

        let decimals = await proxy.decimals();
        l(decimals.toString());
        assert.equal(decimals, 18);

        const callData = token.enableWhitelist.request().params[0].data;
        // in essence, it's `proxy.enableWhitelist()` executed by the owner
        await web3.eth.sendTransaction({to: proxy.address, data: callData, from: owner});

        decimals = await proxy.decimals();
        l(decimals.toString());
        assert.equal(decimals, 18);
    })
})

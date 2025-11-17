const glob = require("glob")
const pdf = require("pdf-parse");
const fs = require("fs");
const moment = require('moment');

const BASE_URL = 'https://github.com/mixbytes/audits_public/blob/master/';
const README_TEMPLATE_PATH = __dirname + '/main_readme_template.md';
const MAIN_README_PATH = __dirname + '/../README.md';

const CATEGORY_MAP = {
    'Mantle Network:mETH x Aave Integration': 'Liquid Staking',
    'Velodrome:Pool Launcher': 'DEX',
    'Barter DAO:Superposition': 'DEX Aggregator',
    'Notional Finance:Notional v4': 'Lending',
    'Velodrome:CLGaugeFactory': 'DEX',
    'NUTS Finance:Pike': 'Lending',
    'Gearbox Protocol:Kodiak & Mellow Adapters': 'Lending',
    'Gearbox Protocol:Gearbox Midas Integration': 'Lending',
    'Instadapp:Jupiter Lend Vaults': 'Lending',
    'Lido:Lido EasyTrack CSM v2': 'Liquid Staking',
    'NUTS Finance:Tapio': 'Middleware',
    'Lido:Easy Track (3)': 'Liquid Staking',
    'P2P.org:SSV Integration Diff Audit (v1)': 'Staking',
    'Lido:WstETH Staker': 'Liquid Staking',
    'Threshold Network:tBTC v2': 'Cross Chain Bridge',
    'Barter DAO:InchFusionBarterResolver': 'DEX Aggregator',
    'Enso:ERC‑4337 Integration': 'Middleware',
    'Yield Basis:DAO': 'Leveraged Farming',
    'Resolv:Staking': 'Basis Trading',
    'Lido:CSM': 'Liquid Staking',
    'Resolv:Treasury EtherFI Extension': 'Basis Trading',
    'CryptoLegacy:CryptoLegacy': 'Services',
    'Gearbox Protocol:Mellow Adapters': 'Lending',
    'Euler:AccessControlKeyring': 'Lending',
    'Resolv:Utils': 'Basis Trading',
    'Algebra Finance:Limit Order Plugin': 'DEX',
    'DIA:Lumina Staking': 'Oracle',
    'MetaLeX:Borg': 'Services',
    'Gearbox Protocol:Gearbox Protocol v.3.1 Bots & Integrations': 'Lending',
    'Mellow Finance:Simple-LRT Vault': 'Liquid Restaking',
    'Mantle Network:FBTC Timelock': 'L2',
    'Keep3r.Network:Sunset': 'Services',
    'AAVE:Umbrella': 'Lending',
    'P2P.org:Staking Lending Proxy (2)': 'Staking',
    'XPress:Liquidity Vault': 'DEX',
    'XPress:OnchainCLOB': 'DEX',
    'Lido:Easy Track (2)': 'Liquid Staking',
    'Euler:EVK Periphery': 'Lending',
    'Euler:HookTargetStakeDelegator': 'Lending',
    'DIA:Multi Scope': 'Oracle',
    'Hanji:Liquidity Vault': 'DEX',
    'Hanji:OnchainCLOB': 'DEX',
    'P2P.org:Staking Lending Proxy': 'Staking',
    'Resolv:Treasury Escrow': 'Basis Trading',
    'Enjoyoors:EVM Vaults': 'CDP',
    'Liquorice:Liquorice': 'Lending',
    'Ozean Finance:Ozean Finance': 'RWA',
    'P2P.org:Lending Proxy': 'Staking',
    'EYWA:DAO': 'Cross Chain Bridge',
    'Resolv:PoR Oracles': 'Basis Trading',
    'Resolv:Treasury Extension': 'Basis Trading',
    'AAVE:Stata Token (watoken)': 'Lending',
    'Instadapp:Fluid DEX': 'Lending DEX',
    'DIA:Genesis Staking': 'Oracle',
    'Lido:Lido Oracle': 'Liquid Staking',
    'MetaLeX:MetaVesT': 'Services',
    'dForce:Lending v2': 'Lending',
    'Mantle Network:cMETH': 'L2',
    'P2P.org:ETH Allocation Share': 'Staking',
    'Resolv:Treasury': 'Basis Trading',
    'Lido:a.DI': 'Liquid Staking',
    'Lido:stETH on Optimism': 'Liquid Staking',
    'EYWA:CLP': 'Cross Chain Bridge',
    'MetaLeX:LeXscrow': 'Services',
    'Euler:Reward-Streams': 'Lending',
    'Curve Finance:Curve Lending': 'DEX CDP Lending',
    'dForce:sUSX': 'Lending',
    'AAVE:Aave v 3.1.0': 'Lending',
    'Lido:SanityChecker': 'Liquid Staking',
    'Barter DAO:Barter DAO (diff v2)': 'DEX Aggregator',
    'Stader Labs:ETHx': 'Liquid Staking',
    'Napier Finance:Napier Pool': 'Yield',
    'Napier Finance:Napier v1': 'Yield',
    'P2P.org:Staking Fee Distributor Diff Audit (v1)': 'Staking',
    'FireBTC:FBTC': 'Bridge',
    'Instadapp:Fluid': 'Lending DEX',
    'DeFi Money:Core': 'CDP',
    'Resolv:stUSR': 'Basis Trading',
    'Gearbox Protocol:Gearbox Protocol v.3 Bots & Integrations': 'Lending',
    'Swell:Staking': 'Liquid Restaking',
    'Prisma Finance:Zap': 'CDP',
    'KelpDAO:KelpDAO': 'Liquid Restaking',
    'Kinto:Kinto': 'L2',
    'Threshold Network:BAMM': 'CDP',
    'Threshold Network:Threshold USD': 'CDP',
    'Aspida Network:Aspida Network': 'Liquid Restaking',
    'Conic Finance:Conic Finance v2': 'Yield',
    'Divergence Protocol:Divergence Protocol': 'Derivatives',
    'P2P.org:SSV Integration': 'Staking',
    'AAVE:Voting Tokens': 'Lending',
    'Mantle Network:METH': 'L2',
    'Curve Finance:StableSwapNG': 'DEX CDP Lending',
    'Yearn Finance:Vesting Escrow': 'Yield Aggregator',
    'Algebra Finance:Plugins': 'DEX',
    'Barter DAO:Barter DAO (diff)': 'DEX Aggregator',
    'Prisma Finance:Core': 'CDP',
    'Algebra Finance:Core': 'DEX',
    'Bebop:Bebop': 'DEX Aggregator',
    'Yearn Finance:yETH-bootstrap': 'Yield Aggregator',
    'Vibe:Vibe': 'NFTFi',
    'Curve Finance:Curve Stablecoin (crvUSD)': 'DEX CDP Lending',
    'Algebra Finance:Periphery': 'DEX',
    'Algebra Finance:Farmings': 'DEX',
    'Fantium:Fantium v2': 'NFTFi',
    'CloudWalk:CloudWalk': 'Services',
    'P2P.org:ETH2 Depositor & ETH Staking Fee Distributor (v.2)': 'Staking',
    'Clearpool:Clearpool': 'Uncollateralized Lending',
    'Rubic:Rubic': 'DEX Aggregator',
    'Barter DAO:Barter DAO': 'DEX Aggregator',
    'Enso:Enso Wallet': 'Middleware',
    'Fantium:Fantium': 'NFTFi',
    'P2P.org:ETH2 Depositor & ETH Staking Fee Distributor (v.1)': 'Staking',
    '1inch:Aggregation Router V5': 'DEX Aggregator',
    'Enso:Weiroll': 'Middleware',
    'Iron Bank:Iron Bank': 'Lending',
    'Lido:Two-Phase Voting': 'Liquid Staking',
    '1inch:Farming': 'DEX Aggregator',
    'Lido:Lido Protocol': 'Liquid Staking',
    'Solidex:Solidex': 'DEX',
    'Lido:Deposit Security Module': 'Liquid Staking',
    'Lido:In-protocol Coverage': 'Liquid Staking',
    'Yearn Finance:ySwaps': 'Yield Aggregator',
    'Lido:Lido KSM': 'Liquid Staking',
    'Lido:Aave stETH': 'Liquid Staking',
    'Lido:Anchor Collateral stETH': 'Liquid Staking',
    'Gearbox Protocol:Gearbox Protocol v.1': 'Lending',
    'Yearn Finance:Yearn Strategy SSB': 'Yield Aggregator',
    '1inch:Fixed Rate Swap': 'DEX Aggregator',
    'Keep3r.Network:Staking Rewards': 'Services',
    'Yearn Finance:Maker Dai Delegate': 'Yield Aggregator',
    '1inch:Aggregation Router V4': 'DEX Aggregator',
    'Lido:Aragon Voting': 'Liquid Staking',
    'Lido:1inch Rewards Manager': 'Liquid Staking',
    'C.R.E.A.M. Finance:Liquidity Mining': 'Lending',
    'Lido:WstETH': 'Liquid Staking',
    '1inch:Fee Collector': 'DEX Aggregator',
    '1inch:Limit Order Protocol': 'DEX Aggregator',
    'Lido:Easy Track': 'Liquid Staking',
    '1inch:Cumulative Merkle Drop': 'DEX Aggregator',
    'AAVE:Governance Crosschain Bridges V2': 'Lending',
    'AAVE:Incentives Proposal': 'Lending',
    'Lido:Anchor Collateral': 'Liquid Staking',
    'Mellow Finance:Mellow Finance': 'Liquid Restaking',
    'Urbit:Urbit': 'Services',
    '1inch:FixedFeeSwap': 'DEX Aggregator',
    'AAVE:Governance Crosschain Bridges V1': 'Lending',
    'AAVE:Governance Crosschain Bridges V3': 'Lending',
    'Lido:stETH Price Feed': 'Liquid Staking',
    'SpiritSwap:SpiritSwap': 'DEX',
    'Yearn Finance:Liquity Stability Pool': 'Yield Aggregator',
    'AAVE:ParaSwap Adapter': 'Lending',
    'Lido:Withdrawals Manager Stub': 'Liquid Staking',
    'Yearn Finance:SNX': 'Yield Aggregator',
    'Lido:stETH Price Oracle': 'Liquid Staking',
    'Yearn Finance:Weth Maker': 'Yield Aggregator',
    'Yearn Finance:Yfi Maker': 'Yield Aggregator',
    'C.R.E.A.M. Finance:Compound Protocol': 'Lending',
    'Yearn Finance:Generic Lender Aave': 'Yield Aggregator',
    'Convex Platform:Convex Platform': 'Yield',
    'Yearn Finance:Curve Voter Proxy': 'Yield Aggregator',
    'Yearn Finance:Yearn Vaults V3': 'Yield Aggregator',
    'Yearn Finance:yveCRV': 'Yield Aggregator',
    'NuCypher:NuCypher': 'Services',
    'Yearn Finance:Stablecoins 3pool': 'Yield Aggregator',
    'Reality Cards:Reality Cards': 'NFTFi',
    'Yearn Finance:Stablecoins Ypool': 'Yield Aggregator',
    'Bond Appetit:Bond Appetit': 'Lending',
    'C.R.E.A.M. Finance:Flashloan': 'Lending',
    'Cover Protocol:Cover Flashloan': 'Insurance',
    'TosDis:TosDis': 'Lending',
    'Cover Protocol:Cover Protocol V2': 'Insurance',
    'Abyss Finance:Abyss Eth2 Depositor': 'Services',
    'Abyss Finance:Abyss LockUp': 'Services',
    'B-Cube:B-Cube': 'Services',
    'SushiSwap:BentoBox': 'DEX',
    'Yearn Finance:Generic Lender': 'Yield Aggregator',
    'Cover Protocol:Cover Protocol Peripheral': 'Insurance',
    'Yearn Finance:Yoracle.Link': 'Yield Aggregator',
    '1inch:token': 'DEX Aggregator',
    'PieDAO:ExperiPie': 'Indexes',
    'AAVE:protocol v2': 'Lending',
    'Yearn Finance:Vault V2 (Solidity part)': 'Yield Aggregator',
    'Yearn Finance:Vault V2 (Vyper part)': 'Yield Aggregator',
    'Defi Starter:DefiStarter Smart Contracts': 'Launchpad',
    'Pickle Finance:All Strategies': 'Yield Aggregator',
    'Yearn Finance:Timeloans': 'Yield Aggregator',
    'Yearn Finance:Yearn Protocol V1': 'Yield Aggregator',
    'Pickle Finance:Strategy-Curve-scrv-v4_1': 'Yield Aggregator',
    'PieDAO:VestedTokenMigration and Crust': 'Indexes',
    'Curve Finance:DAO Voting': 'DEX CDP Lending',
    'Curve Finance:DAO Voting Forwarder': 'DEX CDP Lending',
    'Aragon:Voting Connectors': 'Services',
    'Aragon:Open Enterprise': 'Services',
    'Empower the DAO:Empower the DAO': 'Services',
    'Akropolis:Vesting': 'Yield',
    'Akropolis:Token': 'Yield',
    'Roobee:Roobee': 'Services',
    'LTO Network:Token Sale': 'L2',
    'TrustWallet:TST Token': 'Services',
    'POA Network:POA PoPA': 'L2',
    'POA Network:POA Bridge': 'L2',
    'POA Network:POA Consensus': 'L2',
    'Ubcoin:UBCoinToken': 'Services',
    'KickICO:KickICO': 'Launchpad'
  };

const UNIQUE_CATEGORIES = {
    'Basis Trading': '(https://img.shields.io/badge/Basis%20Trading-%23424200)',
    'Bridge': '(https://img.shields.io/badge/Bridge-%23424200)',
    'CDP': '(https://img.shields.io/badge/CDP-%23424200)',
    'Cross Chain Bridge': '(https://img.shields.io/badge/Cross%20Chain%20Bridge-%23424200)',
    'DEX': '(https://img.shields.io/badge/DEX-%23424200)',
    'DEX Aggregator': '(https://img.shields.io/badge/DEX%20Aggregator-%23424200)',
    'DEX CDP Lending': '(https://img.shields.io/badge/DEX%20CDP%20Lending-%23424200)',
    'Derivatives': '(https://img.shields.io/badge/Derivatives-%23424200)',
    'Indexes': '(https://img.shields.io/badge/Indexes-%23424200)',
    'Insurance': '(https://img.shields.io/badge/Insurance-%23424200)',
    'L2': '(https://img.shields.io/badge/L2-%23424200)',
    'Launchpad': '(https://img.shields.io/badge/Launchpad-%23424200)',
    'Lending': '(https://img.shields.io/badge/Lending-%23424200)',
    'Lending DEX': '(https://img.shields.io/badge/Lending%20DEX-%23424200)',
    'Leveraged Farming': '(https://img.shields.io/badge/Leveraged%20Farming-%23424200)',
    'Liquid Restaking': '(https://img.shields.io/badge/Liquid%20Restaking-%23424200)',
    'Liquid Staking': '(https://img.shields.io/badge/Liquid%20Staking-%23424200)',
    'Middleware': '(https://img.shields.io/badge/Middleware-%23424200)',
    'NFTFi': '(https://img.shields.io/badge/NFTFi-%23424200)',
    'Oracle': '(https://img.shields.io/badge/Oracle-%23424200)',
    'RWA': '(https://img.shields.io/badge/RWA-%23424200)',
    'Services': '(https://img.shields.io/badge/Services-%23424200)',
    'Staking': '(https://img.shields.io/badge/Staking-%23424200)',
    'Uncollateralized Lending': '(https://img.shields.io/badge/Uncollateralized%20Lending-%23424200)',
    'Yield': '(https://img.shields.io/badge/Yield-%23424200)',
    'Yield Aggregator': '(https://img.shields.io/badge/Yield%20Aggregator-%23424200)'
};

(async () => {

const mdFiles = glob.sync("*/**/+(readme|README).md")
        .map(file => file.split('/'))
        .filter(file => file.length > 1);

let audits = mdFiles.map(mdFile => {
    const mdFilePath = mdFile.join('/');
    const basePath = mdFile.slice(0, -1).join('/');
    const project = mdFile[0];
    const auditName = mdFile.length > 2 ? mdFile[1] : mdFile[0];

    let pdfFilePath = null;
    const files = glob.sync(`${basePath}/*.pdf`);
    if (files.length > 0) {
        pdfFilePath = files[0];
    }

    return [project, auditName, basePath, mdFilePath, pdfFilePath];
});


audits = await Promise.all(audits.map(async (audit) => {
    if (audit[4] != null) {
        const file = fs.readFileSync(audit[4]);
        const data = await pdf(file, {max: 1});
        const text = data.text.replace(/\n/g, ' ');

        // support new timeline format (e.g. 28.02.2022 - 13.03.2022)
        const timeline = text.match(/\d+[./\\]\d+[./\\]\d+\s?[—–−-]\s?(\d+[./\\]\d+[./\\]\d+)/);
        if (timeline && timeline.length === 2) {
            const dateArray = timeline[1].split('.');
            const date = moment(new Date(
                parseInt(dateArray[2]),
                dateArray[1] - 1,
                parseInt(dateArray[0]))
            ).format("YYYY-MM-DD");
            audit.push(date);
        } else {
            const found = text.match(/([A-z]+)\s*(\d+),?\s*(\d+)/);
            if (found) {
                const date = moment(found[0]).format("YYYY-MM-DD");
                audit.push(date);
            } else {
                audit.push('N/A');
            }
        }
    }
    else {
        const files = glob.sync(`${audit[2]}/date.txt`);
        if (files.length > 0) {
            const date_raw = fs.readFileSync(files[0])
            const date = moment(date_raw).format("YYYY-MM-DD");
            audit.push(date);
        }
        else {
            audit.push('N/A');
        }
    }
    return audit;
}));

audits.sort(function(a, b) {
    // Compare the 2 dates
    if (a[5] == 'N/A' && b[5] != 'N/A') return 1;
    if (a[5] != 'N/A' && b[5] == 'N/A') return -1;
    if (a[5] > b[5]) return -1;
    if (a[5] < b[5]) return 1;
    return 0;
});

// let table = '| Project | Audit Name | MD Report | PDF Report | Release Date (YYYY-MM-DD) |\n';
let table = '| Client | Project | Category | Report | Date |\n';
table +=    '|---|---|---|---|---|\n';
audits.forEach(audit => {
    // const mdPath = `[link](${encodeURI(BASE_URL + audit[3])})`;
    
    const pdfPath = audit[4] != null ? `[📄](${encodeURI(BASE_URL + audit[4])})` : `[📄](${encodeURI(BASE_URL + audit[3])})`;
    const key = audit[0] + ":" + audit[1];
    const category = CATEGORY_MAP[key] ?? '-';
    const finalCategory = category !== '-' ? ("![" + category + "]" + UNIQUE_CATEGORIES[category]) : category;

    table += `| ${audit[0]} | ${audit[1]} | ${finalCategory} | ${pdfPath} | ${audit[5]} |\n`;
});

let readme = fs.readFileSync(README_TEMPLATE_PATH).toString();
readme = readme.replace('{REPORT_LIST}', table);
fs.writeFileSync(MAIN_README_PATH, readme);

})().then();

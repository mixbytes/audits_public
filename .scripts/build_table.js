const glob = require("glob")
const pdf = require("pdf-parse");
const fs = require("fs");
const moment = require('moment');

const BASE_URL = 'https://github.com/mixbytes/audits_public/blob/master/';
const README_TEMPLATE_PATH = __dirname + '/main_readme_template.md';
const MAIN_README_PATH = __dirname + '/../README.md';


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
        const found = text.match(/([A-z]+)\s*(\d+),?\s*(\d+)/);
        if (found) {
            const date = moment(found[0]).format("YYYY-MM-DD");
            audit.push(date);
        }
        else {
            audit.push('N/A');
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

let table = '| Project | Audit Name | MD Report | PDF Report | Release Date (YYYY-MM-DD) |\n';
table +=    '|---|---|---|---|---|\n';
audits.forEach(audit => {
    const mdPath = `[link](${encodeURI(BASE_URL + audit[3])})`;
    const pdfPath = audit[4] != null ? `[link](${encodeURI(BASE_URL + audit[4])})` : 'N/A';

    table += `| ${audit[0]} | ${audit[1]} | ${mdPath} | ${pdfPath} | ${audit[5]} |\n`;
});

let readme = fs.readFileSync(README_TEMPLATE_PATH).toString();
readme = readme.replace('{REPORT_LIST}', table);
fs.writeFileSync(MAIN_README_PATH, readme);

})().then();

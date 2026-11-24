const glob = require("glob");
const pdf = require("pdf-parse");
const fs = require("fs");
const moment = require('moment');

const BASE_URL = 'https://github.com/mixbytes/audits_public/blob/master/';
const README_TEMPLATE_PATH = __dirname + '/main_readme_template.md';
const MAIN_README_PATH = __dirname + '/../README.md';

const PDF_MAX_PAGES = 1;

const handleError = (error) => {
    console.error(`Error: ${error.message}`);
};

const createTable = (audits) => {
    let table = '| Project | Audit Name | MD Report | PDF Report | Release Date (YYYY-MM-DD) |\n';
    table += '|---|---|---|---|---|\n';
    audits.forEach(audit => {
        const mdPath = `[link](${encodeURI(BASE_URL + audit[3])})`;
        const pdfPath = audit[4] != null ? `[link](${encodeURI(BASE_URL + audit[4])})` : 'N/A';

        table += `| ${audit[0]} | ${audit[1]} | ${mdPath} | ${pdfPath} | ${audit[5]} |\n`;
    });
    return table;
};

(async () => {
    try {
        const mdFiles = glob.sync("*/**/+(readme|README).md")
            .map(file => file.split('/'))
            .filter(file => file.length > 1);

        let audits = await Promise.all(mdFiles.map(async (mdFile) => {
            const mdFilePath = mdFile.join('/');
            const basePath = mdFile.slice(0, -1).join('/');
            const project = mdFile[0];
            const auditName = mdFile.length > 2 ? mdFile[1] : mdFile[0];

            let pdfFilePath = null;
            const files = glob.sync(`${basePath}/*.pdf`);
            if (files.length > 0) {
                pdfFilePath = files[0];
            }

            let audit = [project, auditName, basePath, mdFilePath, pdfFilePath];

            if (audit[4] != null) {
                const file = fs.readFileSync(audit[4]);
                const data = await pdf(file, { max: PDF_MAX_PAGES });
                const text = data.text.replace(/\n/g, ' ');

                const timeline = text.match(/\d+[./\\]\d+[./\\]\d+\s?[—–−-]\s?(\d+[./\\]\d+[./\\]\d+)/);
                if (timeline && timeline.length === 2) {
                    const dateArray = timeline[1].split('.');
                    const date = new Date(parseInt(dateArray[2]), dateArray[1] - 1, parseInt(dateArray[0]));
                    audit.push(moment(date).format("YYYY-MM-DD"));
                } else {
                    const found = text.match(/([A-z]+)\s*(\d+),?\s*(\d+)/);
                    audit.push(found ? moment(found[0]).format("YYYY-MM-DD") : 'N/A');
                }
            } else {
                const files = glob.sync(`${audit[2]}/date.txt`);
                audit.push(files.length > 0 ? moment(fs.readFileSync(files[0])).format("YYYY-MM-DD") : 'N/A');
            }
            return audit;
        }));

        audits.sort((a, b) => {
            if (a[5] == 'N/A' && b[5] != 'N/A') return 1;
            if (a[5] != 'N/A' && b[5] == 'N/A') return -1;
            if (a[5] > b[5]) return -1;
            if (a[5] < b[5]) return 1;
            return 0;
        });

        const table = createTable(audits);

        let readme = fs.readFileSync(README_TEMPLATE_PATH).toString();
        readme = readme.replace('{REPORT_LIST}', table);
        fs.writeFileSync(MAIN_README_PATH, readme);
    } catch (error) {
        handleError(error);
    }
})();

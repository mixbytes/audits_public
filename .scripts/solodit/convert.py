"""
Parse findings in mixbytes public repo

Usage:
    convert [options]

Options:
    -h              help
    --config=FILE   [default: config.json]
    --index=FILE    root md file with a table of reports
    --path=PATH     base path with reports
    --debug=FILE    run in debug mode over a single report

"""
from docopt import docopt
import json
import sys
import re
import os
import md


def extract_href_from_md_link(text):
    link_pattern = r'\[link\]\((https?://\S+)\)'
    return re.findall(link_pattern, text)[0]


def extract_file_path_from_link(link):
    relative_path = link.replace("https://github.com/mixbytes/audits_public/blob/master/", "").replace("%20", " ")
    return relative_path


def clean_title(text):
    text = text.lower()
    text = re.sub("[^a-z]", " ", text)
    text = re.sub("\s+", " ", text)
    text = text.strip()
    return text


def find(section, title):
    if clean_title(section["title"]) == clean_title(title):
        return section

    for section in section["subsections"]:
        if found := find(section, title):
            return found


def parse(text, md_link="", pdf_link=None, protocol_name="", report_date=""):
    sections = md.parse_md(text)

    for urgency in config["urgency_map"]:
        if findings := find(sections, urgency):
            findings = findings["subsections"]
            for finding in findings:

                if clean_title(finding["title"]) == "not found" and not finding["subsections"]:
                    continue

                finding_github_link = md_link + md.generate_hash_link(finding["title"])
                debug_info = finding_github_link

                if not finding["subsections"] and finding["content"]:
                    content = md.to_md({**finding, "level": 0})

                elif re.match("^[0-9]+\. https://github.com/", finding["title"]):
                    raise Exception("Report '%s' have to be fixed" % finding_github_link)

                else:
                    description = find(finding, "description")
                    assert description, f"Description section not found in {debug_info}"

                    recommendation = find(finding, "recommendation")
                    assert recommendation, f"Recommendation section not found in {debug_info}"

                    content = md.to_md(description) + "\n" + md.to_md(recommendation)

                yield {
                    "title": re.sub(r'^[0-9]+\.\s+', '', finding["title"]),
                    "content": content,
                    "protocol": protocol_name,
                    "report_date": report_date,
                    "impact": config["urgency_map"][urgency],
                    "finders": [],
                    "github_link": finding_github_link,
                    "pdf_link": pdf_link,
                }


def fix(text, md_link):
    for md_link_to_fix, rules in config.get("fix", {}).items():
        if md_link == md_link_to_fix:
            if "sub" in rules:
                for pattern, repl in rules["sub"].items():
                    text = re.sub(pattern, repl, text, flags=re.M)
            elif "file" in rules:
                return open(rules["file"]).read()
    return text


def run_from_index(path):
    table = md.parse_table(open(path).read())
    base_path = config.get("base_path", "")
    outputs = []

    for report in table:
        md_link = extract_href_from_md_link(report["MD Report"])
        path = extract_file_path_from_link(md_link)
        path = os.path.join(base_path, path)

        if report["PDF Report"] == "N/A":
            pdf_link = None
        else:
            pdf_link = extract_href_from_md_link(report["PDF Report"])

        assert os.path.exists(path), f"Report '{md_link}' cannot be found in '{path}'"

        text = open(path).read()
        text = fix(text, md_link)

        outputs.extend(parse(
            text,
            md_link=md_link,
            protocol_name=report["Project"],
            report_date=report["Release Date (YYYY-MM-DD)"],
            pdf_link=pdf_link,
        ))

    print(json.dumps(outputs, indent=4))


def run_single_report(path):
    print(json.dumps(list(parse(open(path).read())), indent=4))


def get_config(args):
    config = args["--config"] or "config.json"
    assert os.path.exists(config), "Config not found"
    config = json.load(open(config))

    if args["--index"]:
        config["index"] = args["--index"]

    if args["--path"]:
        config["base_path"] = args["--path"]

    return config


if __name__ == "__main__":
    args = docopt(__doc__)
    config = get_config(args)

    if args["--debug"]:
        run_single_report(args["--debug"])
    else:
        run_from_index(config["index"])

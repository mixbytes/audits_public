from collections import deque
import re


def parse_md(text):
    """
    Parses Markdown text and extracts data.

    >>> md = '''
    ... # TITLE 1
    ... text 1
    ... ##### TAGS
    ... tags
    ... ## TITLE 2
    ... text 2
    ... ### TITLE 3
    ... text 3
    ... # TITLE 4
    ... text 4
    ... '''

    >>> import json
    >>> print(json.dumps(parse_md(md), indent=4))
    {
        "level": 0,
        "title": "",
        "content": [],
        "subsections": [
            {
                "level": 1,
                "title": "TITLE 1",
                "content": [
                    "text 1"
                ],
                "subsections": [
                    {
                        "level": 5,
                        "title": "TAGS",
                        "content": [
                            "tags"
                        ],
                        "subsections": []
                    },
                    {
                        "level": 2,
                        "title": "TITLE 2",
                        "content": [
                            "text 2"
                        ],
                        "subsections": [
                            {
                                "level": 3,
                                "title": "TITLE 3",
                                "content": [
                                    "text 3"
                                ],
                                "subsections": []
                            }
                        ]
                    }
                ]
            },
            {
                "level": 1,
                "title": "TITLE 4",
                "content": [
                    "text 4"
                ],
                "subsections": []
            }
        ]
    }
    """
    lines = text.strip().split("\n")
    sections = deque([{
        "level": 0,
        "title": "",
        "content": [],
        "subsections": [],
    }])

    skip_until = None
    CODE = '```'

    def append(line):
        sections[-1]["content"].append(line)

    for line in lines:
        if line.startswith(CODE):
            append(line)
            if skip_until == CODE:
                skip_until = None
            else:
                skip_until = CODE
        
        elif skip_until is not None:
            append(line)

        elif line.strip().startswith("#"):
            line = line.strip()
            level = 0
            for c in line:
                if c == "#":
                    level += 1
                else:
                    break
            sections.append({
                "level": level,
                "title": line[level:].strip(),
                "content": [],
                "subsections": [],
            })

        else:
            append(line)

    assert skip_until is None

    def build_subsections(start):
        while sections:
            next = sections.popleft()
            if start["level"] < next["level"]:
                start["subsections"].append(build_subsections(next))
            else:
                sections.appendleft(next)
                break

        return start

    return build_subsections(sections.popleft())


def to_md(parsed_md):
    """
    Converts parsed md back to text

    >>> md = '''
    ... # TITLE 1
    ... text 1
    ... ##### TAGS
    ... tags
    ... ## TITLE 2
    ... text 2
    ... ### TITLE 3
    ... text 3
    ... # TITLE 4
    ... text 4
    ... '''

    >>> print(to_md(parse_md(md)))
    <BLANKLINE>
    # TITLE 1
    text 1
    ##### TAGS
    tags
    ## TITLE 2
    text 2
    ### TITLE 3
    text 3
    # TITLE 4
    text 4
    """
    if not parsed_md:
        return ""

    md_text = ""
    if parsed_md["level"] > 0:
        md_text += "#" * parsed_md["level"] + " " + parsed_md["title"] + "\n"

    md_text += "\n".join(parsed_md["content"])

    for subsection in parsed_md["subsections"]:
        md_text += "\n" + to_md(subsection)

    return md_text


def parse_table(text):
    """
    >>> example = '''
    ... | Project | Audit Name | MD Report | PDF Report | Release Date (YYYY-MM-DD) |
    ... |---|---|---|---|---|
    ... | Algebra Finance | Plugins | [link](https://github.com/mixbytes/audits_public/blob/master/Algebra%20Finance/Plugins/README.md) | [link](https://github.com/mixbytes/audits_public/blob/master/Algebra%20Finance/Plugins/Algebra%20Plugins%20Security%20Audit%20Report.pdf) | 2023-09-06 |
    ... '''
    >>> parse_table(example)
    [{'Project': 'Algebra Finance', 'Audit Name': 'Plugins', 'MD Report': '[link](https://github.com/mixbytes/audits_public/blob/master/Algebra%20Finance/Plugins/README.md)', 'PDF Report': '[link](https://github.com/mixbytes/audits_public/blob/master/Algebra%20Finance/Plugins/Algebra%20Plugins%20Security%20Audit%20Report.pdf)', 'Release Date (YYYY-MM-DD)': '2023-09-06'}]
    >>> 
    """
    lines = text.split("\n")

    # Find the start and end of the table based on horizontal rule lines
    table_start = None
    table_end = None
    for index, line in enumerate(lines):
        if "|---" in line:
            table_start = index
        if table_start and line.strip() == "":
            table_end = index
            break

    # Extract the table header and rows
    header_line = lines[table_start - 1].strip().split("|")[1:-1]
    table_rows = [row.strip().split("|")[1:-1] for row in lines[table_start + 1:table_end]]

    # Convert the table to a list of dictionaries
    table_data = []
    for row in table_rows:
        entry = {header.strip(): value.strip() for header, value in zip(header_line, row)}
        table_data.append(entry)

    return table_data


def generate_hash_link(title):
    """
    >>> generate_hash_link("1. EIP712 DOMAIN_SEPARATOR stored as immutable")
    '#1-eip712-domain_separator-stored-as-immutable'
    >>> generate_hash_link("2. AMM.exchange() produces negative fees")
    '#2-ammexchange-produces-negative-fees'
    >>> generate_hash_link("3. Early liquidations via repay() front-running")
    '#3-early-liquidations-via-repay-front-running'
    >>> generate_hash_link("1. No checks of the result of AMM.withdraw")
    '#1-no-checks-of-the-result-of-ammwithdraw'
    >>> generate_hash_link("6. ControllerFactory.set_admin() does not have two-step ownership transferring")
    '#6-controllerfactoryset_admin-does-not-have-two-step-ownership-transferring'
    """
    # Remove special characters and spaces, convert to lowercase
    cleaned_title = re.sub(r'[^a-zA-Z0-9_ -]', '', title).strip().lower()
    # Replace spaces with hyphens
    hash_link = re.sub(r'\s+', '-', cleaned_title)
    # Add a hash symbol at the beginning
    hash_link = '#' + hash_link
    return hash_link

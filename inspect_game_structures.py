import sys, glob, re, json
sys.stdout.reconfigure(encoding='utf-8')

js_files = sorted(glob.glob('js/*-simulators.js'))

summary = {}

for jf in js_files:
    animal = jf.replace('js\\', '').replace('-simulators.js', '').replace('js/', '')
    with open(jf, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find level definitions: name, desc, title, etc.
    levels_match = re.findall(r'name:\s*[\'"`]([^\'"`]+)[\'"`]', content)
    targets_match = re.findall(r'name:\s*[\'"`]([^\'"`]+)[\'"`]', content) # wait, targets also have name
    
    # Find all string literals with Polish characters (ą, ć, ę, ł, ń, ó, ś, ź, ż or capital)
    pl_regex = re.compile(r'[\'"`]([^\n\'"`]*[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ][^\n\'"`]*)[\'"`]')
    pl_strings = set(pl_regex.findall(content))

    # Also template literals with Polish chars (can be multiline)
    pl_templates = set(re.findall(r'`([^`]*[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ][^`]*)`', content))

    summary[animal] = {
        'pl_strings_count': len(pl_strings),
        'pl_templates_count': len(pl_templates),
        'sample_strings': list(pl_strings)[:10],
        'sample_templates': [t.strip().replace('\n', ' ')[:80] for t in list(pl_templates)[:5]]
    }

print(json.dumps(summary, indent=2, ensure_ascii=False))

import sys, json, re
sys.stdout.reconfigure(encoding='utf-8')

with open('true_user_strings_simulators.json', 'r', encoding='utf-8') as f:
    true_strings = json.load(f)

with open('js/translations.js', 'r', encoding='utf-8') as f:
    existing_keys = set(re.findall(r'"([^"\\]*(?:\\.[^"\\]*)*)"\s*:', f.read()))

combined_sim = {}
for fn in ['dict_simulators_set1.json', 'dict_simulators_set2.json', 'dict_simulators_set3.json', 'dict_simulators_set4.json']:
    with open(fn, 'r', encoding='utf-8') as f:
        combined_sim.update(json.load(f))

# Patterns simulated from i18n.js
patterns = [
    re.compile(r'^Misja\s+\d+\s+Ukończona!$', re.I),
    re.compile(r'^Misja\s+\d+\s+ukończona!$', re.I),
    re.compile(r'^Misja\s+\d+\/\d+:?$', re.I),
    re.compile(r'^Poziom\s+\d+\s+Zwyciężony!$', re.I),
    re.compile(r'^Poziom\s+\d+\s+Zakończony Sukcesem!$', re.I),
    re.compile(r'^Poziom\s+\d+\s+Ukończony!$', re.I),
    re.compile(r'^Sukces!\s+Ukończono Misję\s+\d+!$', re.I),
    re.compile(r'^Zwycięstwo!\s+Ukończono Poziom\s+\d+!$', re.I),
    re.compile(r'^Sezon\s+\d+\s+Zakończony Sukcesem!$', re.I),
    re.compile(r'^PYTANIE\s+\d+\s+Z\s+\d+$', re.I),
    re.compile(r'^Pytanie\s+\d+\s+z\s+\d+$', re.I),
    re.compile(r'^Poziom\s+\d+$', re.I),
    re.compile(r'^Krok\s+\d+\s+z\s+\d+$', re.I),
    re.compile(r'^\d+\s*\/\s*\d+\s+punktów$', re.I),
    re.compile(r'^\d+\s+z\s+\d+\s+celów$', re.I),
    re.compile(r'^\d+\s+z\s+\d+\s+punktów$', re.I),
    re.compile(r'^\d+\s+z\s+\d+\s+pytań$', re.I),
    re.compile(r'^\d+\s+myszy$', re.I),
    re.compile(r'^\d+\s+owadów$', re.I),
    re.compile(r'^\d+\s+ciem$', re.I),
    re.compile(r'^\d+\s*trufli$', re.I),
]

covered = []
uncovered = []

for s in true_strings:
    s_clean = s.strip()
    if s_clean in existing_keys or s_clean in combined_sim:
        covered.append(s_clean)
        continue
    if any(p.match(s_clean) for p in patterns):
        covered.append(s_clean)
        continue
    uncovered.append(s_clean)

print(f"Total true strings: {len(true_strings)}")
print(f"Covered: {len(covered)} ({len(covered)/len(true_strings)*100:.1f}%)")
print(f"Uncovered: {len(uncovered)}")

with open('uncovered_sim_strings.json', 'w', encoding='utf-8') as f:
    json.dump(uncovered, f, indent=2, ensure_ascii=False)

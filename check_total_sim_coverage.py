import sys, json, re
sys.stdout.reconfigure(encoding='utf-8')

all_new_sim = {}
dict_files = [
    'dict_simulators_set1.json',
    'dict_simulators_set2.json',
    'dict_simulators_set3.json',
    'dict_simulators_set4.json',
    'dict_all_levels.json',
    'dict_quiz_batchA.json',
    'dict_quiz_batchB.json',
    'dict_quiz_batchC.json'
]

for df in dict_files:
    with open(df, 'r', encoding='utf-8') as f:
        data = json.load(f)
        all_new_sim.update(data)

print(f"Total entries in new simulator dictionaries: {len(all_new_sim)}")

with open('js/translations.js', 'r', encoding='utf-8') as f:
    existing_keys = set(re.findall(r'"([^"\\]*(?:\\.[^"\\]*)*)"\s*:', f.read()))

print(f"Existing translations.js keys: {len(existing_keys)}")

total_known = set(existing_keys) | set(all_new_sim.keys())

with open('true_user_strings_simulators.json', 'r', encoding='utf-8') as f:
    true_strings = json.load(f)

# Regex patterns in i18n.js
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
    re.compile(r'^\d+°\s*względem słońca$', re.I),
    re.compile(r'^\d+\s*m od ula$', re.I),
]

unmapped = []
mapped = []

for s in true_strings:
    clean = s.strip()
    if clean in total_known or clean.replace('\r\n', '\n') in total_known:
        mapped.append(clean)
        continue
    if any(p.match(clean) for p in patterns):
        mapped.append(clean)
        continue
    unmapped.append(clean)

print(f"Total true strings: {len(true_strings)}")
print(f"Mapped: {len(mapped)} ({len(mapped)/len(true_strings)*100:.1f}%)")
print(f"Still unmapped: {len(unmapped)}")

with open('final_unmapped_sim_strings.json', 'w', encoding='utf-8') as f:
    json.dump(unmapped, f, indent=2, ensure_ascii=False)

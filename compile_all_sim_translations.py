import sys, json
sys.stdout.reconfigure(encoding='utf-8')

combined_sim = {}
for fn in ['dict_simulators_set1.json', 'dict_simulators_set2.json', 'dict_simulators_set3.json', 'dict_simulators_set4.json']:
    with open(fn, 'r', encoding='utf-8') as f:
        data = json.load(f)
        combined_sim.update(data)

print(f"Total entries in combined simulator dictionary: {len(combined_sim)}")

with open('all_simulator_strings_extracted.json', 'r', encoding='utf-8') as f:
    all_sim = json.load(f)['all_unique']

with open('js/translations.js', 'r', encoding='utf-8') as f:
    import re
    existing_keys = set(re.findall(r'"([^"\\]*(?:\\.[^"\\]*)*)"\s*:', f.read()))

still_missing = []
for s in all_sim:
    clean = s.strip()
    if clean in combined_sim or clean in existing_keys:
        continue
    still_missing.append(clean)

print(f"Total simulator strings: {len(all_sim)}")
print(f"Still unmapped: {len(still_missing)}")

with open('simulators_still_missing.json', 'w', encoding='utf-8') as f:
    json.dump(still_missing, f, indent=2, ensure_ascii=False)

import sys, json, re
sys.stdout.reconfigure(encoding='utf-8')

with open('all_extracted_levels.json', 'r', encoding='utf-8') as f:
    levels_data = json.load(f)

with open('js/translations.js', 'r', encoding='utf-8') as f:
    t_keys = set(re.findall(r'"([^"\\]*(?:\\.[^"\\]*)*)"\s*:', f.read()))

total_levels = 0
in_dict = 0
not_in_dict = []

for item in levels_data:
    for name in item['names']:
        total_levels += 1
        if name in t_keys:
            in_dict += 1
        else:
            not_in_dict.append(name)

print(f"Total level names: {total_levels}")
print(f"Already in translations.js: {in_dict} ({in_dict/total_levels*100:.1f}%)")
print(f"Missing level names: {len(not_in_dict)}")
if not_in_dict:
    print("Sample missing:", not_in_dict[:10])

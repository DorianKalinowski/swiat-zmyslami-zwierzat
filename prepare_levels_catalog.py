import sys, glob, re, json
sys.stdout.reconfigure(encoding='utf-8')

with open('all_extracted_levels.json', 'r', encoding='utf-8') as f:
    levels_data = json.load(f)

levels_catalog = {}
for item in levels_data:
    animal = item['animal']
    levels_catalog[animal] = {
        'names': list(dict.fromkeys(item['names'])),
        'descs': list(dict.fromkeys(item['descs']))
    }

with open('levels_catalog.json', 'w', encoding='utf-8') as f:
    json.dump(levels_catalog, f, indent=2, ensure_ascii=False)

total_names = sum(len(v['names']) for v in levels_catalog.values())
total_descs = sum(len(v['descs']) for v in levels_catalog.values())
print(f"Total unique level names: {total_names}, descriptions: {total_descs}")

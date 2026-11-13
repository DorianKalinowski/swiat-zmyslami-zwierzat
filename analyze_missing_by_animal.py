import sys, glob, re, json
sys.stdout.reconfigure(encoding='utf-8')

with open('missing_simulator_translations.json', 'r', encoding='utf-8') as f:
    missing_set = set(json.load(f))

with open('all_simulator_strings_extracted.json', 'r', encoding='utf-8') as f:
    extracted = json.load(f)

by_file = extracted['by_file']

missing_by_file = {}
for file_path, strings in by_file.items():
    animal = file_path.replace('js\\', '').replace('-simulators.js', '').replace('js/', '')
    file_missing = [s for s in strings if s in missing_set]
    missing_by_file[animal] = file_missing
    print(f"{animal:12}: {len(file_missing)} missing strings")

with open('missing_by_file.json', 'w', encoding='utf-8') as f:
    json.dump(missing_by_file, f, indent=2, ensure_ascii=False)

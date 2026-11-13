import sys, json
sys.stdout.reconfigure(encoding='utf-8')

with open('all_simulator_strings_extracted.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
unique_strings = data['all_unique']

with open('js/translations.js', 'r', encoding='utf-8') as f:
    t_content = f.read()

# Load current translations dict keys by parsing or regex
import re
# Match "key": or 'key':
dict_keys = set(re.findall(r'"([^"\\]*(?:\\.[^"\\]*)*)"\s*:', t_content))
print(f"Current translations.js keys: {len(dict_keys)}")

missing = []
present = []

for s in unique_strings:
    clean = s.strip()
    if clean in dict_keys or clean.replace('\r\n', '\n') in dict_keys:
        present.append(clean)
    else:
        missing.append(clean)

print(f"Already in translations.js: {len(present)}")
print(f"Missing from translations.js: {len(missing)}")

with open('missing_simulator_translations.json', 'w', encoding='utf-8') as f:
    json.dump(missing, f, indent=2, ensure_ascii=False)

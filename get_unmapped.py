import json, sys
sys.stdout.reconfigure(encoding='utf-8')
from dict_global import GLOBAL_DICT

with open('extracted_phrases.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

page = sys.argv[1] if len(sys.argv) > 1 else 'index.html'
phrases = data.get(page, [])

unmapped = []
for p in phrases:
    norm_p = ' '.join(p.split())
    if norm_p not in GLOBAL_DICT and p not in GLOBAL_DICT:
        unmapped.append(p)

print(f"=== {page}: total {len(phrases)}, unmapped {len(unmapped)} ===")
for i, p in enumerate(unmapped):
    print(f"[{i}]: {repr(p)}")

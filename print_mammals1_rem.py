import json, sys
sys.stdout.reconfigure(encoding='utf-8')
from dict_global import GLOBAL_DICT
from dict_index import INDEX_DICT
from trans_mammals1 import MAMMALS1_DICT

combined = {**GLOBAL_DICT, **INDEX_DICT, **MAMMALS1_DICT}
with open('extracted_phrases.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for animal in ['pies.html', 'kot.html', 'dzik.html', 'wilk.html']:
    phrases = data[animal]
    unmapped = [p for p in phrases if p not in combined and ' '.join(p.split()) not in combined]
    print(f"\n=== {animal} remaining {len(unmapped)} ===")
    for i, p in enumerate(unmapped[:20]):
        print(f"[{i}]: {repr(p)}")

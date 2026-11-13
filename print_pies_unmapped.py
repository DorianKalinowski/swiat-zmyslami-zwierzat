import json, sys
sys.stdout.reconfigure(encoding='utf-8')
from dict_global import GLOBAL_DICT
from dict_index import INDEX_DICT

combined = {**GLOBAL_DICT, **INDEX_DICT}
with open('extracted_phrases.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

phrases = data['pies.html']
unmapped = [p for p in phrases if p not in combined and ' '.join(p.split()) not in combined]
for i, p in enumerate(unmapped):
    print(f"[{i}]: {repr(p)}")

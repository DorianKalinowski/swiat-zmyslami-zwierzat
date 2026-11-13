import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('bear_to_trans.json', 'r', encoding='utf-8') as f:
    bear = json.load(f)

for i, p in enumerate(bear):
    print(f"[{i}]: {repr(p)}")

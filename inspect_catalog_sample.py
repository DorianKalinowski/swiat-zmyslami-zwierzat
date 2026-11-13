import sys, json
sys.stdout.reconfigure(encoding='utf-8')

with open('levels_catalog.json', 'r', encoding='utf-8') as f:
    cat = json.load(f)

for a, data in cat.items():
    print(f"=== {a.upper()} ({len(data['names'])} names, {len(data['descs'])} descs) ===")
    for n in data['names'][:4]:
        print("  Name:", repr(n))
    for d in data['descs'][:2]:
        print("  Desc:", repr(d))

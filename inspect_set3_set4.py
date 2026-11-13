import sys, json
sys.stdout.reconfigure(encoding='utf-8')

for fn in ['set3_strings.json', 'set4_strings.json']:
    with open(fn, 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"==================== {fn} ====================")
    for animal, strings in data.items():
        print(f"=== {animal.upper()} ({len(strings)}) ===")
        for s in strings[:10]:
            print(" ", repr(s[:80]))
        print()

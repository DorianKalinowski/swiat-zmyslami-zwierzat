import sys, json
sys.stdout.reconfigure(encoding='utf-8')

with open('simulators_still_missing.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

print(f"Total: {len(items)}")
print("\nSample 40 items:")
for s in items[:40]:
    print(" -", repr(s[:80]))

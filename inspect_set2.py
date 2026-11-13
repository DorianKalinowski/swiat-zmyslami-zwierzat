import sys, json
sys.stdout.reconfigure(encoding='utf-8')

with open('set2_strings.json', 'r', encoding='utf-8') as f:
    set2 = json.load(f)

for animal, strings in set2.items():
    print(f"=== {animal.upper()} ({len(strings)}) ===")
    for s in strings[:15]:
        print(" ", repr(s[:80]))
    print()

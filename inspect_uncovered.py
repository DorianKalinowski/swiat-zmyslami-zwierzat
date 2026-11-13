import sys, json
sys.stdout.reconfigure(encoding='utf-8')

with open('uncovered_sim_strings.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

print(f"Total uncovered: {len(items)}")
for i, s in enumerate(items[:50]):
    print(f"{i+1:2}: {repr(s[:90])}")

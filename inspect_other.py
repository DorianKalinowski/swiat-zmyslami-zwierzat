import sys, json
sys.stdout.reconfigure(encoding='utf-8')

with open('final_unmapped_sim_strings.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

for i, s in enumerate(items[50:110]):
    print(f"{i+1:2}: {repr(s[:90])}")

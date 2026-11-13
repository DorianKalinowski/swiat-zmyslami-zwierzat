import sys, json
sys.stdout.reconfigure(encoding='utf-8')

with open('final_unmapped_sim_strings.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

b1 = items[:390]
b2 = items[390:]

with open('rem_batch1.json', 'w', encoding='utf-8') as f: json.dump(b1, f, indent=2, ensure_ascii=False)
with open('rem_batch2.json', 'w', encoding='utf-8') as f: json.dump(b2, f, indent=2, ensure_ascii=False)

print(f"rem_batch1: {len(b1)} strings")
print(f"rem_batch2: {len(b2)} strings")

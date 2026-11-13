import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('all_unmapped_phrases.json', 'r', encoding='utf-8') as f:
    all_unm = set(json.load(f))

with open('extracted_phrases.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for a in ['niedzwiedz.html', 'lis.html']:
    phrases = [p for p in data[a] if p in all_unm]
    print(f"\n# === {a} ({len(phrases)}) ===")
    with open(f'pair1_{a}.json', 'w', encoding='utf-8') as out:
        json.dump(phrases, out, ensure_ascii=False, indent=2)

print("Saved pair1 files.")

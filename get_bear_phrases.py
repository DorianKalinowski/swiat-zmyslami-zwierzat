import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('all_unmapped_phrases.json', 'r', encoding='utf-8') as f:
    all_unm = set(json.load(f))

with open('extracted_phrases.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

bear_phrases = [p for p in data['niedzwiedz.html'] if p in all_unm]
print(f"Total bear phrases to translate: {len(bear_phrases)}")

with open('bear_to_trans.json', 'w', encoding='utf-8') as out:
    json.dump(bear_phrases, out, ensure_ascii=False, indent=2)

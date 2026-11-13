import sys, json
sys.stdout.reconfigure(encoding='utf-8')

with open('missing_by_file.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

set1 = {animal: data[animal] for animal in ['dog', 'wolf', 'cat', 'boar']}

with open('set1_strings.json', 'w', encoding='utf-8') as f:
    json.dump(set1, f, indent=2, ensure_ascii=False)

print("Saved set1_strings.json successfully")

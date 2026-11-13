import sys, json
sys.stdout.reconfigure(encoding='utf-8')

with open('missing_by_file.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

set2 = {animal: data[animal] for animal in ['bat', 'bear', 'fox', 'hedgehog']}
set3 = {animal: data[animal] for animal in ['bee', 'owl', 'eagle', 'viper']}
set4 = {animal: data[animal] for animal in ['dolphin', 'shark', 'octopus']}

with open('set2_strings.json', 'w', encoding='utf-8') as f:
    json.dump(set2, f, indent=2, ensure_ascii=False)

with open('set3_strings.json', 'w', encoding='utf-8') as f:
    json.dump(set3, f, indent=2, ensure_ascii=False)

with open('set4_strings.json', 'w', encoding='utf-8') as f:
    json.dump(set4, f, indent=2, ensure_ascii=False)

print("Saved set2, set3, set4 successfully")

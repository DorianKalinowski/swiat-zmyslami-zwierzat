import sys, json
sys.stdout.reconfigure(encoding='utf-8')

with open('all_simulator_strings_extracted.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

dog_strings = data['by_file']['js\\dog-simulators.js']
print(f"Dog strings ({len(dog_strings)}):")
for s in dog_strings[:40]:
    print(" -", s[:80].replace('\n', ' '))

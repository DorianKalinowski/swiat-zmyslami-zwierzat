import sys, json, re
sys.stdout.reconfigure(encoding='utf-8')

with open('uncovered_sim_strings.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

real_strings = []
for s in items:
    clean = s.strip()
    if len(clean) < 4:
        continue
    # Skip pure numbers or punctuation
    if not re.search(r'[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]', clean):
        continue
    # Skip template fragments like: ! Zanim w ogóle...
    real_strings.append(clean)

print(f"Meaningful uncovered strings: {len(real_strings)}")

with open('meaningful_uncovered.json', 'w', encoding='utf-8') as f:
    json.dump(real_strings, f, indent=2, ensure_ascii=False)

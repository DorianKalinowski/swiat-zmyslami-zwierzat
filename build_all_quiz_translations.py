import sys, json
sys.stdout.reconfigure(encoding='utf-8')

with open('all_quizzes_clean.json', 'r', encoding='utf-8') as f:
    quizzes = json.load(f)

# Load existing translations to avoid redoing work
existing = {}
for fn in ['dict_simulators_set1.json', 'dict_simulators_set2.json', 'dict_simulators_set3.json', 'dict_simulators_set4.json']:
    try:
        with open(fn, 'r', encoding='utf-8') as f:
            existing.update(json.load(f))
    except Exception:
        pass

print(f"Loaded {len(existing)} existing simulator translations.")

# Collect unique quiz strings needed
quiz_strings = set()
for q in quizzes:
    if q['q']: quiz_strings.add(q['q'])
    for opt in q['options']:
        if opt: quiz_strings.add(opt)
    if q['explain']: quiz_strings.add(q['explain'])

print(f"Total unique strings in all 70 quizzes: {len(quiz_strings)}")
missing_quiz_strings = [s for s in quiz_strings if s not in existing]
print(f"Missing quiz strings: {len(missing_quiz_strings)}")

with open('missing_quiz_strings.json', 'w', encoding='utf-8') as f:
    json.dump(missing_quiz_strings, f, indent=2, ensure_ascii=False)

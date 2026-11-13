import sys, json
sys.stdout.reconfigure(encoding='utf-8')

with open('all_quizzes_clean.json', 'r', encoding='utf-8') as f:
    quizzes = json.load(f)

print(f"Total quiz questions: {len(quizzes)}")
by_animal = {}
for q in quizzes:
    by_animal.setdefault(q['animal'], []).append(q)

for a, q_list in by_animal.items():
    print(f"=== {a.upper()} ({len(q_list)} questions) ===")
    for q in q_list[:2]:
        print("  Q:", repr(q['q'][:70]))
        print("  Opt1:", repr(q['options'][0][:50]))
        print("  Exp:", repr(q['explain'][:70]))

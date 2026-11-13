import sys, json
sys.stdout.reconfigure(encoding='utf-8')

with open('quiz_batchB.json', 'r', encoding='utf-8') as f:
    batchB = json.load(f)

for q in batchB:
    print(f"[{q['animal'].upper()}] Q: {repr(q['q'])}")
    for opt in q['options']:
        print("  -", repr(opt))
    print("  Exp:", repr(q['explain'][:80]))
    print()

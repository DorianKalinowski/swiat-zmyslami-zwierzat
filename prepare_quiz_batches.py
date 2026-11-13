import sys, json
sys.stdout.reconfigure(encoding='utf-8')

with open('all_quizzes_clean.json', 'r', encoding='utf-8') as f:
    quizzes = json.load(f)

batchA = [q for q in quizzes if q['animal'] in ['bat', 'bear', 'bee', 'boar', 'cat']]
batchB = [q for q in quizzes if q['animal'] in ['dog', 'dolphin', 'eagle', 'fox', 'hedgehog']]
batchC = [q for q in quizzes if q['animal'] in ['octopus', 'owl', 'shark', 'viper']]

with open('quiz_batchA.json', 'w', encoding='utf-8') as f: json.dump(batchA, f, indent=2, ensure_ascii=False)
with open('quiz_batchB.json', 'w', encoding='utf-8') as f: json.dump(batchB, f, indent=2, ensure_ascii=False)
with open('quiz_batchC.json', 'w', encoding='utf-8') as f: json.dump(batchC, f, indent=2, ensure_ascii=False)

print(f"Batch A: {len(batchA)} questions")
print(f"Batch B: {len(batchB)} questions")
print(f"Batch C: {len(batchC)} questions")

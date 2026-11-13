import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('js/shark-simulators.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'function initSharkQuiz' in l:
        print(f"Line {i+1}:")
        for j in range(i, min(i+50, len(lines))):
            print(f"  {j+1}: {lines[j].rstrip()}")
        break

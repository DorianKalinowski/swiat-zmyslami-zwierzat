import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('js/dog-simulators.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'function initDogScentGame' in line:
        print(f"Line {i+1}: {line.strip()}")
        for j in range(i, min(i+40, len(lines))):
            print(f"  {j+1}: {lines[j].rstrip()}")
        break

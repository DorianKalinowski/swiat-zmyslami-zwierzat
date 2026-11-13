import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('js/dog-simulators.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for j in range(835, min(890, len(lines))):
    print(f"  {j+1}: {lines[j].rstrip()}")

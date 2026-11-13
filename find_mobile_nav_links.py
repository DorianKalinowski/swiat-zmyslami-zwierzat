import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('css/style.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'nav-links' in l and '@media' in ''.join(lines[max(0, i-15):i]):
        print(f"Line {i+1}: {l.strip()}")
        for j in range(i, min(i+25, len(lines))):
            print(f"  {j+1}: {lines[j].rstrip()}")

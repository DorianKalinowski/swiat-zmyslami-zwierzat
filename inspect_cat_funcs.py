import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('js/cat-simulators.js', 'r', encoding='utf-8') as f:
    c = f.read()
calls = re.findall(r'(\w+)\s*\([^)]*\)', c)
print([x for x in calls if 'game' in x.lower() or 'over' in x.lower() or 'end' in x.lower() or 'hunt' in x.lower()])
for m in re.finditer(r'function\s+(\w+)\s*\([^)]*\)\s*\{', c):
    print("Function:", m.group(1))

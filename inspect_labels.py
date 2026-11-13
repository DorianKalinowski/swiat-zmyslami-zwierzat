import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('js/bat-simulators.js', 'r', encoding='utf-8') as f:
    c = f.read()
for m in re.finditer(r'label:\s*[\'"][^\'"]+[\'"]', c):
    print("Bat label:", m.group(0))

with open('js/bee-simulators.js', 'r', encoding='utf-8') as f:
    c = f.read()
for m in re.finditer(r'type:\s*[\'"][^\'"]+[\'"]', c):
    print("Bee hazard type:", m.group(0))

with open('js/fox-simulators.js', 'r', encoding='utf-8') as f:
    c = f.read()
for m in re.finditer(r'type:\s*[\'"][^\'"]+[\'"]', c):
    print("Fox hazard type:", m.group(0))

with open('js/octopus-simulators.js', 'r', encoding='utf-8') as f:
    c = f.read()
for m in re.finditer(r'name:\s*[\'"][^\'"]+[\'"]', c):
    print("Octopus mode/zone name:", m.group(0))

import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('js/bat-simulators.js', 'r', encoding='utf-8') as f:
    c = f.read()

m = re.search(r'const questions\s*=\s*\[([\s\S]*?)\];', c)
if m:
    print(m.group(0)[:800])

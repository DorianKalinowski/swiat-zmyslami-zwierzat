import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('js/bat-simulators.js', 'r', encoding='utf-8') as f:
    c = f.read()

m = re.search(r'explanation:\s*([\'"`])([\s\S]*?)\1', c)
if m:
    print("Found explanation:", repr(m.group(2)[:100]))
else:
    print("No explanation found with regex")

import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('js/bat-simulators.js', 'r', encoding='utf-8') as f:
    c = f.read()

m = re.search(r'const questions\s*=\s*\[([\s\S]*?)\];', c)
block = m.group(1)
q_indices = [m.start() for m in re.finditer(r'\bq:\s*[\'"`]', block)]
chunk = block[q_indices[0]:q_indices[1]]
print("Chunk length:", len(chunk))
print("Chunk repr:", repr(chunk))
exp_m = re.search(r'(?:explanation|explain):\s*([\'"`])([\s\S]*?)\1', chunk)
print("Exp match:", exp_m)

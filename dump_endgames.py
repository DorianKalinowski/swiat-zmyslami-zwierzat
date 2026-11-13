import sys, glob, re
sys.stdout.reconfigure(encoding='utf-8')

js_files = sorted(glob.glob('js/*-simulators.js'))
for jf in js_files:
    animal = jf.replace('js\\', '').replace('-simulators.js', '').replace('js/', '')
    with open(jf, 'r', encoding='utf-8') as f:
        c = f.read()
    m = re.search(r'function\s+(endGame|gameOver)\s*\([^)]*\)\s*\{([\s\S]*?)(?=\n  function\s|\nfunction\s|\n\/\*|\nconst\s|\nlet\s|$)', c)
    if m:
        print(f"==================== {animal} ({m.group(1)}) ====================")
        print(m.group(0)[:1500])
        print("\n")

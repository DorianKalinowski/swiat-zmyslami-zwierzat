import sys, glob, re
sys.stdout.reconfigure(encoding='utf-8')

js_files = sorted(glob.glob('js/*-simulators.js'))
for jf in js_files:
    with open(jf, 'r', encoding='utf-8') as f:
        content = f.read()
    
    matches = re.finditer(r'ctx[A-Za-z0-9_]*\.fillText\s*\(([^;]+)\);', content)
    calls = [m.group(0) for m in matches]
    if calls:
        print(f"\n=== {jf} ({len(calls)} calls) ===")
        for c in calls:
            print("  ", c.strip())

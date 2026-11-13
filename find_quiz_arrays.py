import sys, glob, re
sys.stdout.reconfigure(encoding='utf-8')

for jf in sorted(glob.glob('js/*-simulators.js')):
    with open(jf, 'r', encoding='utf-8') as f:
        c = f.read()
    # Find quiz array declaration
    m = re.search(r'(?:const|let|var)\s+(\w*[Qq]uiz\w*|\w*[Qq]uestions\w*)\s*=\s*\[', c)
    if m:
        arr_name = m.group(1)
        # Find first object inside array
        start = m.end() - 1
        end = c.find('];', start)
        print(f"{jf:25} -> {arr_name} (length in chars: {end - start})")
        sample = c[start:start+300].replace('\n', ' ')
        print("  Sample:", sample[:120])

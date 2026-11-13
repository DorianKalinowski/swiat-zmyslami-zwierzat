import sys, glob, re
sys.stdout.reconfigure(encoding='utf-8')

js_files = sorted(glob.glob('js/*-simulators.js'))
for jf in js_files:
    with open(jf, 'r', encoding='utf-8') as f:
        c = f.read()
    calls = re.findall(r'ctx[A-Za-z0-9_]*\.fillText\s*\(([^;]+)\);', c)
    for call in calls:
        # Check if contains letters (not just emojis or numbers)
        arg0 = call.split(',')[0].strip()
        if re.search(r'[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]', arg0):
            print(f"{jf:25} -> {arg0}")

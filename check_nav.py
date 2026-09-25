import glob
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
root = os.path.dirname(os.path.abspath(__file__))

for hp in sorted(glob.glob(os.path.join(root, '*.html'))):
    fname = os.path.basename(hp)
    with open(hp, 'r', encoding='utf-8') as f:
        c = f.read()
    m = re.search(r'<div class=[\'"]nav-links[\'"].*?>(.*?)</div>\s*</div>\s*</nav>', c, re.DOTALL)
    if m:
        raw = m.group(1)
        items = re.findall(r'<a[^>]*>(.*?)</a>|<button[^>]*>(.*?)</button>', raw, re.DOTALL)
        clean = []
        for a, b in items:
            t = (a or b).strip()
            # remove inner tags
            t = re.sub(r'<[^>]+>', '', t).strip()
            if 'Dorian' not in t and 'Twórca' not in t:
                clean.append(t)
        print(f"{fname}: {len(clean)} links:")
        print("   " + ", ".join(clean))
    else:
        print(f"{fname}: NO NAV LINKS FOUND")

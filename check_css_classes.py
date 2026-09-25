import re
import glob
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
root = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(root, 'css', 'style.css'), 'r', encoding='utf-8') as f:
    css_content = f.read()

# Extract all css classes defined in style.css
css_classes = set(re.findall(r'\.([a-zA-Z0-9_-]+)\s*[{,.:]', css_content))

new_htmls = ['nietoperz.html', 'sowa.html', 'zmija.html', 'niedzwiedz.html', 'pszczola.html', 'lis.html', 'pies.html', 'kot.html', 'dzik.html', 'wilk.html']

for h in new_htmls:
    with open(os.path.join(root, h), 'r', encoding='utf-8') as f:
        html = f.read()

    html_classes = set()
    for m in re.findall(r'class=[\'"]([^\'"]+)[\'"]', html):
        for c in m.split():
            html_classes.add(c)

    missing = html_classes - css_classes
    # filter dynamic/state classes
    missing = [c for c in missing if c not in ('active', 'show', 'open', 'selected', 'hidden', 'danger', 'success', 'correct', 'wrong', 'completed')]
    print(f"\n{h} - missing CSS classes ({len(missing)}):")
    for mc in sorted(missing):
        print(f"  - .{mc}")

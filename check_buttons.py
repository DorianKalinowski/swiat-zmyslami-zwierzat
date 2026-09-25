import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
root = os.path.dirname(os.path.abspath(__file__))

sim_pairs = {
    'nietoperz.html': 'bat-simulators.js',
    'sowa.html': 'owl-simulators.js',
    'zmija.html': 'viper-simulators.js',
    'niedzwiedz.html': 'bear-simulators.js',
    'pszczola.html': 'bee-simulators.js',
    'lis.html': 'fox-simulators.js',
}

for html_file, js_file in sim_pairs.items():
    hp = os.path.join(root, html_file)
    jp = os.path.join(root, 'js', js_file)

    with open(hp, 'r', encoding='utf-8') as f:
        html = f.read()
    with open(jp, 'r', encoding='utf-8') as f:
        js = f.read()

    # Find all buttons with id
    buttons = re.findall(r'<button[^>]+id=[\'"]([^\'"]+)[\'"]', html)
    print(f"\n--- Checking {html_file} ({len(buttons)} buttons) ---")
    for b in buttons:
        if 'nav' in b or 'modal' in b or 'catalog' in b or 'pwa' in b:
            continue
        in_js = b in js
        status = "✅" if in_js else "⚠️ NOT IN JS"
        print(f"  {status} Button #{b}")

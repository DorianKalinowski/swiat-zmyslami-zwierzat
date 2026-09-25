import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
root = os.path.dirname(os.path.abspath(__file__))

# 1. Update JS files
js_updates = [
    'bee-simulators.js',
    'bear-simulators.js',
    'fox-simulators.js',
    'bat-simulators.js',
    'owl-simulators.js',
    'viper-simulators.js'
]

for js_file in js_updates:
    p = os.path.join(root, 'js', js_file)
    with open(p, 'r', encoding='utf-8') as f:
        c = f.read()

    old_code = "resultBox.className = `crisis-feedback-box show ${resp.type}`;"
    new_code = "resultBox.style.display = 'block';\n      resultBox.className = `crisis-feedback-box show ${resp.type}`;"
    if old_code in c and "resultBox.style.display = 'block';" not in c:
        c = c.replace(old_code, new_code)
        with open(p, 'w', encoding='utf-8') as f:
            f.write(c)
        print(f"✅ Updated JS: {js_file}")
    else:
        print(f"ℹ️ JS already updated or unchanged: {js_file}")

# 2. Update HTML files
html_updates = {
    'pszczola.html': 'id="beeAidResult" class="crisis-feedback-box" style="display: none; padding: 1.5rem; border-radius: 12px;"',
    'niedzwiedz.html': 'id="bearCrisisResult" class="crisis-feedback-box" style="display: none; padding: 1.5rem; border-radius: 12px;"',
    'lis.html': 'id="foxAidResult" class="crisis-feedback-box" style="display: none; padding: 1.5rem; border-radius: 12px;"',
    'nietoperz.html': 'id="batCrisisResult" class="crisis-feedback-box" style="display: none;"',
    'sowa.html': 'id="owlCrisisResult" class="crisis-feedback-box" style="display: none;"',
    'zmija.html': 'id="viperCrisisResult" class="crisis-feedback-box" style="display: none;"'
}

for html_file, old_tag in html_updates.items():
    p = os.path.join(root, html_file)
    with open(p, 'r', encoding='utf-8') as f:
        c = f.read()

    target_id = old_tag.split('"')[1]
    new_tag = f'id="{target_id}" class="crisis-feedback-box"'
    if old_tag in c:
        c = c.replace(old_tag, new_tag)
        with open(p, 'w', encoding='utf-8') as f:
            f.write(c)
        print(f"✅ Updated HTML: {html_file}")
    else:
        print(f"ℹ️ HTML already updated or pattern differed: {html_file}")

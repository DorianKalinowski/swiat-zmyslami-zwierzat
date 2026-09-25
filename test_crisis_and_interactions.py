import os
import re
import sys
sys.stdout.reconfigure(encoding='utf-8')

animals = [
    ('nietoperz.html', 'js/bat-simulators.js', 'batCrisisResult', '.bat-crisis-card'),
    ('sowa.html', 'js/owl-simulators.js', 'owlCrisisResult', '.owl-crisis-card'),
    ('zmija.html', 'js/viper-simulators.js', 'viperCrisisResult', '.viper-crisis-card'),
    ('niedzwiedz.html', 'js/bear-simulators.js', 'bearCrisisResult', '.bear-crisis-card'),
    ('pszczola.html', 'js/bee-simulators.js', 'beeAidResult', '.bee-aid-card'),
    ('lis.html', 'js/fox-simulators.js', 'foxAidResult', '.fox-aid-card')
]

print("=== DEEP VERIFICATION OF CRISIS PROTOCOLS & INTERACTIVE MODULES ===")

all_ok = True

for html_file, js_file, box_id, card_class in animals:
    print(f"\n--- Checking {html_file} & {js_file} ---")
    with open(html_file, encoding='utf-8') as f:
        html = f.read()
    with open(js_file, encoding='utf-8') as f:
        js = f.read()

    # 1. Check box_id in HTML
    if f'id="{box_id}"' not in html:
        print(f"❌ Box ID '{box_id}' NOT found in {html_file}")
        all_ok = False
    else:
        print(f"✅ Box ID '{box_id}' present in HTML")

    # 2. Check inline style='display: none' on crisis feedback box (must NOT be present so show class works cleanly)
    box_match = re.search(r'<div[^>]*id="' + box_id + r'"[^>]*>', html)
    if box_match:
        tag = box_match.group(0)
        if 'display: none' in tag:
            print(f"⚠️ Warning: inline style='display: none' still in {box_id}: {tag}")
            all_ok = False
        else:
            print(f"✅ {box_id} tag is clean of inline display:none: {tag}")
    else:
        print(f"❌ Could not find opening tag for {box_id}")
        all_ok = False

    # 3. Check cards in HTML and check if card selector in JS matches
    raw_class = card_class.lstrip('.')
    card_count = html.count(raw_class)
    print(f"  Found {card_count} elements with class '{raw_class}' in HTML")
    if card_count == 0:
        print(f"❌ No cards found for class '{raw_class}' in {html_file}")
        all_ok = False

    if card_class not in js:
        print(f"❌ Card class '{card_class}' NOT queried in {js_file}")
        all_ok = False
    else:
        print(f"  ✅ Card selector '{card_class}' queried in JS")

    # 4. Check data-action in HTML cards and check if JS handles each action
    # Extract only actions within the crisis card section
    actions_in_html = re.findall(r'class="[^"]*' + raw_class + r'[^"]*"[^>]*data-action="([^"]+)"', html)
    if not actions_in_html:
        actions_in_html = re.findall(r'data-action="([^"]+)"[^>]*class="[^"]*' + raw_class + r'[^"]*"', html)
    print(f"  Actions on crisis cards in HTML: {actions_in_html}")
    if not actions_in_html:
        print(f"❌ Could not parse actions from cards in {html_file}")
        all_ok = False

    for act in actions_in_html:
        if act not in js:
            print(f"❌ Action '{act}' from {html_file} NOT handled in {js_file}")
            all_ok = False
        else:
            print(f"  ✅ Action '{act}' handled in JS")

    # 5. Check if JS sets resultBox.style.display = 'block'
    if 'resultBox.style.display = \'block\'' in js:
        print(f"✅ JS explicitly ensures display: block on {box_id}")
    else:
        print(f"⚠️ Note: JS does not explicitly set display:block on {box_id}")

print("\n" + ("="*50))
if all_ok:
    print("🎉 ALL CRISIS PROTOCOLS FULLY FUNCTIONAL AND VERIFIED!")
else:
    print("❌ SOME CHECKS FAILED!")
print("="*50)

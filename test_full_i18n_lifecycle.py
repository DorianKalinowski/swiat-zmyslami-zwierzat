# test_full_i18n_lifecycle.py
import sys, glob, re, json

sys.stdout.reconfigure(encoding='utf-8')

print("==================================================")
print("   FULL I18N LIFECYCLE & REGRESSION VERIFICATION   ")
print("==================================================")

# 1. Verify translations dictionary
with open('js/translations.js', 'r', encoding='utf-8') as f:
    js_txt = f.read()
prefix = 'window.TRANSLATIONS_EN = '
json_str = js_txt[js_txt.find(prefix) + len(prefix):].rstrip().rstrip(';')
translations = json.loads(json_str)
print(f"✅ translations.js loaded with {len(translations)} entries.")

# 2. Check all 16 HTML pages for markup and script inclusions
html_files = sorted(glob.glob('*.html'))
for hf in html_files:
    with open(hf, 'r', encoding='utf-8') as f:
        html = f.read()

    # Must contain V1.1
    assert 'V1.1' in html, f"{hf} missing V1.1 version tag!"
    # Must contain Dorian Kalinowski
    assert 'Dorian Kalinowski' in html, f"{hf} missing Dorian Kalinowski attribution!"
    # Must contain lang-switch
    assert 'id="langSwitch"' in html, f"{hf} missing #langSwitch!"
    # Must contain data-lang="pl" and data-lang="en"
    assert 'data-lang="pl"' in html and 'data-lang="en"' in html, f"{hf} missing language buttons!"
    # Must contain translations.js and i18n.js
    assert 'src="js/translations.js"' in html, f"{hf} missing translations.js script!"
    assert 'src="js/i18n.js"' in html, f"{hf} missing i18n.js script!"

print(f"✅ All {len(html_files)} HTML files verified: V1.1 branding, author attribution, language switcher, and script tags.")

# 3. Test simulated TreeWalker translation for each page in USA mode
for hf in html_files:
    with open(hf, 'r', encoding='utf-8') as f:
        html = f.read()
    
    clean_html = re.sub(r'<!--.*?-->', '', html, flags=re.DOTALL)
    clean_html = re.sub(r'<(script|style|svg|canvas)[^>]*>.*?</\1>', '', clean_html, flags=re.DOTALL)
    text_fragments = re.findall(r'>([^<]+)<', clean_html)
    
    unmapped = []
    translated_count = 0
    for frag in text_fragments:
        trimmed = frag.strip()
        if not trimmed:
            continue
        if not re.search(r'[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]', trimmed):
            continue
        norm = re.sub(r'\s+', ' ', trimmed)
        if frag in translations or trimmed in translations or norm in translations:
            translated_count += 1
        else:
            unmapped.append(norm)

    assert len(unmapped) == 0, f"Page {hf} has unmapped strings in USA mode: {unmapped}"
    print(f"✅ {hf:<16}: 100% of text nodes mapped ({translated_count} nodes)")

# 4. Verify CSS styling
with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

assert '.lang-switch' in css, "style.css missing .lang-switch!"
assert '.lang-btn' in css, "style.css missing .lang-btn!"
assert '.lang-btn.active' in css, "style.css missing .lang-btn.active!"
print("✅ css/style.css verified: .lang-switch, .lang-btn, .lang-btn.active styles present.")

# 5. Verify Service Worker assets
with open('sw.js', 'r', encoding='utf-8') as f:
    sw = f.read()

assert '/js/translations.js' in sw, "sw.js missing /js/translations.js!"
assert '/js/i18n.js' in sw, "sw.js missing /js/i18n.js!"
print("✅ sw.js verified: translations.js and i18n.js included in cache.")

# 6. Verify README.md maintains V1.1
with open('README.md', 'r', encoding='utf-8') as f:
    readme = f.read()
assert 'V1.1' in readme, "README.md missing V1.1!"
print("✅ README.md verified: V1.1 branding present.")

print("\n==================================================")
print("🎉 ALL LIFECYCLE AND REGRESSION TESTS PASSED 100%!")
print("==================================================")

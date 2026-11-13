# test_i18n_simulation.py
import sys, glob, re, json

sys.stdout.reconfigure(encoding='utf-8')

# Read translations.js
with open('js/translations.js', 'r', encoding='utf-8') as f:
    js_txt = f.read()

prefix = 'window.TRANSLATIONS_EN = '
start_idx = js_txt.find(prefix)
if start_idx == -1:
    print("FATAL: Could not find window.TRANSLATIONS_EN in js/translations.js")
    sys.exit(1)

json_str = js_txt[start_idx + len(prefix):].rstrip().rstrip(';')
try:
    translations = json.loads(json_str)
    print(f"Loaded {len(translations)} translations from js/translations.js successfully!")
except Exception as e:
    print(f"FATAL parsing translations JSON: {e}")
    sys.exit(1)

html_files = sorted(glob.glob('*.html'))
print(f"Testing translation across all {len(html_files)} HTML files...\n")

total_nodes_all = 0
translated_nodes_all = 0
untranslated_nodes_all = 0
failed_pages = []

for hf in html_files:
    with open(hf, 'r', encoding='utf-8') as f:
        html = f.read()

    # Verify lang-switch markup is present
    if 'id="langSwitch"' not in html:
        print(f"❌ {hf}: Missing #langSwitch in navbar!")
        failed_pages.append(hf)
        continue

    # Verify scripts are loaded in order
    if 'js/translations.js' not in html or 'js/i18n.js' not in html:
        print(f"❌ {hf}: Missing translations.js or i18n.js script tag!")
        failed_pages.append(hf)
        continue

    # Remove comments, script, style, svg, canvas tags for text node simulation
    clean_html = re.sub(r'<!--.*?-->', '', html, flags=re.DOTALL)
    clean_html = re.sub(r'<(script|style|svg|canvas)[^>]*>.*?</\1>', '', clean_html, flags=re.DOTALL)
    
    # Extract text content between tags >TEXT<
    text_fragments = re.findall(r'>([^<]+)<', clean_html)
    
    page_total = 0
    page_translated = 0
    page_untranslated = []

    for frag in text_fragments:
        trimmed = frag.strip()
        if not trimmed:
            continue
        
        # If it's purely numbers, punctuation, emojis, arrows or math symbols
        if not re.search(r'[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]', trimmed):
            continue

        page_total += 1
        norm = re.sub(r'\s+', ' ', trimmed)

        # Check translation
        if frag in translations or trimmed in translations or norm in translations:
            page_translated += 1
        else:
            page_untranslated.append(norm)

    total_nodes_all += page_total
    translated_nodes_all += page_translated
    untranslated_nodes_all += len(page_untranslated)

    if len(page_untranslated) == 0:
        print(f"✅ {hf:<16}: {page_translated}/{page_total} text nodes translated (100.0%)")
    else:
        print(f"⚠️ {hf:<16}: {page_translated}/{page_total} translated. Unmapped {len(page_untranslated)}: {page_untranslated[:3]}")

print("\n==========================================")
print(f"TOTAL TEXT NODES CHECKED : {total_nodes_all}")
print(f"TRANSLATED IN USA MODE   : {translated_nodes_all}")
print(f"UNMAPPED                 : {untranslated_nodes_all}")
print(f"SUCCESS RATE             : {translated_nodes_all / total_nodes_all * 100:.2f}%")
print("==========================================")

if untranslated_nodes_all == 0 and len(failed_pages) == 0:
    print("🎉 ALL 16 PAGES HAVE 100.0% FULL AMERICAN ENGLISH SUPPORT IN USA MODE!")
else:
    sys.exit(1)

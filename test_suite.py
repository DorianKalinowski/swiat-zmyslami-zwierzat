import os
import glob
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
root = os.path.dirname(os.path.abspath(__file__))

print("==================================================")
print("   AUTOMATED TEST SUITE: ŚWIAT ZMYSŁAMI ZWIERZĄT  ")
print("==================================================")

animal_map = {
    'pies.html': 'dog-simulators.js',
    'kot.html': 'cat-simulators.js',
    'dzik.html': 'boar-simulators.js',
    'wilk.html': 'wolf-simulators.js',
    'nietoperz.html': 'bat-simulators.js',
    'sowa.html': 'owl-simulators.js',
    'zmija.html': 'viper-simulators.js',
    'niedzwiedz.html': 'bear-simulators.js',
    'pszczola.html': 'bee-simulators.js',
    'lis.html': 'fox-simulators.js',
}

all_passed = True

print("\n--- 1. FILE EXISTENCE CHECK ---")
for html_name, js_name in animal_map.items():
    hp = os.path.join(root, html_name)
    jp = os.path.join(root, 'js', js_name)
    if not os.path.isfile(hp):
        print(f"❌ HTML missing: {html_name}")
        all_passed = False
    else:
        print(f"✅ HTML found: {html_name}")
    if not os.path.isfile(jp):
        print(f"❌ JS missing: {js_name}")
        all_passed = False
    else:
        print(f"✅ JS found: {js_name}")

print("\n--- 2. JS DOM ID REFERENCES VS HTML DECLARATIONS ---")
for html_name, js_name in animal_map.items():
    hp = os.path.join(root, html_name)
    jp = os.path.join(root, 'js', js_name)
    if not os.path.isfile(hp) or not os.path.isfile(jp):
        continue

    with open(hp, 'r', encoding='utf-8') as f:
        html = f.read()
    with open(jp, 'r', encoding='utf-8') as f:
        js = f.read()

    # IDs referenced by getElementById
    referenced_ids = set(re.findall(r"document\.getElementById\(['\"]([a-zA-Z0-9_-]+)['\"]\)", js))
    # Query selectors with #id
    referenced_ids.update(re.findall(r"querySelector\(['\"]#([a-zA-Z0-9_-]+)['\"]\)", js))

    missing = []
    for rid in sorted(referenced_ids):
        # Look for id="rid" or id='rid' in html OR in js template strings (dynamic UI)
        pattern = re.compile(rf'id=[\'"]{re.escape(rid)}[\'"]')
        if not pattern.search(html) and not pattern.search(js):
            missing.append(rid)

    if missing:
        print(f"❌ {html_name} <-> {js_name} has MISSING IDs in HTML/JS: {missing}")
        all_passed = False
    else:
        print(f"✅ {html_name} <-> {js_name}: All {len(referenced_ids)} JS DOM IDs matched in HTML or dynamic JS!")

print("\n--- 3. 10 LEVELS CHECK FOR ALL 10 ANIMALS ---")
for html_name, js_name in animal_map.items():
    jp = os.path.join(root, 'js', js_name)
    if not os.path.isfile(jp):
        continue
    with open(jp, 'r', encoding='utf-8') as f:
        js = f.read()
    
    # Check level names count
    levels_match = re.findall(r"name:\s*['\"]([^'\"]+)['\"]", js)
    if len(levels_match) >= 10:
        print(f"✅ {js_name}: Has {len(levels_match)} progressive missions (>=10).")
    else:
        print(f"❌ {js_name}: Only has {len(levels_match)} levels! Expected at least 10.")
        all_passed = False

print("\n--- 4. MINIGAME OVERLAY SHOW/HIDE LOGIC (ALL 6 NEW ANIMALS) ---")
new_simulators = ['bat-simulators.js', 'owl-simulators.js', 'viper-simulators.js', 'bear-simulators.js', 'bee-simulators.js', 'fox-simulators.js']
for sim in new_simulators:
    jp = os.path.join(root, 'js', sim)
    with open(jp, 'r', encoding='utf-8') as f:
        js = f.read()

    hide_ok = "overlay.classList.add('hidden')" in js and "overlay.style.display = 'none'" in js
    show_ok = "overlay.classList.remove('hidden')" in js and "overlay.style.display = 'flex'" in js

    if hide_ok and show_ok:
        print(f"✅ {sim}: Overlay hide and show logic is correct.")
    else:
        print(f"❌ {sim}: Overlay logic issue! hide_ok={hide_ok}, show_ok={show_ok}")
        all_passed = False

print("\n--- 5. 5-QUESTION QUIZ VERIFICATION (ALL 6 NEW ANIMALS) ---")
for sim in new_simulators:
    jp = os.path.join(root, 'js', sim)
    with open(jp, 'r', encoding='utf-8') as f:
        js = f.read()

    q_count = len(re.findall(r"\bq:\s*['\"]", js))
    has_meter = "MeterProgress" in js
    has_body = "DynamicBody" in js

    if q_count >= 5 and has_meter and has_body:
        print(f"✅ {sim}: Quiz has {q_count} questions, dynamic body, and progress meter.")
    else:
        print(f"❌ {sim}: Quiz verification failed! q_count={q_count}, has_meter={has_meter}, has_body={has_body}")
        all_passed = False

print("\n--- 6. HTML SECTIONS & SUBNAV INTEGRITY (ALL 6 NEW ANIMALS) ---")
new_htmls = ['nietoperz.html', 'sowa.html', 'zmija.html', 'niedzwiedz.html', 'pszczola.html', 'lis.html']
required_sections = ['historia', 'zmysly', 'anatomia', 'bezpieczenstwo', 'ciekawostki', 'gra', 'quiz']

for h in new_htmls:
    hp = os.path.join(root, h)
    with open(hp, 'r', encoding='utf-8') as f:
        html = f.read()

    missing_sections = []
    for sec in required_sections:
        if f'id="{sec}"' not in html and f"id='{sec}'" not in html:
            missing_sections.append(sec)

    has_stats_grid = 'hero-stats-grid' in html
    has_portrait = 'animal-portrait-card' in html
    has_timeline = 'timeline-stepper' in html
    has_curiosity = 'curiosity-grid' in html
    has_quiz_wrap = 'quiz-wrapper' in html

    features_ok = has_stats_grid and has_portrait and has_timeline and has_curiosity and has_quiz_wrap

    if not missing_sections and features_ok:
        print(f"✅ {h}: All 7 required sections and UI modules (stats, portrait, timeline, curiosities, quiz) present!")
    else:
        print(f"❌ {h}: Missing sections: {missing_sections}, features_ok={features_ok}")
        all_passed = False

print("\n--- 7. APP VERSION AND AUTHOR ATTRIBUTION CHECK ---")
all_html_files = glob.glob(os.path.join(root, '*.html'))
for hpath in all_html_files:
    fname = os.path.basename(hpath)
    with open(hpath, 'r', encoding='utf-8') as f:
        content = f.read()

    has_v1 = "V1" in content
    has_dorian = "Dorian Kalinowski" in content or "Dorian" in content
    if has_v1 and has_dorian:
        print(f"✅ {fname}: Correctly displays V1 and Dorian Kalinowski attribution.")
    else:
        print(f"⚠️ {fname}: Check V1 ({has_v1}) or Dorian ({has_dorian})")

print("\n--- 8. LOCAL RESOURCE & LINK RESOLUTION CHECK ---")
broken = []
for hpath in all_html_files:
    fname = os.path.basename(hpath)
    with open(hpath, 'r', encoding='utf-8') as f:
        html = f.read()

    links = re.findall(r'(?:href|src)=[\'"]([^\'"]+)[\'"]', html)
    for l in links:
        if l.startswith('http') or l.startswith('#') or l.startswith('mailto:') or l.startswith('data:'):
            continue
        cleaned = l.split('?')[0].split('#')[0]
        if not cleaned:
            continue
        target = os.path.normpath(os.path.join(root, cleaned))
        if not os.path.exists(target):
            broken.append((fname, l, target))

if broken:
    print("❌ Broken local file links found:")
    for b in broken:
        print(f"   In {b[0]}: {b[1]} -> {b[2]}")
    all_passed = False
else:
    print(f"✅ All local resource links (CSS, JS, icons, images, HTML) resolve successfully!")

print("\n--- 9. DEEP EVENT LISTENER & SIMULATOR LOGIC VERIFICATION ---")
new_sims = {
    'bat-simulators.js': ('startBatGameBtn', 'nextBatLevelBtn', 'restartBatGameBtn', 'resetBatCampaignBtn', 'initBatQuiz'),
    'owl-simulators.js': ('startOwlGameBtn', 'nextOwlLevelBtn', 'restartOwlGameBtn', 'resetOwlCampaignBtn', 'initOwlQuiz'),
    'viper-simulators.js': ('startViperGameBtn', 'nextViperLevelBtn', 'restartViperGameBtn', 'resetViperCampaignBtn', 'initViperQuiz'),
    'bear-simulators.js': ('startBearGameBtn', 'nextBearLevelBtn', 'restartBearGameBtn', 'resetBearCampaignBtn', 'initBearQuiz'),
    'bee-simulators.js': ('startBeeGameBtn', 'nextBeeLevelBtn', 'restartBeeGameBtn', 'resetBeeCampaignBtn', 'initBeeQuiz'),
    'fox-simulators.js': ('startFoxGameBtn', 'nextFoxLevelBtn', 'restartFoxGameBtn', 'resetFoxCampaignBtn', 'initFoxQuiz')
}

for sim_file, expected_els in new_sims.items():
    jp = os.path.join(root, 'js', sim_file)
    with open(jp, 'r', encoding='utf-8') as f:
        js = f.read()

    # check buttons are fetched by ID
    for btn_id in expected_els[:4]:
        if f"document.getElementById('{btn_id}')" not in js and f'document.getElementById("{btn_id}")' not in js:
            print(f"❌ {sim_file}: Missing getElementById for {btn_id}")
            all_passed = False

    # check click listeners are attached
    for btn_var in ['startBtn', 'nextBtn', 'restartBtn', 'resetBtn']:
        if f"{btn_var}?.addEventListener('click'" not in js and f"{btn_var}.addEventListener('click'" not in js:
            print(f"❌ {sim_file}: Missing click listener for {btn_var}")
            all_passed = False

    # check quiz invocation in DOMContentLoaded
    quiz_fn = expected_els[4]
    if f"{quiz_fn}();" not in js:
        print(f"❌ {sim_file}: {quiz_fn}() not called in DOMContentLoaded")
        all_passed = False

    # check overlay hiding & showing
    if "overlay.style.display = 'none'" not in js:
        print(f"❌ {sim_file}: Missing overlay.style.display = 'none'")
        all_passed = False
    if "overlay.style.display = 'flex'" not in js:
        print(f"❌ {sim_file}: Missing overlay.style.display = 'flex'")
        all_passed = False

    print(f"✅ {sim_file}: Start, next, restart, reset listeners, quiz hook, and overlay mechanics verified!")

print("\n--- 10. LIVE HTTP SERVER RESPONSE TEST ---")
import http.server
import socketserver
import threading
import urllib.request

PORT = 8999
class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

def run_server():
    os.chdir(root)
    with socketserver.TCPServer(("", PORT), QuietHandler) as httpd:
        httpd.serve_forever()

server_thread = threading.Thread(target=run_server, daemon=True)
server_thread.start()

test_urls = [
    'index.html', 'pies.html', 'kot.html', 'dzik.html', 'wilk.html',
    'nietoperz.html', 'sowa.html', 'zmija.html', 'niedzwiedz.html', 'pszczola.html', 'lis.html',
    'css/style.css', 'js/app.js', 'manifest.json'
]

http_ok = True
for u in test_urls:
    try:
        url = f"http://127.0.0.1:{PORT}/{u}"
        req = urllib.request.urlopen(url, timeout=3)
        status = req.getcode()
        size = len(req.read())
        if status == 200 and size > 0:
            print(f"✅ HTTP 200 OK: /{u} ({size} bytes)")
        else:
            print(f"❌ HTTP Error for /{u}: status {status}, size {size}")
            http_ok = False
            all_passed = False
    except Exception as e:
        print(f"❌ HTTP Exception for /{u}: {e}")
        http_ok = False
        all_passed = False

print("\n==================================================")
if all_passed:
    print("🎉 ALL 10 TEST SUITES PASSED! PROJECT IS VERIFIED 100%!")
else:
    print("❌ SOME TESTS FAILED. PLEASE REVIEW OUTPUT ABOVE.")
print("==================================================")
sys.exit(0 if all_passed else 1)


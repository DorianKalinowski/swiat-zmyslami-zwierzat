import sys, glob, re
sys.stdout.reconfigure(encoding='utf-8')

chip_target = '<div class="creator-chip" id="authorChip" title="Dowiedz się więcej o autorze">\n          <img src="img/dorian-kalinowski.png" alt="Dorian Kalinowski" class="creator-avatar">\n          <div class="creator-text">\n            <span class="creator-name">Dorian Kalinowski</span>\n            <span class="creator-role">Twórca aplikacji</span>\n          </div>\n        </div>'

script_target = '<script src="js/app.js"></script>'

for f in sorted(glob.glob('*.html')):
    with open(f, 'r', encoding='utf-8') as fp:
        txt = fp.read()
    
    has_chip = chip_target in txt
    has_script = script_target in txt
    print(f"{f}: has_chip={has_chip}, has_script={has_script}")

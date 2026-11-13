import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

m = re.findall(r'(@media[^{]+nav-links[\s\S]{0,400})', css)
if m:
    print("Found nav-links media query:")
    print(m[0])
else:
    idx = css.find('.nav-links')
    print(css[idx:idx+600])

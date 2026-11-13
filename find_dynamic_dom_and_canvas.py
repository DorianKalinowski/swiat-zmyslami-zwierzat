import sys, glob, re, json
sys.stdout.reconfigure(encoding='utf-8')

js_files = sorted(glob.glob('js/*-simulators.js'))

results = {}

for jf in js_files:
    animal = jf.replace('js\\', '').replace('-simulators.js', '').replace('js/', '')
    with open(jf, 'r', encoding='utf-8') as f:
        c = f.read()

    # Find innerHTML assignments
    inner_htmls = re.findall(r'(\w+(?:\.\w+)*)\.innerHTML\s*=\s*([^;]+);', c)
    # Find textContent assignments
    text_contents = re.findall(r'(\w+(?:\.\w+)*)\.textContent\s*=\s*([^;]+);', c)
    # Find fillText calls
    fill_texts = re.findall(r'ctx[A-Za-z0-9_]*\.fillText\s*\(([^;]+)\);', c)

    results[animal] = {
        'innerHTML_count': len(inner_htmls),
        'textContent_count': len(text_contents),
        'fillText_count': len(fill_texts),
        'fill_texts': [f.strip() for f in fill_texts if any(c in f for c in 'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ') or any(w in f for w in ['Widok', 'CEL', 'Pion', 'Węszy', 'Wiatr', 'Rozproszenie', 'UKRYTY', 'WIDOCZNY'])],
        'sample_innerHTML': [h[1].strip()[:90] for h in inner_htmls[:5]],
        'sample_textContent': [t[1].strip()[:90] for t in text_contents[:5]]
    }

print(json.dumps(results, indent=2, ensure_ascii=False))

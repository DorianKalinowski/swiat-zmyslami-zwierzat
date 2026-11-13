import sys, glob, re, json
sys.stdout.reconfigure(encoding='utf-8')

js_files = sorted(glob.glob('js/*.js'))
results = {}

for jf in js_files:
    if 'translations.js' in jf:
        continue
    with open(jf, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find string literals (single, double, backtick)
    # Match strings containing Polish characters or common Polish words
    matches = []
    # Find all strings
    all_strings = re.findall(r'(["\'`])((?:(?!\1)[^\\]|\\.)*)\1', content)
    for q, s in all_strings:
        # Check if s has Polish chars or words like Misja, Poziom, Zwycięstwo, Pytanie, Punkty, etc.
        has_pl_char = bool(re.search(r'[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]', s))
        has_pl_words = bool(re.search(r'\b(Misja|Poziom|Punkty|Czas|Sukces|Błąd|Wynik|Zwycięstwo|Przegrana|Świetnie|Brawo|Węch|Wzrok|Słuch|Echolokacja)\b', s, re.IGNORECASE))
        if has_pl_char or has_pl_words:
            clean = s.strip().replace('\r\n', ' ').replace('\n', ' ')
            if len(clean) > 1 and not clean.startswith('data:image'):
                matches.append(clean)
    
    results[jf] = list(set(matches))
    print(f"{jf}: {len(results[jf])} strings with Polish content")

with open('all_js_polish_candidates.json', 'w', encoding='utf-8') as out:
    json.dump(results, out, indent=2, ensure_ascii=False)

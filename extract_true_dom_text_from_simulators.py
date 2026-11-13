import sys, glob, re, json
from html.parser import HTMLParser

sys.stdout.reconfigure(encoding='utf-8')

class HTMLTextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.texts = []
        self.attrs_text = []

    def handle_data(self, data):
        d = data.strip()
        if d and not d.startswith('${') and not d.endswith('}'):
            self.texts.append(d)

    def handle_starttag(self, tag, attrs):
        for attr, val in attrs:
            if val and attr in ['title', 'placeholder', 'aria-label']:
                self.attrs_text.append(val.strip())

js_files = sorted(glob.glob('js/*-simulators.js'))

true_user_strings = set()

for jf in js_files:
    with open(jf, 'r', encoding='utf-8') as f:
        c = f.read()

    # 1. Single & Double quotes (non-empty, length > 1, contains Polish or relevant game words)
    for q in re.findall(r"'([^'\n\r]+)'", c) + re.findall(r'"([^"\n\r]+)"', c):
        q_strip = q.strip()
        if len(q_strip) > 1 and not q_strip.startswith('#') and not q_strip.startswith('rgba') and not q_strip.startswith('var(') and not q_strip.startswith('http'):
            # If contains Polish chars or game words
            if re.search(r'[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]', q_strip) or re.search(r'\b(Misja|Poziom|Punkty|Czas|Sukces|Błąd|Wynik|Zwycięstwo|Przegrana|Węch|Wzrok|Słuch|Echolokacja|Węszy|Rozproszenie)\b', q_strip):
                # If it's HTML, parse it
                if '<' in q_strip and '>' in q_strip:
                    parser = HTMLTextExtractor()
                    try:
                        parser.feed(q_strip)
                        for t in parser.texts + parser.attrs_text:
                            true_user_strings.add(t)
                    except Exception:
                        true_user_strings.add(q_strip)
                else:
                    true_user_strings.add(q_strip)

    # 2. Template literals
    for t in re.findall(r'`([^`]+)`', c):
        # Parse template as HTML
        # First clean out ${...} by replacing with a placeholder space
        cleaned = re.sub(r'\$\{[^}]+\}', ' ', t)
        if '<' in cleaned and '>' in cleaned:
            parser = HTMLTextExtractor()
            try:
                parser.feed(cleaned)
                for txt in parser.texts + parser.attrs_text:
                    if re.search(r'[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]', txt) or re.search(r'\b(Misja|Poziom|Punkty|Czas|Sukces|Błąd|Wynik|Zwycięstwo|Przegrana|Węch|Wzrok|Słuch|Echolokacja|Węszy|Rozproszenie)\b', txt):
                        true_user_strings.add(txt)
            except Exception:
                pass
        else:
            t_strip = cleaned.strip()
            if t_strip and (re.search(r'[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]', t_strip) or re.search(r'\b(Misja|Poziom)\b', t_strip)):
                true_user_strings.add(t_strip)

print(f"Total REAL user-visible strings extracted from simulator JS: {len(true_user_strings)}")

with open('true_user_strings_simulators.json', 'w', encoding='utf-8') as f:
    json.dump(sorted(list(true_user_strings)), f, indent=2, ensure_ascii=False)

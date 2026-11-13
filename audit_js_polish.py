import sys, glob, re, json
sys.stdout.reconfigure(encoding='utf-8')

js_files = sorted(glob.glob('js/*-simulators.js'))
print(f"Auditing {len(js_files)} simulator files...")

total_strings = 0
file_details = {}

for jf in js_files:
    with open(jf, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find template literals, single quotes, double quotes containing Polish or game terms
    # We want to catch:
    # 1. Any string with Polish characters: ąćęłńóśźżĄĆĘŁŃÓŚŹŻ
    # 2. Game terms: Misja, Poziom, Ukończona, Zwycięstwo, Porażka, Cel, Czas, Punkty, Wynik, Koniec gry
    
    # Match backtick strings (multiline allowed)
    backtick_strings = re.findall(r'`([^`]+)`', content)
    # Match single-quoted strings
    sq_strings = re.findall(r"'([^'\n\r]+)'", content)
    # Match double-quoted strings
    dq_strings = re.findall(r'"([^"\n\r]+)"', content)
    
    candidates = backtick_strings + sq_strings + dq_strings
    
    polish_terms = []
    for s in candidates:
        s_clean = s.strip()
        if not s_clean or len(s_clean) < 2:
            continue
        # Skip pure html or css or selectors
        if s_clean.startswith('<div class=') and len(s_clean) < 30 and 'Misja' not in s_clean:
            pass
        if re.search(r'[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]', s_clean) or any(k in s_clean for k in [
            'Misja', 'Ukończona', 'Koniec gry', 'Zwycięstwo', 'Porażka', 'Znalazłeś', 'Poziom', 'Wynik', 'Prawidłowo', 'Błąd'
        ]):
            polish_terms.append(s_clean)
            
    file_details[jf] = polish_terms
    total_strings += len(polish_terms)
    print(f"{jf}: {len(polish_terms)} strings")

print(f"\nTotal potential Polish/game strings across all simulators: {total_strings}")

with open('all_simulator_polish_strings.json', 'w', encoding='utf-8') as f_out:
    json.dump(file_details, f_out, ensure_ascii=False, indent=2)
print("Saved to all_simulator_polish_strings.json")

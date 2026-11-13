import sys, glob, re, json
sys.stdout.reconfigure(encoding='utf-8')

js_files = sorted(glob.glob('js/*-simulators.js'))

pl_char_pattern = re.compile(r'[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]')
pl_word_pattern = re.compile(r'\b(Misja|Poziom|Zwycięstwo|Przegrana|Świetnie|Brawo|Prawidłowo|Błąd|Węch|Wzrok|Słuch|Echolokacja|Zmysł|Zmysły|Rozproszenie|Węszy|Polowanie|Sekunda|Sekundy|Minuta|Minuty|Punkty|Czas|Cel|Cele|Odyniec|Dzik|Niedźwiedź|Pszczoła|Żmija|Orzeł|Delfin|Rekin|Ośmiornica|Wilk|Kot|Pies|Sowa|Nietoperz|Jeż|Lis)\b', re.IGNORECASE)

all_strings_by_file = {}
global_unique_strings = set()

for jf in js_files:
    with open(jf, 'r', encoding='utf-8') as f:
        c = f.read()

    found_in_file = set()

    # 1. Single quotes
    for s in re.findall(r"'([^'\r\n]*)'", c):
        found_in_file.add(s)

    # 2. Double quotes
    for s in re.findall(r'"([^"\r\n]*)"', c):
        found_in_file.add(s)

    # 3. Backtick templates (multiline)
    for s in re.findall(r'`([^`]*)`', c):
        # We also extract the literal text parts outside of ${...}
        # and if it's a short template like `Misja ${currentLevelIdx + 1} Ukończona!`, record full template and parts
        found_in_file.add(s)
        parts = re.split(r'\$\{[^}]+\}', s)
        for p in parts:
            p_strip = p.strip()
            if p_strip:
                found_in_file.add(p_strip)

    # Filter to Polish content
    pl_in_file = set()
    for s in found_in_file:
        s_clean = s.strip()
        if not s_clean:
            continue
        if s_clean.startswith('data:image') or s_clean.startswith('http') or s_clean.startswith('rgba') or s_clean.startswith('#'):
            continue
        if pl_char_pattern.search(s_clean) or pl_word_pattern.search(s_clean):
            pl_in_file.add(s_clean)
            global_unique_strings.add(s_clean)

    all_strings_by_file[jf] = sorted(list(pl_in_file))
    print(f"{jf}: {len(pl_in_file)} Polish strings found")

print(f"\nTOTAL unique Polish strings across all simulators: {len(global_unique_strings)}")

with open('all_simulator_strings_extracted.json', 'w', encoding='utf-8') as out:
    json.dump({
        'by_file': all_strings_by_file,
        'unique_total': len(global_unique_strings),
        'all_unique': sorted(list(global_unique_strings))
    }, out, indent=2, ensure_ascii=False)

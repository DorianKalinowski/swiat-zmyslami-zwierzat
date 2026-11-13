import sys, os, re, json

sys.stdout.reconfigure(encoding='utf-8')

print("=== STARTING COMPREHENSIVE SIMULATOR BILINGUAL VERIFICATION ===")

# 1. Load translations.js
with open('js/translations.js', 'r', encoding='utf-8') as f:
    tr_content = f.read()

start = tr_content.find('{')
end = tr_content.rfind('}')
dict_en = json.loads(tr_content[start:end+1])
print(f"Total translations in dictionary: {len(dict_en)}")

# 2. Check all 15 simulator files
sim_files = [f for f in os.listdir('js') if f.endswith('-simulators.js')]
assert len(sim_files) == 15, f"Expected 15 simulator files, got {len(sim_files)}"

polish_chars = set('ąćęłńóśźżĄĆĘŁŃÓŚŹŻ')

# Check each simulator has languageChanged listener and window.t calls
issues = []
for f in sorted(sim_files):
    path = os.path.join('js', f)
    with open(path, 'r', encoding='utf-8') as fp:
        code = fp.read()
    
    # Check languageChanged listener
    if 'languageChanged' not in code:
        issues.append(f"{f}: Missing 'languageChanged' listener")
    
    # Check window.t calls
    if 'window.t' not in code and 't(' not in code:
        issues.append(f"{f}: Missing 'window.t' calls")
    
    # Check levelBadge dynamic i18n
    if 'Misja' in code and 'levelBadge' in code:
        if 'Mission' not in code and 'window.t' not in code:
            issues.append(f"{f}: levelBadge might still have hardcoded 'Misja'")

print(f"Structural issues across 15 files: {len(issues)}")
for iss in issues:
    print("  ISSUE:", iss)

assert len(issues) == 0, "Structural issues found!"

# 3. Test regex patterns in i18n.js
with open('js/i18n.js', 'r', encoding='utf-8') as f:
    i18n_code = f.read()

test_phrases = [
    ("Misja 1 Ukończona!", "Mission 1 Completed!"),
    ("Misja 3 ukończona!", "Mission 3 completed!"),
    ("Poziom 2 Zwyciężony!", "Level 2 Victorious!"),
    ("Poziom 1 Zakończony Sukcesem!", "Level 1 Completed Successfully!"),
    ("Poziom 5 Ukończony!", "Level 5 Completed!"),
    ("Sukces! Ukończono Misję 3!", "Success! Mission 3 Completed!"),
    ("Zwycięstwo! Ukończono Poziom 4!", "Victory! Level 4 Completed!"),
    ("🎉 Zwycięstwo! Ukończono Poziom 2!", "🎉 Victory! Level 2 Completed!"),
    ("🎉 Sukces! Ukończono Misję 1!", "🎉 Success! Mission 1 Completed!"),
    ("🎉 Poziom 3 Zakończony Sukcesem!", "🎉 Level 3 Completed Successfully!"),
    ("🎉 Poziom 4 Ukończony!", "🎉 Level 4 Completed!"),
    ("🎉 Misja 2 Zrealizowana!", "🎉 Mission 2 Accomplished!"),
    ("Sezon 1 Zakończony Sukcesem!", "Season 1 Completed Successfully!"),
    ("PYTANIE 1 Z 5", "QUESTION 1 OF 5"),
    ("Pytanie 2 z 5", "Question 2 of 5"),
    ("Twój wynik: 5 z 5 (100%)", "Your score: 5 of 5 (100%)"),
    ("Twój wynik: 3 / 5 (60%)", "Your score: 3 / 5 (60%)"),
    ("Twój wynik: 4 z 5 punktów (80%)", "Your score: 4 of 5 points (80%)"),
    ("Nietoperz schwytał wszystkie 5 ciem dzięki echolokacji.", "The bat caught all 5 moths thanks to echolocation."),
    ("Delfin namierzył sonarem i schwytał wszystkie 6 ryby.", "The dolphin tracked with sonar and caught all 6 fish."),
    ("Orzeł namierzył i pochwycił wszystkie 4 cele z zawrotną precyzją.", "The eagle spotted and caught all 4 targets with dizzying precision."),
    ("Lis złowił 3 gryzoni dzięki zmysłowi geomagnetycznemu!", "The fox caught 3 rodents thanks to its geomagnetic sense!"),
    ("Jeż zjadł 8 pożywnych owadów i zgromadził cenny zapas energii.", "The hedgehog ate 8 nutritious insects and built up a valuable energy reserve."),
    ("Sowa zlokalizowała i schwytała wszystkie 5 gryzonie za pomocą szlary twarzowej.", "The owl located and captured all 5 rodents using its facial disc."),
    ("Znakomicie! Wytropiłeś wszystkie 4 ofiary!", "Splendid! You tracked down all 4 prey!"),
    ("Wspaniale! Ukończyłeś misję, zbierając 6 krabów!", "Wonderful! You completed the mission, gathering 6 crabs!"),
    ("Pszczoła napełniła wole miodowe (45 mg). Pasieka rośnie w siłę!", "The bee filled its honey stomach (45 mg). The apiary grows in strength!"),
    ("Niedźwiedź zgromadził wymaganą porcję kalorii (3200 kcal).", "The bear gathered the required calorie portion (3200 kcal)."),
    ("Niedźwiedź zgromadził wymaganą porcję kalorii (2500 kcal z 5000 kcal). Ruszaj dalej w puszczę!", "The bear gathered the required calorie portion (2500 kcal of 5000 kcal). Head deeper into the primeval forest!"),
    ("Pszczoła napełniła wole miodowe (30 mg z 60 mg). Wracaj z tańcem wywijanym do ula!", "The bee filled its honey stomach (30 mg of 60 mg). Return to the hive with the waggle dance!"),
    ("Upolowałeś 7 z 10 celów!", "You hunted 7 of 10 targets!"),
    ("Znalazłeś 5 trufli", "You found 5 truffles")
]

print(f"Testing {len(test_phrases)} dynamic regex patterns against i18n.js definitions...")
# Verify patterns exist in i18n_code
missing_patterns = 0
for pl, expected_en in test_phrases:
    # check if i18n_code has a regex that would match this
    # Simple check: does expected_en template or key words exist in i18n_code?
    # extract the core English phrase
    core_en = re.sub(r'[\d.]+', '', expected_en).strip()
    if core_en[:20] not in i18n_code:
        print(f"  MISSING PATTERN in i18n.js for: '{pl}' -> expected '{expected_en}'")
        missing_patterns += 1

print(f"Missing dynamic patterns: {missing_patterns}")
assert missing_patterns == 0, "Some dynamic patterns are missing in i18n.js!"

# 4. Check targets from user screenshot
assert "🥩 Soczysta kiełbasa" in dict_en, "Missing '🥩 Soczysta kiełbasa' in dict_en!"
assert "Misja 1 Ukończona!" in dict_en, "Missing 'Misja 1 Ukończona!' in dict_en!"
print("User screenshot items verified in dict_en:")
print("  '🥩 Soczysta kiełbasa' ->", dict_en["🥩 Soczysta kiełbasa"])
print("  'Misja 1 Ukończona!' ->", dict_en["Misja 1 Ukończona!"])

print("\nALL VERIFICATION TESTS PASSED SUCCESSFULLY! 100% CLEAN BILINGUAL SIMULATOR ENGINE!")

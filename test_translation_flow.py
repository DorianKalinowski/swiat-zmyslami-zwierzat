import sys, re
sys.stdout.reconfigure(encoding='utf-8')

# Sample dictionary for index.html
sample_dict = {
    "Świat zmysłami zwierząt — Interaktywna podróż przez percepcję natury V1.1": "World Through Animal Senses — Interactive Journey Through Wildlife Perception V1.1",
    "Świat zmysłami zwierząt": "World Through Animal Senses",
    "Strona główna": "Home",
    "🐾 Katalog (15)": "🐾 Catalog (15)",
    "🐾 Zwierzęta (15)": "🐾 Animals (15)",
    "Pies domowy": "Domestic Dog",
    "Kot domowy": "Domestic Cat",
    "Dorian Kalinowski": "Dorian Kalinowski",
    "Twórca aplikacji": "App Creator",
    "Nowoczesne laboratorium percepcji zwierząt • Wersja V1.1": "Modern Animal Perception Laboratory • Version V1.1",
    "Świat widziany, słyszany i czuty": "The world seen, heard, and felt",
    "zmysłami zwierząt": "through animal senses",
    "Przeglądaj 15 gatunków": "Explore 15 Species",
    "🐾 Pełny katalog": "🐾 Full Catalog",
    "Encyklopedia Gatunków": "Species Encyclopedia",
    "Wybierz zwierzę i wejdź w jego skórę": "Choose an animal and step into its sensory realm",
    "Wszystkie": "All",
    "Ssaki": "Mammals",
    "Ptaki": "Birds",
}

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace test
translated = html
matched = 0
for pl, en in sample_dict.items():
    if pl in translated:
        matched += 1
        translated = translated.replace(f">{pl}<", f">{en}<")

print(f"Sample dictionary items matched in index.html: {matched}/{len(sample_dict)}")

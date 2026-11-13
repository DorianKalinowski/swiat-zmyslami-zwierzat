# compile_translations_bundle.py
import sys, os, json, importlib

sys.stdout.reconfigure(encoding='utf-8')

dict_modules = [
    'dict_global', 'dict_index', 'trans_mammals1', 'trans_mammals1_ext',
    'trans_batch1', 'trans_batch1_final', 'trans_batch2', 'trans_batchA',
    'trans_batchA_final', 'dict_group1', 'dict_sowa_final',
    'dict_pair1_bear_fox', 'dict_pair2_bee_hedgehog', 'dict_pair3_eagle_dolphin', 'dict_pair4_shark_octopus'
]

combined = {}
for m in dict_modules:
    mod = importlib.import_module(m)
    for attr in dir(mod):
        if attr.startswith('__'):
            continue
        v = getattr(mod, attr)
        if isinstance(v, dict):
            for k, val in v.items():
                if isinstance(k, str) and isinstance(val, str):
                    combined[k] = val

print(f"Base dictionary entries from 15 modules: {len(combined)}")

# Add common UI, simulator, quiz, and navigation translations
EXTRA_TRANSLATIONS = {
    # Language Switcher
    "Wybór języka / Language selection": "Language selection",
    "Język polski": "Polish language",
    "American English": "American English",
    "Polski": "Polish",
    "PL": "PL",
    "USA": "USA",

    # Catalog & Search
    "Katalog Gatunków (Skalowalny)": "Species Catalog (Scalable)",
    "🐾 Wybierz Zwierzę": "🐾 Select Animal",
    "Odkryj percepcję świata oczami i uszami poszczególnych gatunków.": "Discover how different species perceive reality through their unique senses.",
    "Szukaj zwierzęcia (np. kot, pies, orzeł, ssaki)...": "Search animal (e.g. cat, dog, eagle, mammals)...",
    "Wszystkie": "All",
    "Ssaki": "Mammals",
    "Ptaki": "Birds",
    "Morskie": "Marine",
    "Gady & Płazy": "Reptiles & Amphibians",
    "Owady": "Insects",
    "Dostępny": "Available",
    "Wkrótce": "Coming Soon",
    "Zobacz zmysły →": "Explore senses →",
    "W opracowaniu": "In development",
    "Zamknij": "Close",
    "Zamknij okno": "Close window",

    # Animal Registry Names & Descriptions
    "Pies domowy": "Domestic Dog",
    "300 mln receptorów węchu, słuch do 65 kHz, widzenie dwubarwne i 10 poziomów gry tropiącej.": "300 million scent receptors, hearing up to 65 kHz, dichromatic vision, and 10 levels of tracking game.",
    "Kot domowy": "Domestic Cat",
    "Pionowa źrenica noktowizyjna, ultradźwięki 85 kHz, wibrysy i 10 poziomów nocnego refleksu.": "Vertical slit night-vision pupils, 85 kHz ultrasound hearing, whiskers, and 10 nocturnal reflex levels.",
    "Dzik euroazjatycki": "Eurasian Wild Boar",
    "Węch podziemny (tabakierka), oręż (szable i fajki) oraz 10-poziomowa gra żerowania leśnego.": "Subterranean olfaction (snout disc), tusks (cutters and whetters), and 10-level forest foraging quest.",
    "Wilk szary": "Gray Wolf",
    "Akustyczne wycie niosące się na 15 km, lęk przed człowiekiem i 10 poziomów misji watahy.": "Acoustic howl carrying 15 km, natural wariness of humans, and 10-level pack hierarchy simulation.",
    "Nietoperz (Nocek duży)": "Greater Mouse-Eared Bat",
    "Ultradźwiękowa echolokacja do 120 kHz, widzenie uszami i 10 poziomów sonaru jaskiniowego.": "Ultrasonic echolocation up to 120 kHz, auditory vision, and 10 levels of subterranean cave sonar.",
    "Żmija zygzakowata": "Common European Viper",
    "Sejsmiczne wykrywanie drgań gleby, narząd Jacobsona, jad i 10-poziomowa gra skradania.": "Seismic substrate vibration sensing, Jacobson's organ, venom apparatus, and 10-level stealth stalk.",
    "Sowa (Płomykówka)": "Barn Owl",
    "Asymetryczne uszy do triangulacji 3D, szlara twarzowa, bezszelestny lot i 10-poziomowe łowy nocne.": "Asymmetrical ears for 3D acoustic triangulation, facial disc, silent plumage, and 10-level night hunt.",
    "Niedźwiedź brunatny": "Brown Bear",
    "Węch z 20 km (7x czulszy niż psa), sprint 50 km/h, zasady TPN i 10 poziomów szlaku bieszczadzkiego.": "Olfaction from 20 km (7x keener than a hound), 50 km/h sprint, park safety, and 10 Bieszczady missions.",
    "Pszczoła miodna": "Western Honeybee",
    "Widzenie w ultrafiolecie (UV), taniec wywijany von Frischa, ładunek +100V i 10-poziomowy zbiór nektaru.": "Ultraviolet (UV) vision, von Frisch's waggle dance, +100V flight charge, and 10-level nectar quest.",
    "Lis rudy": "Red Fox",
    "Zmysł geomagnetyczny (skok na NE z 73% sukcesu), słuch pod 1 m śniegu i 10-poziomowa gra myszkowania.": "Geomagnetic compass (NE leap with 73% accuracy), hearing under 1 m snow, and 10-level mousing game.",
    "Jeż zachodni": "Western European Hedgehog",
    "Odporność na jad żmii, narząd Jacobsona (samosmarowanie puszystą pianą), słuch do 45 kHz i 10-poziomowe żerowanie.": "Adder venom immunity, Jacobson's organ (foamy self-anointing), 45 kHz ultrasound, and 10 night rounds.",
    "Orzeł przedni (i Bielik)": "Golden Eagle (& White-Tailed)",
    "Wzrok 8-krotnie ostrzejszy, dwa dołki siatkówki, widzenie UV i 10-poziomowy lot szybowcowy z chmur.": "8x telescopic visual acuity, dual foveae, UV vision, and 10 levels of cloud-high soaring.",
    "Delfin butlonosy": "Bottlenose Dolphin",
    "Akustyczny sonar 3D (echolokacja), soczewka tłuszczowa melona, gwizdy podpisowe i 10 poziomów łowów głębinowych.": "3D acoustic sonar (echolocation), forehead melon lens, signature whistles, and 10 deep-sea missions.",
    "Żarłacz błękitny": "Blue Shark (& Hammerhead)",
    "Elektrorecepcja ampułek Lorenziniego wykrywająca nanowolty, linia boczna i 10 poziomów patrolu rafy.": "Ampullae of Lorenzini nanovolt electroreception, lateral line, and 10 reef patrol arcade levels.",
    "Ośmiornica zwyczajna": "Common Octopus",
    "500 mln neuronów w ramionach, kamuflaż chromatoforów w 200 ms, 3 serca i 10 poziomów szczelin skalnych.": "500 million neurons across 8 arms, 200 ms chromatophore camouflage, 3 hearts, and 10 reef labyrinth levels.",

    # Common Simulator / Quiz terms
    "Pytanie": "Question",
    "Twój wynik:": "Your score:",
    "Następne pytanie": "Next question",
    "Zagraj ponownie": "Play again",
    "Odpowiedz na pytanie:": "Answer the question:",
    "Świetnie! Poprawna odpowiedź.": "Great job! Correct answer.",
    "Niestety, to nie ta odpowiedź.": "Incorrect answer.",
    "Wyjaśnienie:": "Explanation:",
    "Wynik:": "Score:",
    "Poziom:": "Level:",
    "Misja:": "Mission:",
    "Gratulacje! Ukończono wszystkie poziomy!": "Congratulations! All levels completed!",
    "Koniec gry! Spróbuj ponownie.": "Game over! Try again.",
    "Ukończono!": "Completed!",
    "Porażka!": "Failed!",
    "Czas minął!": "Time is up!",
    "Zwycięstwo!": "Victory!",
    "Start": "Start",
    "Pauza": "Pause",
    "Wznów": "Resume",
    "Restart": "Restart",
    "Dźwięk:": "Sound:",
    "Włącz dźwięk": "Enable sound",
    "Wyłącz dźwięk": "Mute sound",
    "Kolejny poziom": "Next level",
    "Punkty:": "Points:",
    "Życia:": "Lives:",
    "Czas:": "Time:",
    "Sekundy:": "Seconds:",
    "Prędkość:": "Speed:",
    "Częstotliwość:": "Frequency:",
    "Dystans:": "Distance:",
    "Kąt:": "Angle:",
    "Tryb:": "Mode:",
    "Status:": "Status:",
    "Cel:": "Target:",
    "Wykryto:": "Detected:",
    "i": "and"
}

combined.update(EXTRA_TRANSLATIONS)

print(f"Total dictionary entries after common extras: {len(combined)}")

# Write to js/translations.js
js_content = "/* ============================================================\n"
js_content += "   translations.js — American English Translation Dictionary\n"
js_content += "   Comprehensive i18n Dictionary for 'Świat zmysłami zwierząt V1.1'\n"
js_content += "   ============================================================ */\n\n"
js_content += "window.TRANSLATIONS_EN = " + json.dumps(combined, ensure_ascii=False, indent=2) + ";\n"

with open('js/translations.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"Wrote js/translations.js with {len(combined)} entries successfully!")

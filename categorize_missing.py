import sys, json, re
sys.stdout.reconfigure(encoding='utf-8')

with open('missing_simulator_translations.json', 'r', encoding='utf-8') as f:
    missing = json.load(f)

print(f"Total missing: {len(missing)}")

categories = {
    'html_fragment': [],
    'quiz_content': [],
    'overlay_or_feedback': [],
    'level_or_target': [],
    'canvas_or_hud': [],
    'other': []
}

for s in missing:
    if '<' in s and '>' in s:
        categories['html_fragment'].append(s)
    elif any(w in s for w in ['?', 'Któr', 'Dlaczego', 'Co rob', 'Jak ', 'Czy ', 'Odp']):
        categories['quiz_content'].append(s)
    elif any(w in s for w in ['Gratulacje', 'Misja', 'Poziom', 'Ukończon', 'Przegran', 'Zwycięstw', 'Czas minął', 'Punkty']):
        categories['overlay_or_feedback'].append(s)
    elif any(e in s for e in ['🥩', '🦴', '🎾', '🍏', '🪵', '🔑', '👟', '🧤', '🥪', '🥏', '🧣', '🧢', '🦌', '📜', '🎒', '🍶', '🔦', '☕', '🧭', '🎿', '⛏️', '🫖', '🩹', '📻', '🪢', '🧨', '👤', '🍎', '🍓', '🐟', '🍯', '🍂', '🌰', '🍄', '🐛', '🪱', '🌿', '🌱', '🪨', '🐁', '🐀', '🦋', '🦗', '🐝', '🦟', '🪰', '🦀', '🦐', '🦑', '🐚', '⚡', '🌊', '❄️', '🏡', '🛋️', '🌳', '🏙️', '🌧️', '🦉', '🌲', '🏔️', '🚁', '🎖️', '🐾', '🌾']):
        categories['level_or_target'].append(s)
    elif any(w in s for w in ['Hz', 'kHz', 'Lux', 'nV/cm', 'dB', 'km/h', 'Węszy', 'Wiatr', 'Strach', 'Rozproszenie', 'UKRYTY', 'WIDOCZNY', 'Wzrok', 'Słuch', 'Zmysł']):
        categories['canvas_or_hud'].append(s)
    else:
        categories['other'].append(s)

for cat, items in categories.items():
    print(f"{cat}: {len(items)} items")

with open('missing_categorized.json', 'w', encoding='utf-8') as f:
    json.dump(categories, f, indent=2, ensure_ascii=False)

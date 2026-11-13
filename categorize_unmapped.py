import sys, json
sys.stdout.reconfigure(encoding='utf-8')

with open('final_unmapped_sim_strings.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

# Group items into categories
ranks = []
anatomy_cards = []
crisis_items = []
fragments = []
other = []

for s in items:
    if any(e in s for e in ['📚', '🌲', '👑', '🏆', '⭐', '✨', '🐾', '🦅', '🐬', '🦈', '🐙', '🦉', '🦊', '🐻', '🐝', '🐗', '🐍', '🦔']):
        ranks.append(s)
    elif any(w in s for w in ['A)', 'B)', 'C)', 'Sytuacja', 'ZASADA', 'KROK', 'Scenariusz', 'reakcja', 'REAKCJA']):
        crisis_items.append(s)
    elif len(s) < 20 or s.startswith('!') or s.startswith('(') or s.startswith('.'):
        fragments.append(s)
    elif any(w in s for w in ['Anatomia', 'Narząd', 'Zmysł', 'Oczy', 'Uszy', 'Wibrysy', 'Skóra', 'Płetwa', 'Dziób', 'Skrzydła', 'Ciało', 'Szable', 'Ampułki', 'Szlara']):
        anatomy_cards.append(s)
    else:
        other.append(s)

print(f"Ranks/Badges: {len(ranks)}")
print(f"Crisis/Scenarios: {len(crisis_items)}")
print(f"Anatomy cards: {len(anatomy_cards)}")
print(f"Fragments: {len(fragments)}")
print(f"Other: {len(other)}")

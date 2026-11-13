import sys, json
sys.stdout.reconfigure(encoding='utf-8')

with open('extracted_phrases.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# length distribution
short = []
medium = []
long_p = []
for f, phrases in data.items():
    for p in phrases:
        if len(p) < 30:
            short.append(p)
        elif len(p) < 100:
            medium.append(p)
        else:
            long_p.append(p)

print(f"Short phrases (<30 chars): {len(set(short))}")
print(f"Medium phrases (30-100 chars): {len(set(medium))}")
print(f"Long phrases (>100 chars): {len(set(long_p))}")

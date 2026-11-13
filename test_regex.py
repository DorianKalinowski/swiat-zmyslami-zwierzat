import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('js/dog-simulators.js', 'r', encoding='utf-8') as f:
    c = f.read()

# Simple and safe regex for single quotes without newline inside
matches = re.findall(r"'([^'\n\r]*)'", c)
print(f"Matches count: {len(matches)}")
print('🥩 Soczysta kiełbasa in matches:', '🥩 Soczysta kiełbasa' in matches)

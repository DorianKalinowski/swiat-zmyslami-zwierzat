import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('js/wolf-simulators.js', 'r', encoding='utf-8') as f:
    c = f.read()

m = re.search(r'function initWolfTrackingGame\s*\(\)\s*\{([\s\S]*?)(?=\nfunction|\n\/\*|\Z)', c)
if m:
    lines = m.group(0).split('\n')
    print(f"initWolfTrackingGame has {len(lines)} lines")
    for i, l in enumerate(lines):
        if any(w in l for w in ['updateHUD', 'endGame', 'fillText', 'currentTarget', 'overlayTitle', 'levelBadge']):
            print(f"{i+1}: {l.strip()[:100]}")

import glob
import re

missing = [
    'animal-catalog-trigger', 'hotspot-dot', 'hotspot-pulse', 'insight-col',
    'insight-list', 'item-emoji', 'viper-crisis-card', 'insight-badge',
    'crisis-option-btn', 'fact-pill-group', 'btn-outline', 'active-danger',
    'hearing', 'hotspot-body', 'hotspot-ears', 'hotspot-eyes', 'hotspot-mouth',
    'hotspot-tail', 'smell', 'touch', 'vision', 'sensory-grid'
]

for cls in missing:
    found = []
    for f in glob.glob('*.html'):
        with open(f, encoding='utf-8') as fh:
            content = fh.read()
            if cls in content:
                for m in re.finditer(r'<[^>]*class="[^"]*' + re.escape(cls) + r'[^"]*"[^>]*>', content):
                    found.append((f, m.group(0)))
    print(f"=== Class: {cls} ({len(found)} matches) ===")
    for f, snip in found[:3]:
        print(f"  {f}: {snip}")

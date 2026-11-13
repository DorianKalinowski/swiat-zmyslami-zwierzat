import sys, glob, re
sys.stdout.reconfigure(encoding='utf-8')

for animal in ['bat', 'bear', 'bee', 'fox', 'owl', 'viper', 'dolphin', 'eagle', 'hedgehog', 'cat']:
    jf = f'js/{animal}-simulators.js'
    with open(jf, 'r', encoding='utf-8') as f:
        c = f.read()
    calls = re.findall(r'endGame\s*\(([^;]+)\)', c)
    print(f"=== {animal} ({len(calls)} calls to endGame) ===")
    for call in calls:
        print("  ", call.strip()[:100].replace('\n', ' '))

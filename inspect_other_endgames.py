import sys, re
sys.stdout.reconfigure(encoding='utf-8')

for animal in ['bat', 'bear', 'bee', 'fox', 'owl', 'viper']:
    jf = f'js/{animal}-simulators.js'
    with open(jf, 'r', encoding='utf-8') as f:
        content = f.read()
    match = re.search(r'function\s+endGame\s*\([^)]*\)\s*\{([\s\S]*?)(?=\n  function|\nfunction|\n\/\*|$)', content)
    if match:
        print(f"\n================ {animal} endGame ================")
        print(match.group(0)[:800])

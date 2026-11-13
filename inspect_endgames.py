import sys, glob, re
sys.stdout.reconfigure(encoding='utf-8')

js_files = sorted(glob.glob('js/*-simulators.js'))
for jf in js_files:
    with open(jf, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract endGame/gameOver function block
    match = re.search(r'function\s+(endGame|gameOver)\s*\([^)]*\)\s*\{([\s\S]*?)(?=\n  function|\nfunction|\n\/\*|$)', content)
    if match:
        body = match.group(2)
        # find string assignments or innerHTML/textContent
        strings = re.findall(r'(?:innerHTML|textContent)\s*=\s*[`\'"]([\s\S]*?)[`\'"]', body)
        print(f"\n=== {jf} ({match.group(1)}) ===")
        for s in strings:
            s_clean = s.strip()
            # truncate for display
            first_line = s_clean.split('\n')[0]
            print(f"  -> {first_line[:90]}")

import sys, glob, re
sys.stdout.reconfigure(encoding='utf-8')

js_files = sorted(glob.glob('js/*-simulators.js'))
for jf in js_files:
    with open(jf, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check overlays
    has_overlay_title = 'overlayTitle' in content
    has_overlay_desc = 'overlayDesc' in content
    has_levels = 'const levels' in content or 'let levels' in content
    
    # Check for Polish keywords in endGame or victory
    wins = re.findall(r'overlayTitle\.(?:textContent|innerHTML)\s*=\s*[`\'"]([^`\'"\n\r]+)[`\'"]', content)
    
    print(f"{jf:<26} overlayTitle: {len(wins)} assignments, sample: {wins[:2] if wins else 'none'}")

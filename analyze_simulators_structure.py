import sys, glob, re
sys.stdout.reconfigure(encoding='utf-8')

js_files = sorted(glob.glob('js/*-simulators.js'))

for jf in js_files:
    animal = jf.replace('js\\', '').replace('-simulators.js', '').replace('js/', '')
    with open(jf, 'r', encoding='utf-8') as f:
        c = f.read()

    # Find functions defined
    funcs = re.findall(r'function\s+([a-zA-Z0-9_]+)\s*\(', c)
    # Check for quiz
    has_quiz = any('quiz' in fn.lower() for fn in funcs) or 'quiz' in c.lower()
    # Check for minigame
    has_game = any('game' in fn.lower() or 'play' in fn.lower() or 'hunt' in fn.lower() or 'scent' in fn.lower() or 'sonar' in fn.lower() for fn in funcs)
    
    print(f"{animal:12} | Quiz: {has_quiz!s:5} | Game: {has_game!s:5} | Funcs: {', '.join(funcs[:6])}")

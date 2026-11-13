import sys, glob, re, json
sys.stdout.reconfigure(encoding='utf-8')

js_files = sorted(glob.glob('js/*-simulators.js'))

data_by_animal = {}

for jf in js_files:
    animal = jf.replace('js\\', '').replace('-simulators.js', '').replace('js/', '')
    with open(jf, 'r', encoding='utf-8') as f:
        c = f.read()

    # Find quiz questions: questions = [...] or quizData = [...]
    # Usually: q: '...', options: [...], explanation: '...'
    questions = []
    # Match questions objects
    q_matches = re.finditer(r'q(?:uestion)?:\s*[\'"`]([^\'"`]+)[\'"`]\s*,\s*options:\s*\[([\s\S]*?)\]\s*,\s*(?:correct|answer):\s*[^,\n]+\s*,\s*explain(?:ation)?:\s*[\'"`]([^\'"`]+)[\'"`]', c)
    for m in q_matches:
        q_text = m.group(1).strip()
        opts_raw = m.group(2)
        opts = [o.strip() for o in re.findall(r'[\'"`]([^\'"`]+)[\'"`]', opts_raw)]
        exp_text = m.group(3).strip()
        questions.append({
            'q': q_text,
            'options': opts,
            'explain': exp_text
        })

    # Find levels: name: '...', desc: '...', targets: [...]
    levels = []
    lvl_matches = re.finditer(r'name:\s*[\'"`]([^\'"`]+)[\'"`]\s*,\s*desc:\s*[\'"`]([^\'"`]+)[\'"`]', c)
    for m in lvl_matches:
        levels.append({
            'name': m.group(1).strip(),
            'desc': m.group(2).strip()
        })

    data_by_animal[animal] = {
        'questions_count': len(questions),
        'levels_count': len(levels),
        'questions': questions,
        'levels': levels
    }
    print(f"{animal:12}: {len(questions)} quiz questions, {len(levels)} levels")

with open('simulator_structured_data.json', 'w', encoding='utf-8') as f:
    json.dump(data_by_animal, f, indent=2, ensure_ascii=False)

import sys, glob, re, json
sys.stdout.reconfigure(encoding='utf-8')

all_quiz_items = []

for jf in sorted(glob.glob('js/*-simulators.js')):
    animal = jf.replace('js\\', '').replace('-simulators.js', '').replace('js/', '')
    with open(jf, 'r', encoding='utf-8') as f:
        c = f.read()

    m = re.search(r'(?:const|let|var)\s+(\w*[Qq]uiz\w*|\w*[Qq]uestions\w*)\s*=\s*\[', c)
    if not m:
        continue
    start = m.end() - 1
    end = c.find('];', start)
    if end == -1:
        continue
    block = c[start:end+1]

    # Find question objects inside block
    # q: '...', options: [...], explanation: '...'
    q_matches = re.finditer(r'q(?:uestion)?:\s*[\'"`]([^\'"`]+)[\'"`]', block)
    for qm in q_matches:
        q_text = qm.group(1).strip()
        # Find following options
        after_q = block[qm.end():]
        opt_match = re.search(r'options:\s*\[([\s\S]*?)\]', after_q)
        exp_match = re.search(r'explain(?:ation)?:\s*[\'"`]([^\'"`]+)[\'"`]', after_q)
        
        opts = []
        if opt_match:
            opts = [o.strip() for o in re.findall(r'[\'"`]([^\'"`]+)[\'"`]', opt_match.group(1))]

        exp = ''
        if exp_match:
            exp = exp_match.group(1).strip()

        all_quiz_items.append({
            'animal': animal,
            'q': q_text,
            'options': opts,
            'explain': exp
        })

print(f"Total quiz items extracted: {len(all_quiz_items)}")

with open('all_extracted_quizzes.json', 'w', encoding='utf-8') as f:
    json.dump(all_quiz_items, f, indent=2, ensure_ascii=False)

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
    depth = 0
    end = -1
    for idx in range(start, len(c)):
        if c[idx] == '[':
            depth += 1
        elif c[idx] == ']':
            depth -= 1
            if depth == 0:
                end = idx
                break
    if end == -1:
        continue
    block = c[start:end+1]

    # Split into individual question objects
    q_indices = [m.start() for m in re.finditer(r'\bq:\s*[\'"`]', block)]
    for i, idx in enumerate(q_indices):
        next_idx = q_indices[i+1] if i+1 < len(q_indices) else len(block)
        chunk = block[idx:next_idx]

        q_m = re.search(r'\bq:\s*([\'"`])([\s\S]*?)\1', chunk)
        q_text = q_m.group(2).strip() if q_m else ''

        opts_m = re.search(r'options:\s*\[([\s\S]*?)\]', chunk)
        opts = []
        if opts_m:
            opts = [t.strip() for q, t in re.findall(r'([\'"`])([\s\S]*?)\1', opts_m.group(1))]

        exp_m = re.search(r'(?:explanation|explain):\s*([\'"`])([\s\S]*?)\1', chunk)
        exp_text = exp_m.group(2).strip() if exp_m else ''

        all_quiz_items.append({
            'animal': animal,
            'q': q_text,
            'options': opts,
            'explain': exp_text
        })

print(f"Cleanly extracted quiz items: {len(all_quiz_items)}")
with open('all_quizzes_clean.json', 'w', encoding='utf-8') as f:
    json.dump(all_quiz_items, f, indent=2, ensure_ascii=False)

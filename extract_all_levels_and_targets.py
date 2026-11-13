import sys, glob, re, json
sys.stdout.reconfigure(encoding='utf-8')

all_levels = []

for jf in sorted(glob.glob('js/*-simulators.js')):
    animal = jf.replace('js\\', '').replace('-simulators.js', '').replace('js/', '')
    with open(jf, 'r', encoding='utf-8') as f:
        c = f.read()

    # Find levels or seasons array: const levels = [...] or const seasons = [...]
    m = re.search(r'(?:const|let|var)\s+(\w*[Ll]evels\w*|\w*[Ss]easons\w*)\s*=\s*\[', c)
    if not m:
        continue
    start = m.end() - 1
    # Match matching bracket
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
    
    # Extract each level object
    # name: '...', desc: '...'
    lvl_names = re.findall(r'name:\s*[\'"`]([^\'"`]+)[\'"`]', block)
    lvl_descs = re.findall(r'desc:\s*[\'"`]([^\'"`]+)[\'"`]', block)
    
    # Extract all target names inside this block
    # targets: [ { name: '...', emoji: '...' } ] or food, prey, etc.
    target_names = re.findall(r'(?:name|label|type):\s*[\'"`]([^\'"`]+)[\'"`]', block)
    
    all_levels.append({
        'animal': animal,
        'names': lvl_names,
        'descs': lvl_descs,
        'all_target_names': target_names
    })
    print(f"{animal:12}: {len(lvl_names)} levels, {len(lvl_descs)} descriptions, {len(target_names)} target names")

with open('all_extracted_levels.json', 'w', encoding='utf-8') as f:
    json.dump(all_levels, f, indent=2, ensure_ascii=False)

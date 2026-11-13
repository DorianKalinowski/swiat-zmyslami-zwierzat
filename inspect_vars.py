import sys, re
sys.stdout.reconfigure(encoding='utf-8')

def find_context(file_path, var_name):
    with open(file_path, 'r', encoding='utf-8') as f:
        c = f.read()
    for m in re.finditer(re.escape(var_name), c):
        start = max(0, m.start() - 100)
        end = min(len(c), m.end() + 100)
        print(f"=== {file_path} ({var_name}) ===")
        print(c[start:end])
        print()

find_context('js/bat-simulators.js', 'obj.label')
find_context('js/bee-simulators.js', 'h.type')
find_context('js/fox-simulators.js', 'h.type')
find_context('js/octopus-simulators.js', 'z.mode.name')

import json, sys
sys.stdout.reconfigure(encoding='utf-8')

for f in ['rem_kot.html.json', 'rem_dzik.html.json', 'rem_wilk.html.json']:
    with open(f, 'r', encoding='utf-8') as jf:
        arr = json.load(jf)
    print(f"\n# {f}")
    for p in arr:
        print(f"    {repr(p)}: ...,")

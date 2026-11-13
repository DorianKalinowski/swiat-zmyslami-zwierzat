import sys, json
sys.stdout.reconfigure(encoding='utf-8')

with open('rem_batch1.json', 'r', encoding='utf-8') as f:
    b1 = json.load(f)

for i in range(0, len(b1), 40):
    print(f"--- Chunk {i//40 + 1} (items {i} to {min(i+40, len(b1))}) ---")
    for s in b1[i:i+4]:
        print(" ", repr(s[:80]))

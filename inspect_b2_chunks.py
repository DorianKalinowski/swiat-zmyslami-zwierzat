import sys, json
sys.stdout.reconfigure(encoding='utf-8')

with open('rem_batch2.json', 'r', encoding='utf-8') as f:
    b2 = json.load(f)

for i in range(0, len(b2), 40):
    print(f"--- Chunk {i//40 + 1} (items {i} to {min(i+40, len(b2))}) ---")
    for s in b2[i:i+4]:
        print(" ", repr(s[:80]))

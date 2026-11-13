import sys, json, re
sys.stdout.reconfigure(encoding='utf-8')

with open('final_unmapped_sim_strings.json', 'r', encoding='utf-8') as f:
    unmapped = json.load(f)

print(f"Translating {len(unmapped)} remaining strings...")

# Let's inspect the distribution and translate
# We will create dict_simulators_full_remaining.json
# First let's write a helper that matches and translates known patterns and exact strings

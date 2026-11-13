import sys, json, re
sys.stdout.reconfigure(encoding='utf-8')

# Read current translations.js
with open('js/translations.js', 'r', encoding='utf-8') as f:
    c = f.read()

# Extract existing dictionary
start = c.find('{')
end = c.rfind('}')
if start == -1 or end == -1:
    print("Could not find dictionary bounds in translations.js")
    sys.exit(1)

dict_str = c[start:end+1]
existing_dict = json.loads(dict_str)
print(f"Loaded existing dictionary: {len(existing_dict)} entries")

# Merge all new simulator dictionaries
dict_files = [
    'dict_simulators_set1.json',
    'dict_simulators_set2.json',
    'dict_simulators_set3.json',
    'dict_simulators_set4.json',
    'dict_all_levels.json',
    'dict_quiz_batchA.json',
    'dict_quiz_batchB.json',
    'dict_quiz_batchC.json',
    'dict_rem_b1.json',
    'dict_rem_b2.json',
    'dict_summaries_and_sims.json'
]

total_added = 0
for df in dict_files:
    try:
        with open(df, 'r', encoding='utf-8') as f:
            data = json.load(f)
            for k, v in data.items():
                k_clean = k.strip()
                v_clean = v.strip()
                if k_clean and k_clean not in existing_dict:
                    existing_dict[k_clean] = v_clean
                    total_added += 1
                elif k_clean:
                    existing_dict[k_clean] = v_clean
    except Exception as e:
        print(f"Error reading {df}: {e}")

print(f"Added/Updated {total_added} entries from simulator dictionaries.")
print(f"New total dictionary size: {len(existing_dict)} entries")

# Add key target names and HUD patterns explicitly
extra_targets = {
    "🥩 Soczysta kiełbasa": "🥩 Juicy Sausage",
    "🦴 Smakowita kość": "🦴 Tasty Bone",
    "🎾 Żółta piłeczka": "🎾 Yellow Ball",
    "Misja 1 Ukończona!": "Mission 1 Completed!",
    "Misja 2 Ukończona!": "Mission 2 Completed!",
    "Misja 3 Ukończona!": "Mission 3 Completed!",
    "Misja 4 Ukończona!": "Mission 4 Completed!",
    "Misja 5 Ukończona!": "Mission 5 Completed!",
    "Misja 6 Ukończona!": "Mission 6 Completed!",
    "Misja 7 Ukończona!": "Mission 7 Completed!",
    "Misja 8 Ukończona!": "Mission 8 Completed!",
    "Misja 9 Ukończona!": "Mission 9 Completed!",
    "Misja 10 Ukończona!": "Mission 10 Completed!",
    "Znalazłeś wszystkie cele poziomu": "You found all targets of level",
    "w czasie": "in",
    "Twój pies udowodnił niezwykłą sprawność węchową. Przed Tobą kolejne, trudniejsze wyzwanie!": "Your dog proved extraordinary scenting ability. Ahead lies the next, harder challenge!",
    "Next Level →": "Next Level →",
    "Retry Level ↺": "Retry Level ↺",
    "Next Level": "Next Level",
    "Retry Level": "Retry Level"
}

for k, v in extra_targets.items():
    existing_dict[k] = v

print(f"Final dictionary size: {len(existing_dict)} entries")

# Write updated translations.js
header = """/* ============================================================
   translations.js — American English Dictionary (en-US)
   Author: Dorian Kalinowski for "Świat zmysłami zwierząt V1.1"
   Total translations: {count}
   ============================================================ */

window.TRANSLATIONS_EN = """.format(count=len(existing_dict))

with open('js/translations.js', 'w', encoding='utf-8') as f:
    f.write(header)
    json.dump(existing_dict, f, indent=2, ensure_ascii=False)
    f.write(";\n")

print("Successfully written updated js/translations.js!")

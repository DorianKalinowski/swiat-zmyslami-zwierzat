import sys, re, json
sys.stdout.reconfigure(encoding='utf-8')

with open('js/dog-simulators.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Match single-quoted strings
single_q = re.findall(r"'([^'\\]*(?:\\.[^'\\]*)*)'", content)
# Match double-quoted strings
double_q = re.findall(r'"([^"\\]*(?:\\.[^"\\]*)*)"', content)
# Match template strings (can span lines)
templates = re.findall(r'`([^`\\]*(?:\\.[^`\\]*)*)`', content)

all_strings = single_q + double_q + templates
print(f"Total string literals found: {len(all_strings)}")

pl_chars = re.compile(r'[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]')
pl_strings = [s.strip() for s in all_strings if pl_chars.search(s)]
print(f"Strings with Polish characters: {len(pl_strings)}")
for s in pl_strings[:30]:
    print(" -", s[:80].replace('\n', ' '))

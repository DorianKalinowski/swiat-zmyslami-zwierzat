import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# remove script, style, comments
clean = re.sub(r'<script[\s\S]*?</script>', '', html)
clean = re.sub(r'<style[\s\S]*?</style>', '', clean)
clean = re.sub(r'<!--[\s\S]*?-->', '', clean)

# extract all text fragments between > and <
matches = re.findall(r'>\s*([^<>\r\n]+(?:\s+[^<>\r\n]+)*)\s*<', clean)
unique_phrases = []
seen = set()
for m in matches:
    txt = m.strip()
    if txt and len(txt) > 1 and not txt.isdigit() and txt not in seen:
        seen.add(txt)
        unique_phrases.append(txt)

print(f"index.html unique clean phrases: {len(unique_phrases)}")
for i, p in enumerate(unique_phrases[:35]):
    print(f"{i+1:2}: {p}")

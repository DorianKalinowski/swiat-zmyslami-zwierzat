import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('pies.html', 'r', encoding='utf-8') as f:
    html = f.read()

clean = re.sub(r'<script[\s\S]*?</script>', '', html)
clean = re.sub(r'<style[\s\S]*?</style>', '', clean)
clean = re.sub(r'<!--[\s\S]*?-->', '', clean)

matches = re.findall(r'>\s*([^<>\r\n]+(?:\s+[^<>\r\n]+)*)\s*<', clean)
unique_phrases = []
seen = set()
for m in matches:
    txt = m.strip()
    if txt and len(txt) > 1 and not txt.isdigit() and txt not in seen:
        seen.add(txt)
        unique_phrases.append(txt)

print(f"pies.html unique clean phrases: {len(unique_phrases)}")
for i, p in enumerate(unique_phrases[:35]):
    print(f"{i+1:2}: {p}")

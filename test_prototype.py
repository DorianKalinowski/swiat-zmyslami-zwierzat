import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Let's inspect what elements exist in index.html and how a dictionary translates them
print("File read successfully, length:", len(html))

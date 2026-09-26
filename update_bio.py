import glob
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

old_pattern = re.compile(
    r'Cześć!\s*Mam na imię Dorian i po prostu bardzo lubię zwierzaki\..*?konfrontacji między nami a nimi\.',
    re.DOTALL
)

new_text = "Cześć! Mam na imię Dorian. Od zawsze fascynowało mnie to, jak zwierzęta odbierają otaczający nas świat – zupełnie inaczej niż my, ludzie. Na mojej stronie możesz na własne oczy i uszy sprawdzić ich perspektywę oraz dowiedzieć się, kiedy i dlaczego dochodzi do niebezpiecznych spięć. Wierzę, że gdybyśmy naprawdę rozumieli, jak zwierzęta myślą, widzą i czują, byłoby między nami znacznie mniej strachu i niepotrzebnych konfrontacji."

html_files = glob.glob('*.html')
updated = 0

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content, count = old_pattern.subn(new_text, content)
    if count > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated bio in: {filepath} ({count} replacements)")
        updated += 1
    else:
        print(f"Pattern NOT found in: {filepath}")

print(f"Total files updated: {updated}/{len(html_files)}")

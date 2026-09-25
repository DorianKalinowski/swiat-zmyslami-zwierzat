import glob
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
root = os.path.dirname(os.path.abspath(__file__))

animals = [
    ('pies.html', '🐕', 'Pies domowy'),
    ('kot.html', '🐈', 'Kot domowy'),
    ('dzik.html', '🐗', 'Dzik euroazjatycki'),
    ('wilk.html', '🐺', 'Wilk szary'),
    ('nietoperz.html', '🦇', 'Nietoperz'),
    ('zmija.html', '🐍', 'Żmija zygzakowata'),
    ('sowa.html', '🦉', 'Sowa (Płomykówka)'),
    ('niedzwiedz.html', '🐻', 'Niedźwiedź brunatny'),
    ('pszczola.html', '🐝', 'Pszczoła miodna'),
    ('lis.html', '🦊', 'Lis rudy'),
]

for hp in sorted(glob.glob(os.path.join(root, '*.html'))):
    fname = os.path.basename(hp)
    with open(hp, 'r', encoding='utf-8') as f:
        html = f.read()

    is_home = (fname == 'index.html')
    home_active = ' active' if is_home else ''

    # Generate dropdown items
    dropdown_items = []
    current_animal_label = "🐾 Zwierzęta (10)"
    for a_file, emoji, name in animals:
        is_cur = (fname == a_file)
        active_cls = ' active' if is_cur else ''
        if is_cur:
            current_animal_label = f"{emoji} {name.split()[0]}"
        dropdown_items.append(f'            <a href="{a_file}" class="nav-dropdown-item{active_cls}"><span class="item-emoji">{emoji}</span> {name}</a>')

    dropdown_html = "\n".join(dropdown_items)

    nav_replacement = f'''      <div class="nav-links" id="navLinks">
        <a href="index.html" class="nav-link{home_active}">Strona główna</a>
        <button class="nav-link animal-catalog-trigger" id="triggerAnimalModal">🐾 Katalog (10)</button>

        <!-- Dropdown: Wybierz zwierzę (10) -->
        <div class="nav-dropdown" id="navAnimalsDropdown">
          <button class="nav-link nav-dropdown-btn" id="navDropdownBtn" aria-expanded="false" style="cursor: pointer;">
            <span>{current_animal_label}</span>
            <span class="dropdown-chevron">▾</span>
          </button>
          <div class="nav-dropdown-menu" id="navDropdownMenu">
{dropdown_html}
          </div>
        </div>

        <!-- Creator Chip (Dorian Kalinowski) -->
        <div class="creator-chip" id="authorChip" title="Dowiedz się więcej o autorze">
          <img src="img/dorian-kalinowski.png" alt="Dorian Kalinowski" class="creator-avatar">
          <div class="creator-text">
            <span class="creator-name">Dorian Kalinowski</span>
            <span class="creator-role">Twórca aplikacji</span>
          </div>
        </div>
      </div>'''

    # Pattern to match <div class="nav-links" id="navLinks">...</div>
    pattern = re.compile(r'<div class=[\'"]nav-links[\'"]\s+id=[\'"]navLinks[\'"].*?</div>\s*</div>\s*</nav>', re.DOTALL)
    m = pattern.search(html)
    if m:
        html = html[:m.start()] + nav_replacement + "\n    </div>\n  </nav>" + html[m.end():]
        with open(hp, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"✅ Updated nav in {fname}")
    else:
        print(f"❌ Failed to match nav in {fname}")


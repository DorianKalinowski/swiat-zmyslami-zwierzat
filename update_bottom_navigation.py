import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
root = os.path.dirname(os.path.abspath(__file__))

animals = [
    ('pies.html', '🐕', 'Pies domowy', 'Pies'),
    ('kot.html', '🐈', 'Kot domowy', 'Kot'),
    ('dzik.html', '🐗', 'Dzik euroazjatycki', 'Dzik'),
    ('wilk.html', '🐺', 'Wilk szary', 'Wilk'),
    ('nietoperz.html', '🦇', 'Nietoperz', 'Nietoperz'),
    ('zmija.html', '🐍', 'Żmija zygzakowata', 'Żmija'),
    ('sowa.html', '🦉', 'Sowa (Płomykówka)', 'Sowa'),
    ('niedzwiedz.html', '🐻', 'Niedźwiedź brunatny', 'Niedźwiedź'),
    ('pszczola.html', '🐝', 'Pszczoła miodna', 'Pszczoła'),
    ('lis.html', '🦊', 'Lis rudy', 'Lis'),
    ('jez.html', '🦔', 'Jeż zachodni', 'Jeż'),
    ('orzel.html', '🦅', 'Orzeł przedni', 'Orzeł'),
    ('delfin.html', '🐬', 'Delfin butlonosy', 'Delfin'),
    ('rekin.html', '🦈', 'Żarłacz błękitny', 'Rekin'),
    ('osmiornica.html', '🐙', 'Ośmiornica zwyczajna', 'Ośmiornica'),
]

n = len(animals)

for i, (fname, emoji, full_name, short_name) in enumerate(animals):
    hp = os.path.join(root, fname)
    if not os.path.isfile(hp):
        print(f"❌ File not found: {fname}")
        continue
    
    with open(hp, 'r', encoding='utf-8') as f:
        html = f.read()

    prev_idx = (i - 1) % n
    next_idx = (i + 1) % n
    prev_file, prev_emoji, prev_full, prev_short = animals[prev_idx]
    next_file, next_emoji, next_full, next_short = animals[next_idx]

    # Generate quick chips
    chips = []
    for cur_file, cur_emoji, cur_full, cur_short in animals:
        is_active = (cur_file == fname)
        active_cls = " active" if is_active else ""
        chips.append(f'                <a href="{cur_file}" class="animal-quick-chip{active_cls}"><span>{cur_emoji}</span> <span>{cur_short}</span></a>')
    chips_html = "\n".join(chips)

    nav_section = f'''    <!-- ============================================================
         SEKCJA: NAWIGACJA PO GATUNKACH I PRZEJŚCIE DO KATALOGU
         ============================================================ -->
    <section class="section animal-navigation-hub">
      <div class="container">
        <div class="animal-navigation-card">
          <span class="overline" style="color: var(--amber);">Nawigacja po świecie zmysłów</span>
          <h3 style="font-size: 1.75rem; margin: 8px 0 12px;">Poznaj zmysły innych zwierząt</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 24px; line-height: 1.6; max-width: 620px; margin-left: auto; margin-right: auto;">
            Odkryj percepcję kolejnego gatunku lub otwórz pełny, interaktywny katalog wszystkich 15 zwierząt:
          </p>

          <!-- Stepper: Poprzednie / Główny katalog / Następne -->
          <div class="animal-nav-stepper">
            <a href="{prev_file}" class="animal-nav-btn animal-nav-btn-prev" title="Poprzednie zwierzę: {prev_full}">
              <span>←</span>
              <span>{prev_emoji} {prev_short}</span>
            </a>

            <button class="animal-nav-btn animal-nav-btn-catalog animal-catalog-trigger" title="Otwórz pełny katalog ze wszystkimi 15 zwierzętami">
              <span>🐾 Pełny katalog (15 zwierząt)</span>
            </button>

            <a href="{next_file}" class="animal-nav-btn animal-nav-btn-next" title="Następne zwierzę: {next_full}">
              <span>{next_emoji} {next_short}</span>
              <span>→</span>
            </a>
          </div>

          <!-- Szybki skok do każdego zwierzęcia -->
          <div class="animal-quick-jump-wrap">
            <div class="animal-quick-jump-title">
              Szybki skok do dowolnego gatunku (15):
            </div>
            <div class="animal-quick-jump-bar">
{chips_html}
            </div>
          </div>

          <!-- Powrót na stronę główną -->
          <div class="animal-home-return">
            <a href="index.html#zwierzeta">
              <span>🏠 Wróć do spisu na stronie głównej</span>
            </a>
          </div>
        </div>
      </div>
    </section>'''

    # Replacement logic:
    # 1. Check if there's already an existing bottom navigation section right before </main>
    # Typical patterns:
    # <!-- Navigation between Animals --> ... </section>\s*</main>
    # <!-- Navigation to Hub --> ... </section>\s*</main>
    # <section style="padding: 60px 0; text-align: center;"> ... </section>\s*</main>
    # <section class="section animal-navigation-hub"> ... </section>\s*</main>
    pattern_existing = re.compile(
        r'(?:<!--\s*Navigation[^\n]*-->\s*)?<section[^>]*?(?:animal-navigation-hub|padding:\s*60px\s*0|Poznaj (?:inne|zmysły|percepcję)|Chcesz poznać percepcję).*?</section>\s*</main>',
        re.DOTALL | re.IGNORECASE
    )

    if pattern_existing.search(html):
        new_html = pattern_existing.sub(f"{nav_section}\n  </main>", html, count=1)
        with open(hp, 'w', encoding='utf-8') as f:
            f.write(new_html)
        print(f"✅ Replaced existing bottom nav in {fname}")
    else:
        # Fallback: Insert right before </main>
        idx = html.find('</main>')
        if idx != -1:
            new_html = html[:idx].rstrip() + "\n\n" + nav_section + "\n  </main>" + html[idx + len('</main>'):]
            with open(hp, 'w', encoding='utf-8') as f:
                f.write(new_html)
            print(f"✅ Inserted new bottom nav before </main> in {fname}")
        else:
            print(f"❌ Could not find </main> in {fname}")

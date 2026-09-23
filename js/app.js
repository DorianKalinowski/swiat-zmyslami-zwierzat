/* ============================================================
   App.js — Global Core, Scalable Animal Registry & PWA Engine
   Author: Dorian Kalinowski for "Świat zmysłami zwierząt"
   Architecture: Scalable for 20-100+ Animals
   ============================================================ */

// ---------- CENTRAL ANIMAL REGISTRY (Ready for 100+ animals) ----------
const ANIMAL_REGISTRY = [
  {
    id: 'pies',
    name: 'Pies domowy',
    latin: 'Canis lupus familiaris',
    emoji: '🐕',
    category: 'ssaki',
    url: 'pies.html',
    available: true,
    desc: '300 mln receptorów węchu, słuch do 65 kHz, widzenie dichromatyczne i Zasada Drzewa.'
  },
  {
    id: 'kot',
    name: 'Kot domowy',
    latin: 'Felis catus',
    emoji: '🐈',
    category: 'ssaki',
    url: 'kot.html',
    available: true,
    desc: 'Pionowa źrenica noktowizyjna (1/6 światła), ultradźwięki 85 kHz, wibrysy i mruczenie lecznicze.'
  },
  {
    id: 'dzik',
    name: 'Dzik euroazjatycki',
    latin: 'Sus scrofa',
    emoji: '🐗',
    category: 'ssaki',
    url: 'dzik.html',
    available: true,
    desc: 'Węch wykrywający żołędzie metr pod ziemią, słaby wzrok, oręż (szable) i protokół spokojnego odwrotu.'
  },
  {
    id: 'orzel',
    name: 'Orzeł przedni',
    latin: 'Aquila chrysaetos',
    emoji: '🦅',
    category: 'ptaki',
    url: 'orzel.html',
    available: false,
    desc: 'Wzrok 8-krotnie ostrzejszy od ludzkiego, widzenie w ultrafiolecie i dwa dołki siatkówki.'
  },
  {
    id: 'delfin',
    name: 'Delfin butlonosy',
    latin: 'Tursiops truncatus',
    emoji: '🐬',
    category: 'morskie',
    url: 'delfin.html',
    available: false,
    desc: 'Akustyczny sonar 3D (echolokacja), soczewka tłuszczowa melona i magnetorecepcja oceaniczna.'
  },
  {
    id: 'waz',
    name: 'Grzechotnik preriowy',
    latin: 'Crotalus viridis',
    emoji: '🐍',
    category: 'gady',
    url: 'waz.html',
    available: false,
    desc: 'Termowizja w podczerwieni jamek policzkowych, smakowanie powietrza językiem i drgania sejsmiczne.'
  },
  {
    id: 'nietoperz',
    name: 'Mroczek posrebrzany',
    latin: 'Vespertilio murinus',
    emoji: '🦇',
    category: 'ssaki',
    url: 'nietoperz.html',
    available: false,
    desc: 'Wojskowa precyzja echolokacji powyżej 100 kHz pozwalająca omijać pojedyncze nitki pajęcze w mroku.'
  },
  {
    id: 'pszczola',
    name: 'Pszczoła miodna',
    latin: 'Apis mellifera',
    emoji: '🐝',
    category: 'owady',
    url: 'pszczola.html',
    available: false,
    desc: 'Percepcja pól elektrostatycznych kwiatów, spolaryzowane światło słoneczne i ultrafioletowe nektarniki.'
  },
  {
    id: 'rekin',
    name: 'Żarłacz błękitny',
    latin: 'Prionace glauca',
    emoji: '🦈',
    category: 'morskie',
    url: 'rekin.html',
    available: false,
    desc: 'Elektrorecepcja ampułek Lorenziniego wykrywająca nanowolty uderzenia serca ryby pod piaskiem.'
  },
  {
    id: 'sowa',
    name: 'Płomykówka zwyczajna',
    latin: 'Tyto alba',
    emoji: '🦉',
    category: 'ptaki',
    url: 'sowa.html',
    available: false,
    desc: 'Szlara twarzowa jako antena paraboliczna, asymetryczne uszy i bezszelestny lot w absolutnej ciszy.'
  },
  {
    id: 'osmiornica',
    name: 'Ośmiornica zwyczajna',
    latin: 'Octopus vulgaris',
    emoji: '🐙',
    category: 'morskie',
    url: 'osmiornica.html',
    available: false,
    desc: '500 milionów neuronów rozproszonych w mackach, komórki barwnikowe chromatofory i skóra widząca światło.'
  },
  {
    id: 'kameleon',
    name: 'Kameleon lamparci',
    latin: 'Furcifer pardalis',
    emoji: '🦎',
    category: 'gady',
    url: 'kameleon.html',
    available: false,
    desc: 'Oczy obracające się niezależnie o 360°, nanokryształy fotoniczne w skórze i precyzyjny balistyczny język.'
  },
  {
    id: 'motyl',
    name: 'Rusałka pawik',
    latin: 'Aglais io',
    emoji: '🦋',
    category: 'owady',
    url: 'motyl.html',
    available: false,
    desc: 'Receptory smaku w odnóżach, 15 rodzajów czopków w oku i odbiór promieniowania UV.'
  }
];

const CATEGORIES = [
  { id: 'all', label: 'Wszystkie', emoji: '🌍' },
  { id: 'ssaki', label: 'Ssaki', emoji: '🐾' },
  { id: 'ptaki', label: 'Ptaki', emoji: '🦅' },
  { id: 'morskie', label: 'Morskie', emoji: '🐬' },
  { id: 'gady', label: 'Gady & Płazy', emoji: '🦎' },
  { id: 'owady', label: 'Owady', emoji: '🦋' }
];

document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  initAuthorModal();
  initPWAEngine();
  initCategoryFilters();
  initScrollSpy();
  initGlobalAnimalCatalog();
});

/* ============================================================
   1. MOBILE NAVIGATION & DRAWER
   ============================================================ */
function initMobileNavigation() {
  const toggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const overlay = document.getElementById('mobileOverlay');

  if (!toggle || !navLinks) return;

  function openMenu() {
    toggle.classList.add('open');
    navLinks.classList.add('open');
    overlay?.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    toggle.classList.remove('open');
    navLinks.classList.remove('open');
    overlay?.classList.remove('show');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  });

  overlay?.addEventListener('click', closeMenu);

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ============================================================
   2. AUTHOR PROFILE MODAL (Dorian Kalinowski)
   ============================================================ */
function initAuthorModal() {
  const modal = document.getElementById('authorModal');
  const triggerChip = document.getElementById('authorChip');
  const mobileTrigger = document.getElementById('mobileAuthorTrigger');
  const closeBtn = document.getElementById('closeAuthorModal');
  const confirmBtn = document.getElementById('confirmAuthorModal');

  if (!modal) return;

  function showModal() {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function hideModal() {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }

  triggerChip?.addEventListener('click', showModal);
  mobileTrigger?.addEventListener('click', showModal);
  closeBtn?.addEventListener('click', hideModal);
  confirmBtn?.addEventListener('click', hideModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) hideModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) hideModal();
  });
}

/* ============================================================
   3. GLOBAL SCALABLE ANIMAL CATALOG (Ready for 100+ animals)
   ============================================================ */
function initGlobalAnimalCatalog() {
  // Ensure catalog modal exists in DOM
  let catalogModal = document.getElementById('animalCatalogModal');
  if (!catalogModal) {
    catalogModal = document.createElement('div');
    catalogModal.className = 'modal-backdrop';
    catalogModal.id = 'animalCatalogModal';
    catalogModal.innerHTML = `
      <div class="modal-card catalog-modal-card">
        <button class="modal-close-btn" id="closeCatalogModal" aria-label="Zamknij">✕</button>
        <div class="catalog-header">
          <span class="overline" style="margin-bottom: 6px;">Katalog Gatunków (Skalowalny)</span>
          <h3 style="margin-bottom: 4px;">🐾 Wybierz Zwierzę</h3>
          <p style="font-size: 0.88rem; color: var(--text-muted);">
            Odkryj percepcję świata oczami i uszami poszczególnych gatunków.
          </p>
          <div class="catalog-search-wrap">
            <span class="catalog-search-icon">🔍</span>
            <input type="search" class="catalog-search-input" id="catalogSearchInput" placeholder="Szukaj zwierzęcia (np. kot, pies, orzeł, ssaki)..." autocomplete="off">
          </div>
        </div>

        <div class="catalog-filters-scroll" id="catalogFilterPills">
          ${CATEGORIES.map(c => `
            <button class="btn-pill ${c.id === 'all' ? 'active' : ''}" data-cat="${c.id}">
              ${c.emoji} ${c.label}
            </button>
          `).join('')}
        </div>

        <div class="catalog-grid-scroll" id="catalogGridItems"></div>
      </div>
    `;
    document.body.appendChild(catalogModal);
  }

  const grid = catalogModal.querySelector('#catalogGridItems');
  const searchInput = catalogModal.querySelector('#catalogSearchInput');
  const filterPills = catalogModal.querySelectorAll('#catalogFilterPills .btn-pill');
  const closeBtn = catalogModal.querySelector('#closeCatalogModal');

  function renderCatalog(filterText = '', filterCat = 'all') {
    const query = filterText.toLowerCase().trim();
    const filtered = ANIMAL_REGISTRY.filter(a => {
      const matchCat = filterCat === 'all' || a.category === filterCat;
      const matchText = !query || 
        a.name.toLowerCase().includes(query) || 
        a.latin.toLowerCase().includes(query) || 
        a.desc.toLowerCase().includes(query);
      return matchCat && matchText;
    });

    if (!filtered.length) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 30px; color: var(--text-dim);">
          Nie znaleziono zwierzęcia pasującego do „${filterText}” 🔍
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(a => `
      <${a.available ? `a href="${a.url}"` : 'div'} class="catalog-item-card ${a.available ? '' : 'locked'}">
        <div>
          <div class="cic-top">
            <span class="cic-emoji">${a.emoji}</span>
            <span class="card-badge ${a.available ? 'available' : 'soon'}">
              ${a.available ? 'Dostępny' : 'Wkrótce'}
            </span>
          </div>
          <div class="cic-title">${a.name}</div>
          <div class="cic-latin">${a.latin}</div>
          <div class="cic-desc">${a.desc}</div>
        </div>
        ${a.available ? `
          <span style="font-size: 0.8rem; font-weight: 700; color: var(--amber); margin-top: auto;">
            Zobacz zmysły →
          </span>
        ` : `
          <span style="font-size: 0.75rem; color: var(--text-dim); margin-top: auto;">
            W opracowaniu
          </span>
        `}
      </${a.available ? 'a' : 'div'}>
    `).join('');
  }

  function openCatalog() {
    renderCatalog();
    catalogModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput?.focus(), 150);
  }

  function closeCatalog() {
    catalogModal.classList.remove('show');
    document.body.style.overflow = '';
  }

  // Triggers
  document.querySelectorAll('#triggerAnimalModal, [data-open-catalog], .animal-catalog-trigger').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openCatalog();
    });
  });

  closeBtn?.addEventListener('click', closeCatalog);
  catalogModal.addEventListener('click', (e) => {
    if (e.target === catalogModal) closeCatalog();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && catalogModal.classList.contains('show')) closeCatalog();
    // Hotkey: Cmd+K or Ctrl+K opens catalog
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      catalogModal.classList.contains('show') ? closeCatalog() : openCatalog();
    }
  });

  // Search filter
  searchInput?.addEventListener('input', () => {
    const activeCat = catalogModal.querySelector('#catalogFilterPills .btn-pill.active')?.dataset.cat || 'all';
    renderCatalog(searchInput.value, activeCat);
  });

  // Category filter
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      renderCatalog(searchInput?.value || '', pill.dataset.cat);
    });
  });
}

/* ============================================================
   4. PWA SERVICE WORKER & INSTALL PROMPT
   ============================================================ */
function initPWAEngine() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').then((reg) => {
        // Check for updates on load to ensure new SW activates right away
        reg.update();
      }).catch(err => {
        console.warn('SW registration fallback: ', err);
      });
    });
  }

  let deferredPrompt = null;
  const banner = document.getElementById('pwaBanner');
  const installBtn = document.getElementById('pwaInstallBtn');
  const dismissBtn = document.getElementById('pwaDismissBtn');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    setTimeout(() => {
      if (banner && !sessionStorage.getItem('pwa_dismissed')) {
        banner.classList.add('show');
      }
    }, 2500);
  });

  installBtn?.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      banner?.classList.remove('show');
    }
    deferredPrompt = null;
  });

  dismissBtn?.addEventListener('click', () => {
    banner?.classList.remove('show');
    sessionStorage.setItem('pwa_dismissed', 'true');
  });
}

/* ============================================================
   5. CATEGORY FILTERS (Index Hub)
   ============================================================ */
function initCategoryFilters() {
  const filterButtons = document.querySelectorAll('#catFilters .btn-pill');
  const animalCards = document.querySelectorAll('#animalsGrid .animal-hub-card');

  if (!filterButtons.length || !animalCards.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.cat;
      animalCards.forEach(card => {
        if (cat === 'all' || card.dataset.cat === cat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ============================================================
   6. STICKY SUBNAV SCROLL SPY
   ============================================================ */
function initScrollSpy() {
  const subnavPills = document.querySelectorAll('.subnav-pill');
  if (!subnavPills.length) return;

  const targets = [];
  subnavPills.forEach(pill => {
    const id = pill.getAttribute('href')?.replace('#', '');
    const el = document.getElementById(id);
    if (el) targets.push({ pill, el });
  });

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 160;
    let found = false;

    for (let i = targets.length - 1; i >= 0; i--) {
      if (targets[i].el.offsetTop <= scrollPos) {
        subnavPills.forEach(p => p.classList.remove('active'));
        targets[i].pill.classList.add('active');
        found = true;
        break;
      }
    }

    if (!found && subnavPills[0]) {
      subnavPills.forEach(p => p.classList.remove('active'));
      subnavPills[0].classList.add('active');
    }
  }, { passive: true });
}

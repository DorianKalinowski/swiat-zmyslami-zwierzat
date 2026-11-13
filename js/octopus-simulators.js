/* ============================================================
   OCTOPUS (OŚMIORNICA ZWYCZAJNA) — SENSORY SIMULATORS & 10-LEVEL GAME
   Author: Dorian Kalinowski for "Świat zmysłami zwierząt"
   Senses: Chromatophores camouflage, Tasting suckers, 500M neurons
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initOctopusCamouflageSimulator();
  initOctopusChemoreceptionSimulator();
  initOctopusAnatomyInspector();
  initOctopusCrisisSimulator();
  initOctopusCamouflageGame();
  initOctopusQuiz();
});

/* ============================================================
   1. DYNAMIC CAMOUFLAGE & CHROMATOPHORES SIMULATOR
   ============================================================ */
function initOctopusCamouflageSimulator() {
  let audioCtx = null;
  function getAudioCtx() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!audioCtx) audioCtx = new AudioCtx();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      return audioCtx;
    } catch (e) {
      return null;
    }
  }

  const bgButtons = document.querySelectorAll('[data-octopus-bg]');
  const textureSlider = document.getElementById('octopusTextureSlider');
  const textureDisplay = document.getElementById('octopusTextureDisplay');
  const stage = document.getElementById('octopusCamoStage');
  const subject = document.getElementById('octopusCamoSubject');
  const pattern = document.getElementById('octopusSkinPattern');
  const scoreBadge = document.getElementById('octopusCamoScoreBadge');
  const statusText = document.getElementById('octopusCamoStatusText');
  const soundBtn = document.getElementById('playCamouflageShiftBtn');

  const themes = {
    sand: {
      bgColor: '#D97706',
      bgGrad: 'linear-gradient(180deg, #92400E 0%, #D97706 70%)',
      skinColor: '#D97706',
      optTexture: 20,
      pattern: 'radial-gradient(circle, #B45309 15%, transparent 20%)',
      status: 'Dopasowana do podłoża piaszczystego (Gładka z drobnym ziarnem)'
    },
    coral: {
      bgColor: '#DB2777',
      bgGrad: 'linear-gradient(135deg, #BE185D 0%, #9D174D 50%, #EC4899 100%)',
      skinColor: '#DB2777',
      optTexture: 65,
      pattern: 'radial-gradient(circle, #F43F5E 30%, #831843 70%)',
      status: 'Dopasowana do koralowca (Wypustki brodawkowe i purpurowe plamki)'
    },
    rock: {
      bgColor: '#475569',
      bgGrad: 'linear-gradient(135deg, #1E293B 0%, #475569 50%, #334155 100%)',
      skinColor: '#475569',
      optTexture: 90,
      pattern: 'repeating-linear-gradient(45deg, #1E293B, #1E293B 6px, #64748B 6px, #64748B 12px)',
      status: 'Dopasowana do ciemnego bazaltu (Maksymalna chropowatość brodawek)'
    },
    algae: {
      bgColor: '#059669',
      bgGrad: 'linear-gradient(135deg, #065F46 0%, #059669 60%, #10B981 100%)',
      skinColor: '#059669',
      optTexture: 45,
      pattern: 'repeating-radial-gradient(circle at 0 0, #047857, #10B981 10px, #064E3B 15px)',
      status: 'Dopasowana do łąki traw morskich (Podłużne pasy maskujące)'
    }
  };

  let currentKey = 'sand';

  function updateCamo() {
    const data = themes[currentKey];
    if (!data) return;

    const textureVal = parseInt(textureSlider?.value || 15);
    if (textureDisplay) {
      const desc = textureVal < 25 ? 'Gładka (0-25%)' : textureVal < 60 ? 'Brodawki średnie (26-60%)' : 'Szorstka i kolczasta (61-100%)';
      textureDisplay.textContent = `Tekstura: ${desc} (${textureVal}%)`;
    }

    if (stage) stage.style.background = data.bgGrad;
    if (subject) {
      subject.style.background = data.skinColor;
      subject.style.boxShadow = `0 ${Math.round(textureVal / 10)}px ${Math.round(textureVal / 5)}px rgba(0,0,0,0.5)`;
      subject.style.borderRadius = textureVal > 60 ? '45% 45% 35% 35%' : '50% 50% 40% 40%';
    }
    if (pattern) {
      pattern.style.background = data.pattern;
      pattern.style.opacity = (0.3 + (textureVal / 100) * 0.5).toFixed(2);
    }

    // Camouflage match calculation
    const diff = Math.abs(textureVal - data.optTexture);
    const score = Math.max(70, Math.min(99, 99 - diff));
    if (scoreBadge) {
      scoreBadge.textContent = `Kamuflaż: ${score}% (Niewidoczna dla drapieżnika)`;
      scoreBadge.style.color = score > 88 ? '#4ADE80' : '#FDE047';
    }

    if (statusText) statusText.textContent = `Stan skóry: ${data.status}`;
  }

  bgButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      bgButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentKey = btn.getAttribute('data-octopus-bg');
      updateCamo();
      triggerSkinPopSound();
    });
  });

  textureSlider?.addEventListener('input', updateCamo);

  function triggerSkinPopSound() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      // Synthesize rapid muscular contraction click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {}
  }

  soundBtn?.addEventListener('click', triggerSkinPopSound);
  updateCamo();
}

/* ============================================================
   2. TASTING SUCKERS & CHEMORECEPTION SIMULATOR
   ============================================================ */
function initOctopusChemoreceptionSimulator() {
  const tasteBtns = document.querySelectorAll('[data-octopus-taste]');
  const iconEl = document.getElementById('octopusTasteIcon');
  const titleEl = document.getElementById('octopusTasteTitle');
  const subEl = document.getElementById('octopusTasteSub');
  const descEl = document.getElementById('octopusTasteDesc');

  if (!tasteBtns.length || !titleEl) return;

  const data = {
    crab: {
      icon: '🦀',
      title: 'Wykryto aminokwasy skorupiaka: Cel jadalny!',
      sub: 'Reakcja chemoreceptorów przyssawki: Aktywacja odruchu chwytnego',
      desc: 'Przyssawka natychmiast wyczuwa stężenie kwasu glutaminowego i tauryny wydzielanych przez kraba. Ramię samoistnie owija się wokół zdobyczy i kieruje ją prosto w stronę dzioba, bez konieczności angażowania centralnego mózgu!'
    },
    plastic: {
      icon: '🥤',
      title: 'Polimer syntetyczny: Brak składników odżywczych',
      sub: 'Reakcja chemoreceptorów przyssawki: Odrzucenie i zwolnienie uchwytu',
      desc: 'Brak jakichkolwiek cząsteczek organicznych. Autonomiczne ramię bada gładką powierzchnię tworzywa przez 0.5 sekundy, po czym zwalnia podciśnienie przyssawki i odrzuca śmieć na bok, oszczędzając energię metaboliczną.'
    },
    snail: {
      icon: '🐚⚡',
      title: 'Toksyna peptydowa ślimaka stożka: ALARM!',
      sub: 'Reakcja chemoreceptorów przyssawki: Błyskawiczne cofnięcie ramienia',
      desc: 'Chemoreceptory wykrywają niebezpieczne konotoksyny jadowitego ślimaka stożka. Sygnał nerwowy wywołuje natychmiastowy odruch ucieczki całego ramienia i przygotowanie syfonu do wyrzutu czernidła!'
    }
  };

  tasteBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tasteBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const key = btn.getAttribute('data-octopus-taste');
      const item = data[key];
      if (!item) return;

      if (iconEl) iconEl.textContent = item.icon;
      if (titleEl) titleEl.textContent = item.title;
      if (subEl) subEl.textContent = item.sub;
      if (descEl) descEl.textContent = item.desc;
    });
  });
}

/* ============================================================
   3. OCTOPUS ANATOMY & BIOMECHANICS INSPECTOR
   ============================================================ */
function initOctopusAnatomyInspector() {
  const buttons = document.querySelectorAll('[data-octopus-anatomy]');
  const titleEl = document.getElementById('octopusAnatomyTitle');
  const descEl = document.getElementById('octopusAnatomyDesc');
  const statEl = document.getElementById('octopusAnatomyStat');

  if (!buttons.length || !titleEl) return;

  const data = {
    eyes: {
      title: 'Kamera Oka — Brak Martwego Pola i Polaryzacja Światła',
      desc: 'Oko głowonoga to arcydzieło ewolucji konwergentnej. W przeciwieństwie do oka ludzkiego, nerwy siatkówki biegną z tyłu fotoreceptorów, co oznacza brak plamki ślepej! Pozioma, prostokątna źrenica zawsze utrzymuje idealny poziom dzięki grawitacyjnym statocystom w głowie, a rewelacyjna czułość na polaryzację światła pozwala widzieć przezroczyste meduzy.',
      stat: 'Plamka ślepa: 0% • Automatyczna stabilizacja źrenicy w pionie grawitacyjnym'
    },
    beak: {
      title: 'Chitynowy Dziób — Jedyna Twarda Część Ciała',
      desc: 'W centrum wieńca ramion znajduje się twardy dziób zbudowany z chityny i usieciowanych białek, twardszy niż kości ryb. Przypomina dziób papugi i potrafi z łatwością kruszyć pancerze krabów. Zawiera również radulę (chitynowy język-tarkę) oraz ujście gruczołów jadowych wstrzykujących enzymy trawienne.',
      stat: 'Wielkość szczeliny ucieczki: Ograniczona wyłącznie średnicą dzioba (~2.5 cm)'
    },
    arms: {
      title: '8 Autonomicznych Ramion — Zdecentralizowany Umysł',
      desc: 'Aż 350 milionów neuronów z 500 milionów znajduje się w ramionach! Każde ramię posiada własny zwój nerwowy (mini-mózg) zdolny do planowania ruchu, reagowania na bodźce i chwytania bez udziału mózgu w głowie. Odcięte ramię potrafi jeszcze przez godzinę reagować na bodźce i podawać pokarm do miejsca, gdzie kiedyś znajdował się dziób!',
      stat: 'Liczba neuronów: 350 mln w ramionach vs 150 mln w mózgu centralnym'
    },
    suckers: {
      title: 'Smakujące Przyssawki — Chemorecepcja i Dotyk',
      desc: 'Dorosła ośmiornica ma ok. 1600 przyssawek. Każda przyssawka może poruszać się niezależnie i jest wyposażona w 10 000 czuciowych i chemorecepcyjnych komórek nerwowych. Ośmiornica czuje smak każdej dotkniętej skały, szczeliny czy muszli, a jej przyssawki potrafią utrzymać ciężar ponad 15 kg każda!',
      stat: 'Siła podciśnienia: Pojedyncza przyssawka unosi do 15 kg pod wodą'
    },
    siphon: {
      title: 'Syfon Odrzutowy i Worek Czernidłowy',
      desc: 'Mięśniowa rura skierowana w dowolną stronę, przez którą ośmiornica gwałtownie wytłacza wodę z jamy płaszczowej. Działa jak silnik odrzutowy, pozwalając na ucieczkę z prędkością do 40 km/h. W sytuacjach skrajnych wyrzuca chmurę czernidła z melaniną, która tworzy „fantom” o kształcie ośmiornicy i paraliżuje węch drapieżnika.',
      stat: 'Prędkość ucieczki odrzutowej: do 40 km/h tyłem w ułamku sekundy'
    }
  };

  function selectPart(key) {
    buttons.forEach(b => {
      if (b.getAttribute('data-octopus-anatomy') === key) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    const item = data[key];
    if (!item) return;

    titleEl.textContent = item.title;
    if (descEl) descEl.textContent = item.desc;
    if (statEl) statEl.textContent = item.stat;
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-octopus-anatomy');
      selectPart(key);
    });
  });
}

/* ============================================================
   4. CRISIS SIMULATOR: SPOTKANIE Z OŚMIORNICĄ NA RAFIE
   ============================================================ */
function initOctopusCrisisSimulator() {
  const cards = document.querySelectorAll('.octopus-crisis-card');
  const resultBox = document.getElementById('octopusCrisisResult');
  if (!cards.length || !resultBox) return;

  const responses = {
    touch_blue_ring: {
      type: 'danger',
      title: '❌ ŚMIERTELNY BŁĄD: Branie do ręki ośmiornicy niebieskopierścieniowej!',
      text: 'Ośmiornica niebieskopierścieniowa (<em>Hapalochlaena</em>) posiada w ślinie tetrodotoksynę (TTX), na którą nie istnieje antidotum! Jedno niewyczuwalne ukąszenie paraliżuje mięśnie oddechowe człowieka w 15 minut, powodując zgon przy pełnej świadomości. NIGDY nie bierz do ręki małych ośmiornic o pulsujących, neonowych wzorach!'
    },
    keep_distance_admire: {
      type: 'success',
      title: '✅ WZOROWE I ETYCZNE POSTĘPOWANIE NA RAFIE:',
      text: '1. <strong>Zachowaj dystans:</strong> Podziwiaj zwierzę z odległości 1–2 metrów bez płoszenia go.<br>2. <strong>Nie dotykaj:</strong> Pozwól jej swobodnie polować i eksplorować podłoże.<br>3. <strong>Podziwiaj kamuflaż:</strong> Zobaczysz, jak w ułamku sekundy dopasowuje się do otoczenia, nie czując się zagrożona.'
    },
    pick_bucket: {
      type: 'danger',
      title: '❌ BŁĄD: Łapanie do wiaderka lub kubka!',
      text: 'Stres wywołany uwięzieniem zmusza ośmiornicę do desperackich prób ucieczki i wyrzutu czernidła w małej objętości wody, co może ją samą zatruć brakiem tlenu. Ponadto grozi przypadkowym ukąszeniem.'
    },
    pour_freshwater: {
      type: 'danger',
      title: '❌ CIĘŻKI BŁĄD: Wlewanie słodkiej wody mineralnej!',
      text: 'Ośmiornice to organizmy wyłącznie morskie o ściśle uregulowanym ciśnieniu osmotycznym. Dolanie słodkiej wody powoduje gwałtowny szok osmotyczny, pęcznienie i pękanie komórek nabłonkowych skrzeli, prowadząc do męczarni zwierzęcia!'
    }
  };

  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      const action = card.dataset.action;
      const resp = responses[action];
      if (!resp) return;

      resultBox.style.display = 'block';
      resultBox.className = `crisis-feedback-box show ${resp.type}`;
      resultBox.innerHTML = `
        <h4 style="margin-bottom: 6px; font-size: 1.15rem;">${resp.title}</h4>
        <p style="font-size: 0.92rem; line-height: 1.6; margin: 0;">${resp.text}</p>
      `;
    });
  });
}

/* ============================================================
   5. 10-LEVEL MINIGAME: GŁĘBINOWY KAMUFLAŻ I ŁOWY NA KRABY
   ============================================================ */
function initOctopusCamouflageGame() {
  const canvas = document.getElementById('octopusGameCanvas');
  const overlay = document.getElementById('octopusGameOverlay');
  const startBtn = document.getElementById('startOctopusGameBtn');
  const nextBtn = document.getElementById('nextOctopusLevelBtn');
  const restartBtn = document.getElementById('restartOctopusGameBtn');
  const resetBtn = document.getElementById('resetOctopusCampaignBtn');
  const camoToggleBtn = document.getElementById('octopusCamouflageToggleInGameBtn');

  const crabsVal = document.getElementById('octopusGameCrabs');
  const timerVal = document.getElementById('octopusGameTimer');
  const camoStatusVal = document.getElementById('octopusGameCamoStatus');
  const levelBadge = document.getElementById('octopusGameLevelBadge');
  const levelDotsContainer = document.getElementById('octopusGameLevelDots');
  const overlayIcon = document.getElementById('octopusGameOverIcon');
  const overlayTitle = document.getElementById('octopusGameOverTitle');
  const overlayDesc = document.getElementById('octopusGameOverDesc');

  if (!canvas || !overlay || !startBtn) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.clientWidth || 500);
  let height = (canvas.height = canvas.clientHeight || 340);

  window.addEventListener('resize', () => {
    if (!canvas) return;
    width = canvas.width = canvas.clientWidth || 500;
    height = canvas.height = canvas.clientHeight || 340;
  });

  // Color Modes for Camouflage
  const camoModes = [
    { name: '🏖️ Piasek (Żółty)', color: '#D97706', key: 'sand' },
    { name: '🪸 Koralowiec (Różowy)', color: '#EC4899', key: 'coral' },
    { name: '🪨 Bazalt (Szary)', color: '#64748B', key: 'rock' },
    { name: '🌿 Algi (Zielony)', color: '#10B981', key: 'algae' }
  ];

  // 10 Progressive Underwater Levels
  const levels = [
    {
      name: 'Płytka Rafa i Złote Kraby 🦀🐙',
      desc: 'Dopasuj barwę ośmiornicy do podłoża (klawisz C lub przycisk), by murena Cię nie zauważyła. Złów 3 kraby!',
      time: 40,
      targetCrabs: 3,
      predators: 1,
      predatorSpeed: 1.0
    },
    {
      name: 'Koralowy Labirynt i Purpurowe Ukwiały 🪸',
      desc: 'Podłoże dzieli się na piasek i koralowiec. Przełączaj barwę w biegu i schwytaj 4 kraby.',
      time: 38,
      targetCrabs: 4,
      predators: 1,
      predatorSpeed: 1.2
    },
    {
      name: 'Skalisty Wrak Okrętu i Ciemny Bazalt 🪨',
      desc: 'Wrak porasta 3 strefy dna: skała, piasek i koralowce. Złów 4 kraby, unikając drapieżnika.',
      time: 36,
      targetCrabs: 4,
      predators: 2,
      predatorSpeed: 1.3
    },
    {
      name: 'Gęsta Łąka Traw Morskich i Mureny 🌿',
      desc: 'Mureny patrolują łąkę glonów. Zielony kamuflaż da Ci niewidzialność! Złów 5 krabów.',
      time: 35,
      targetCrabs: 5,
      predators: 2,
      predatorSpeed: 1.4
    },
    {
      name: 'Podmorska Rozpadlina Szelfowa 🌊',
      desc: 'Zmienne prądy przesuwają kraby po dnie. Zachowaj czujność sensoryczną na 5 celach.',
      time: 35,
      targetCrabs: 5,
      predators: 2,
      predatorSpeed: 1.5
    },
    {
      name: 'Nocna Rafa i Świecący Plankton ✨',
      desc: 'W ciemnościach tylko idealny kamuflaż chroni przed czujnym okiem węgorza morskiego.',
      time: 32,
      targetCrabs: 6,
      predators: 2,
      predatorSpeed: 1.6
    },
    {
      name: 'Labirynt Wąskich Szczelin Skalnych 🧗',
      desc: 'Przeciskaj się miękkim ciałem przez wąskie przesmyki i schwytaj 6 krabów.',
      time: 32,
      targetCrabs: 6,
      predators: 3,
      predatorSpeed: 1.7
    },
    {
      name: 'Koralowce Ogniste i Szybkie Mureny 🐍',
      desc: 'Bardzo szybkie mureny krążą nad dnem. Błyskawicznie zmieniaj barwę chromatoforów!',
      time: 30,
      targetCrabs: 7,
      predators: 3,
      predatorSpeed: 1.8
    },
    {
      name: 'Głębia Rowu Oceanicznego — Test Zmysłów 🌌',
      desc: 'Skrajne ciśnienie i głód. Złów 7 krabów pod czujnym okiem 3 drapieżników.',
      time: 30,
      targetCrabs: 7,
      predators: 3,
      predatorSpeed: 1.9
    },
    {
      name: 'Władca Chromatoforów — Król Kamuflażu 👑🐙',
      desc: 'Finałowy sprawdzian mistrza maskowania! Złów 8 krabów w rekordowym czasie!',
      time: 28,
      targetCrabs: 8,
      predators: 4,
      predatorSpeed: 2.0
    }
  ];

  let currentLevelIdx = 0;
  let isPlaying = false;
  let timeLeft = 40;
  let timerInterval = null;
  let animId = null;
  let caughtCrabs = 0;
  let currentCamoIdx = 0; // index into camoModes

  // Octopus player
  let octo = {
    x: 80,
    y: 170,
    targetX: 80,
    targetY: 170,
    radius: 20
  };

  // Crabs and Predators
  let crabs = [];
  let predators = [];

  // Floor zones (3 horizontal bands on bottom)
  let zones = [];

  function generateZones() {
    zones = [
      { startX: 0, endX: width * 0.33, mode: camoModes[0] }, // Sand
      { startX: width * 0.33, endX: width * 0.66, mode: camoModes[1] }, // Coral
      { startX: width * 0.66, endX: width, mode: camoModes[2] } // Rock
    ];
    if (currentLevelIdx >= 3) {
      zones[2].mode = camoModes[3]; // Algae
    }
  }

  function spawnLevelEntities() {
    const lvl = levels[currentLevelIdx];
    crabs = [];
    predators = [];
    generateZones();

    for (let i = 0; i < lvl.targetCrabs; i++) {
      crabs.push({
        x: 60 + Math.random() * (width - 120),
        y: height - 60 + (Math.random() * 40 - 20),
        vx: (Math.random() > 0.5 ? 1 : -1) * 0.6,
        radius: 15,
        caught: false
      });
    }

    for (let i = 0; i < lvl.predators; i++) {
      predators.push({
        x: 100 + Math.random() * (width - 150),
        y: 60 + i * 45,
        vx: (Math.random() > 0.5 ? 1 : -1) * lvl.predatorSpeed,
        radius: 20
      });
    }
  }

  function updateHUD() {
    const lvl = levels[currentLevelIdx];
    if (crabsVal) crabsVal.textContent = `${caughtCrabs} / ${lvl.targetCrabs}`;
    if (timerVal) timerVal.textContent = `${timeLeft}s`;
    if (camoStatusVal) {
      camoStatusVal.textContent = camoModes[currentCamoIdx].name;
      camoStatusVal.style.color = camoModes[currentCamoIdx].color;
    }

    if (levelBadge) {
      levelBadge.innerHTML = `<span>Misja ${currentLevelIdx + 1}/10:</span> ${lvl.name}`;
    }

    if (levelDotsContainer) {
      const dots = levelDotsContainer.querySelectorAll('.level-dot');
      dots.forEach((dot, idx) => {
        if (idx === currentLevelIdx) {
          dot.className = 'level-dot active';
        } else if (idx < currentLevelIdx) {
          dot.className = 'level-dot completed';
        } else {
          dot.className = 'level-dot';
        }
      });
    }
  }

  function cycleCamouflage() {
    currentCamoIdx = (currentCamoIdx + 1) % camoModes.length;
    updateHUD();
  }

  // Keyboard shortcut C
  window.addEventListener('keydown', (e) => {
    if (isPlaying && (e.key === 'c' || e.key === 'C')) {
      cycleCamouflage();
    }
  });

  camoToggleBtn?.addEventListener('click', () => {
    if (isPlaying) {
      cycleCamouflage();
    }
  });

  // Pointer tracking
  function handlePointer(clientX, clientY) {
    if (!isPlaying) return;
    const rect = canvas.getBoundingClientRect();
    octo.targetX = Math.max(octo.radius, Math.min(width - octo.radius, clientX - rect.left));
    octo.targetY = Math.max(octo.radius, Math.min(height - octo.radius, clientY - rect.top));
  }

  canvas.addEventListener('mousemove', (e) => handlePointer(e.clientX, e.clientY));
  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      e.preventDefault();
      handlePointer(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: false });

  function startLevel(lvlIndex) {
    currentLevelIdx = lvlIndex;
    const lvl = levels[currentLevelIdx];
    timeLeft = lvl.time;
    caughtCrabs = 0;
    currentCamoIdx = 0;
    isPlaying = true;

    octo.x = 60;
    octo.y = height / 2;
    octo.targetX = 60;
    octo.targetY = height / 2;

    spawnLevelEntities();
    updateHUD();

    overlay.style.display = 'none';
    overlay.classList.remove('active');

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      updateHUD();
      if (timeLeft <= 0) {
        gameOver(false, 'Koniec czasu! Kraby schowały się głęboko w szczelinach.');
      }
    }, 1000);

    if (animId) cancelAnimationFrame(animId);
    animLoop();
  }

  function gameOver(won, message) {
    isPlaying = false;
    clearInterval(timerInterval);
    if (animId) cancelAnimationFrame(animId);

    overlay.style.display = 'flex';
    overlay.classList.add('active');

    if (startBtn) startBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (restartBtn) restartBtn.style.display = 'none';
    if (resetBtn) resetBtn.style.display = 'none';

    if (won) {
      if (currentLevelIdx < levels.length - 1) {
        if (overlayIcon) overlayIcon.textContent = '🎉🐙🦀';
        if (overlayTitle) overlayTitle.textContent = `Misja ${currentLevelIdx + 1} ukończona!`;
        if (overlayDesc) overlayDesc.textContent = message || 'Doskonały kamuflaż! Złapałeś wszystkie kraby, pozostając niewidocznym dla muren.';
        if (nextBtn) nextBtn.style.display = 'inline-block';
      } else {
        if (overlayIcon) overlayIcon.textContent = '👑🐙🎨';
        if (overlayTitle) overlayTitle.textContent = 'GRATULACJE! Władca Głębinowego Kamuflażu!';
        if (overlayDesc) overlayDesc.textContent = 'Ukończyłeś wszystkie 10 poziomów! Opanowałeś 500 mln neuronów, dynamiczne chromatofory i smakujące przyssawki.';
        if (resetBtn) resetBtn.style.display = 'inline-block';
      }
    } else {
      if (overlayIcon) overlayIcon.textContent = '💥🐍';
      if (overlayTitle) overlayTitle.textContent = 'Zdemaskowany!';
      if (overlayDesc) overlayDesc.textContent = message || 'Murena zauważyła Cię, gdy kolor Twojej skóry nie pasował do tła rafowego!';
      if (restartBtn) restartBtn.style.display = 'inline-block';
    }
  }

  function getZoneAt(x) {
    for (let z of zones) {
      if (x >= z.startX && x <= z.endX) return z;
    }
    return zones[0];
  }

  function animLoop() {
    if (!isPlaying) return;

    // Smooth movement
    octo.x += (octo.targetX - octo.x) * 0.12;
    octo.y += (octo.targetY - octo.y) * 0.12;

    // Clear ocean background
    ctx.fillStyle = '#070C18';
    ctx.fillRect(0, 0, width, height);

    // Draw seabed zones
    const seabedHeight = 65;
    zones.forEach(z => {
      ctx.fillStyle = z.mode.color;
      ctx.globalAlpha = 0.28;
      ctx.fillRect(z.startX, height - seabedHeight, z.endX - z.startX, seabedHeight);
      ctx.globalAlpha = 1.0;

      // Border between zones
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.strokeRect(z.startX, height - seabedHeight, z.endX - z.startX, seabedHeight);

      // Label
      ctx.font = '11px sans-serif';
      ctx.fillStyle = z.mode.color;
      ctx.fillText(z.mode.name, z.startX + 10, height - 12);
    });

    // Check camouflage match with current zone
    const currentZone = getZoneAt(octo.x);
    const isCamouflaged = (currentZone.mode.key === camoModes[currentCamoIdx].key);

    // Update & draw crabs
    const lvl = levels[currentLevelIdx];
    crabs.forEach(c => {
      if (c.caught) return;
      c.x += c.vx;
      if (c.x < 30 || c.x > width - 30) c.vx *= -1;

      ctx.font = '20px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🦀', c.x, c.y);

      // Check capture by octopus
      const dist = Math.hypot(octo.x - c.x, octo.y - c.y);
      if (dist < octo.radius + c.radius) {
        c.caught = true;
        caughtCrabs++;
        updateHUD();
        if (caughtCrabs >= lvl.targetCrabs) {
          gameOver(true, `Wspaniale! Ukończyłeś misję, zbierając ${lvl.targetCrabs} krabów!`);
        }
      }
    });

    // Update & draw predators (Moray eels 🐍)
    predators.forEach(p => {
      p.x += p.vx;
      if (p.x < 30 || p.x > width - 30) p.vx *= -1;

      ctx.font = '24px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🐍', p.x, p.y);

      // Distance to octopus
      const dist = Math.hypot(octo.x - p.x, octo.y - p.y);
      if (dist < octo.radius + p.radius + 10) {
        // If not camouflaged, predator spots octopus!
        if (!isCamouflaged) {
          gameOver(false, 'Murena Cię zauważyła! Twoja skóra miała inny kolor niż strefa dna pod Tobą!');
        }
      }
    });

    // Draw Octopus
    ctx.save();
    ctx.translate(octo.x, octo.y);

    // Glow if perfectly camouflaged
    if (isCamouflaged) {
      ctx.strokeStyle = '#4ADE80';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, octo.radius + 6, 0, Math.PI * 2);
      ctx.stroke();

      ctx.font = '10px monospace';
      ctx.fillStyle = '#4ADE80';
      ctx.textAlign = 'center';
      ctx.fillText('UKRYTY (100%)', 0, -octo.radius - 10);
    } else {
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, octo.radius + 6, 0, Math.PI * 2);
      ctx.stroke();

      ctx.font = '10px monospace';
      ctx.fillStyle = '#EF4444';
      ctx.textAlign = 'center';
      ctx.fillText('WIDOCZNY!', 0, -octo.radius - 10);
    }

    ctx.font = '32px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🐙', 0, 0);
    ctx.restore();

    animId = requestAnimationFrame(animLoop);
  }

  startBtn?.addEventListener('click', () => startLevel(0));
  nextBtn?.addEventListener('click', () => startLevel(currentLevelIdx + 1));
  restartBtn?.addEventListener('click', () => startLevel(currentLevelIdx));
  resetBtn?.addEventListener('click', () => startLevel(0));

  updateHUD();

  window.addEventListener('languageChanged', () => {
    updateHUD();
  });
}

/* ============================================================
   6. INTERACTIVE 5-QUESTION OCTOPUS QUIZ
   ============================================================ */
function initOctopusQuiz() {
  const container = document.getElementById('octopusQuizDynamicBody');
  const meter = document.getElementById('octopusQuizMeterProgress');
  if (!container) return;

  const questions = [
    {
      q: 'Gdzie znajduje się większość (ok. 2/3) neuronów ośmiornicy?',
      options: [
        'W potężnym mózgu umieszczonym wewnątrz chitynowego dzioba',
        'W ośmiu ramionach, z których każde posiada autonomiczny zwój nerwowy',
        'W worku czernidłowym odpowiedzialnym za obronę',
        'W trzech sercach pompujących błękitną krew'
      ],
      correct: 1,
      explain: 'Aż 350 milionów z 500 milionów neuronów ośmiornicy zlokalizowanych jest w ramionach. Pozwala to każdemu ramieniu na samodzielne badanie otoczenia, poruszanie się i smakowanie pokarmu.'
    },
    {
      q: 'Dlaczego krew ośmiornicy jest intensywnie błękitna, a nie czerwona?',
      options: [
        'Ponieważ zawiera barwnik melaninowy pobrany z worka czernidłowego',
        'Ośmiornica absorbuje sole kobaltu z wody morskiej',
        'Zamiast żelaza opiera się na miedzi (hemocyjanina), która w zimnej wodzie wydajniej wiąże tlen',
        'Jej krew nie zawiera żadnych cząsteczek transportujących tlen'
      ],
      correct: 2,
      explain: 'Krew głowonogów wykorzystuje cząsteczki hemocyjaniny oparte na atomach miedzi. Po natlenieniu hemocyjanina przybiera piękny błękitny kolor i świetnie sprawdza się w zimnych, słabo natlenionych głębinach.'
    },
    {
      q: 'Jakie zagrożenie niesie ze sobą dotknięcie małej ośmiornicy niebieskopierścieniowej (Hapalochlaena)?',
      options: [
        'Może jedynie ubrudzić skórę trwałym atramentem',
        'Wydziela śmiertelną tetrodotoksynę (TTX), która paraliżuje mięśnie oddechowe człowieka w kilkanaście minut',
        'Powoduje lekkie swędzenie dłoni przypominające poparzenie pokrzywą',
        'Nie niesie żadnego zagrożenia, te ośmiornice nie mają jadu'
      ],
      correct: 1,
      explain: 'Ośmiornica niebieskopierścieniowa przenosi w ślinie tetrodotoksynę (TTX) produkowaną przez bakterie symbiotyczne. Trucizna jest ponad 1000 razy silniejsza od cyjanku i nie ma na nią antidotum!'
    },
    {
      q: 'Jaka jest jedyna twarda część ciała ośmiornicy decydująca o tym, przez jaką szczelinę zdoła się przecisnąć?',
      options: [
        'Szkielet wewnętrzny głowotułowia',
        'Chitynowy dziób w centrum ramion (przypominający dziób papugi)',
        'Pierścienie chrzęstne syfonu odrzutowego',
        'Wapienne tarczki na przyssawkach'
      ],
      correct: 1,
      explain: 'Ośmiornica nie posiada ani jednej kości. Jedynym sztywnym elementem jest twardy dziób. Jeśli dziób przejdzie przez otwór, całe ciało bez trudu przeciśnie się za nim.'
    },
    {
      q: 'Jak szybko ośmiornica potrafi zmienić kolor i strukturę 3D swojej skóry dzięki chromatoforom?',
      options: [
        'Potrzebuje około 2–3 godzin na powolną syntezę barwników',
        'Około 15 minut (podobnie jak kameleon)',
        'W zaledwie 200 milisekund (ułamek sekundy) dzięki bezpośredniej kontroli nerwowej mięśni chromatoforów',
        'Zmienia kolor tylko raz w roku podczas linienia'
      ],
      correct: 2,
      explain: 'W przeciwieństwie do kameleona, który polega na hormonach, chromatofory ośmiornicy są połączone bezpośrednio z układem nerwowym. Zmiana barwy i faktury następuje w zawrotnym tempie ok. 200 ms!'
    }
  ];

  let currentQ = 0;
  let score = 0;

  function renderQuestion() {
    if (meter) {
      meter.style.width = `${(currentQ / questions.length) * 100}%`;
    }

    if (currentQ >= questions.length) {
      renderSummary();
      return;
    }

    const item = questions[currentQ];
    container.innerHTML = `
      <div style="margin-bottom: 12px; font-size: 0.82rem; color: var(--purple-light); font-weight: 700; text-transform: uppercase;">
        Pytanie ${currentQ + 1} z ${questions.length}
      </div>
      <h3 style="margin-bottom: 20px; font-size: 1.25rem;">${item.q}</h3>
      <div class="quiz-options-list" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
        ${item.options.map((opt, idx) => `
          <button class="quiz-option-btn" data-opt-idx="${idx}" style="text-align: left; padding: 14px 18px; border-radius: var(--radius-md); border: 1px solid var(--border); background: rgba(255,255,255,0.02); color: var(--text); font-size: 0.95rem; cursor: pointer; transition: all 0.2s ease;">
            <strong style="color: var(--purple-light); margin-right: 8px;">${String.fromCharCode(65 + idx)}.</strong> ${opt}
          </button>
        `).join('')}
      </div>
      <div id="quizExplainBox" style="display: none; padding: 14px; border-radius: var(--radius-md); font-size: 0.9rem; line-height: 1.5; margin-bottom: 16px;"></div>
      <div style="text-align: right;">
        <button id="nextQBtn" class="btn btn-primary" style="display: none; background: linear-gradient(135deg, #A855F7 0%, #7E22CE 100%);">${(window.swiat_zmyslow_lang === 'en' || (typeof localStorage !== 'undefined' && localStorage.getItem('swiat_zmyslow_lang') === 'en')) ? 'Next →' : 'Dalej →'}</button>
      </div>
    `;

    const optButtons = container.querySelectorAll('.quiz-option-btn');
    const explainBox = document.getElementById('quizExplainBox');
    const nextBtn = document.getElementById('nextQBtn');

    optButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const picked = parseInt(btn.getAttribute('data-opt-idx'));
        optButtons.forEach(b => b.disabled = true);

        if (picked === item.correct) {
          score++;
          btn.style.borderColor = '#10B981';
          btn.style.background = 'rgba(16, 185, 129, 0.15)';
          if (explainBox) {
            explainBox.style.display = 'block';
            explainBox.style.background = 'rgba(16, 185, 129, 0.1)';
            explainBox.style.border = '1px solid #10B981';
            const expl = window.t ? window.t(item.explain) : item.explain;
            const isEn = window.swiat_zmyslow_lang === 'en' || (typeof localStorage !== 'undefined' && localStorage.getItem('swiat_zmyslow_lang') === 'en');
            explainBox.innerHTML = isEn ? `<strong>Correct!</strong> ${expl}` : `<strong>Dobrze!</strong> ${expl}`;
          }
        } else {
          btn.style.borderColor = '#EF4444';
          btn.style.background = 'rgba(239, 68, 68, 0.15)';
          const correctBtn = container.querySelector(`[data-opt-idx="${item.correct}"]`);
          if (correctBtn) {
            correctBtn.style.borderColor = '#10B981';
            correctBtn.style.background = 'rgba(16, 185, 129, 0.15)';
          }
          if (explainBox) {
            explainBox.style.display = 'block';
            explainBox.style.background = 'rgba(239, 68, 68, 0.1)';
            explainBox.style.border = '1px solid #EF4444';
            const expl = window.t ? window.t(item.explain) : item.explain;
            const isEn = window.swiat_zmyslow_lang === 'en' || (typeof localStorage !== 'undefined' && localStorage.getItem('swiat_zmyslow_lang') === 'en');
            explainBox.innerHTML = isEn ? `<strong>Incorrect!</strong> ${expl}` : `<strong>Błąd!</strong> ${expl}`;
          }
        }

        if (nextBtn) {
          nextBtn.style.display = 'inline-block';
          nextBtn.addEventListener('click', () => {
            currentQ++;
            renderQuestion();
          }, { once: true });
        }
      });
    });
  }

  function renderSummary() {
    if (meter) meter.style.width = '100%';
    const pct = Math.round((score / questions.length) * 100);
    const perfect = score === questions.length;

    container.innerHTML = `
      <div style="text-align: center; padding: 20px 10px;">
        <div style="font-size: 3.5rem; margin-bottom: 12px;">${perfect ? '🏆🐙🎨' : '🌊🐙'}</div>
        <h3 style="font-size: 1.5rem; margin-bottom: 8px;">Twój wynik: ${score} z ${questions.length} (${pct}%)</h3>
        <p style="color: var(--text-muted); font-size: 0.95rem; max-width: 460px; margin: 0 auto 24px;">
          ${perfect
            ? 'Genialnie! Znasz fizjologię głowonogów, decentralizację neuronów, rolę błękitnej krwi i potrafisz rozpoznać groźne gatunki!'
            : 'Niezły wynik! Przejrzyj sekcje o ramionach z mini-mózgami i kamuflażu chromatoforów, a potem spróbuj ponownie!'}
        </p>

        ${perfect ? `
          <div style="display: inline-block; background: linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%); border: 1px dashed var(--purple-light); border-radius: var(--radius-md); padding: 16px 24px; margin-bottom: 24px;">
            <span style="font-size: 0.85rem; color: var(--purple-light); font-weight: 700; text-transform: uppercase;">CERTYFIKAT ZMYSŁÓW OTRZYMANY:</span>
            <div style="font-size: 1.1rem; font-weight: 800; color: #fff; margin-top: 4px;">🎨 Mistrz Zmysłów Głowonogów i Badacz Ośmiornic 🐙</div>
          </div>
        ` : ''}

        <div>
          <button id="retryOctoQuizBtn" class="btn btn-secondary">Spróbuj ponownie ↺</button>
        </div>
      </div>
    `;

    document.getElementById('retryOctoQuizBtn')?.addEventListener('click', () => {
      currentQ = 0;
      score = 0;
      renderQuestion();
    });
  }

  renderQuestion();
}

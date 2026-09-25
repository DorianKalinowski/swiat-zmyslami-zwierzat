/* ============================================================
   BEE (PSZCZOŁA MIODNA) — SENSORY SIMULATORS & 10-LEVEL GAME
   Author: Dorian Kalinowski for "Świat zmysłami zwierząt"
   Senses: UV vision (300-650 nm), Polarized light compass, Waggle dance (von Frisch), Electrostatic pollen jump
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initBeeUVSimulator();
  initBeeWaggleSynth();
  initBeeAnatomyInspector();
  initBeeFirstAidQuiz();
  initBeePollinationGame();
  initBeeQuiz();
});

/* ============================================================
   1. UV VISION SIMULATOR (HUMAN VS BEE EYE)
   ============================================================ */
function initBeeUVSimulator() {
  const canvas = document.getElementById('beeUVCanvas');
  const toggleBtn = document.getElementById('beeUVToggleBtn');
  const flowerTypeSelect = document.getElementById('beeFlowerSelect');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.clientWidth || 560);
  let height = (canvas.height = 300);

  window.addEventListener('resize', () => {
    if (!canvas) return;
    width = canvas.width = canvas.clientWidth || 560;
  });

  let mode = 'human'; // 'human' | 'bee'
  let animAngle = 0;

  toggleBtn?.addEventListener('click', () => {
    mode = mode === 'human' ? 'bee' : 'human';
    toggleBtn.textContent = mode === 'human' ? '👁️ Widok człowieka (żółty)' : '✨ Widok pszczoły (UV + tarcza nektarowa)';
    toggleBtn.classList.toggle('active', mode === 'bee');
  });

  flowerTypeSelect?.addEventListener('change', () => {
    // Redraw on select change
  });

  function drawFlower() {
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const flowerType = flowerTypeSelect ? flowerTypeSelect.value : 'dandelion';

    if (mode === 'human') {
      // Background: natural green lawn
      ctx.fillStyle = '#1c2e17';
      ctx.fillRect(0, 0, width, height);

      // Human vision: plain uniform yellow or pink flower
      const petalColor = flowerType === 'dandelion' ? '#FACC15' : (flowerType === 'evening_primrose' ? '#FDE047' : '#FB7185');
      const petalCount = 18;
      const radius = 95;

      ctx.save();
      ctx.translate(centerX, centerY);

      // Draw petals
      for (let i = 0; i < petalCount; i++) {
        ctx.rotate((Math.PI * 2) / petalCount);
        ctx.beginPath();
        ctx.ellipse(0, radius * 0.55, 14, radius * 0.45, 0, 0, Math.PI * 2);
        ctx.fillStyle = petalColor;
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.15)';
        ctx.stroke();
      }

      // Center
      ctx.beginPath();
      ctx.arc(0, 0, 26, 0, Math.PI * 2);
      ctx.fillStyle = '#EAB308';
      ctx.fill();

      ctx.restore();

      // Label
      ctx.fillStyle = '#94A3B8';
      ctx.font = '13px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Widok ludzki: jednolity żółty kwiat bez widocznych ścieżek nektarowych', centerX, height - 20);

    } else {
      // BEE UV VISION
      // Pszczoły nie widzą czerwieni, widzą zieleń, błękit i ultrafiolet (300-400 nm).
      // Środek kwiatu pochłania UV (ciemny "bullseye" celownik), płatki silnie odbijają UV.
      ctx.fillStyle = '#080d1a';
      ctx.fillRect(0, 0, width, height);

      // Compound eye honeycomb subtle grid overlay
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
      ctx.lineWidth = 1;
      const step = 20;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      const petalCount = 18;
      const radius = 95;

      ctx.save();
      ctx.translate(centerX, centerY);

      // Outer petals reflect UV: cyan-violet glowing iridescent
      for (let i = 0; i < petalCount; i++) {
        ctx.rotate((Math.PI * 2) / petalCount);
        ctx.beginPath();
        ctx.ellipse(0, radius * 0.55, 14, radius * 0.45, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(168, 85, 247, 0.75)'; // UV reflection
        ctx.fill();
        ctx.strokeStyle = '#38BDF8';
        ctx.stroke();
      }

      // UV Nectar Guide Lines (drogowskazy nektarowe zbiegające się do środka)
      for (let i = 0; i < petalCount; i++) {
        ctx.rotate((Math.PI * 2) / petalCount);
        ctx.beginPath();
        ctx.moveTo(0, 24);
        ctx.lineTo(0, radius * 0.7);
        ctx.strokeStyle = '#F43F5E';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // Bullseye Center: UV absorption (pochłanianie UV wygląda jak ciemny środek tarczy)
      ctx.beginPath();
      ctx.arc(0, 0, 28, 0, Math.PI * 2);
      ctx.fillStyle = '#030712'; // Ultra dark absorbent center
      ctx.fill();
      ctx.strokeStyle = '#E11D48';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Pulsing nectar landing target indicator
      animAngle += 0.04;
      const pulseR = 32 + Math.sin(animAngle) * 4;
      ctx.beginPath();
      ctx.arc(0, 0, pulseR, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.7)';
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.restore();

      // Label
      ctx.fillStyle = '#38BDF8';
      ctx.font = '13px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Widok pszczoły: ciemny celownik UV (Bullseye) + fluorescencyjne linie wabiące prosto do nektaru!', centerX, height - 20);
    }

    requestAnimationFrame(drawFlower);
  }

  drawFlower();
}

/* ============================================================
   2. WAGGLE DANCE & SOUND SYNTHESIZER (VON FRISCH)
   ============================================================ */
function initBeeWaggleSynth() {
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

  const danceAngleSlider = document.getElementById('waggleAngleSlider');
  const danceDistanceSlider = document.getElementById('waggleDistSlider');
  const angleDisplay = document.getElementById('waggleAngleVal');
  const distDisplay = document.getElementById('waggleDistVal');
  const playDanceBtn = document.getElementById('playWaggleBtn');
  const danceCanvas = document.getElementById('waggleDanceCanvas');

  let angleDeg = 45;
  let distanceMeters = 800;

  danceAngleSlider?.addEventListener('input', () => {
    angleDeg = parseInt(danceAngleSlider.value, 10);
    if (angleDisplay) angleDisplay.textContent = `${angleDeg}° względem słońca`;
  });

  danceDistanceSlider?.addEventListener('input', () => {
    distanceMeters = parseInt(danceDistanceSlider.value, 10);
    if (distDisplay) distDisplay.textContent = `${distanceMeters} m od ula`;
  });

  // Play acoustic vibration of waggle dance (~240-260 Hz thorax vibration)
  function playWaggleSound() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();

      // Base bee wing vibration frequency: 245 Hz
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(245, ctx.currentTime);

      // Tremolo / pulse modulation ~14-16 Hz (częstotliwość potrząsania odwłokiem)
      lfo.frequency.setValueAtTime(15, ctx.currentTime);
      lfoGain.gain.setValueAtTime(0.15, ctx.currentTime);
      lfo.connect(lfoGain);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      lfo.start();
      osc.start();

      osc.stop(ctx.currentTime + 1.6);
      lfo.stop(ctx.currentTime + 1.6);
    } catch (e) {}
  }

  playDanceBtn?.addEventListener('click', playWaggleSound);

  // Canvas visual representation of waggle dance on vertical honeycomb
  if (danceCanvas) {
    const ctx = danceCanvas.getContext('2d');
    let t = 0;

    function renderDance() {
      const w = danceCanvas.width = danceCanvas.clientWidth || 300;
      const h = danceCanvas.height = 200;

      ctx.fillStyle = '#17120a';
      ctx.fillRect(0, 0, w, h);

      // Vertical gravity line (góra plastra = kierunek słońca)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(w / 2, 20);
      ctx.lineTo(w / 2, h - 20);
      ctx.stroke();
      ctx.setLineDash([]);

      // Sun icon at top
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('☀️ Pion = Słońce', w / 2, 18);

      // Dance vector
      const rad = (angleDeg - 90) * (Math.PI / 180);
      const cx = w / 2;
      const cy = h / 2 + 10;
      const len = 55;

      const endX = cx + Math.cos(rad) * len;
      const endY = cy + Math.sin(rad) * len;

      ctx.strokeStyle = '#EAB308';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Waggle oscillating bee
      t += 0.2;
      const waggleOffset = Math.sin(t * 4) * 8;
      const beeX = cx + (Math.cos(rad) * len * 0.5) + Math.cos(rad + Math.PI / 2) * waggleOffset;
      const beeY = cy + (Math.sin(rad) * len * 0.5) + Math.sin(rad + Math.PI / 2) * waggleOffset;

      ctx.save();
      ctx.font = '22px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🐝', beeX, beeY);
      ctx.restore();

      requestAnimationFrame(renderDance);
    }
    renderDance();
  }
}

/* ============================================================
   3. BEE ANATOMY & SENSORY ORGANS INSPECTOR
   ============================================================ */
function initBeeAnatomyInspector() {
  const buttons = document.querySelectorAll('[data-bee-anatomy]');
  const titleEl = document.getElementById('beeAnatomyTitle');
  const descEl = document.getElementById('beeAnatomyDesc');
  const statEl = document.getElementById('beeAnatomyStat');

  if (!buttons.length || !titleEl) return;

  const data = {
    corbicula: {
      title: 'Koszyczki Pyłkowe (Corbiculae na Odnóżach)',
      desc: 'Na goleniach tylnych odnóży robotnicy znajdują się spłaszczone zagłębienia otoczone sztywnymi szczecinkami. Pszczoła w locie zbiera pyłek z całego owłosionego ciała i ubija go w tzw. obnóża pyłkowe ważące do 30% masy jej ciała.',
      stat: 'Pojemność koszyczka: do 15 mg pyłku'
    },
    eyes: {
      title: 'Oczy Złożone (Ommatidia) + 3 Przyoczka (Ocelli)',
      desc: 'Pszczoła ma dwoje wielkich oczu mozaikowych złożonych z ~5000 fasetek (ommatidiów) rejestrujących 300 klatek na sekundę (ludzkie oko widzi ruch płynny już przy 24-30 kl./s). Na czubku głowy ma dodatkowo 3 proste przyoczka mierzące polaryzację nieba.',
      stat: 'Częstotliwość fuzji błysków: 300 Hz'
    },
    antennae: {
      title: 'Czułki z 170 Receptorami Węchu',
      desc: 'Czułki to super-nos, radar wilgotności i termometr w jednym. Pszczoła wyczuwa cząsteczki zapachowe nektaru z kilku kilometrów oraz odbiera feromony królowej matki wewnątrz ciemnego ula.',
      stat: 'Węch w 3D: orientacja przestrzenna nosem'
    },
    stinger: {
      title: 'Żądło z Zadziorami i Zbiornikiem Jadowym',
      desc: 'Żądło to przekształcone pokładełko samicy. Posiada mikroskopijne zadziory (haczyki skierowane wstecz). Po użądleniu człowieka o elastycznej skórze żądło zostaje wyrwane wraz ze zbiorniczkiem jadu i zwojem nerwowym, który jeszcze przez minuty pompuje jad, a pszczoła ginie.',
      stat: 'Apitoksyna: użądlenie śmiertelne dla pszczoły'
    },
    electrostatic: {
      title: 'Ładunek Elektrostatyczny (+100 Voltów w Locie)',
      desc: 'Podczas machania skrzydłami (230 razy na sekundę) pszczoła trze o cząsteczki powietrza i ładuje się dodatnio (nawet do +100V!). Kwiaty mają ładunek ujemny. W rezultacie pyłek dosłownie sam przeskakuje z pręcika na pszczołę jeszcze zanim usiądzie!',
      stat: 'Napięcie elektrostatyczne: do +100 V'
    }
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.getAttribute('data-bee-anatomy');
      const item = data[key];
      if (!item) return;

      titleEl.textContent = item.title;
      descEl.textContent = item.desc;
      if (statEl) statEl.textContent = item.stat;
    });
  });
}

/* ============================================================
   4. FIRST AID PROTOCOL: REMOVING THE STINGER SAFELY
   ============================================================ */
function initBeeFirstAidQuiz() {
  const cards = document.querySelectorAll('.bee-aid-card');
  const resultBox = document.getElementById('beeAidResult');
  if (!cards.length || !resultBox) return;

  const responses = {
    tweezers: {
      type: 'danger',
      title: '❌ ŚMIERTELNY BŁĄD: Pęseta lub ściskanie palcami!',
      text: 'NIGDY nie chwytaj żądła pszczoły pęsetą ani dwoma palcami! Na szczycie wyrwanego żądła znajduje się wciąż pulsujący woreczek jadowy. Ściskając go, działasz jak tłoczek strzykawki — **wstrzykujesz całą dawkę apitoksyny prosto do krwiobiegu**!'
    },
    suck: {
      type: 'danger',
      title: '❌ Błąd: Wysysanie jadu ustami',
      text: 'Wysysanie jadu z rany jest całkowicie nieskuteczne (jad natychmiast łączy się z tkankami) i stwarza ryzyko wprowadzenia bakterii z jamy ustnej do rany.'
    },
    scrape: {
      type: 'success',
      title: '✅ JEDYNY PRAWIDŁOWY PROTOKÓŁ MEDYCZNY (Ratownictwo Medyczne):',
      text: '1. **NATYCHMIAST ZESKROB ŻĄDŁO:** Użyj twardej krawędzi (karty płatniczej, dowodu osobistego, paznokcia lub tępej strony noża) i zeskrob żądło płaskim ruchem w bok, tuż przy samej skórze.<br>2. Dzięki temu oderwiesz je bez uciśnięcia woreczka jadowego!<br>3. Przyłóż zimny okład (lód, kompres żelowy) w celu obkurczenia naczyń i zmniejszenia obrzęku.<br>4. W przypadku duszności, obrzęku krtani lub zawrotów głowy (wstrząs anafilaktyczny) — **natychmiast dzwoń pod 112** i podaj ampułkostrzykawkę z adrenaliną (jeśli osoba jest uczulona).'
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
   5. 10-LEVEL MINIGAME: ZAPYLACZ ŁĄKOWY (LOT PO NEKTAR)
   ============================================================ */
function initBeePollinationGame() {
  const canvas = document.getElementById('beeGameCanvas');
  const overlay = document.getElementById('beeGameOverlay');
  const startBtn = document.getElementById('startBeeGameBtn');
  const nextBtn = document.getElementById('nextBeeLevelBtn');
  const restartBtn = document.getElementById('restartBeeGameBtn');
  const resetBtn = document.getElementById('resetBeeCampaignBtn');

  const timerVal = document.getElementById('beeGameTimer');
  const nectarVal = document.getElementById('beeGameNectar');
  const targetNectarVal = document.getElementById('beeGameTargetNectar');
  const levelBadge = document.getElementById('beeGameLevelBadge');
  const levelDotsContainer = document.getElementById('beeGameLevelDots');
  const overlayIcon = document.getElementById('beeGameOverIcon');
  const overlayTitle = document.getElementById('beeGameOverTitle');
  const overlayDesc = document.getElementById('beeGameOverDesc');

  if (!canvas || !overlay || !startBtn) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.clientWidth || 500);
  let height = (canvas.height = canvas.clientHeight || 340);

  window.addEventListener('resize', () => {
    if (!canvas) return;
    width = canvas.width = canvas.clientWidth || 500;
    height = canvas.height = canvas.clientHeight || 340;
  });

  // Sound FX
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

  function playCollectSound() {
    const c = getAudioCtx();
    if (!c) return;
    try {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, c.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1100, c.currentTime + 0.08);
      gain.gain.setValueAtTime(0.25, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start();
      osc.stop(c.currentTime + 0.08);
    } catch (e) {}
  }

  // 10 Progressive Pollination Stages
  const levels = [
    {
      name: 'Mniszek na Słonecznym Trawniku 🌼',
      desc: 'Pierwsze wiosenne obloty. Zbieraj słodki nektar z mniszków lekarskich.',
      time: 35,
      targetNectar: 100,
      hazards: 0,
      wind: 0
    },
    {
      name: 'Kwitnący Sad Jabłoniowy 🍎🌸',
      desc: 'Drzewa owocowe potrzebują zapylenia! Szukaj kwiatów z jasnym środkiem UV.',
      time: 35,
      targetNectar: 140,
      hazards: 0,
      wind: 0.5
    },
    {
      name: 'Złote Morze Rzepaku 🌾',
      desc: 'Rzepak dostarcza ogromnych ilości nektaru, lecz boczny wiatr znosi lot pszczoły.',
      time: 34,
      targetNectar: 180,
      hazards: 1,
      wind: 1.0
    },
    {
      name: 'Łąka Koniczynowa i Trzmiele ☘️🐝',
      desc: 'Uważaj na trzmiele i gwałtowne podmuchy wiatru. Celuj prosto w kwiaty.',
      time: 32,
      targetNectar: 220,
      hazards: 1,
      wind: 1.2
    },
    {
      name: 'W Koronie Letniej Lipy 🌳✨',
      desc: 'Kwitnąca lipa pachnie na setki metrów! Nektar jest gęsty i bardzo pożywny.',
      time: 32,
      targetNectar: 260,
      hazards: 2,
      wind: 1.4
    },
    {
      name: 'Wrzosowisko w Borze Sosnowym 🪻🌲',
      desc: 'Późne lato na wrzosowisku. Cenne krople miodu wrzosowego wymagają zręczności.',
      time: 30,
      targetNectar: 300,
      hazards: 2,
      wind: 1.6
    },
    {
      name: 'Zbliżająca się Burza Letnia ⛈️⚡',
      desc: 'Ciężkie krople deszczu spadają z nieba! Jedna kropla może strącić pszczołę.',
      time: 30,
      targetNectar: 340,
      hazards: 3,
      wind: 2.0
    },
    {
      name: 'Ogród Botaniczny: Polowanie Szerszenia 🐝⚠️',
      desc: 'Szerszeń azjatycki patroluje przestrzeń! Omijaj drapieżnika za wszelką cenę.',
      time: 28,
      targetNectar: 380,
      hazards: 3,
      wind: 2.0
    },
    {
      name: 'Złota Nawłoć Późną Jesienią 🌾🍯',
      desc: 'Ostatni pożytek sezonu przed nadejściem mrozów. Każda kropla nektaru to życie ula.',
      time: 28,
      targetNectar: 420,
      hazards: 4,
      wind: 2.2
    },
    {
      name: 'Triumfalny Powrót do Ula — Królowa Czeka 👑🍯✨',
      desc: 'Finałowa misja! Zgromadź 460 mg nektaru i wykonaj w ulu taniec wywijany (waggle dance)!',
      time: 30,
      targetNectar: 460,
      hazards: 4,
      wind: 2.5
    }
  ];

  let currentLevelIdx = 0;
  let isPlaying = false;
  let timeLeft = 35;
  let timerInterval = null;
  let animId = null;
  let currentNectar = 0;

  // Bee Pos
  let beeX = 50;
  let beeY = 170;
  let targetBeeX = 50;
  let targetBeeY = 170;

  // Entities
  let flowers = [];
  let hazards = [];

  function spawnLevelEntities() {
    const lvl = levels[currentLevelIdx];
    flowers = [];
    hazards = [];

    const flowerEmojis = ['🌼', '🌸', '🪻', '🌻', '🌺'];

    for (let i = 0; i < 10; i++) {
      flowers.push({
        x: 80 + Math.random() * (width - 120),
        y: 40 + Math.random() * (height - 80),
        emoji: flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)],
        nectar: 35 + Math.floor(Math.random() * 25),
        collected: false
      });
    }

    for (let i = 0; i < lvl.hazards; i++) {
      hazards.push({
        x: 140 + Math.random() * (width - 180),
        y: 40 + Math.random() * (height - 80),
        vx: (Math.random() - 0.5) * 2.2,
        vy: (Math.random() - 0.5) * 2.2,
        type: i % 2 === 0 ? '🌧️' : '⚠️'
      });
    }
  }

  function updateHUD() {
    const lvl = levels[currentLevelIdx];
    if (levelBadge) {
      levelBadge.innerHTML = `<span>Misja ${currentLevelIdx + 1}/${levels.length}:</span> ${lvl.name}`;
    }
    if (levelDotsContainer) {
      if (levelDotsContainer.children.length !== levels.length) {
        levelDotsContainer.innerHTML = levels.map((_, i) => `<span class="level-dot" title="Poziom ${i + 1}"></span>`).join('');
      }
      const dots = levelDotsContainer.querySelectorAll('.level-dot');
      dots.forEach((dot, idx) => {
        dot.className = 'level-dot';
        if (idx < currentLevelIdx) dot.classList.add('completed');
        else if (idx === currentLevelIdx) dot.classList.add('active');
      });
    }
    if (nectarVal) nectarVal.textContent = `${currentNectar} mg`;
    if (targetNectarVal) targetNectarVal.textContent = `${lvl.targetNectar} mg`;
    if (timerVal) timerVal.textContent = `${timeLeft}s`;
  }

  function handlePointer(e) {
    if (!isPlaying) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    targetBeeX = Math.max(20, Math.min(width - 20, clientX - rect.left));
    targetBeeY = Math.max(20, Math.min(height - 20, clientY - rect.top));
  }

  canvas.addEventListener('mousemove', handlePointer);
  canvas.addEventListener('touchstart', (e) => { e.preventDefault(); handlePointer(e); }, { passive: false });
  canvas.addEventListener('touchmove', (e) => { e.preventDefault(); handlePointer(e); }, { passive: false });

  function startGame(lvlIdx = 0) {
    currentLevelIdx = lvlIdx;
    const lvl = levels[currentLevelIdx];
    isPlaying = true;
    timeLeft = lvl.time;
    currentNectar = 0;
    beeX = 50;
    beeY = height / 2;
    targetBeeX = 50;
    targetBeeY = height / 2;

    spawnLevelEntities();
    updateHUD();

    overlay.classList.add('hidden');
    overlay.classList.remove('show');
    overlay.style.display = 'none';
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      if (timerVal) timerVal.textContent = `${timeLeft}s`;
      if (timeLeft <= 0) {
        endGame(false, '⏱️ Zmierzch nad pasieką!', 'Słońce zaszło i pszczoły tracą zdolność nawigacji na spolaryzowane światło. Zbierz nektar sprawniej!');
      }
    }, 1000);

    loop();
  }

  function endGame(victory, title, desc) {
    isPlaying = false;
    if (timerInterval) clearInterval(timerInterval);
    if (animId) cancelAnimationFrame(animId);

    overlay.classList.remove('hidden');
    overlay.classList.add('show');
    overlay.style.display = 'flex';
    overlayTitle.textContent = title;
    overlayDesc.innerHTML = desc;

    if (victory) {
      overlayIcon.textContent = '🏆🐝👑';
      if (currentLevelIdx < levels.length - 1) {
        startBtn.style.display = 'none';
        nextBtn.style.display = 'inline-block';
        restartBtn.style.display = 'none';
        resetBtn.style.display = 'none';
      } else {
        startBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        restartBtn.style.display = 'none';
        resetBtn.style.display = 'inline-block';
      }
    } else {
      overlayIcon.textContent = '🐝🌧️';
      startBtn.style.display = 'none';
      nextBtn.style.display = 'none';
      restartBtn.style.display = 'inline-block';
      resetBtn.style.display = 'none';
    }
  }

  function loop() {
    if (!isPlaying) return;

    // Movement interpolation + wind drift
    const lvl = levels[currentLevelIdx];
    const windOffset = Math.sin(Date.now() * 0.003) * lvl.wind;
    beeX += (targetBeeX - beeX) * 0.14 + windOffset;
    beeY += (targetBeeY - beeY) * 0.14;

    ctx.fillStyle = '#10151E';
    ctx.fillRect(0, 0, width, height);

    // Subtle meadow grass texture
    ctx.fillStyle = '#162214';
    ctx.fillRect(0, height - 25, width, 25);

    // Hazards (rain drops / hornets)
    hazards.forEach(h => {
      h.x += h.vx;
      h.y += h.vy;
      if (h.x < 30 || h.x > width - 30) h.vx *= -1;
      if (h.y < 30 || h.y > height - 30) h.vy *= -1;

      ctx.save();
      ctx.font = '22px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(h.type, h.x, h.y);
      ctx.restore();

      const d = Math.hypot(beeX - h.x, beeY - h.y);
      if (d < 28) {
        endGame(false, '⚠️ Zderzenie z zagrożeniem!', 'Pszczoła wpadła na kroplę deszczu lub drapieżnika! Wracaj na łąkę i omijaj przeszkody.');
      }
    });

    // Flowers
    flowers.forEach(f => {
      if (f.collected) return;

      // Glow circle around uncollected flowers
      ctx.save();
      ctx.beginPath();
      ctx.arc(f.x, f.y, 18, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(234, 179, 8, 0.15)';
      ctx.fill();

      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(f.emoji, f.x, f.y);
      ctx.restore();

      // Collect detection
      const d = Math.hypot(beeX - f.x, beeY - f.y);
      if (d < 26) {
        f.collected = true;
        currentNectar += f.nectar;
        playCollectSound();
        if (nectarVal) nectarVal.textContent = `${currentNectar} mg`;

        if (currentNectar >= lvl.targetNectar) {
          endGame(true, `🎉 Misja ${currentLevelIdx + 1} Zrealizowana!`, `Pszczoła napełniła wole miodowe (${currentNectar} mg). Pasieka rośnie w siłę!`);
        }
      }
    });

    // Draw Bee Player
    ctx.save();
    ctx.font = '28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🐝', beeX, beeY);
    ctx.restore();

    animId = requestAnimationFrame(loop);
  }

  startBtn?.addEventListener('click', () => startGame(0));
  restartBtn?.addEventListener('click', () => startGame(currentLevelIdx));
  nextBtn?.addEventListener('click', () => startGame(currentLevelIdx + 1));
  resetBtn?.addEventListener('click', () => startGame(0));
}

/* ============================================================
   INTERACTIVE 5-QUESTION QUIZ: MISTRZ ZMYSŁÓW PSZCZOŁY
   ============================================================ */
function initBeeQuiz() {
  const quizBody = document.getElementById('beeQuizDynamicBody');
  const progressBar = document.getElementById('beeQuizMeterProgress');

  if (!quizBody || !progressBar) return;

  const questions = [
    {
      q: 'Jakiego koloru widzialnego dla człowieka pszczoła miodna NIE dostrzega i widzi go jako czerń?',
      options: [
        'Koloru żółtego',
        'Koloru niebieskiego',
        'Koloru czerwonego (nie posiada receptorów czerwieni)',
        'Pszczoły widzą dokładnie wszystkie kolory co człowiek'
      ],
      correct: 2,
      explanation: 'Oczy złożone pszczoły mają receptory dla zieleni, błękitu i ultrafioletu (UV). Zakres widzenia pszczoły jest przesunięty ku falom krótszym — nie widzi barwy czerwonej, widząc ją jako ciemność lub czerń!'
    },
    {
      q: 'Czym są tzw. „ścieżki nektarowe” (nectar guides) na płatkach kwiatów?',
      options: [
        'Sztucznymi ścieżkami wydeptanymi przez mrówki',
        'Wzorami i pasami widocznymi wyłącznie w ultrafiolecie (UV), które wskazują pszczole drogę do nektaru niczym pas startowy',
        'Kroplami rosy odbijającymi światło słoneczne',
        'Śladami zapachowymi zostawianymi przez trutnie'
      ],
      correct: 1,
      explanation: 'Wiele kwiatów (np. mniszek, fiołek, storczyk) wygląda dla nas jednolicie, lecz w ultrafiolecie ma jaskrawe tarcze i ciemne pasy zbiegające się wprost do nektarium — to ewolucyjny drogowskaz dla zapylaczy!'
    },
    {
      q: 'Jak należy prawidłowo usunąć żądło pszczoły ze skóry po użądleniu?',
      options: [
        'Ścisnąć mocno pęsetą lub dwoma palcami i pociągnąć',
        'Zeskrobać żądło płasko przy skórze kartą płatniczą, dowodem lub paznokciem, by nie ścisnąć woreczka jadowego',
        'Naciąć skórę i wycisnąć jad',
        'Polać żądło wrzątkiem lub spirytusem'
      ],
      correct: 1,
      explanation: 'Ściskanie żądła pęsetą lub palcami działa jak tłok w strzykawce — wstrzykuje resztki jadu z pulsującego woreczka do krwiobiegu! Należy natychmiast zeskrobać żądło płaskim ruchem krawędzi karty lub paznokcia.'
    },
    {
      q: 'W jaki sposób pszczoła zwiadowczyni informuje siostry w ulu o odległości i kierunku nowego pożytku kwiatowego?',
      options: [
        'Wydaje ultradźwiękowe piski jak nietoperz',
        'Wylatuje z ula i prowadzi cały rój za sobą',
        'Wykonuje na pionowym plastrze w ulu tzw. taniec wywijany (waggle dance), wskazując kąt względem słońca',
        'Wydziela feromon strachu'
      ],
      correct: 2,
      explanation: 'Karl von Frisch otrzymał Nagrodę Nobla za odszyfrowanie tańca pszczół. Kąt osi tańca względem pionu odpowiada kątowi między słońcem a kwiatami, a czas trwania i tempo drżenia odwłoka precyzyjnie określają odległość!'
    },
    {
      q: 'Dlaczego pszczoła robotnica ginie po użądleniu człowieka, podczas gdy osa może żądlić wielokrotnie?',
      options: [
        'Pszczoła umiera z żalu po użądleniu',
        'Żądło pszczoły ma mikroskopijne zadziory, które zakotwiczają się w elastycznej skórze ssaków i odrywają się wraz z odwłokiem',
        'Jad pszczeli jest trujący dla samej pszczoły',
        'Pszczoła ma za mało energii, by przeżyć użądlenie'
      ],
      correct: 1,
      explanation: 'Żądło osy jest gładkie jak igła do szycia — może je wbić i wyciągnąć bez trudu. Żądło pszczoły ma haczyki (jak harpun). W chitynowym pancerzu owada pszczoła może je wysunąć, ale w elastycznej skórze ssaka żądło zostaje wyrwane z wnętrznościami.'
    }
  ];

  let currentIdx = 0;
  let score = 0;

  function renderQuestion() {
    if (currentIdx >= questions.length) {
      renderSummary();
      return;
    }

    const qData = questions[currentIdx];
    progressBar.style.width = `${(currentIdx / questions.length) * 100}%`;

    const letters = ['A', 'B', 'C', 'D'];
    quizBody.innerHTML = `
      <div class="quiz-step-tag">PYTANIE ${currentIdx + 1} Z ${questions.length}</div>
      <h3 class="quiz-question-title">${qData.q}</h3>
      <div class="quiz-options-list">
        ${qData.options.map((opt, i) => `
          <button class="quiz-opt-btn" data-index="${i}">
            <span class="quiz-opt-letter">${letters[i]}</span>
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>
      <div id="beeQuizFeedback"></div>
      <div class="quiz-action-bar" id="beeQuizNextBar" style="display: none; margin-top: 20px;">
        <button class="btn btn-primary" id="beeQuizNextBtn" style="background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);">
          ${currentIdx < questions.length - 1 ? 'Następne pytanie →' : 'Zobacz certyfikat wiedzy →'}
        </button>
      </div>
    `;

    const optButtons = quizBody.querySelectorAll('.quiz-opt-btn');
    optButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const selected = parseInt(btn.dataset.index);
        handleAnswer(selected, qData, optButtons);
      });
    });
  }

  function handleAnswer(selected, qData, optButtons) {
    optButtons.forEach(b => b.classList.add('disabled'));

    const feedbackEl = document.getElementById('beeQuizFeedback');
    const nextBar = document.getElementById('beeQuizNextBar');

    optButtons[qData.correct].classList.add('correct');

    if (selected === qData.correct) {
      score++;
      feedbackEl.className = 'quiz-feedback-banner success';
      feedbackEl.innerHTML = `<strong>Świetnie!</strong> ${qData.explanation}`;
    } else {
      optButtons[selected].classList.add('wrong');
      feedbackEl.className = 'quiz-feedback-banner failure';
      feedbackEl.innerHTML = `<strong>Niepoprawnie.</strong> ${qData.explanation}`;
    }

    nextBar.style.display = 'flex';
    document.getElementById('beeQuizNextBtn').addEventListener('click', () => {
      currentIdx++;
      renderQuestion();
    });
  }

  function renderSummary() {
    progressBar.style.width = '100%';
    const percent = Math.round((score / questions.length) * 100);

    let rankTitle = 'Mistrz Wiedzy Pszczelej i Zapylania 🐝';
    let badgeEmoji = '👑';
    let rankDesc = 'Znakomicie! Rozumiesz widzenie w ultrafiolecie, taniec wywijany von Frischa oraz zasady pierwszej pomocy ratujące zdrowie.';

    if (percent < 80 && percent >= 60) {
      rankTitle = 'Przyjaciel Pszczół i Pasiecznik 🍯';
      badgeEmoji = '🎖️';
      rankDesc = 'Bardzo dobry wynik! Wiesz, dlaczego zeskrobywanie żądła jest kluczowe i jak pszczoły widzą kwiaty.';
    } else if (percent < 60) {
      rankTitle = 'Młody Entomolog 📚';
      badgeEmoji = '🌸';
      rankDesc = 'Warto przejrzeć symulator widzenia UV i protokół użądlenia raz jeszcze — pszczoły odpowiadają za co trzeci kęs jedzenia na Ziemi!';
    }

    quizBody.innerHTML = `
      <div class="quiz-certificate">
        <div class="certificate-badge-emoji">${badgeEmoji}</div>
        <div class="certificate-score">${score} / ${questions.length}</div>
        <h3 class="certificate-title">${rankTitle}</h3>
        <p class="certificate-desc">${rankDesc}</p>
        <button class="btn btn-primary" id="beeQuizRestartBtn" style="background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);">Rozwiąż quiz ponownie ↺</button>
      </div>
    `;

    document.getElementById('beeQuizRestartBtn').addEventListener('click', () => {
      currentIdx = 0;
      score = 0;
      renderQuestion();
    });
  }

  renderQuestion();
}


/* ============================================================
   FOX (LIS RUDY) — SENSORY SIMULATORS & 10-LEVEL GAME
   Author: Dorian Kalinowski for "Świat zmysłami zwierząt"
   Senses: Geomagnetic pounce (Earth's magnetic field), Snow acoustics, Cat-like slit pupils
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initFoxCompassSimulator();
  initFoxAcousticsSynth();
  initFoxAnatomyInspector();
  initFoxEchinococcusQuiz();
  initFoxPounceGame();
  initFoxQuiz();
});

/* ============================================================
   1. GEOMAGNETIC COMPASS & POUNCE SIMULATOR
   ============================================================ */
function initFoxCompassSimulator() {
  const canvas = document.getElementById('foxCompassCanvas');
  const angleSlider = document.getElementById('foxHeadingSlider');
  const angleVal = document.getElementById('foxHeadingVal');
  const pounceBtn = document.getElementById('foxTestPounceBtn');
  const resultText = document.getElementById('foxPounceResultText');
  if (!canvas || !angleSlider) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.clientWidth || 500);
  let height = (canvas.height = 280);

  window.addEventListener('resize', () => {
    if (!canvas) return;
    width = canvas.width = canvas.clientWidth || 500;
  });

  let headingDeg = 20; // 20 deg = North-East (optimal magnetic vector)

  angleSlider.addEventListener('input', () => {
    headingDeg = parseInt(angleSlider.value, 10);
    if (angleVal) {
      const cardinal = getCardinal(headingDeg);
      angleVal.textContent = `${headingDeg}° (${cardinal})`;
    }
    updateSuccessProbability();
  });

  function getCardinal(deg) {
    if (deg >= 340 || deg <= 20) return 'N (Północ)';
    if (deg > 20 && deg < 70) return 'NE (Północny Wschód - OPTIMUM!)';
    if (deg >= 70 && deg <= 110) return 'E (Wschód)';
    if (deg > 110 && deg < 160) return 'SE (Południowy Wschód)';
    if (deg >= 160 && deg <= 200) return 'S (Południe)';
    if (deg > 200 && deg < 250) return 'SW (Południowy Zachód)';
    if (deg >= 250 && deg <= 290) return 'W (Zachód)';
    return 'NW (Północny Zachód)';
  }

  function updateSuccessProbability() {
    // Červený study: 73% success at NE (around 20-30 deg), drops to ~18% elsewhere
    const diff = Math.abs(headingDeg - 20);
    const normalizedDiff = Math.min(diff, 360 - diff);
    let prob = 18;
    if (normalizedDiff < 20) {
      prob = 73 - normalizedDiff * 1.5;
    } else if (normalizedDiff < 50) {
      prob = 40 - (normalizedDiff - 20) * 0.7;
    }
    if (resultText) {
      resultText.innerHTML = `Szansa na udany skok myszkujący: <strong>${Math.round(prob)}%</strong> ${normalizedDiff < 20 ? '🎯 (Idealny wektor geomagnetyczny!)' : '📉 (Rozbieżność słuchowo-magnetyczna)'}`;
    }
  }

  updateSuccessProbability();

  pounceBtn?.addEventListener('click', () => {
    // Visual pounce animation trigger
    animatePounce();
  });

  let pounceProgress = 0;
  let isPouncing = false;

  function animatePounce() {
    if (isPouncing) return;
    isPouncing = true;
    pounceProgress = 0;
  }

  function renderCompass() {
    ctx.fillStyle = '#080E14';
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const r = 90;

    // Draw Magnetic Field Lines (flowing North)
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.lineWidth = 1.5;
    for (let x = 20; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, height);
      ctx.bezierCurveTo(x + 10, height * 0.6, x - 10, height * 0.4, x, 0);
      ctx.stroke();
    }

    // Compass circle
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Optimal NE Sector Highlight (10° to 35°)
    const startRad = (10 - 90) * (Math.PI / 180);
    const endRad = (35 - 90) * (Math.PI / 180);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startRad, endRad);
    ctx.closePath();
    ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
    ctx.fill();
    ctx.strokeStyle = '#10B981';
    ctx.stroke();

    // Cardinal labels
    ctx.fillStyle = '#94A3B8';
    ctx.font = '12px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('N (0°)', cx, cy - r - 14);
    ctx.fillText('E (90°)', cx + r + 24, cy);
    ctx.fillText('S (180°)', cx, cy + r + 14);
    ctx.fillText('W (270°)', cx - r - 24, cy);

    ctx.fillStyle = '#10B981';
    ctx.fillText('NE (73% sukcesu)', cx + r * 0.7, cy - r * 0.7);

    // Fox Heading Vector
    const rad = (headingDeg - 90) * (Math.PI / 180);
    const vecX = cx + Math.cos(rad) * (r - 10);
    const vecY = cy + Math.sin(rad) * (r - 10);

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(vecX, vecY);
    ctx.strokeStyle = '#EA580C';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Fox avatar in center
    ctx.save();
    ctx.font = '28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🦊', cx, cy);
    ctx.restore();

    // Pounce Animation if active
    if (isPouncing) {
      pounceProgress += 0.05;
      const jumpY = -Math.sin(pounceProgress * Math.PI) * 40;
      const jumpX = Math.cos(rad) * pounceProgress * 50;
      const curY = cy + Math.sin(rad) * pounceProgress * 50 + jumpY;

      ctx.save();
      ctx.font = '26px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🐾', cx + jumpX, curY);
      ctx.restore();

      if (pounceProgress >= 1) {
        isPouncing = false;
      }
    }

    requestAnimationFrame(renderCompass);
  }

  renderCompass();
}

/* ============================================================
   2. SNOW ACOUSTICS & FOX VOCALS SYNTHESIZER
   ============================================================ */
function initFoxAcousticsSynth() {
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

  const playRustleBtn = document.getElementById('playFoxRustleBtn');
  const playBarkBtn = document.getElementById('playFoxBarkBtn');
  const playGeckerBtn = document.getElementById('playFoxGeckerBtn');

  // Mouse rustle under deep snow (dźwięk chrupania i szelestu pod śniegiem)
  function playSnowRustle() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      const bufferSize = ctx.sampleRate * 0.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.2;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass around 1200 Hz with high Q to simulate snow muffled scraping
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.Q.setValueAtTime(3.5, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch (e) {}
  }

  // Fox nocturnal bark / scream (nocny, skrzeczący szczek lisa)
  function playFoxBark() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + 0.35);

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, ctx.currentTime);
      filter.Q.setValueAtTime(2.0, ctx.currentTime);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {}
  }

  // Fox geckering (chichot / serdeczne gaworzenie lisów)
  function playFoxGecker() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      [0, 0.08, 0.16, 0.24, 0.32].forEach((delay, idx) => {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(850 + (idx % 2 === 0 ? 100 : -100), ctx.currentTime);
          osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.05);

          gain.gain.setValueAtTime(0.25, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.05);
        }, delay * 1000);
      });
    } catch (e) {}
  }

  playRustleBtn?.addEventListener('click', playSnowRustle);
  playBarkBtn?.addEventListener('click', playFoxBark);
  playGeckerBtn?.addEventListener('click', playFoxGecker);
}

/* ============================================================
   3. FOX ANATOMY & SENSORY INSPECTOR
   ============================================================ */
function initFoxAnatomyInspector() {
  const buttons = document.querySelectorAll('[data-fox-anatomy]');
  const titleEl = document.getElementById('foxAnatomyTitle');
  const descEl = document.getElementById('foxAnatomyDesc');
  const statEl = document.getElementById('foxAnatomyStat');

  if (!buttons.length || !titleEl) return;

  const data = {
    ears: {
      title: 'Trójkątne Małżowiny (Słuch Pod Śniegiem)',
      desc: 'Uszy lisa obracają się niezależnie o 180 stopni. Posiadają zdolność triangulacji dźwięku w pionie i poziomie z dokładnością do 1 stopnia. Lis potrafi usłyszeć chrobot ząbków myszy pod warstwą 1 metra ubitego śniegu z odległości 30 metrów!',
      stat: 'Czułość słuchu: do 65 kHz (ultradźwięki gryzoni)'
    },
    eyes: {
      title: 'Pionowe Źrenice Szczelinowe (Jedyne u Psowatych)',
      desc: 'Lis jest jedynym przedstawicielem rodziny psowatych (Canidae), który posiada pionowe źrenice szczelinowe jak u kotów! Pozwalają one na precyzyjną ocenę odległości w trawie i błyskawiczne zwężenie w ostrym świetle zimowego śniegu.',
      stat: 'Wzrok: pionowa szczelina + tapetum lucidum'
    },
    magnetic: {
      title: 'Geomagnetyczny Zmysł Kompasowy (Kryptochromy)',
      desc: 'W siatkówce oka lisa wykryto kryptochromy — fotoreceptory czułe na ziemskie pole magnetyczne. Lis widzi cień lub smugę pola magnetycznego, którą dopasowuje do docierającego dźwięku chrobotu gryzonia, wykonując skok z 73% skutecznością!',
      stat: 'Wektor ataku: Północny Wschód (~20°)'
    },
    tail: {
      title: 'Puszysta Kita (Ster Aerodynamiczny i Kołdra)',
      desc: 'Ogon lisa stanowi 1/3 długości jego ciała. Podczas wysokich skoków myszkujących (do 2 metrów w górę) kita działa jak żyroskop i ster aerodynamiczny. Zimą lis owija nią pysk i łapy, chroniąc nozdrza przed odmrożeniem.',
      stat: 'Długość ogona: 35–45 cm (żyroskop skoku)'
    },
    paws: {
      title: 'Ocieplane i Owłosione Opuszki Łap',
      desc: 'Zimą poduszki łap lisa porastają gęstym, sztywnym futrem. Zmniejsza to utratę ciepła na lodzie, zapobiega ślizganiu się i pozwala na całkowicie bezszelestne skradanie się po zmrożonym śniegu.',
      stat: 'Adaptacja zimowa: naturalne raki śnieżne'
    }
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.getAttribute('data-fox-anatomy');
      const item = data[key];
      if (!item) return;

      titleEl.textContent = item.title;
      descEl.textContent = item.desc;
      if (statEl) statEl.textContent = item.stat;
    });
  });
}

/* ============================================================
   4. ECHINOCOCCOSIS & URBAN FOX SAFETY QUIZ
   ============================================================ */
function initFoxEchinococcusQuiz() {
  const cards = document.querySelectorAll('.fox-aid-card');
  const resultBox = document.getElementById('foxAidResult');
  if (!cards.length || !resultBox) return;

  const responses = {
    eat_unwashed: {
      type: 'danger',
      title: '❌ ŚMIERTELNE ZAGROŻENIE: Jedzenie niemytych owoców leśnych!',
      text: 'Jedzenie borówek, poziomek czy jeżyn prosto z krzaczka w lesie niesie ryzyko zarażenia jajami **tasiemca bąblowcowego (Echinococcus multilocularis)**. Jaja wydalane z kałem lisów są mikroskopijne i odporne na mróz. Bąblowica rozwija się w wątrobie przez 10-15 lat jak guz nowotworowy!'
    },
    touch_urban: {
      type: 'danger',
      title: '❌ Ryzyko pogryzienia: Podchodzenie do lisa w mieście',
      text: 'Miejski lis, który nie boi się człowieka, nie jest oswojonym pieskiem. Może być chory, nosić świerzbowca lub ugryźć w obronie zdobytego ze śmietnika pożywienia.'
    },
    wash_berries: {
      type: 'success',
      title: '✅ ŻELAZNE ZASADY BEZPIECZEŃSTWA (Sanepid i Medycyna):',
      text: '1. **ZAWSZE MYJ LEŚNE OWOCE:** Mycie borówek i poziomek pod bieżącą ciepłą wodą skutecznie spłukuje jaja bąblowca.<br>2. **ODROBACZAJ PSY I KOTY:** Domowe czworonogi biegające po lesie mogą przenieść jaja bąblowca na sierści.<br>3. **LIS W MIEŚCIE:** Zabezpieczaj osiedlowe śmietniki i nie zostawiaj karmy dla kotów na zewnątrz. Lis to dzikie zwierzę — zachowaj dystans!'
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
   5. 10-LEVEL MINIGAME: MAGNETYCZNY SKOK W ŚNIEG (POUNCE)
   ============================================================ */
function initFoxPounceGame() {
  const canvas = document.getElementById('foxGameCanvas');
  const overlay = document.getElementById('foxGameOverlay');
  const startBtn = document.getElementById('startFoxGameBtn');
  const nextBtn = document.getElementById('nextFoxLevelBtn');
  const restartBtn = document.getElementById('restartFoxGameBtn');
  const resetBtn = document.getElementById('resetFoxCampaignBtn');

  const timerVal = document.getElementById('foxGameTimer');
  const miceVal = document.getElementById('foxGameMice');
  const targetMiceVal = document.getElementById('foxGameTargetMice');
  const levelBadge = document.getElementById('foxGameLevelBadge');
  const levelDotsContainer = document.getElementById('foxGameLevelDots');
  const overlayIcon = document.getElementById('foxGameOverIcon');
  const overlayTitle = document.getElementById('foxGameOverTitle');
  const overlayDesc = document.getElementById('foxGameOverDesc');

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

  function playCatchSound() {
    const c = getAudioCtx();
    if (!c) return;
    try {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, c.currentTime);
      osc.frequency.linearRampToValueAtTime(800, c.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start();
      osc.stop(c.currentTime + 0.12);
    } catch (e) {}
  }

  // 10 Progressive Winter Hunting Missions
  const levels = [
    {
      name: 'Zaśnieżone Ściernisko pod Białymstokiem 🌾❄️',
      desc: 'Pierwszy śnieg. Cienki puch pozwala łatwo namierzyć szelest nornicy.',
      time: 35,
      targetMice: 4,
      hazards: 0
    },
    {
      name: 'Miedza Śródpolna na Mazowszu 🐭❄️',
      desc: 'Gryzonie kryją się pod zaspami przy rowie melioracyjnym.',
      time: 35,
      targetMice: 5,
      hazards: 0
    },
    {
      name: 'Skraj Puszczy Kampinoskiej 🌲🦊',
      desc: 'Głębszy śnieg tłumi dźwięki. Skacz pod kątem północno-wschodnim!',
      time: 34,
      targetMice: 6,
      hazards: 1
    },
    {
      name: 'Zamarznięte Bagna Biebrzańskie 🌾🌫️',
      desc: 'Poranna mgła i zmarznięty lód. Uważaj na kruchy lód na rowach.',
      time: 32,
      targetMice: 7,
      hazards: 1
    },
    {
      name: 'Głębokie Zaspy Roztoczańskie 🪵❄️',
      desc: 'Zaspy do 40 cm. Skok myszkujący wymaga potężnego wybicia w górę.',
      time: 32,
      targetMice: 8,
      hazards: 2
    },
    {
      name: 'Zimowe Pogórze Przemyskie 🏔️',
      desc: 'Stromy stok i wiatr z połonin. Precyzyjna triangulacja słuchowa.',
      time: 30,
      targetMice: 8,
      hazards: 2
    },
    {
      name: 'Nocna Zamieć na Suwalszczyźnie 🌨️🥶',
      desc: 'Biegun zimna! Temperatura -20°C. Słuchaj chrupania ziaren pod śniegiem.',
      time: 30,
      targetMice: 9,
      hazards: 3
    },
    {
      name: 'Skraj Wsi — Omiń Psa Podwórzowego 🐕⚠️',
      desc: 'Gryzonie przy stogach siana. Omijaj szczekające psy łańcuchowe!',
      time: 28,
      targetMice: 9,
      hazards: 3
    },
    {
      name: 'Odwilż w Puszczy Białowieskiej 🌲💧',
      desc: 'Kapiący z gałęzi śnieg myli słuch. Skup się wyłącznie na wibracjach.',
      time: 28,
      targetMice: 10,
      hazards: 4
    },
    {
      name: 'Arcymistrz Magnetycznego Skoku 🦊👑❄️',
      desc: 'Finałowe wyzwanie! Złów 11 gryzoni w perfekcyjnym wektorze Północ-Wschód!',
      time: 30,
      targetMice: 11,
      hazards: 4
    }
  ];

  let currentLevelIdx = 0;
  let isPlaying = false;
  let timeLeft = 35;
  let timerInterval = null;
  let animId = null;
  let currentMice = 0;

  // Fox Pos
  let foxX = 50;
  let foxY = 170;
  let targetFoxX = 50;
  let targetFoxY = 170;

  // Entities
  let snowMounds = [];
  let hazards = [];

  function spawnLevelEntities() {
    const lvl = levels[currentLevelIdx];
    snowMounds = [];
    hazards = [];

    for (let i = 0; i < 12; i++) {
      snowMounds.push({
        x: 80 + Math.random() * (width - 120),
        y: 40 + Math.random() * (height - 80),
        hasMouse: true,
        revealed: false,
        pulseAngle: Math.random() * Math.PI * 2
      });
    }

    for (let i = 0; i < lvl.hazards; i++) {
      hazards.push({
        x: 140 + Math.random() * (width - 180),
        y: 40 + Math.random() * (height - 80),
        vx: (Math.random() - 0.5) * 2.0,
        vy: (Math.random() - 0.5) * 2.0,
        type: i % 2 === 0 ? '🐕' : '🧊'
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
    if (miceVal) miceVal.textContent = `${currentMice} myszy`;
    if (targetMiceVal) targetMiceVal.textContent = `${lvl.targetMice} myszy`;
    if (timerVal) timerVal.textContent = `${timeLeft}s`;
  }

  function handlePointer(e) {
    if (!isPlaying) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    targetFoxX = Math.max(25, Math.min(width - 25, clientX - rect.left));
    targetFoxY = Math.max(25, Math.min(height - 25, clientY - rect.top));
  }

  canvas.addEventListener('mousemove', handlePointer);
  canvas.addEventListener('touchstart', (e) => { e.preventDefault(); handlePointer(e); }, { passive: false });
  canvas.addEventListener('touchmove', (e) => { e.preventDefault(); handlePointer(e); }, { passive: false });

  function startGame(lvlIdx = 0) {
    currentLevelIdx = lvlIdx;
    const lvl = levels[currentLevelIdx];
    isPlaying = true;
    timeLeft = lvl.time;
    currentMice = 0;
    foxX = 50;
    foxY = height / 2;
    targetFoxX = 50;
    targetFoxY = height / 2;

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
        endGame(false, '⏱️ Zapadła zimowa noc!', 'Myszki schowały się głęboko pod zmarzlinę. Spróbuj ponownie i poluj sprawniej!');
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
      overlayIcon.textContent = '🏆🦊👑';
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
      overlayIcon.textContent = '🦊❄️';
      startBtn.style.display = 'none';
      nextBtn.style.display = 'none';
      restartBtn.style.display = 'inline-block';
      resetBtn.style.display = 'none';
    }
  }

  function loop() {
    if (!isPlaying) return;

    foxX += (targetFoxX - foxX) * 0.14;
    foxY += (targetFoxY - foxY) * 0.14;

    // Snow landscape background
    ctx.fillStyle = '#0F1A24';
    ctx.fillRect(0, 0, width, height);

    // Faint geomagnetic grid lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 35) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }

    // Hazards (dogs / thin ice)
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

      const d = Math.hypot(foxX - h.x, foxY - h.y);
      if (d < 28) {
        endGame(false, '⚠️ Zagrożenie na śniegu!', 'Lis wpadł na psa wiejskiego lub załamał się lód! Omijaj przeszkody.');
      }
    });

    // Snow Mounds & Hidden Mice
    const lvl = levels[currentLevelIdx];
    snowMounds.forEach(m => {
      if (m.revealed) return;

      m.pulseAngle += 0.05;
      const soundWaveR = 12 + Math.sin(m.pulseAngle) * 4;

      // Acoustic rustle wave visible to fox's ears
      ctx.save();
      ctx.beginPath();
      ctx.arc(m.x, m.y, soundWaveR, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Snow mound
      ctx.fillStyle = '#E2E8F0';
      ctx.beginPath();
      ctx.arc(m.x, m.y, 8, 0, Math.PI * 2);
      ctx.fill();

      // Mouse rustle icon
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🔊', m.x, m.y - 12);
      ctx.restore();

      // Catch check (pounce)
      const d = Math.hypot(foxX - m.x, foxY - m.y);
      if (d < 26) {
        m.revealed = true;
        currentMice++;
        playCatchSound();
        if (miceVal) miceVal.textContent = `${currentMice} myszy`;

        if (currentMice >= lvl.targetMice) {
          endGame(true, `🎉 Poziom ${currentLevelIdx + 1} Zakończony Sukcesem!`, `Lis złowił ${currentMice} gryzoni dzięki zmysłowi geomagnetycznemu!`);
        }
      }
    });

    // Draw Fox Player
    ctx.save();
    ctx.font = '30px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🦊', foxX, foxY);
    ctx.restore();

    animId = requestAnimationFrame(loop);
  }

  startBtn?.addEventListener('click', () => startGame(0));
  restartBtn?.addEventListener('click', () => startGame(currentLevelIdx));
  nextBtn?.addEventListener('click', () => startGame(currentLevelIdx + 1));
  resetBtn?.addEventListener('click', () => startGame(0));
}

/* ============================================================
   INTERACTIVE 5-QUESTION QUIZ: MISTRZ ZMYSŁÓW LISA RUDEGO
   ============================================================ */
function initFoxQuiz() {
  const quizBody = document.getElementById('foxQuizDynamicBody');
  const progressBar = document.getElementById('foxQuizMeterProgress');

  if (!quizBody || !progressBar) return;

  const questions = [
    {
      q: 'W jakim kierunku geograficznym skoki myszkujące lisa rudego przynoszą statystycznie aż 73% sukcesu (w porównaniu do zaledwie 18% w innych kierunkach)?',
      options: [
        'Kierunek nie ma znaczenia — liczy się tylko prędkość biegu',
        'Północny Wschód (około 20° azymutu, zgodnie z wektorem nachylenia ziemskiego pola magnetycznego)',
        'Ściśle na Południe, by słońce świeciło w oczy ofiary',
        'Zawsze dokładnie pod wiatr'
      ],
      correct: 1,
      explanation: 'Badania zespołu prof. Hyneka Burdy i dr. Jaroslava Červený\'ego wykazały, że lis posiada w siatkówce oka fotoreceptory kryptochromowe czułe na ziemskie pole magnetyczne. W wektorze NE (20°) "cień magnetyczny" w oku idealnie pokrywa się z docierającym do uszu dźwiękiem nornicy!'
    },
    {
      q: 'Jaka unikalna cecha budowy oka odróżnia lisa rudego od WSZYSTKICH innych dzikich psowatych (Canidae), takich jak wilki czy szakale?',
      options: [
        'Całkowity brak widzenia barwnego (achromatopsja)',
        'Oczy umieszczone symetrycznie z tyłu głowy',
        'Pionowe źrenice szczelinowe (identyczne jak u kotów)',
        'Czwarta powieka chroniąca przed mrozem'
      ],
      correct: 2,
      explanation: 'Lis jest jedynym dzikim przedstawicielem rodziny psowatych posiadającym pionowe źrenice szczelinowe. Pozwalają mu one błyskawicznie adaptować się do oślepiającego śniegu i precyzyjnie szacować odległość przy ziemi.'
    },
    {
      q: 'Dlaczego epidemiolodzy i służby sanitarne bezwzględnie nakazują dokładne mycie leśnych jagód, poziomek i borówek przed spożyciem?',
      options: [
        'Owoce leśne mogą zawierać mikroskopijne jaja tasiemca bąblowcowego (Echinococcus multilocularis) wydalane przez lisy',
        'Aby zmyć naturalny kwas szczawiowy z leśnego runa',
        'Leśne jagody bez umycia tracą witaminy w żołądku',
        'Żeby usunąć pyłki iglaste utrudniające trawienie'
      ],
      correct: 0,
      explanation: 'Bąblowica wielojamowa (echinokokoza) to śmiertelnie groźna parazytoza. Mikroskopijne jaja tasiemca wydalane z odchodami lisów są odporne na mróz i mogą przylegać do niskich krzaczków jagód. W wątrobie człowieka rozwijają się latami jak guz nowotworowy!'
    },
    {
      q: 'Co udowodnił słynny, trwający ponad 50 lat eksperyment prof. Dymitra Biełajewa nad udomowieniem lisów srebrzystych?',
      options: [
        'Że lisy są genetycznie niezdolne do oswojenia przez człowieka',
        'Że selekcja wyłącznie pod kątem braku agresji wywołała tzw. zespół udomowienia: merdanie ogonem, oklapnięte uszy i plamiste futro',
        'Że udomowione lisy zaczęły znosić jaja',
        'Że lisy tracą zdolność słyszenia ultradźwięków'
      ],
      correct: 1,
      explanation: 'Eksperyment Biełajewa w Nowosybirsku to kamień milowy genetyki. Selekcja najłagodniejszych lisów doprowadziła do spadku hormonów stresu (kortyzolu), a to pociągnęło za sobą zmiany fenotypowe: merdanie ogonem, klapnięte uszka i łaty na sierści — dokładnie jak u domowych psów!'
    },
    {
      q: 'Dlaczego widok lisa spokojnie spacerującego w środku dnia po osiedlu mieszkaniowym w polskim mieście NIE oznacza zazwyczaj wścieklizny?',
      options: [
        'Wszystkie lisy w Polsce rodzą się z wrodzoną odpornością na wirusa wścieklizny',
        'Lisy miejskie są wypuszczane ze schronisk dla zwierząt',
        'Wścieklizna u dzikich lisów w Polsce została praktycznie wyeliminowana dzięki zrzutom szczepionek, a lisy miejskie szukają łatwego pożywienia w śmietnikach',
        'Wirus wścieklizny nie występuje na terenach zurbanizowanych'
      ],
      correct: 2,
      explanation: 'Dzięki wieloletnim ogólnopolskim zrzutom szczepionek w przynętach z samolotów, wścieklizna u lisów w Polsce została niemal w 100% wytępiona. Lisy miejskie to oportunistyczni synantropi, którzy nie boją się ludzi ze względu na obfitość odpadków i dokarmianie kotów.'
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
          <button class="quiz-option-btn" data-index="${i}">
            <span class="quiz-opt-letter">${letters[i]}</span>
            <span class="quiz-opt-text">${opt}</span>
          </button>
        `).join('')}
      </div>
      <div id="foxQuizFeedback" class="quiz-feedback-box" style="display: none;"></div>
    `;

    const optButtons = quizBody.querySelectorAll('.quiz-option-btn');
    optButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const selected = parseInt(btn.getAttribute('data-index'), 10);
        handleAnswer(selected, qData, optButtons);
      });
    });
  }

  function handleAnswer(selected, qData, optButtons) {
    optButtons.forEach(b => b.disabled = true);

    const isCorrect = selected === qData.correct;
    if (isCorrect) score++;

    optButtons.forEach((b, idx) => {
      if (idx === qData.correct) {
        b.classList.add('correct');
      } else if (idx === selected && !isCorrect) {
        b.classList.add('wrong');
      }
    });

    const feedbackBox = document.getElementById('foxQuizFeedback');
    if (feedbackBox) {
      feedbackBox.style.display = 'block';
      feedbackBox.className = `quiz-feedback-box ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`;
      feedbackBox.innerHTML = `
        <div style="font-weight: 700; margin-bottom: 0.35rem;">
          ${isCorrect ? '🎯 Brawo! Prawidłowa odpowiedź!' : '💡 Nie do końca! Prawidłowa odpowiedź: ' + qData.options[qData.correct]}
        </div>
        <p style="margin: 0 0 0.85rem 0; font-size: 0.88rem; line-height: 1.5; color: var(--text-muted);">
          ${qData.explanation}
        </p>
        <button id="foxQuizNextBtn" class="primary-btn" style="background: #ea580c; border-color: #ea580c; padding: 6px 16px; font-size: 0.85rem;">
          ${currentIdx + 1 < questions.length ? 'Następne pytanie ➔' : 'Zobacz certyfikat wyników 🏆'}
        </button>
      `;

      document.getElementById('foxQuizNextBtn')?.addEventListener('click', () => {
        currentIdx++;
        renderQuestion();
      });
    }
  }

  function renderSummary() {
    progressBar.style.width = '100%';
    const pct = Math.round((score / questions.length) * 100);
    let title = '';
    let desc = '';
    let emoji = '';

    if (score === 5) {
      emoji = '👑🦊🧭';
      title = 'Arcymistrz Zmysłów Lisa Rudego!';
      desc = 'Niewiarygodna wiedza! Rozumiesz geomagnetyczne polowanie, biologiczne sekrety szczelinowych źrenic, historię eksperymentu Biełajewa i zasady profilaktyki bąblowicy jak wytrawny naukowiec.';
    } else if (score >= 3) {
      emoji = '🦊❄️👏';
      title = 'Zimowy Badacz Fauny Leśnej!';
      desc = 'Bardzo dobry wynik! Doskonale orientujesz się w mechanizmach zmysłów lisa i znasz kluczowe fakty ekologiczne dotyczące naszych rodzimych drapieżników.';
    } else {
      emoji = '🐾🌱📚';
      title = 'Początkujący Obserwator Przyrody';
      desc = 'Świetny pierwszy krok! Przejrzyj sekcje o nawigacji magnetycznej i profilaktyce bąblowicy, po czym sprawdź swoje siły ponownie!';
    }

    quizBody.innerHTML = `
      <div class="quiz-summary-card" style="text-align: center; padding: 2rem 1rem;">
        <div style="font-size: 3.5rem; margin-bottom: 0.75rem;">${emoji}</div>
        <h3 style="font-size: 1.6rem; color: #fff; margin-bottom: 0.5rem;">${title}</h3>
        <p style="font-size: 1.15rem; color: #fb923c; font-weight: 700; margin-bottom: 1rem;">
          Twój wynik: ${score} z ${questions.length} punktów (${pct}%)
        </p>
        <p style="font-size: 0.95rem; color: var(--text-muted); max-width: 480px; margin: 0 auto 1.5rem auto; line-height: 1.6;">
          ${desc}
        </p>
        <button id="foxQuizRestartBtn" class="primary-btn" style="background: #ea580c; border-color: #ea580c;">
          🔄 Rozwiąż quiz ponownie
        </button>
      </div>
    `;

    document.getElementById('foxQuizRestartBtn')?.addEventListener('click', () => {
      currentIdx = 0;
      score = 0;
      renderQuestion();
    });
  }

  renderQuestion();
}


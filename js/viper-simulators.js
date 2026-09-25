/* ============================================================
   VIPER (ŻMIJA ZYGZAKOWATA) — SENSORY SIMULATORS & 10-LEVEL GAME
   Author: Dorian Kalinowski for "Świat zmysłami zwierząt"
   Senses: Seismic ground vibrations, Jacobson's organ, Strike mechanics
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initViperAudioSynthesizer();
  initViperSeismicCanvas();
  initViperAnatomyInspector();
  initViperCrisisSimulator();
  initViperStealthGame();
  initViperQuiz();
});

/* ============================================================
   1. SEISMIC VIBRATION & HISS AUDIO SYNTHESIZER
   ============================================================ */
function initViperAudioSynthesizer() {
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

  const playHissBtn = document.getElementById('playViperHissBtn');
  const playThudBtn = document.getElementById('playViperThudBtn');
  const playTongueBtn = document.getElementById('playViperTongueBtn');

  // Warning Hiss (syk ostrzegawczy żmii)
  function playHiss() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      const bufferSize = ctx.sampleRate * 0.8;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.15;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(4200, ctx.currentTime);
      filter.Q.setValueAtTime(3.5, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.28, ctx.currentTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.75);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch (e) {}
  }

  // Low frequency ground step thud (drgania kroków sejsmicznych 45 Hz)
  function playSeismicThud() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.22);

      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch (e) {}
  }

  // Tongue flick chemical sampling audio click
  function playTongueFlick() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      [1400, 1800, 1600].forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.05);
        gain.gain.setValueAtTime(0.06, ctx.currentTime + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.05 + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.05);
        osc.stop(ctx.currentTime + i * 0.05 + 0.04);
      });
    } catch (e) {}
  }

  playHissBtn?.addEventListener('click', playHiss);
  playThudBtn?.addEventListener('click', playSeismicThud);
  playTongueBtn?.addEventListener('click', playTongueFlick);
}

/* ============================================================
   2. SEISMIC GROUND VIBRATIONS CANVAS
   ============================================================ */
function initViperSeismicCanvas() {
  const canvas = document.getElementById('viperSeismicCanvas');
  const stepBtn = document.getElementById('triggerViperStepBtn');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.clientWidth || 600);
  let height = (canvas.height = 280);

  window.addEventListener('resize', () => {
    if (!canvas) return;
    width = canvas.width = canvas.clientWidth || 600;
  });

  let ripples = [];

  function addStepRipple(x = width * 0.8, y = height / 2) {
    ripples.push({
      x,
      y,
      r: 4,
      maxR: width * 0.85,
      alpha: 1.0,
      speed: 4.5
    });
  }

  stepBtn?.addEventListener('click', () => addStepRipple());
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    addStepRipple(e.clientX - rect.left, e.clientY - rect.top);
  });

  function render() {
    ctx.fillStyle = '#080F0B';
    ctx.fillRect(0, 0, width, height);

    // Heath ground line
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, height);
      ctx.lineTo(x + 10, height - 25);
      ctx.stroke();
    }

    // Resting Viper at (80, height/2)
    ctx.save();
    ctx.font = '32px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🐍', 80, height / 2);
    ctx.restore();

    // Render ripples (seismic waves)
    for (let i = ripples.length - 1; i >= 0; i--) {
      const rip = ripples[i];
      rip.r += rip.speed;
      rip.alpha = Math.max(0, 1 - rip.r / rip.maxR);

      ctx.save();
      ctx.beginPath();
      ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(245, 158, 11, ${rip.alpha * 0.85})`;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#F59E0B';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.restore();

      // Detection at Viper jaw (x=80, y=height/2)
      const dist = Math.hypot(rip.x - 80, rip.y - height / 2);
      if (Math.abs(dist - rip.r) < 14) {
        // Draw green shield pulse on Viper
        ctx.save();
        ctx.beginPath();
        ctx.arc(80, height / 2, 45, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.9)';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#10B981';
        ctx.shadowBlur = 16;
        ctx.stroke();

        ctx.fillStyle = '#10B981';
        ctx.font = '12px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('WYKRYTO DRGANIA ŻUCHWĄ!', 80, height / 2 - 50);
        ctx.restore();
      }

      if (rip.alpha <= 0.01) {
        ripples.splice(i, 1);
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ============================================================
   3. VIPER ANATOMY & BIOMECHANICS INSPECTOR
   ============================================================ */
function initViperAnatomyInspector() {
  const buttons = document.querySelectorAll('[data-viper-anatomy]');
  const titleEl = document.getElementById('viperAnatomyTitle');
  const descEl = document.getElementById('viperAnatomyDesc');
  const statEl = document.getElementById('viperAnatomyStat');

  if (!buttons.length || !titleEl) return;

  const data = {
    head: {
      title: 'Trójkątna, Płaska Głowa z Drobnymi Łuskami',
      desc: 'W odróżnieniu od nieszkodliwego zaskrońca, żmija ma głowę wyraźnie odcinającą się od tułowia w kształcie grotu strzały. Pokrywają ją liczne drobne tarczki, a z tyłu głowy mieszczą się potężne mięśnie zaciskające gruczoły jadowe.',
      stat: 'Kształt: sercowaty / grot strzały'
    },
    eye: {
      title: 'Pionowa Źrenica (Znak Rozpoznawczy Drapieżnika)',
      desc: 'Wystarczy jedno spojrzenie: żmija ma pionową, wąską źrenicę jak kot. Pozwala jej precyzyjnie oceniać odległość do ofiary z poziomu ziemi. Niejadowity zaskroniec ma źrenicę całkowicie okrągłą!',
      stat: 'Wzrok: pionowa szczelina noktowizyjna'
    },
    fangs: {
      title: 'Składane Kły Jadowe (Typ Solenoglypha)',
      desc: 'Kły żmii działają jak igły strzykawkowe o długości do 5 mm. W spoczynku leżą złożone wzdłuż podniebienia w fałdach śluzówki. Podczas ataku kość szczękowa obraca się, a zęby wyskakują do przodu w ułamku 0.05 sekundy!',
      stat: 'Długość kłów: do 5 mm (składane)'
    },
    zigzag: {
      title: 'Wstęga Kainowa (Czarny Zygzak na Grzbiecie)',
      desc: 'Charakterystyczny zygzak biegnący przez całą długość ciała służy do kamuflażu rozbijającego sylwetkę wśród traw i wrzosów. Co ciekawe, spotyka się też rzadkie żmije melanistyczne (całkowicie czarne), u których zygzak zlewa się z tłem.',
      stat: 'Kamuflaż: zjawisko zamazania ruchu'
    },
    tongue: {
      title: 'Rozwidlony Język i Narząd Jacobsona',
      desc: 'Żmija nieustannie wysuwa język, chwytając cząsteczki zapachowe z powietrza. Następnie wsuwa go do dwóch jamek w podniebieniu (narząd lemieszowo-nosowy Jacobsona), gdzie mózg tworzy stereofoniczną mapę zapachową otoczenia.',
      stat: 'Częstotliwość drgań języka: 4-6 Hz'
    }
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.getAttribute('data-viper-anatomy');
      const item = data[key];
      if (!item) return;

      titleEl.textContent = item.title;
      descEl.textContent = item.desc;
      if (statEl) statEl.textContent = item.stat;
    });
  });
}

/* ============================================================
   4. CRISIS SIMULATOR: UKĄSZENIE ŻMII (PROTOKÓŁ RATUNKOWY)
   ============================================================ */
function initViperCrisisSimulator() {
  const cards = document.querySelectorAll('.viper-crisis-card');
  const resultBox = document.getElementById('viperCrisisResult');
  if (!cards.length || !resultBox) return;

  const responses = {
    tourniquet: {
      type: 'danger',
      title: '❌ ŚMIERTELNY BŁĄD: Martwica tkanek!',
      text: 'NIGDY nie zakładaj opaski uciskowej ani stazy! Jad żmii zygzakowatej zawiera enzymy uszkadzające tkanki (hemotoksyny). Zaciśnięcie opaski zatrzymuje jad w jednym miejscu, co prowadzi do błyskawicznej martwicy mięśni i często kończy się amputacją kończyny.'
    },
    suck_cut: {
      type: 'danger',
      title: '❌ Mit z filmów: Nacinanie i wysysanie jadu!',
      text: 'Żadnego nacinania nożem, wysysania ustami ani przypalania! W ustach są mikrootarcia, przez które jad może wniknąć do krwiobiegu, a nacięcie rany grozi sepsą i zakażeniem bakteryjnym.'
    },
    run: {
      type: 'danger',
      title: '❌ Błąd: Szybki marsz lub bieg po pomoc!',
      text: 'Wysiłek fizyczny i przyspieszone tętno pompują krew i błyskawicznie rozprowadzają jad po całym organizmie. Poszkodowany powinien usiąść i zachować absolutny bezruch.'
    },
    immobilize_112: {
      type: 'success',
      title: '✅ PRAWIDŁOWY PROTOKÓŁ MEDYCZNY (100% zaleceń):',
      text: '1. Usiądź, zachowaj spokój — ponad 40% ukąszeń w obronie to tzw. <em>ukąszenia suche</em> (bez wstrzyknięcia jadu!).<br>2. Zdejmij natychmiast zegarek, pierścionki i ciasne buty, zanim pojawi się opuchlizna.<br>3. Unieruchom kończynę (jak przy złamaniu) i trzymaj ją <strong>poniżej poziomu serca</strong>.<br>4. Przemyj ranę wodą i zadzwoń pod <strong>112 lub 985 (GOPR/TOPR)</strong>.'
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
   5. 10-LEVEL MINIGAME: ŚCIEŻKA DRGAŃ (CICHY WĄŻ WE WRZOSOWISKU)
   ============================================================ */
function initViperStealthGame() {
  const canvas = document.getElementById('viperGameCanvas');
  const overlay = document.getElementById('viperGameOverlay');
  const startBtn = document.getElementById('startViperGameBtn');
  const nextBtn = document.getElementById('nextViperLevelBtn');
  const restartBtn = document.getElementById('restartViperGameBtn');
  const resetBtn = document.getElementById('resetViperCampaignBtn');

  const timerVal = document.getElementById('viperGameTimer');
  const preyVal = document.getElementById('viperGamePrey');
  const calmVal = document.getElementById('viperGameCalm');
  const levelBadge = document.getElementById('viperGameLevelBadge');
  const levelDotsContainer = document.getElementById('viperGameLevelDots');
  const overlayIcon = document.getElementById('viperGameOverIcon');
  const overlayTitle = document.getElementById('viperGameOverTitle');
  const overlayDesc = document.getElementById('viperGameOverDesc');

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

  function playStrikeSound() {
    const c = getAudioCtx();
    if (!c) return;
    try {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, c.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, c.currentTime + 0.14);
      gain.gain.setValueAtTime(0.2, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.14);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start();
      osc.stop(c.currentTime + 0.14);
    } catch (e) {}
  }

  function playWarningVibe() {
    const c = getAudioCtx();
    if (!c) return;
    try {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, c.currentTime);
      gain.gain.setValueAtTime(0.25, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start();
      osc.stop(c.currentTime + 0.18);
    } catch (e) {}
  }

  // 10 Progressive Viper Stealth Levels
  const levels = [
    {
      name: 'Słoneczna Polana i Zaskrońce ☀️🐍',
      desc: 'Wygrzewanie na ciepłym kamieniu. Złap 3 chrząszcze. Brak ludzi w pobliżu — idealna rozgrzewka.',
      time: 40,
      targetPrey: 3,
      hikers: 0
    },
    {
      name: 'Wrzosowisko w Pełni Dnia 🌸',
      desc: 'Pierwsze drgania kroków w oddali. Gdy poczujesz czerwone fale wibracji — zastygnij w bezruchu!',
      time: 38,
      targetPrey: 4,
      hikers: 1
    },
    {
      name: 'Leśna Ścieżka Spacerowiczów 🥾⚠️',
      desc: 'Turyści w ciężkich butach trekingowych. Ich kroki wywołują sejsmiczne fale. Ukryj się pod kępą mchu!',
      time: 38,
      targetPrey: 4,
      hikers: 2
    },
    {
      name: 'Kamieniołom w Pieninach 🪨',
      desc: 'Wapienne skały i szczeliny. Złap 5 zwinnych jaszczurek zwinek pośród głazów.',
      time: 36,
      targetPrey: 5,
      hikers: 2
    },
    {
      name: 'Brzeg Młaki i Żaby Trawne 🌾🐸',
      desc: 'Wilgotna łąka podgórsa. Skaczące żabki to pożywny posiłek. Uważaj na wędkarzy.',
      time: 36,
      targetPrey: 5,
      hikers: 2
    },
    {
      name: 'Młody Zrąb Sosnowy 🌲',
      desc: 'Pniaki i gałęzie. Szybcy zbieracze grzybów przeczesują zarośla. Wymaga dyskrecji!',
      time: 34,
      targetPrey: 5,
      hikers: 3
    },
    {
      name: 'Zbieracze Jagód w Borówkach 🫐🥾',
      desc: 'Gęste krzaczki borówek. Zbieracze z wiadrami tupią w ściółkę. Zastygnij w bezruchu, gdy nadchodzą.',
      time: 34,
      targetPrey: 6,
      hikers: 3
    },
    {
      name: 'Deszczowy Zmierzch na Grani 🌧️',
      desc: 'Mokre wrzosy tłumią drgania — musisz polegać na rozwidlonym języku i węszeniu ofiar.',
      time: 32,
      targetPrey: 6,
      hikers: 3
    },
    {
      name: 'Kępy Mchu i Skalne Pęknięcia 🪨⚡',
      desc: 'Zwinne gryzonie uciekają błyskawicznie. Atakuj w ułamku sekundy, unikając tupotu butów.',
      time: 30,
      targetPrey: 6,
      hikers: 4
    },
    {
      name: 'Mistrzyni Kamuflażu — Władczyni Wrzosowiska 👑🐍',
      desc: 'Finałowe wyzwanie! Tłum turystów na szlaku i ostrożne nornice. Przetrwaj, poluj i zniknij w mchu!',
      time: 32,
      targetPrey: 7,
      hikers: 4
    }
  ];

  let currentLevelIdx = 0;
  let isPlaying = false;
  let timeLeft = 40;
  let timerInterval = null;
  let animId = null;
  let caughtPrey = 0;
  let stressLevel = 0; // 0-100%

  // Viper Pos
  let viperX = 60;
  let viperY = 170;
  let targetViperX = 60;
  let targetViperY = 170;
  let isMoving = false;
  let lastMoveTime = 0;

  // Entities
  let preys = [];
  let hikers = [];
  let vibrationWaves = [];

  function spawnLevelEntities() {
    const lvl = levels[currentLevelIdx];
    preys = [];
    hikers = [];
    vibrationWaves = [];

    // Preys (gryzonie 🐭, jaszczurki 🦎, żaby 🐸, chrząszcze 🪲)
    const emojis = ['🐭', '🪲', '🦎', '🐸'];
    for (let i = 0; i < lvl.targetPrey; i++) {
      preys.push({
        x: 120 + Math.random() * (width - 160),
        y: 40 + Math.random() * (height - 80),
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        caught: false
      });
    }

    // Hikers (but turysty 🥾)
    for (let i = 0; i < lvl.hikers; i++) {
      hikers.push({
        x: 150 + Math.random() * (width - 180),
        y: 40 + Math.random() * (height - 80),
        vx: (Math.random() - 0.5) * 1.8,
        vy: (Math.random() - 0.5) * 1.8,
        stepTimer: Math.random() * 80
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
    if (preyVal) preyVal.textContent = `${caughtPrey} / ${lvl.targetPrey}`;
    if (timerVal) timerVal.textContent = `${timeLeft}s`;
    if (calmVal) calmVal.textContent = isMoving ? 'Ruch (ryzyko!)' : 'Zastygnięcie (bezpiecznie)';
  }

  function handlePointer(e) {
    if (!isPlaying) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    targetViperX = Math.max(25, Math.min(width - 25, clientX - rect.left));
    targetViperY = Math.max(25, Math.min(height - 25, clientY - rect.top));
    isMoving = true;
    lastMoveTime = Date.now();
  }

  canvas.addEventListener('mousemove', handlePointer);
  canvas.addEventListener('touchstart', (e) => { e.preventDefault(); handlePointer(e); }, { passive: false });
  canvas.addEventListener('touchmove', (e) => { e.preventDefault(); handlePointer(e); }, { passive: false });

  function startGame(lvlIdx = 0) {
    currentLevelIdx = lvlIdx;
    const lvl = levels[currentLevelIdx];
    isPlaying = true;
    timeLeft = lvl.time;
    caughtPrey = 0;
    stressLevel = 0;
    viperX = 60;
    viperY = height / 2;
    targetViperX = 60;
    targetViperY = height / 2;

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
        endGame(false, '⏱️ Czas minął!', 'Zabrakło czasu na zebranie energii. Bądź cichszy i poluj sprawniej.');
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
      playStrikeSound();
      overlayIcon.textContent = '🏆🐍✨';
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
      overlayIcon.textContent = '🐍⚠️';
      startBtn.style.display = 'none';
      nextBtn.style.display = 'none';
      restartBtn.style.display = 'inline-block';
      resetBtn.style.display = 'none';
    }
  }

  function loop() {
    if (!isPlaying) return;

    if (Date.now() - lastMoveTime > 300) {
      isMoving = false;
    }
    if (calmVal) {
      calmVal.textContent = isMoving ? '🏃 Ruch (widoczna)' : '🛡️ Zastygnięcie (ukryta)';
      calmVal.style.color = isMoving ? '#F87171' : '#10B981';
    }

    // Move viper smoothly
    viperX += (targetViperX - viperX) * 0.12;
    viperY += (targetViperY - viperY) * 0.12;

    // Clear Canvas with heath texture
    ctx.fillStyle = '#09130D';
    ctx.fillRect(0, 0, width, height);

    // Hikers movement & seismic wave emission
    hikers.forEach(h => {
      h.x += h.vx;
      h.y += h.vy;
      if (h.x < 50 || h.x > width - 50) h.vx *= -1;
      if (h.y < 40 || h.y > height - 40) h.vy *= -1;

      h.stepTimer++;
      if (h.stepTimer > 45) {
        h.stepTimer = 0;
        playWarningVibe();
        vibrationWaves.push({
          x: h.x,
          y: h.y,
          r: 5,
          maxR: 140,
          alpha: 1.0
        });
      }

      // Draw Hiker icon
      ctx.save();
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🥾', h.x, h.y);
      ctx.restore();
    });

    // Process Vibration Waves
    for (let i = vibrationWaves.length - 1; i >= 0; i--) {
      const v = vibrationWaves[i];
      v.r += 3.2;
      v.alpha = Math.max(0, 1 - v.r / v.maxR);

      ctx.save();
      ctx.beginPath();
      ctx.arc(v.x, v.y, v.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(239, 68, 68, ${v.alpha * 0.8})`;
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();

      // Check if vibration hits moving viper!
      const distToViper = Math.hypot(v.x - viperX, v.y - viperY);
      if (distToViper < v.r + 15 && Math.abs(distToViper - v.r) < 15) {
        if (isMoving) {
          endGame(false, '⚠️ Spłoszona przez turystę!', 'Wykryto Cię! Kiedy fale drgań kroków (czerwone kręgi) przechodzą przez żmiję, MUSISZ ZASTYGNĄĆ W BEZRUCHU (puścić mysz/palec)!');
          return;
        }
      }

      if (v.alpha <= 0.02) {
        vibrationWaves.splice(i, 1);
      }
    }

    // Preys
    const lvl = levels[currentLevelIdx];
    preys.forEach(p => {
      if (p.caught) return;

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 30 || p.x > width - 30) p.vx *= -1;
      if (p.y < 30 || p.y > height - 30) p.vy *= -1;

      // Draw prey
      ctx.save();
      ctx.font = '22px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.emoji, p.x, p.y);
      ctx.restore();

      // Catch check
      const d = Math.hypot(viperX - p.x, viperY - p.y);
      if (d < 24) {
        p.caught = true;
        caughtPrey++;
        playStrikeSound();
        if (preyVal) preyVal.textContent = `${caughtPrey} / ${lvl.targetPrey}`;

        if (caughtPrey >= lvl.targetPrey) {
          endGame(true, `🎉 Zwycięstwo! Ukończono Poziom ${currentLevelIdx + 1}!`, `Żmija schwytała wszystkie cele, bezszelestnie kamuflując się wśród wrzosów.`);
        }
      }
    });

    // Draw Viper
    ctx.save();
    ctx.font = '28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🐍', viperX, viperY);
    ctx.restore();

    animId = requestAnimationFrame(loop);
  }

  startBtn?.addEventListener('click', () => startGame(0));
  restartBtn?.addEventListener('click', () => startGame(currentLevelIdx));
  nextBtn?.addEventListener('click', () => startGame(currentLevelIdx + 1));
  resetBtn?.addEventListener('click', () => startGame(0));
}

/* ============================================================
   INTERACTIVE QUIZ: MISTRZ ZMYSŁÓW ŻMII
   ============================================================ */
function initViperQuiz() {
  const quizBody = document.getElementById('viperQuizDynamicBody');
  const progressBar = document.getElementById('viperQuizMeterProgress');

  if (!quizBody || !progressBar) return;

  const questions = [
    {
      q: 'Po jakich dwóch cechach najpewniej odróżnisz jadowitą żmiję zygzakowatą od niejadowitego zaskrońca?',
      options: [
        'Żmija ma pionową źrenicę oka i wstęgę kainową (zygzak), a zaskroniec okrągłą źrenicę i żółte plamy za skroniami',
        'Żmija zawsze głośno grzechocze ogonem, a zaskroniec szczeka',
        'Żmija jest zielona, a zaskroniec zawsze czarny',
        'Żmija ma nogi, a zaskroniec nie ma'
      ],
      correct: 0,
      explanation: 'Żmija zygzakowata ma pionowe, kocie źrenice, sercowatą głowę i wyraźny zygzak na grzbiecie. Niejadowity zaskroniec zwyczajny ma okrągłe źrenice oraz dwie jaskrawożółte plamy z tyłu głowy („za skroniami”).'
    },
    {
      q: 'W jaki sposób żmija „słyszy” zbliżającego się człowieka, skoro nie posiada uszu zewnętrznych ani błony bębenkowej?',
      options: [
        'Wyłącznie za pomocą oczu',
        'Odbiera drgania sejsmiczne podłoża dolną szczęką i kością kwadratową połączoną z uchem wewnętrznym',
        'Czuje zapach perfum z odległości 2 kilometrów',
        'W ogóle nie słyszy ani nie czuje obecności człowieka'
      ],
      correct: 1,
      explanation: 'Żmija dosłownie „słyszy brzuchem”. Drgania kroków człowieka niosą się przez grunt, są wychwytywane przez kość kwadratową czaszki i przekazywane do ucha wewnętrznego. Dlatego tupanie na leśnej ścieżce skutecznie ją płoszy!'
    },
    {
      q: 'Co należy zrobić w pierwszej kolejności, jeśli dojdzie do ukąszenia przez żmiję?',
      options: [
        'Naciąć nożem ranę i wysysać jad ustami',
        'Założyć ciasną opaskę uciskową powyżej rany',
        'Unieruchomić ukąszoną kończynę poniżej poziomu serca, zachować spokój i wezwać pogotowie (112)',
        'Biec jak najszybciej do najbliższego szpitala'
      ],
      correct: 2,
      explanation: 'Spokój to klucz: każdy wysiłek i stres przyspieszają krążenie krwi i rozprzestrzenianie toksyn. Unieruchomienie ręki/nogi (np. na temblaku) i telefon pod 112 to jedyne właściwe postępowanie.'
    },
    {
      q: 'Czym jest tzw. „suche ukąszenie” (dry bite)?',
      options: [
        'Ukąszeniem przez martwego węża',
        'Ukąszeniem obronnym, w którym żmija wbija zęby, ale nie wstrzykuje ani kropli jadu',
        'Ukąszeniem w trakcie upalnego, suchego lata',
        'Ukąszeniem przez młodego węża, który nie ma jeszcze zębów'
      ],
      correct: 1,
      explanation: 'Nawet 30–50% ukąszeń żmii to tzw. ukąszenia suche! Produkcja jadu kosztuje węża mnóstwo energii i tygodnie regeneracji, dlatego żmija oszczędza go na polowanie na gryzonie i nie chce marnować na człowieka.'
    },
    {
      q: 'Do czego służy żmii rozwidlony język i narząd Jacobsona?',
      options: [
        'Do wstrzykiwania jadu w ciało ofiary',
        'Do termoregulacji i chłodzenia pyszczka',
        'Do chemicznego stereo-węchu: język zbiera cząsteczki zapachu i przenosi je do receptorów na podniebieniu',
        'Do wydawania ostrzegawczego syku'
      ],
      correct: 2,
      explanation: 'Rozwidlony język bada stężenie cząsteczek zapachowych z lewej i prawej strony, po czym wkłada końcówki do dwóch kieszonek narządu Jacobsona na podniebieniu. Dzięki temu żmija bezbłędnie tropi ścieżkę nornicy!'
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
      <div id="viperQuizFeedback"></div>
      <div class="quiz-action-bar" id="viperQuizNextBar" style="display: none; margin-top: 20px;">
        <button class="btn btn-primary" id="viperQuizNextBtn" style="background: linear-gradient(135deg, #10B981 0%, #059669 100%);">
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

    const feedbackEl = document.getElementById('viperQuizFeedback');
    const nextBar = document.getElementById('viperQuizNextBar');

    optButtons[qData.correct].classList.add('correct');

    if (selected === qData.correct) {
      score++;
      feedbackEl.className = 'quiz-feedback-banner success';
      feedbackEl.innerHTML = `<strong>Wspaniale!</strong> ${qData.explanation}`;
    } else {
      optButtons[selected].classList.add('wrong');
      feedbackEl.className = 'quiz-feedback-banner failure';
      feedbackEl.innerHTML = `<strong>Błąd.</strong> ${qData.explanation}`;
    }

    nextBar.style.display = 'flex';
    document.getElementById('viperQuizNextBtn').addEventListener('click', () => {
      currentIdx++;
      renderQuestion();
    });
  }

  function renderSummary() {
    progressBar.style.width = '100%';
    const percent = Math.round((score / questions.length) * 100);

    let rankTitle = 'Ekspert Herpetologii i Bezpieczeństwa 🐍';
    let badgeEmoji = '👑';
    let rankDesc = 'Znakomity wynik! Wiesz, jak odróżnić żmiję od zaskrońca, znasz zasady pierwszej pomocy i rozumiesz zmysły sejsmiczne gadów.';

    if (percent < 80 && percent >= 60) {
      rankTitle = 'Znawca Gadów Polskich 🌲';
      badgeEmoji = '🎖️';
      rankDesc = 'Bardzo dobry wynik! Wiesz, że tupanie odstrasza żmiję i że nie wolno nacinać rany po ukąszeniu.';
    } else if (percent < 60) {
      rankTitle = 'Początkujący Obserwator Przyrody 📚';
      badgeEmoji = '🦎';
      rankDesc = 'Warto powtórzyć zasady pierwszej pomocy i różnice anatomiczne — ta wiedza zapewnia spokój i bezpieczeństwo na leśnym szlaku!';
    }

    quizBody.innerHTML = `
      <div class="quiz-certificate">
        <div class="certificate-badge-emoji">${badgeEmoji}</div>
        <div class="certificate-score">${score} / ${questions.length}</div>
        <h3 class="certificate-title">${rankTitle}</h3>
        <p class="certificate-desc">${rankDesc}</p>
        <button class="btn btn-primary" id="viperQuizRestartBtn" style="background: linear-gradient(135deg, #10B981 0%, #059669 100%);">Rozwiąż quiz ponownie ↺</button>
      </div>
    `;

    document.getElementById('viperQuizRestartBtn').addEventListener('click', () => {
      currentIdx = 0;
      score = 0;
      renderQuestion();
    });
  }

  renderQuestion();
}


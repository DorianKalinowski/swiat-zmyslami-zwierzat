/* ============================================================
   BAT (NIETOPERZ) — SENSORY SIMULATORS & 10-LEVEL MINIGAME
   Author: Dorian Kalinowski for "Świat zmysłami zwierząt"
   Senses: Echolocation (Ultrasound), Ear Micro-mechanics, Cave Sonar
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initBatAudioSynthesizer();
  initBatSonarCanvas();
  initBatAnatomyInspector();
  initBatCrisisSimulator();
  initBatEcholocationGame();
  initBatQuiz();
});

/* ============================================================
   1. ECHOLOCATION ULTRASOUND AUDIO SYNTHESIZER (Web Audio API)
   ============================================================ */
function initBatAudioSynthesizer() {
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

  const playPitchBtn = document.getElementById('playBatPitchBtn');
  const playEchoPingBtn = document.getElementById('playBatEchoPingBtn');
  const playSwarmBtn = document.getElementById('playBatSwarmBtn');

  // Single FM chirp (opadający ton częstotliwościowy - FM bat call)
  function playBatChirp(audibleFreq = 3200, duration = 0.08) {
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';

      // Real bats sweep 80 kHz -> 25 kHz. In audible human range we sweep 7 kHz -> 1.8 kHz
      osc.frequency.setValueAtTime(audibleFreq * 2.2, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(audibleFreq * 0.6, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  }

  // Echo ping with simulated delay reflection
  function playEchoPing() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      // 1. Outgoing loud ping
      playBatChirp(4200, 0.07);

      // 2. Returning softer echo (delay ~80ms = distance ~14 meters)
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(3600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(2200, ctx.currentTime + 0.06);

        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.06);
      }, 95);
    } catch (e) {}
  }

  // Feeding buzz (terminal buzz - gwałtowne zagęszczenie impulsów tuż przed schwytaniem ćmy)
  function playFeedingBuzz() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      let delay = 0;
      for (let i = 0; i < 24; i++) {
        setTimeout(() => {
          playBatChirp(4800, 0.02);
        }, delay);
        // pulses accelerate as bat closes in
        delay += Math.max(12, 100 - i * 4);
      }
    } catch (e) {}
  }

  playPitchBtn?.addEventListener('click', () => {
    playBatChirp(3400, 0.08);
    highlightBtn(playPitchBtn);
  });

  playEchoPingBtn?.addEventListener('click', () => {
    playEchoPing();
    highlightBtn(playEchoPingBtn);
  });

  playSwarmBtn?.addEventListener('click', () => {
    playFeedingBuzz();
    highlightBtn(playSwarmBtn);
  });

  function highlightBtn(btn) {
    btn.style.transform = 'scale(0.97)';
    setTimeout(() => { btn.style.transform = ''; }, 140);
  }
}

/* ============================================================
   2. INTERACTIVE CAVE SONAR VISUALIZER (Canvas)
   ============================================================ */
function initBatSonarCanvas() {
  const canvas = document.getElementById('batSonarCanvas');
  const pingBtn = document.getElementById('triggerSonarPingBtn');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.clientWidth || 600);
  let height = (canvas.height = 300);

  window.addEventListener('resize', () => {
    if (!canvas) return;
    width = canvas.width = canvas.clientWidth || 600;
  });

  // Simulated targets in cave
  const caveObjects = [
    { x: 0.25, y: 0.35, label: '🦋 Ćma w locie', r: 8, hit: false },
    { x: 0.65, y: 0.25, label: '🧗 Stalaktyt', r: 18, hit: false },
    { x: 0.80, y: 0.70, label: '🦟 Komar', r: 5, hit: false },
    { x: 0.40, y: 0.75, label: '🪨 Ściana jaskini', r: 24, hit: false }
  ];

  let pings = [];

  function sendPing() {
    pings.push({
      x: 60,
      y: height / 2,
      radius: 5,
      maxRadius: width * 1.1,
      alpha: 1.0,
      speed: 7
    });
  }

  pingBtn?.addEventListener('click', sendPing);
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    pings.push({ x, y, radius: 5, maxRadius: width * 0.9, alpha: 1.0, speed: 7 });
  });

  function render() {
    // Pitch-black cave background
    ctx.fillStyle = '#06080F';
    ctx.fillRect(0, 0, width, height);

    // Draw Bat emitter icon at (60, height/2)
    ctx.save();
    ctx.font = '28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🦇', 60, height / 2);
    ctx.restore();

    // Render & expand pings
    for (let i = pings.length - 1; i >= 0; i--) {
      const p = pings[i];
      p.radius += p.speed;
      p.alpha = Math.max(0, 1 - p.radius / p.maxRadius);

      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(168, 85, 247, ${p.alpha * 0.85})`;
      ctx.lineWidth = 3;
      ctx.shadowColor = '#A855F7';
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.restore();

      // Check hit with cave objects
      caveObjects.forEach(obj => {
        const ox = obj.x * width;
        const oy = obj.y * height;
        const dist = Math.hypot(p.x - ox, p.y - oy);
        if (Math.abs(dist - p.radius) < 14) {
          obj.hit = true;
          obj.glow = 1.0;
        }
      });

      if (p.alpha <= 0.01) {
        pings.splice(i, 1);
      }
    }

    // Draw cave objects — revealed only when ping hits them!
    caveObjects.forEach(obj => {
      const ox = obj.x * width;
      const oy = obj.y * height;

      if (!obj.glow) obj.glow = 0;
      obj.glow = Math.max(0, obj.glow - 0.018);

      if (obj.glow > 0.05) {
        ctx.save();
        ctx.shadowColor = '#38BDF8';
        ctx.shadowBlur = 16;
        ctx.fillStyle = `rgba(56, 189, 248, ${obj.glow})`;
        ctx.beginPath();
        ctx.arc(ox, oy, obj.r + (1 - obj.glow) * 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 255, 255, ${obj.glow})`;
        ctx.font = '12px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(obj.label, ox, oy - obj.r - 8);
        ctx.restore();
      } else {
        // In the dark — faint mysterious dots
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.beginPath();
        ctx.arc(ox, oy, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    requestAnimationFrame(render);
  }

  render();
}

/* ============================================================
   3. BAT ANATOMY & BIOMECHANICS INSPECTOR
   ============================================================ */
function initBatAnatomyInspector() {
  const buttons = document.querySelectorAll('[data-bat-anatomy]');
  const titleEl = document.getElementById('batAnatomyTitle');
  const descEl = document.getElementById('batAnatomyDesc');
  const statEl = document.getElementById('batAnatomyStat');

  if (!buttons.length || !titleEl) return;

  const data = {
    ears: {
      title: 'Wielkie Małżowiny i Skrawek (Tragus)',
      desc: 'Uszy nietoperza potrafią poruszać się niezależnie. Kluczowym elementem jest fałd skórny zwany skrawkiem (tragus) — odbija fale docierające od góry i od dołu pod różnymi kątami, co pozwala nietoperzowi bezbłędnie określić wysokość lotu owada!',
      stat: 'Częstotliwość do 120 000 Hz'
    },
    wings: {
      title: 'Skrzydła z Wydłużonych Palców Dłoni',
      desc: 'Skrzydło nietoperza (chiroptérium) to w rzeczywistości zmodyfikowana dłoń ssaka. Kciuk tworzy wolny pazur do wspinaczki, a pozostałe 4 palce są ekstremalnie wydłużone i napinają elastyczną, unaczynioną błonę lotną.',
      stat: 'Manewrowość: zwrot o 180° w miejscu'
    },
    nose: {
      title: 'Nos i Narząd Sonaru (Kielich Akustyczny)',
      desc: 'Gatunki takie jak podkowce mają na nosie fantazyjne narośla skórne przypominające siodło i podkowę. Działają one jak megafon akustyczny, skupiając impuls ultradźwiękowy w wąską wiązkę niczym laser.',
      stat: 'Wiązka sonaru: skupienie do 15°'
    },
    claws: {
      title: 'Tylne Pazury z Automatyczną Blokadą Ścięgien',
      desc: 'Nietoperze śpią głową w dół bez użycia energii mięśniowej. Kiedy nietoperz ląduje i zaczepia pazury o skałę, ciężar jego ciała automatycznie zaciska ścięgna. Nie może spaść, nawet gdy zapadnie w głęboką hibernację!',
      stat: 'Wytrzymałość: 100% zablokowania bez zmęczenia'
    },
    tail: {
      title: 'Błona Ogonowa (Uropatagium) — Podbierak na Owady',
      desc: 'Błona rozpięta między tylnymi kończynami i ogonem służy jako hamulec aerodynamiczny oraz... siatka podbieraka! Podczas polowania nietoperz podwija ogon, zgarnia wpadającą ćmę w locie i dopiero wtedy chwyta ją zębami.',
      stat: 'Skuteczność łowiecka: do 98%'
    }
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.getAttribute('data-bat-anatomy');
      const item = data[key];
      if (!item) return;

      titleEl.textContent = item.title;
      descEl.textContent = item.desc;
      if (statEl) statEl.textContent = item.stat;
    });
  });
}

/* ============================================================
   4. CRISIS SIMULATOR: NIETOPERZ W POKOJU (ZASADY BEZPIECZEŃSTWA)
   ============================================================ */
function initBatCrisisSimulator() {
  const cards = document.querySelectorAll('.bat-crisis-card');
  const resultBox = document.getElementById('batCrisisResult');
  if (!cards.length || !resultBox) return;

  const responses = {
    broom: {
      type: 'danger',
      title: '❌ Błąd krytyczny i okrucieństwo!',
      text: 'Miotła lub gazeta łamią delikatne kości palców w skrzydłach nietoperza, skazując go na śmierć. Nietoperz lata w kółko, bo jest przerażony ścianami i szuka wylotu.'
    },
    catch_bare: {
      type: 'danger',
      title: '⚠️ Duże ryzyko ukąszenia!',
      text: 'Nigdy nie łap dzikiego nietoperza gołymi dłońmi. W obronie życia użyje swoich drobnych, ostrych ząbków. Choć wścieklizna u nietoperzy w Polsce jest skrajnie rzadka, każde ukąszenie wymaga serii zastrzyków profilaktycznych.'
    },
    open_window: {
      type: 'success',
      title: '✅ Doskonale! Złota zasada natury:',
      text: '1. Zgaś światło w pokoju, zamknij drzwi do reszty mieszkania.<br>2. Otwórz okno na całą szerokość i rozsuń firanki.<br>3. Wyjdź na 10 minut. Nietoperz za pomocą sonaru natychmiast wyczuje wolną przestrzeń i sam spokojnie odleci w noc.'
    },
    box: {
      type: 'success',
      title: '✅ Prawidłowo (gdy nietoperz wylądował na podłodze):',
      text: 'Gdy nietoperz siedzi na podłodze lub firance: załóż grube rękawice ogrodowe, delikatnie nakryj go pudełkiem po butach, wsuń pod spód tekturkę i wypuść go po zmroku, stawiając pudełko pionowo przy pniu drzewa.'
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
   5. 10-LEVEL MINIGAME: ECHOLOKACJA W JASKINI (NOCNY ŁOWCA CIEM)
   ============================================================ */
function initBatEcholocationGame() {
  const canvas = document.getElementById('batGameCanvas');
  const overlay = document.getElementById('batGameOverlay');
  const startBtn = document.getElementById('startBatGameBtn');
  const nextBtn = document.getElementById('nextBatLevelBtn');
  const restartBtn = document.getElementById('restartBatGameBtn');
  const resetBtn = document.getElementById('resetBatCampaignBtn');

  const timerVal = document.getElementById('batGameTimer');
  const caughtVal = document.getElementById('batGameCaught');
  const pulsesVal = document.getElementById('batGamePulses');
  const levelBadge = document.getElementById('batGameLevelBadge');
  const levelDotsContainer = document.getElementById('batGameLevelDots');
  const overlayIcon = document.getElementById('batGameOverIcon');
  const overlayTitle = document.getElementById('batGameOverTitle');
  const overlayDesc = document.getElementById('batGameOverDesc');

  if (!canvas || !overlay || !startBtn) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.clientWidth || 500);
  let height = (canvas.height = canvas.clientHeight || 340);

  window.addEventListener('resize', () => {
    if (!canvas) return;
    width = canvas.width = canvas.clientWidth || 500;
    height = canvas.height = canvas.clientHeight || 340;
  });

  // Sound generator
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

  function playSonarPip() {
    const c = getAudioCtx();
    if (!c) return;
    try {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(3200, c.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, c.currentTime + 0.05);
      gain.gain.setValueAtTime(0.09, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start();
      osc.stop(c.currentTime + 0.05);
    } catch (e) {}
  }

  function playCatchChime() {
    const c = getAudioCtx();
    if (!c) return;
    try {
      [523, 784, 1046].forEach((f, i) => {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.frequency.setValueAtTime(f, c.currentTime + i * 0.04);
        gain.gain.setValueAtTime(0.12, c.currentTime + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + i * 0.04 + 0.12);
        osc.connect(gain);
        gain.connect(c.destination);
        osc.start(c.currentTime + i * 0.04);
        osc.stop(c.currentTime + i * 0.04 + 0.12);
      });
    } catch (e) {}
  }

  // 10 Progressive Cave Levels Configuration
  const levels = [
    {
      name: 'Płytka Grota Wapienna 🪨',
      desc: 'Pierwsze loty młodego nocka. Spokojne ćmy odpoczywające na ścianach. Wysyłaj impulsy sonaru i łap zdobycz!',
      time: 40,
      targetMoths: 3,
      obstacles: 1,
      sonarCooldown: 400
    },
    {
      name: 'Korytarz Jaskini Nietoperzowej 🦇',
      desc: 'Korytarz staje się węższy. Pojawiają się zwisające stalaktyty. Omijaj przeszkody!',
      time: 38,
      targetMoths: 4,
      obstacles: 2,
      sonarCooldown: 450
    },
    {
      name: 'Stary Strych Kościoła ⛪🕸️',
      desc: 'Gęste belki dachowe i pajęczyny. Zwinne ćmy przelatują między krokwiami.',
      time: 36,
      targetMoths: 4,
      obstacles: 3,
      sonarCooldown: 450
    },
    {
      name: 'Podziemna Komora ze Źródłem 💧',
      desc: 'Krople wody zakłócają fale sonaru. Wytrop 5 ciem odbijając fale od powierzchni wody!',
      time: 36,
      targetMoths: 5,
      obstacles: 3,
      sonarCooldown: 500
    },
    {
      name: 'Gęsty Las Bukowy o Północy 🌲🌙',
      desc: 'Polowanie w plenerze! Gałęzie sosen i powiewy wiatru. Ćmy wykonują uniki w locie.',
      time: 35,
      targetMoths: 5,
      obstacles: 4,
      sonarCooldown: 500
    },
    {
      name: 'Skalny Wąwóz w Ojcowie 🏞️',
      desc: 'Strome wapienne ściany. Echo odbija się wielokrotnie — precyzyjnie kalkuluj odległości.',
      time: 34,
      targetMoths: 6,
      obstacles: 4,
      sonarCooldown: 550
    },
    {
      name: 'Opuszczona Sztolnia Górnicza ⛏️⚠️',
      desc: 'Ciasne drewniane stemple i wiszące przewody. Wymaga chirurgicznej precyzji manewrowania skrzydłami.',
      time: 32,
      targetMoths: 6,
      obstacles: 5,
      sonarCooldown: 550
    },
    {
      name: 'Jaskinia Lodowa w Tatrach ❄️🧊',
      desc: 'Lodowe sople odbijają dźwięk ze zdwojoną siłą. Chłód zmusza do szybkiego zebrania kalorii!',
      time: 30,
      targetMoths: 6,
      obstacles: 5,
      sonarCooldown: 600
    },
    {
      name: 'Letnia Noc nad Jeziorem Śniardwy 🌊🦟',
      desc: 'Tysiące zwinnych komarów i ciem nad taflą wody. Złap 7 owadów w ułamku sekundy!',
      time: 32,
      targetMoths: 7,
      obstacles: 5,
      sonarCooldown: 600
    },
    {
      name: 'Mistrz Nocnego Nieba — Król Echolokacji 👑🦇',
      desc: 'Finałowe wyzwanie! Labirynt przeszkód, błyskawiczne ćmy z uszami akustycznymi. Zdobądź tytuł Władcy Nocy!',
      time: 30,
      targetMoths: 8,
      obstacles: 6,
      sonarCooldown: 650
    }
  ];

  let currentLevelIdx = 0;
  let isPlaying = false;
  let timeLeft = 40;
  let timerInterval = null;
  let animId = null;
  let caughtCount = 0;
  let pulseCount = 0;

  // Bat Player
  let batX = 60;
  let batY = 170;
  let targetBatX = 60;
  let targetBatY = 170;

  // Sonar waves
  let sonarWaves = [];
  let lastSonarTime = 0;

  // Entities
  let moths = [];
  let stalactites = [];

  function spawnLevelEntities() {
    const lvl = levels[currentLevelIdx];
    moths = [];
    stalactites = [];

    // Moths
    for (let i = 0; i < lvl.targetMoths; i++) {
      moths.push({
        x: 140 + Math.random() * (width - 180),
        y: 40 + Math.random() * (height - 80),
        vx: (Math.random() - 0.5) * 2.2,
        vy: (Math.random() - 0.5) * 2.2,
        glow: 0,
        caught: false
      });
    }

    // Stalactites (obstacles)
    for (let i = 0; i < lvl.obstacles; i++) {
      stalactites.push({
        x: 120 + Math.random() * (width - 160),
        y: Math.random() < 0.5 ? 20 : height - 20,
        r: 22 + Math.random() * 14,
        glow: 0
      });
    }
  }

  function emitSonar() {
    const now = Date.now();
    const lvl = levels[currentLevelIdx];
    if (now - lastSonarTime < lvl.sonarCooldown) return;
    lastSonarTime = now;
    pulseCount++;
    if (pulsesVal) pulsesVal.textContent = pulseCount;

    playSonarPip();

    sonarWaves.push({
      x: batX,
      y: batY,
      r: 6,
      maxR: Math.max(width, height) * 0.95,
      alpha: 1.0,
      speed: 6.5
    });
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
    if (caughtVal) caughtVal.textContent = `${caughtCount} / ${lvl.targetMoths}`;
    if (timerVal) timerVal.textContent = `${timeLeft}s`;
    if (pulsesVal) pulsesVal.textContent = pulseCount;
  }

  // Pointer / Touch tracking
  function handlePointer(e) {
    if (!isPlaying) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    targetBatX = Math.max(20, Math.min(width - 20, clientX - rect.left));
    targetBatY = Math.max(20, Math.min(height - 20, clientY - rect.top));

    // Emit sonar on tap / move
    emitSonar();
  }

  canvas.addEventListener('mousemove', handlePointer);
  canvas.addEventListener('touchstart', (e) => { e.preventDefault(); handlePointer(e); }, { passive: false });
  canvas.addEventListener('touchmove', (e) => { e.preventDefault(); handlePointer(e); }, { passive: false });

  function startGame(lvlIdx = 0) {
    currentLevelIdx = lvlIdx;
    const lvl = levels[currentLevelIdx];
    isPlaying = true;
    timeLeft = lvl.time;
    caughtCount = 0;
    pulseCount = 0;
    sonarWaves = [];
    batX = 60;
    batY = height / 2;
    targetBatX = 60;
    targetBatY = height / 2;

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
        endGame(false, '⏱️ Skończył się czas!', 'Zabrakło energii! Wyślij więcej impulsów sonaru i poluj szybciej.');
      }
    }, 1000);

    // Initial ping
    emitSonar();
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
      playCatchChime();
      overlayIcon.textContent = '🏆🦇✨';
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
      overlayIcon.textContent = '🦇❌';
      startBtn.style.display = 'none';
      nextBtn.style.display = 'none';
      restartBtn.style.display = 'inline-block';
      resetBtn.style.display = 'none';
    }
  }

  function loop() {
    if (!isPlaying) return;

    // Move bat towards pointer smoothly
    batX += (targetBatX - batX) * 0.15;
    batY += (targetBatY - batY) * 0.15;

    // Clear Canvas
    ctx.fillStyle = '#060810';
    ctx.fillRect(0, 0, width, height);

    // Periodic sonar pulse if player stays still
    if (Date.now() - lastSonarTime > 1200) {
      emitSonar();
    }

    // Process & Draw Sonar Waves
    for (let i = sonarWaves.length - 1; i >= 0; i--) {
      const w = sonarWaves[i];
      w.r += w.speed;
      w.alpha = Math.max(0, 1 - w.r / w.maxR);

      ctx.save();
      ctx.beginPath();
      ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(168, 85, 247, ${w.alpha * 0.85})`;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#A855F7';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.restore();

      // Hit check with moths
      moths.forEach(m => {
        if (!m.caught) {
          const d = Math.hypot(w.x - m.x, w.y - m.y);
          if (Math.abs(d - w.r) < 16) {
            m.glow = 1.0;
          }
        }
      });

      // Hit check with stalactites
      stalactites.forEach(s => {
        const d = Math.hypot(w.x - s.x, w.y - s.y);
        if (Math.abs(d - w.r) < 18) {
          s.glow = 1.0;
        }
      });

      if (w.alpha <= 0.02) {
        sonarWaves.splice(i, 1);
      }
    }

    // Update & Draw Stalactites (Obstacles)
    stalactites.forEach(s => {
      s.glow = Math.max(0, (s.glow || 0) - 0.02);

      if (s.glow > 0.05) {
        ctx.save();
        ctx.fillStyle = `rgba(239, 68, 68, ${s.glow * 0.75})`;
        ctx.strokeStyle = `rgba(248, 113, 113, ${s.glow})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      // Collision with Bat
      const d = Math.hypot(batX - s.x, batY - s.y);
      if (d < s.r + 14) {
        endGame(false, '💥 Zderzenie ze stalaktytem!', 'Nietoperz uderzył w przeszkodę. Wypuszczaj sonar częściej, by widzieć kontury jaskini w porę!');
      }
    });

    // Update & Draw Moths
    const lvl = levels[currentLevelIdx];
    moths.forEach(m => {
      if (m.caught) return;

      // Jitter movement
      m.x += m.vx;
      m.y += m.vy;
      if (m.x < 30 || m.x > width - 30) m.vx *= -1;
      if (m.y < 30 || m.y > height - 30) m.vy *= -1;

      m.glow = Math.max(0, m.glow - 0.025);

      if (m.glow > 0.05) {
        ctx.save();
        ctx.shadowColor = '#38BDF8';
        ctx.shadowBlur = 14;
        ctx.fillStyle = `rgba(56, 189, 248, ${m.glow})`;
        ctx.font = '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🦋', m.x, m.y);
        ctx.restore();
      }

      // Bat catches moth!
      const dist = Math.hypot(batX - m.x, batY - m.y);
      if (dist < 26) {
        m.caught = true;
        caughtCount++;
        playCatchChime();
        if (caughtVal) caughtVal.textContent = `${caughtCount} / ${lvl.targetMoths}`;

        if (caughtCount >= lvl.targetMoths) {
          endGame(true, `🎉 Zwycięstwo! Ukończono Poziom ${currentLevelIdx + 1}!`, `Nietoperz schwytał wszystkie ${lvl.targetMoths} ciem dzięki echolokacji.`);
        }
      }
    });

    // Draw Bat Player
    ctx.save();
    ctx.font = '30px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🦇', batX, batY);
    ctx.restore();

    animId = requestAnimationFrame(loop);
  }

  startBtn?.addEventListener('click', () => startGame(0));
  restartBtn?.addEventListener('click', () => startGame(currentLevelIdx));
  nextBtn?.addEventListener('click', () => startGame(currentLevelIdx + 1));
  resetBtn?.addEventListener('click', () => startGame(0));
}

/* ============================================================
   INTERACTIVE QUIZ: MISTRZ ECHOLOKACJI NIETOPERZY
   ============================================================ */
function initBatQuiz() {
  const quizBody = document.getElementById('batQuizDynamicBody');
  const progressBar = document.getElementById('batQuizMeterProgress');

  if (!quizBody || !progressBar) return;

  const questions = [
    {
      q: 'Do jakiej częstotliwości sięgają ultradźwięki sonaru polskich nietoperzy?',
      options: [
        'Do 20 000 Hz (jak granica ludzkiego słuchu)',
        'Do ok. 40 000 Hz',
        'Aż do 120 000 Hz (120 kHz!)',
        'Nietoperze posługują się wyłącznie infradźwiękami poniżej 20 Hz'
      ],
      correct: 2,
      explanation: 'Niektóre gatunki (np. podkowce czy nocki) emitują fale o częstotliwości przekraczającej 100-120 kHz, wielokrotnie przekraczając możliwości ludzkiego ucha (max 20 kHz).'
    },
    {
      q: 'W jaki sposób nietoperz nie ogłusza samego siebie, krzycząc z siłą ponad 130 dB?',
      options: [
        'Zatyka uszy skrzydłami w trakcie lotu',
        'Mięsień strzemiączkowy odłącza kosteczki słuchowe na ułamek sekundy podczas każdego krzyku',
        'Nietoperze są w 100% głuche na własny głos',
        'Wydaje dźwięk z taką prędkością, że fala dźwiękowa ucieka do przodu'
      ],
      correct: 1,
      explanation: 'Przed każdym impulsem miniaturowy mięsień w uchu środkowym zaciska się, odłączając błonę bębenkową od ślimaka, po czym natychmiast rozluźnia się w ułamku milisekundy, by odebrać ciche echo odbite od owada!'
    },
    {
      q: 'Czy nietoperz wlatujący do pokoju próbuje wkręcić się człowiekowi we włosy?',
      options: [
        'Tak, przyciąga go zapach ludzkiego szamponu i ciepło głowy',
        'Nie, to absolutny zabobon — jego sonar wykrywa przeszkodę grubości włosa i omija człowieka z daleka',
        'Tylko w okresie godowym jesienią',
        'Robi to wyłącznie wtedy, gdy w pokoju pali się jasne światło'
      ],
      correct: 1,
      explanation: 'Nietoperze nigdy celowo nie wkręcają się we włosy! Ich echolokacja omija nylonowe żyłki o grubości 0,05 mm. Nietoperz lata chaotycznie pod sufitem wyłącznie dlatego, że szuka echa otwartej przestrzeni.'
    },
    {
      q: 'Co należy zrobić, gdy w letni wieczór nietoperz wpadnie przez okno do mieszkania?',
      options: [
        'Próbować strącić go miotłą lub zrolowaną gazetą',
        'Zgasić światło, otworzyć okno na oścież, zamknąć drzwi do pokoju i wyjść na 10 minut',
        'Złapać go w locie gołymi rękami i wyrzucić przez balkon',
        'Użyć odkurzacza lub sprayu na owady'
      ],
      correct: 1,
      explanation: 'Najlepsza metoda to spokój: zgaś światło, otwórz szeroko okno i opuść pokój. Nietoperz dzięki sonarowi szybko zlokalizuje wylot i sam bezpiecznie odleci.'
    },
    {
      q: 'Jaką rolę w ekosystemie Polski pełnią nietoperze?',
      options: [
        'Są szkodnikami niszczącymi konstrukcje dachowe budynków',
        'Żywią się krwią zwierząt hodowlanych (wampiryzm)',
        'Są nieocenionymi sprzymierzeńcami — jeden nietoperz pożera nawet 1000 komarów i szkodników na godzinę',
        'Nie mają wpływu na liczebność owadów'
      ],
      correct: 2,
      explanation: 'W Polsce wszystkie 27 gatunków nietoperzy to owadożercy pod ścisłą ochroną prawną. Pojedynczy malutki karlik potrafi zjeść setki uciążliwych komarów i ciem w ciągu jednej nocy!'
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
      <div id="batQuizFeedback"></div>
      <div class="quiz-action-bar" id="batQuizNextBar" style="display: none; margin-top: 20px;">
        <button class="btn btn-primary" id="batQuizNextBtn" style="background: linear-gradient(135deg, #A855F7 0%, #7E22CE 100%);">
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

    const feedbackEl = document.getElementById('batQuizFeedback');
    const nextBar = document.getElementById('batQuizNextBar');

    optButtons[qData.correct].classList.add('correct');

    if (selected === qData.correct) {
      score++;
      feedbackEl.className = 'quiz-feedback-banner success';
      feedbackEl.innerHTML = `<strong>Świetnie!</strong> ${qData.explanation}`;
    } else {
      optButtons[selected].classList.add('wrong');
      feedbackEl.className = 'quiz-feedback-banner failure';
      feedbackEl.innerHTML = `<strong>Nie do końca.</strong> ${qData.explanation}`;
    }

    nextBar.style.display = 'flex';
    document.getElementById('batQuizNextBtn').addEventListener('click', () => {
      currentIdx++;
      renderQuestion();
    });
  }

  function renderSummary() {
    progressBar.style.width = '100%';
    const percent = Math.round((score / questions.length) * 100);

    let rankTitle = 'Mistrz Echolokacji i Przyjaciel Nietoperzy 🦇';
    let badgeEmoji = '👑';
    let rankDesc = 'Bezbłędnie! Znasz fizykę sonaru, bioakustykę i wiesz doskonale, jak reagować przy spotkaniu z tymi niezwykłymi ssakami.';

    if (percent < 80 && percent >= 60) {
      rankTitle = 'Znawca Nocnych Łowców 🌌';
      badgeEmoji = '🎖️';
      rankDesc = 'Bardzo dobry wynik! Wiesz, że nietoperze to pożyteczni sprzymierzeńcy człowieka i nie wkręcają się we włosy.';
    } else if (percent < 60) {
      rankTitle = 'Adept Nocnej Percepcji 📚';
      badgeEmoji = '🦇';
      rankDesc = 'Warto przejrzeć sekcję zmysłów i faktów o echolokacji raz jeszcze — ochrona nietoperzy to klucz do równowagi w przyrodzie!';
    }

    quizBody.innerHTML = `
      <div class="quiz-certificate">
        <div class="certificate-badge-emoji">${badgeEmoji}</div>
        <div class="certificate-score">${score} / ${questions.length}</div>
        <h3 class="certificate-title">${rankTitle}</h3>
        <p class="certificate-desc">${rankDesc}</p>
        <button class="btn btn-primary" id="batQuizRestartBtn" style="background: linear-gradient(135deg, #A855F7 0%, #7E22CE 100%);">Rozwiąż quiz ponownie ↺</button>
      </div>
    `;

    document.getElementById('batQuizRestartBtn').addEventListener('click', () => {
      currentIdx = 0;
      score = 0;
      renderQuestion();
    });
  }

  renderQuestion();
}


/* ============================================================
   OWL (SOWA PŁOMYKÓWKA) — SENSORY SIMULATORS & 10-LEVEL GAME
   Author: Dorian Kalinowski for "Świat zmysłami zwierząt"
   Senses: Asymmetric ears (3D audio triangulation), Facial disc, Silent flight
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initOwlAudioSynthesizer();
  initOwlFlightSoundComparison();
  initOwlAnatomyInspector();
  initOwlCrisisSimulator();
  initOwlAcousticHuntGame();
  initOwlQuiz();
});

/* ============================================================
   1. 3D ASYMMETRIC EAR AUDIO SYNTHESIZER (Web Audio API)
   ============================================================ */
function initOwlAudioSynthesizer() {
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

  const elevationSlider = document.getElementById('owlElevationSlider');
  const azimuthSlider = document.getElementById('owlAzimuthSlider');
  const playRustleBtn = document.getElementById('playOwlRustleBtn');
  const earDiffDisplay = document.getElementById('owlEarDiffDisplay');

  function play3DMiceRustle(azimuth = 0, elevation = 0) {
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      // White noise filtered to mimic mouse rustling in dry leaves (3-8 kHz)
      const bufferSize = ctx.sampleRate * 0.45;
      const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
      const leftData = buffer.getChannelData(0);
      const rightData = buffer.getChannelData(1);

      // Asymmetric owl ear geometry:
      // Left ear is lower & points down (more sensitive to sounds below horizon).
      // Right ear is higher & points up (more sensitive to sounds above horizon).
      const leftGainVal = Math.max(0.05, 0.5 - elevation * 0.005 - azimuth * 0.005);
      const rightGainVal = Math.max(0.05, 0.5 + elevation * 0.005 + azimuth * 0.005);

      for (let i = 0; i < bufferSize; i++) {
        const noise = (Math.random() * 2 - 1) * 0.12;
        leftData[i] = noise * leftGainVal;
        rightData[i] = noise * rightGainVal;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(4500, ctx.currentTime);
      filter.Q.setValueAtTime(2.0, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start();

      if (earDiffDisplay) {
        const itd = Math.abs(azimuth * 3.8).toFixed(1);
        const ild = Math.abs(elevation * 0.35).toFixed(1);
        earDiffDisplay.textContent = `Różnica czasu (ITD): ${itd} µs | Różnica głośności (ILD): ${ild} dB`;
      }
    } catch (e) {}
  }

  playRustleBtn?.addEventListener('click', () => {
    const az = parseFloat(azimuthSlider?.value || 0);
    const el = parseFloat(elevationSlider?.value || 0);
    play3DMiceRustle(az, el);
  });

  [elevationSlider, azimuthSlider].forEach(slider => {
    slider?.addEventListener('input', () => {
      const az = parseFloat(azimuthSlider?.value || 0);
      const el = parseFloat(elevationSlider?.value || 0);
      if (earDiffDisplay) {
        const itd = Math.abs(az * 3.8).toFixed(1);
        const ild = Math.abs(el * 0.35).toFixed(1);
        earDiffDisplay.textContent = `Różnica czasu (ITD): ${itd} µs | Różnica głośności (ILD): ${ild} dB`;
      }
    });
  });
}

/* ============================================================
   2. SILENT FLIGHT VS PIGEON ACOUSTIC COMPARISON
   ============================================================ */
function initOwlFlightSoundComparison() {
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

  const playPigeonBtn = document.getElementById('playPigeonFlightBtn');
  const playOwlFlightBtn = document.getElementById('playOwlFlightBtn');

  // Pigeon: loud flapping wing turbulence (65 dB)
  playPigeonBtn?.addEventListener('click', () => {
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(140, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.12);
          gain.gain.setValueAtTime(0.35, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.12);
        }, i * 110);
      }
    } catch (e) {}
  });

  // Owl: velvety silent glide with micro-air comb fringes (< 15 dB)
  playOwlFlightBtn?.addEventListener('click', () => {
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      const bufferSize = ctx.sampleRate * 0.8;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.015; // Barely audible velvet whisper
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch (e) {}
  });
}

/* ============================================================
   3. OWL ANATOMY & BIOMECHANICS INSPECTOR
   ============================================================ */
function initOwlAnatomyInspector() {
  const buttons = document.querySelectorAll('[data-owl-anatomy]');
  const titleEl = document.getElementById('owlAnatomyTitle');
  const descEl = document.getElementById('owlAnatomyDesc');
  const statEl = document.getElementById('owlAnatomyStat');

  if (!buttons.length || !titleEl) return;

  const data = {
    disc: {
      title: 'Szlara Twarzowa — Paraboliczna Czasza Anteny',
      desc: 'Twarz sowy ma kształt serca ułożonego z gęstych, sztywnych piórek. Działa dokładnie jak talerz anteny satelitarnej: zbiera nawet najcichszy szelest myszy i kieruje fale dźwiękowe prosto do otworów usznych ukrytych pod piórami.',
      stat: 'Wzmocnienie akustyczne: +10 dB'
    },
    ears: {
      title: 'Asymetria Otworów Usznych (Lewe niżej, Prawe wyżej)',
      desc: 'Uszy sowy nie leżą symetrycznie! Prawe ucho jest umieszczone wyżej i skierowane lekko w górę, a lewe niżej i skierowane w dół. Dźwięk dociera do uszu z mikrosekundową różnicą czasu — mózg sowy natychmiast wylicza współrzędne pionowe i poziome.',
      stat: 'Dokładność lokalizacji: 1 stopień kątowy'
    },
    eyes: {
      title: 'Cylindryczne Oczy (Brak Ruchu Gałek Ocznych)',
      desc: 'Oczy sowy nie są kulami, lecz nieruchomymi cylindrami zaciśniętymi w kościanych pierścieniach twardówki. Sowa nie potrafi poruszać gałkami ocznymi! W zamian posiada 14 kręgów szyjnych i obraca całą głowę aż o 270 stopni w obie strony.',
      stat: 'Obrót głowy: 270° bez zmiany pozycji ciała'
    },
    feathers: {
      title: 'Aksamitne Grzebyki na Lotkach (Bezgłośny Lot)',
      desc: 'Skrajne pióra skrzydeł sowy mają ząbkowane krawędzie (jak grzebyk), które rozbijają wiry powietrza na mikroskopijne strumyczki. Dodatkowo wierzch skrzydeł pokrywa miękki meszek tłumiący tarcie. Sowa leci w 100% bezszelestnie!',
      stat: 'Poziom hałasu w locie: < 18 dB (niesłyszalny)'
    },
    talons: {
      title: 'Zwrotny Palec Szponów (Zygodaktylia Zmienna)',
      desc: 'Szpony sowy mają unikalną biomechanikę: czwarty zewnętrzny palec jest obrotowy. Podczas odpoczynku na gałęzi trzyma się w układzie 3 palce z przodu, 1 z tyłu. Podczas chwytania myszy palec obraca się do tyłu, tworząc zabójczy uścisk 2x2.',
      stat: 'Siła nacisku szponów: do 30 kg/cm²'
    }
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.getAttribute('data-owl-anatomy');
      const item = data[key];
      if (!item) return;

      titleEl.textContent = item.title;
      descEl.textContent = item.desc;
      if (statEl) statEl.textContent = item.stat;
    });
  });
}

/* ============================================================
   4. CRISIS SIMULATOR: PODLOT SOWY NA ZIEMI (BEZPIECZEŃSTWO)
   ============================================================ */
function initOwlCrisisSimulator() {
  const cards = document.querySelectorAll('.owl-crisis-card');
  const resultBox = document.getElementById('owlCrisisResult');
  if (!cards.length || !resultBox) return;

  const responses = {
    take_home: {
      type: 'danger',
      title: '❌ BŁĄD: Kradzież dzikiego pisklęcia!',
      text: 'NIGDY nie zabieraj małej sowy do domu! Młode sowy (podloty) opuszczają dziuplę, zanim nauczą się perfekcyjnie latać. Siedzą na trawie lub gałęziach, a rodzice są w pobliżu i regularnie przynoszą im myszy. Zabranie go do domu to odebranie mu szansy na przeżycie w naturze.'
    },
    feed_milk: {
      type: 'danger',
      title: '❌ Śmiertelny błąd: Karmienie mlekiem lub chlebem!',
      text: 'Ptaki nie trawią laktozy ani przetworzonego pieczywa. Podanie mleka wywołuje śmiertelną biegawkę u pisklęcia.'
    },
    lift_branch: {
      type: 'success',
      title: '✅ PRAWIDŁOWA I JEDYNA POMOC (Gdy grożą psy/koty):',
      text: '1. Jeśli młoda sowa siedzi na ziemi w parku, na chodniku lub przy drodze: delikatnie weź ją w rękawiczkach lub przez bluzę.<br>2. Podsadź ją na wyższą gałąź pobliskiego drzewa lub w gęsty krzew z dala od psów i kotów.<br>3. Oddal się. Zapach człowieka NIE przeszkadza ptakom (mają słaby węch), a rodzice w nocy bez problemu odnajdą ją po głosie.'
    },
    call_vet: {
      type: 'success',
      title: '✅ Prawidłowo tylko w przypadku widocznych ran:',
      text: 'Gdy sowa ma złamane skrzydło, krwawi lub leży bezwładnie: zabezpiecz ją w ciemnym kartonie z otworami i skontaktuj się z lokalnym <em>Ośrodkiem Rehabilitacji Dzikich Zwierząt</em> lub Strażą Miejską/Leśną.'
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
   5. 10-LEVEL MINIGAME: NOCNY ŁOWCA DŹWIĘKU (SZLARA W AKCJI)
   ============================================================ */
function initOwlAcousticHuntGame() {
  const canvas = document.getElementById('owlGameCanvas');
  const overlay = document.getElementById('owlGameOverlay');
  const startBtn = document.getElementById('startOwlGameBtn');
  const nextBtn = document.getElementById('nextOwlLevelBtn');
  const restartBtn = document.getElementById('restartOwlGameBtn');
  const resetBtn = document.getElementById('resetOwlCampaignBtn');

  const timerVal = document.getElementById('owlGameTimer');
  const miceVal = document.getElementById('owlGameMice');
  const angleVal = document.getElementById('owlGameAngle');
  const levelBadge = document.getElementById('owlGameLevelBadge');
  const levelDotsContainer = document.getElementById('owlGameLevelDots');
  const overlayIcon = document.getElementById('owlGameOverIcon');
  const overlayTitle = document.getElementById('owlGameOverTitle');
  const overlayDesc = document.getElementById('owlGameOverDesc');

  if (!canvas || !overlay || !startBtn) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.clientWidth || 500);
  let height = (canvas.height = canvas.clientHeight || 340);

  window.addEventListener('resize', () => {
    if (!canvas) return;
    width = canvas.width = canvas.clientWidth || 500;
    height = canvas.height = canvas.clientHeight || 340;
  });

  // Audio FX
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
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, c.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, c.currentTime + 0.16);
      gain.gain.setValueAtTime(0.25, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.16);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start();
      osc.stop(c.currentTime + 0.16);
    } catch (e) {}
  }

  // 10 Progressive Night Hunting Levels
  const levels = [
    {
      name: 'Cicha Stodoła i Zboże 🌾🦉',
      desc: 'Młoda sowa płomykówka w zaciszu stodoły. Suche deski i szeleszczące myszy. Namierz cel i zaatakuj!',
      time: 40,
      targetMice: 3,
      soundInterval: 65
    },
    {
      name: 'Przydomowy Ogród o Północy 🏡',
      desc: 'Zarośla agrestu i porzeczek. Zwinne myszy zaroślowe biegają po trawie.',
      time: 38,
      targetMice: 4,
      soundInterval: 60
    },
    {
      name: 'Brzeg Lasu i Suche Liście 🍂',
      desc: 'Dąbrowa o zmierzchu. Opadłe liście głośno szeleszczą pod łapkami nornic.',
      time: 36,
      targetMice: 4,
      soundInterval: 55
    },
    {
      name: 'Śnieżna Łąka w Puszczy ❄️',
      desc: 'Puch śnieżny tłumi dźwięk. Użyj szlary twarzowej, by wychwycić szmer gryzonia pod śniegiem.',
      time: 36,
      targetMice: 5,
      soundInterval: 50
    },
    {
      name: 'Wierzby nad Strumieniem 💧',
      desc: 'Szum wody utrudnia nasłuch. Skup uwagę na wyższych częstotliwościach pisku nornika.',
      time: 34,
      targetMice: 5,
      soundInterval: 50
    },
    {
      name: 'Młode Świerki i Zwinne Nornice 🌲',
      desc: 'Gęsty podszyt świerkowy. Wymaga szybkiej korekty obrotu głowy i ataku bez wahania.',
      time: 34,
      targetMice: 6,
      soundInterval: 45
    },
    {
      name: 'Wietrzny Grzbiet Pogórza 💨',
      desc: 'Podmuchy nocnego wiatru. Gryzonie poruszają się falami. Poluj w chwilach ciszy.',
      time: 32,
      targetMice: 6,
      soundInterval: 45
    },
    {
      name: 'Nocna Mgła w Dolinie 🌫️',
      desc: 'Gęsta mgła — wzrok jest bezużyteczny! Działa wyłącznie trójwymiarowy słuch asymetryczny.',
      time: 32,
      targetMice: 6,
      soundInterval: 40
    },
    {
      name: 'Zmrożona Zmarzlina i Szybkie Gryzonie ❄️🐭',
      desc: 'Zmrożona skorupa śniegu. Gryzonie wyczuwają cień drapieżnika — liczy się bezszelestny lot!',
      time: 30,
      targetMice: 7,
      soundInterval: 38
    },
    {
      name: 'Władczyni Nocnego Nieba — Mistrzyni Szlary 👑🦉',
      desc: 'Finałowe polowanie! Zdobądź 7 gryzoni w rekordowym czasie i opanuj słuch absolutny.',
      time: 30,
      targetMice: 7,
      soundInterval: 35
    }
  ];

  let currentLevelIdx = 0;
  let isPlaying = false;
  let timeLeft = 40;
  let timerInterval = null;
  let animId = null;
  let caughtCount = 0;

  // Owl Head Pos (Center top)
  let owlX = 250;
  let owlY = 60;
  let crosshairX = 250;
  let crosshairY = 200;

  // Mice
  let mice = [];

  function spawnLevelEntities() {
    const lvl = levels[currentLevelIdx];
    mice = [];

    for (let i = 0; i < lvl.targetMice; i++) {
      mice.push({
        x: 80 + Math.random() * (width - 160),
        y: 130 + Math.random() * (height - 160),
        vx: (Math.random() - 0.5) * 2.0,
        vy: (Math.random() - 0.5) * 2.0,
        rustleTimer: Math.random() * lvl.soundInterval,
        soundGlow: 0,
        caught: false
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
    if (miceVal) miceVal.textContent = `${caughtCount} / ${lvl.targetMice}`;
    if (timerVal) timerVal.textContent = `${timeLeft}s`;
  }

  function handlePointer(e) {
    if (!isPlaying) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    crosshairX = Math.max(20, Math.min(width - 20, clientX - rect.left));
    crosshairY = Math.max(80, Math.min(height - 20, clientY - rect.top));

    // Calculate angle from owl to crosshair
    const angleRad = Math.atan2(crosshairY - owlY, crosshairX - owlX);
    const angleDeg = Math.round(angleRad * (180 / Math.PI));
    if (angleVal) angleVal.textContent = `${angleDeg}°`;
  }

  canvas.addEventListener('mousemove', handlePointer);
  canvas.addEventListener('touchstart', (e) => { e.preventDefault(); handlePointer(e); }, { passive: false });
  canvas.addEventListener('touchmove', (e) => { e.preventDefault(); handlePointer(e); }, { passive: false });

  // Strike on click/tap
  canvas.addEventListener('click', () => {
    if (!isPlaying) return;
    performStrike();
  });

  function performStrike() {
    const lvl = levels[currentLevelIdx];
    let hit = false;

    mice.forEach(m => {
      if (m.caught) return;
      const d = Math.hypot(crosshairX - m.x, crosshairY - m.y);
      if (d < 32) {
        m.caught = true;
        hit = true;
        caughtCount++;
        playStrikeSound();
        if (miceVal) miceVal.textContent = `${caughtCount} / ${lvl.targetMice}`;

        if (caughtCount >= lvl.targetMice) {
          endGame(true, `🎉 Zwycięstwo! Ukończono Poziom ${currentLevelIdx + 1}!`, `Sowa zlokalizowała i schwytała wszystkie ${lvl.targetMice} gryzonie za pomocą szlary twarzowej.`);
        }
      }
    });

    if (!hit) {
      // Small penalty miss
      playStrikeSound();
    }
  }

  function startGame(lvlIdx = 0) {
    currentLevelIdx = lvlIdx;
    const lvl = levels[currentLevelIdx];
    isPlaying = true;
    timeLeft = lvl.time;
    caughtCount = 0;
    owlX = width / 2;
    owlY = 40;
    crosshairX = width / 2;
    crosshairY = height / 2;

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
        endGame(false, '⏱️ Czas minął!', 'Noc dobiegła końca. Nasłuchuj dźwięków uważniej i atakuj, gdy fala dźwiękowa jest najsilniejsza!');
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
      overlayIcon.textContent = '🏆🦉✨';
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
      overlayIcon.textContent = '🦉🌙';
      startBtn.style.display = 'none';
      nextBtn.style.display = 'none';
      restartBtn.style.display = 'inline-block';
      resetBtn.style.display = 'none';
    }
  }

  function loop() {
    if (!isPlaying) return;

    // Dark night meadow background
    ctx.fillStyle = '#080A14';
    ctx.fillRect(0, 0, width, height);

    // Draw Perched Owl Head at top
    ctx.save();
    ctx.font = '32px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🦉', owlX, owlY);
    ctx.restore();

    // Update & draw sound waves from mice
    const lvl = levels[currentLevelIdx];
    mice.forEach(m => {
      if (m.caught) return;

      m.x += m.vx;
      m.y += m.vy;
      if (m.x < 40 || m.x > width - 40) m.vx *= -1;
      if (m.y < 100 || m.y > height - 40) m.vy *= -1;

      m.rustleTimer++;
      if (m.rustleTimer > lvl.soundInterval) {
        m.rustleTimer = 0;
        m.soundGlow = 1.0;
      }

      m.soundGlow = Math.max(0, m.soundGlow - 0.022);

      // Acoustic echo circle
      if (m.soundGlow > 0.04) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(m.x, m.y, 25 * (1 - m.soundGlow) + 10, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(245, 158, 11, ${m.soundGlow * 0.9})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = '18px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🐭', m.x, m.y);
        ctx.restore();
      }
    });

    // Draw Sight line / Triangulation beam from Owl to Crosshair
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(owlX, owlY + 15);
    ctx.lineTo(crosshairX, crosshairY);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 6]);
    ctx.stroke();

    // Draw Target Reticle (Facial disc focus)
    ctx.beginPath();
    ctx.arc(crosshairX, crosshairY, 22, 0, Math.PI * 2);
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.stroke();

    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(crosshairX, crosshairY, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    animId = requestAnimationFrame(loop);
  }

  startBtn?.addEventListener('click', () => startGame(0));
  restartBtn?.addEventListener('click', () => startGame(currentLevelIdx));
  nextBtn?.addEventListener('click', () => startGame(currentLevelIdx + 1));
  resetBtn?.addEventListener('click', () => startGame(0));
}

/* ============================================================
   INTERACTIVE QUIZ: MISTRZ ZMYSŁÓW SOWY
   ============================================================ */
function initOwlQuiz() {
  const quizBody = document.getElementById('owlQuizDynamicBody');
  const progressBar = document.getElementById('owlQuizMeterProgress');

  if (!quizBody || !progressBar) return;

  const questions = [
    {
      q: 'Dlaczego sowa potrafi obrócić głowę aż o 270 stopni w obu kierunkach?',
      options: [
        'Jej szyja nie ma kręgów i jest zbudowana z czystej chrząstki',
        'Jej oczy są cylindryczne i nieruchome w czaszce, a szyja ma aż 14 kręgów (2x więcej niż u człowieka)',
        'Sowa obraca całe ciało na gałęzi, a nie tylko głowę',
        'To złudzenie optyczne spowodowane puszystymi piórami'
      ],
      correct: 1,
      explanation: 'Oczy sowy to nie ruchome kule, lecz wydłużone tuby zablokowane w czaszce pierścieniami kostnymi. Aby spojrzeć w bok, sowa musi obrócić całą głowę — umożliwia to 14 kręgów szyjnych i specjalne unaczynienie zapobiegające odcięciu krwi do mózgu!'
    },
    {
      q: 'W jaki sposób sowa bezbłędnie określa, czy dźwięk dobiega z góry, czy z dołu?',
      options: [
        'Dzięki asymetrii uszu: prawe ucho jest wyżej i skierowane w dół, a lewe niżej i skierowane w górę',
        'Wysyła ultradźwiękowy pisk sonaru jak nietoperz',
        'Używa dzioba jako wskaźnika poziomu dźwięku',
        'Odbiera fale wyłącznie przez wibrujące pióra ogona'
      ],
      correct: 0,
      explanation: 'Asymetria puszki słuchowej sprawia, że dźwięk dobiegający z góry jest głośniejszy w lewym uchu, a dźwięk z dołu — w prawym uchu. Mózg porównuje różnicę głośności i czasu (z dokładnością do 30 mikrosekund!), uzyskując pełną mapę 3D!'
    },
    {
      q: 'Czym jest szlara twarzowa sowy i jaką pełni funkcję?',
      options: [
        'To ozdobny kołnierz służący do odstraszania drapieżników',
        'To wieniec sztywnych, ułożonych promieniście piór działający jak talerz satelitarny skupiający fale dźwiękowe',
        'To warstwa tłuszczu chroniąca twarz sowy przed mrozem',
        'To narząd węchu chemicznego do tropienia myszy'
      ],
      correct: 1,
      explanation: 'Szlara twarzowa ma paraboliczny profil. Zbiera fale akustyczne z otoczenia i kanalizuje je wprost do otworów usznych ukrytych pod piórami, wzmacniając ciche piski gryzoni nawet o 10 dB!'
    },
    {
      q: 'Co sprawia, że lot sowy jest niemal w 100% bezgłośny dla ucha gryzonia?',
      options: [
        'Sowa nie macha skrzydłami i tylko spada na ofiarę',
        'Aksamitny meszek pochłaniający dźwięk oraz grzebykowate ząbki (serracje) na krawędzi lotek rozbijające wiry powietrza',
        'Sowa porusza się tak wolno, że powietrze nie stawia oporu',
        'Pióra sowy są pokryte śluzem zmniejszającym tarcie'
      ],
      correct: 1,
      explanation: 'Na przedniej krawędzi skrzydeł sowy znajdują się mikroskopijne ząbki, które rozbijają duże wiry powietrza na mikro-strumienie. Miękkie frędzle na krawędzi spływu i welurowa powłoka tłumią resztę szumu, redukując dźwięk do niesłyszalnych 18 dB.'
    },
    {
      q: 'Znalazłeś w lesie młodego, opierzonego podlota sowy siedzącego na trawie pod drzewem. Co robisz?',
      options: [
        'Zabierasz go natychmiast do domu i karmisz surowym mięsem z kurczaka',
        'Zostawiasz go w spokoju (ewentualnie sadzasz na bezpiecznej, wyższej gałęzi) — rodzice są w pobliżu i karmią go w nocy',
        'Wzywasz straż pożarną do transportu na czubek drzewa',
        'Polewasz go wodą, by go ochłodzić'
      ],
      correct: 1,
      explanation: 'Podlot sowy celowo opuszcza ciasną dziuplę, zanim nauczy się w pełni latać. Ukrywa się w trawie lub gałęziach, a rodzice czuwają i przynoszą mu pokarm nocą. Zabranie go z lasu to błąd, który odbiera mu szansę na naturalne dorastanie!'
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
      <div id="owlQuizFeedback"></div>
      <div class="quiz-action-bar" id="owlQuizNextBar" style="display: none; margin-top: 20px;">
        <button class="btn btn-primary" id="owlQuizNextBtn" style="background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);">
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

    const feedbackEl = document.getElementById('owlQuizFeedback');
    const nextBar = document.getElementById('owlQuizNextBar');

    optButtons[qData.correct].classList.add('correct');

    if (selected === qData.correct) {
      score++;
      feedbackEl.className = 'quiz-feedback-banner success';
      feedbackEl.innerHTML = `<strong>Doskonale!</strong> ${qData.explanation}`;
    } else {
      optButtons[selected].classList.add('wrong');
      feedbackEl.className = 'quiz-feedback-banner failure';
      feedbackEl.innerHTML = `<strong>Niezupełnie.</strong> ${qData.explanation}`;
    }

    nextBar.style.display = 'flex';
    document.getElementById('owlQuizNextBtn').addEventListener('click', () => {
      currentIdx++;
      renderQuestion();
    });
  }

  function renderSummary() {
    progressBar.style.width = '100%';
    const percent = Math.round((score / questions.length) * 100);

    let rankTitle = 'Mistrz Akustyki Sowy 🦉';
    let badgeEmoji = '👑';
    let rankDesc = 'Perfekcyjnie! Rozumiesz trójwymiarową triangulację słuchu, funkcję szlary twarzowej i tajemnicę bezszelestnego lotu.';

    if (percent < 80 && percent >= 60) {
      rankTitle = 'Znawca Ptaków Nocnych 🌙';
      badgeEmoji = '🎖️';
      rankDesc = 'Bardzo dobry wynik! Wiesz, dlaczego sowa kręci głową o 270 stopni i jak chronić młode podloty.';
    } else if (percent < 60) {
      rankTitle = 'Adept Nocnej Obserwacji 📚';
      badgeEmoji = '🦉';
      rankDesc = 'Warto przejrzeć sekcję 3D audio i anatomii szlary raz jeszcze — świat zmysłów sowy kryje niezwykłe prawa fizyki!';
    }

    quizBody.innerHTML = `
      <div class="quiz-certificate">
        <div class="certificate-badge-emoji">${badgeEmoji}</div>
        <div class="certificate-score">${score} / ${questions.length}</div>
        <h3 class="certificate-title">${rankTitle}</h3>
        <p class="certificate-desc">${rankDesc}</p>
        <button class="btn btn-primary" id="owlQuizRestartBtn" style="background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);">Rozwiąż quiz ponownie ↺</button>
      </div>
    `;

    document.getElementById('owlQuizRestartBtn').addEventListener('click', () => {
      currentIdx = 0;
      score = 0;
      renderQuestion();
    });
  }

  renderQuestion();
}


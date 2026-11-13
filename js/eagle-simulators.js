/* ============================================================
   EAGLE (ORZEŁ PRZEDNI & BIELIK) — SENSORY SIMULATORS & 10-LEVEL GAME
   Author: Dorian Kalinowski for "Świat zmysłami zwierząt"
   Senses: Bifoveal vision (8x zoom), Ultraviolet vision (UV), 400 PSI talons
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initEagleVisionSimulator();
  initEagleThermalFlightSimulator();
  initEagleAnatomyInspector();
  initEagleCrisisSimulator();
  initEagleSkyPatrolGame();
  initEagleQuiz();
});

/* ============================================================
   1. BIFOVEAL 8X ZOOM & ULTRAVIOLET (UV) VISION SIMULATOR
   ============================================================ */
function initEagleVisionSimulator() {
  const zoomSlider = document.getElementById('eagleZoomSlider');
  const zoomDisplay = document.getElementById('eagleVisionDisplay');
  const landscape = document.getElementById('eagleLandscape');
  const preyTarget = document.getElementById('eaglePreyTarget');
  const preyLabel = document.getElementById('eaglePreyLabel');
  const uvBtn = document.getElementById('toggleEagleUvBtn');
  const uvGlowLayer = document.getElementById('eagleUvGlowLayer');
  const uvStatusText = document.getElementById('eagleUvStatusText');

  let isUvActive = false;

  function updateZoom(val) {
    const zoomVal = parseFloat(val);
    if (zoomDisplay) {
      if (zoomVal <= 1.5) {
        zoomDisplay.textContent = `Dołek boczny (Szeroki kąt): Zoom ${zoomVal.toFixed(1)}x • Widzenie peryferyjne`;
      } else if (zoomVal < 6) {
        zoomDisplay.textContent = `Dołek środkowy: Zoom ${zoomVal.toFixed(1)}x • Ostrość teleobiektywu`;
      } else {
        zoomDisplay.textContent = `Maksymalne zbliżenie: Zoom ${zoomVal.toFixed(1)}x • Widzi detale zająca z 2 km!`;
      }
    }

    if (landscape) {
      landscape.style.transform = `scale(${1 + (zoomVal - 1) * 0.18})`;
    }

    if (preyTarget) {
      preyTarget.style.transform = `scale(${0.8 + zoomVal * 0.35})`;
    }

    if (preyLabel) {
      const distance = Math.round(2500 / zoomVal);
      preyLabel.textContent = `Zając polny (odległość optyczna: ~${distance} m)`;
    }
  }

  zoomSlider?.addEventListener('input', (e) => {
    updateZoom(e.target.value);
  });

  uvBtn?.addEventListener('click', () => {
    isUvActive = !isUvActive;
    if (isUvActive) {
      uvBtn.classList.add('active');
      uvBtn.textContent = '🌈 Wyłącz filtr UV (Powrót do RGB)';
      if (uvGlowLayer) uvGlowLayer.style.opacity = '1';
      if (uvStatusText) {
        uvStatusText.textContent = 'Tryb: Spektrum UV (300-400 nm) — Wykryto ślady moczu gryzoni!';
        uvStatusText.style.color = '#C084FC';
      }
    } else {
      uvBtn.classList.remove('active');
      uvBtn.textContent = '🟣 Włącz filtr Ultrafioletu (UV) — Ślady moczu gryzoni';
      if (uvGlowLayer) uvGlowLayer.style.opacity = '0';
      if (uvStatusText) {
        uvStatusText.textContent = 'Tryb: Światło widzialne (RGB)';
        uvStatusText.style.color = 'var(--amber-light)';
      }
    }
  });

  updateZoom(zoomSlider?.value || 3);
}

/* ============================================================
   2. THERMAL SOARING & EAGLE SCREECH (Web Audio API)
   ============================================================ */
function initEagleThermalFlightSimulator() {
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

  const thermalSlider = document.getElementById('eagleThermalSlider');
  const thermalDisplay = document.getElementById('eagleThermalDisplay');
  const playGlideBtn = document.getElementById('playEagleGlideSoundBtn');
  const playCryBtn = document.getElementById('playEagleCryBtn');

  function updateThermalLabel() {
    if (!thermalSlider || !thermalDisplay) return;
    const alt = parseInt(thermalSlider.value);
    const updraft = (2.0 + (alt / 3000) * 5.5).toFixed(1);
    thermalDisplay.textContent = `Pułap: ${alt} m • Prąd wznoszący +${updraft} m/s (Szybowanie bez wysiłku)`;
  }

  thermalSlider?.addEventListener('input', updateThermalLabel);

  // Play thermal wind glide sound
  playGlideBtn?.addEventListener('click', () => {
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      const alt = parseInt(thermalSlider?.value || 1200);
      const bufferSize = ctx.sampleRate * 1.0;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.15;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350 + (alt / 3000) * 500, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch (e) {}
  });

  // Play majestic eagle screech
  playCryBtn?.addEventListener('click', () => {
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';

      // Piercing downwards glissando characteristic of eagles/sea eagles
      osc.frequency.setValueAtTime(2800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.35);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.7);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.7);
    } catch (e) {}
  });
}

/* ============================================================
   3. EAGLE ANATOMY & BIOMECHANICS INSPECTOR
   ============================================================ */
function initEagleAnatomyInspector() {
  const buttons = document.querySelectorAll('[data-eagle-anatomy]');
  const titleEl = document.getElementById('eagleAnatomyTitle');
  const descEl = document.getElementById('eagleAnatomyDesc');
  const statEl = document.getElementById('eagleAnatomyStat');

  if (!buttons.length || !titleEl) return;

  const data = {
    eyes: {
      title: 'Dwa Dołki Siatkówki i Widzenie w Ultrafiolecie (UV)',
      desc: 'W każdym oku orła znajdują się dwa dołki środkowe: boczny (szerokokątny) oraz centralny (teleobiektyw powiększający cel 8-krotnie). Dodatkowo orzeł posiada czwarty czopek reagujący na światło UV, dzięki czemu widzi fosforyzujące ścieżki moczu nornic w trawie.',
      stat: 'Gęstość fotoreceptorów: 1 000 000 / mm² (5x więcej niż u człowieka)'
    },
    beak: {
      title: 'Hakowaty Dziób z Ostrymi Krawędziami Tnącymi',
      desc: 'Masywny, zakrzywiony pod kątem ostrym dziób orła służy do rozrywania zdobyczy i łamania kości. Górna szczęka zachodzi na dolną jak nożyce do blachy, pozwalając na precyzyjne odcinanie kęsów mięsa.',
      stat: 'Siła cięcia dzioba: wystarczająca do przecięcia twardej skóry sarny'
    },
    wings: {
      title: 'Skrzydła Szczelinowe z Rozszczepionymi Lotkami',
      desc: 'Rozpiętość skrzydeł orła przedniego sięga 2,2 metra (u bielika nawet 2,4 m). Końce skrzydeł posiadają głębokie wcięcia między lotkami I rzędu. Każde skrajne pióro działa jak miniaturowe skrzydełko (winglet), eliminując wiry brzegowe i maksymalizując siłę nośną.',
      stat: 'Rozpiętość skrzydeł: 200 – 240 cm (profil szybowca)'
    },
    talons: {
      title: 'Potężne Szpony o Uścisku Ponad 400 PSI',
      desc: 'Szpony orła to jego główna broń. Tylny szpon osiąga długość 5–6 cm (dłuższy niż kły niedźwiedzia!). Dzięki mechanizmowi zapadkowemu ścięgien orzeł zaciska szpony z siłą ponad 400 funtów na cal kwadratowy, natychmiast miażdżąc czaszkę lub kręgosłup ofiary.',
      stat: 'Siła uścisku szponów: > 400 PSI (ponad 28 kg/cm²)'
    },
    tail: {
      title: 'Szeroki Wachlarz Ogonowy (Hamulec Aerodynamiczny)',
      desc: 'Krótki, klinowaty ogon złożony z mocnych sterówek pełni rolę steru wysokości i hamulca aerodynamicznego. Podczas gwałtownego nurkowania orzeł rozpościera ogon, by wyhamować z prędkości 250 km/h do zera w ułamku sekundy tuż nad ziemią.',
      stat: 'Prędkość nurkowania: do 320 km/h z precyzyjnym hamowaniem'
    }
  };

  function selectPart(key) {
    buttons.forEach(b => {
      if (b.getAttribute('data-eagle-anatomy') === key) {
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
      const key = btn.getAttribute('data-eagle-anatomy');
      selectPart(key);
    });
  });
}

/* ============================================================
   4. CRISIS SIMULATOR: OCHRONA STREFOWA GNIAZD (BEZPIECZEŃSTWO)
   ============================================================ */
function initEagleCrisisSimulator() {
  const cards = document.querySelectorAll('.eagle-crisis-card');
  const resultBox = document.getElementById('eagleCrisisResult');
  if (!cards.length || !resultBox) return;

  const responses = {
    approach_drone: {
      type: 'danger',
      title: '❌ ŚMIERTELNY BŁĄD I PRZESTĘPSTWO: Dron to śmiertelne zagrożenie!',
      text: 'Latanie dronem w pobliżu gniazda orła lub bielika to złamanie Ustawy o ochronie przyrody (strefa 500m) zagrożone grzywną i karą aresztu. Orzeł zaatakuje drona szponami — wirujące śmigła odcinają ptakom palce, a spłoszona samica porzuca wysiadywane jaja, skazując zarodki na zamarznięcie.'
    },
    climb_tree: {
      type: 'danger',
      title: '❌ KOSZMARNY BŁĄD: Płoszenie lęgu bielika!',
      text: 'Zaglądanie do gniazda to gwarancja porzucenia lęgu przez dorosłe ptaki. W marcu i kwietniu temperatura spada w nocy poniżej zera — wystarczy 20 minut nieobecności matki na jajach, by zarodki zginęły.'
    },
    quietly_withdraw: {
      type: 'success',
      title: '✅ JEDYNA PRAWIDŁOWA I WZOROWA POSTAWA:',
      text: '1. Jeśli przypadkowo natkniesz się na gniazdo orła lub bielika: zachowaj absolutną ciszę i natychmiast wycofaj się tą samą drogą poza promień 500 metrów.<br>2. Nie publikuj współrzędnych GPS gniazda w mediach społecznościowych!<br>3. Zgłoś lokalizację gniazda do <em>Komitetu Ochrony Orłów</em> (KOO) lub Regionalnej Dyrekcji Ochrony Środowiska (RDOŚ), aby leśnicy wyznaczyli oficjalną strefę ochronną wyłączoną z wycinki.'
    },
    camp_under: {
      type: 'danger',
      title: '❌ BŁĄD: Przebywanie w strefie lęgowej jest zakazane!',
      text: 'Rozbicie obozu, palenie ogniska i stała obecność ludzi w strefie 500m paraliżuje ptaki. Samiec nie dostarczy pokarmu do gniazda, a para zrezygnuje z lęgu na cały rok.'
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
   5. 10-LEVEL MINIGAME: PODNIEBNY PATROL ORŁA — WZROK Z CHMUR
   ============================================================ */
function initEagleSkyPatrolGame() {
  const canvas = document.getElementById('eagleGameCanvas');
  const overlay = document.getElementById('eagleGameOverlay');
  const startBtn = document.getElementById('startEagleGameBtn');
  const nextBtn = document.getElementById('nextEagleLevelBtn');
  const restartBtn = document.getElementById('restartEagleGameBtn');
  const resetBtn = document.getElementById('resetEagleCampaignBtn');
  const uvToggleBtn = document.getElementById('eagleUvToggleInGameBtn');

  const preyVal = document.getElementById('eagleGamePrey');
  const timerVal = document.getElementById('eagleGameTimer');
  const uvStatusVal = document.getElementById('eagleGameUvStatus');
  const levelBadge = document.getElementById('eagleGameLevelBadge');
  const levelDotsContainer = document.getElementById('eagleGameLevelDots');
  const overlayIcon = document.getElementById('eagleGameOverIcon');
  const overlayTitle = document.getElementById('eagleGameOverTitle');
  const overlayDesc = document.getElementById('eagleGameOverDesc');

  if (!canvas || !overlay || !startBtn) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.clientWidth || 500);
  let height = (canvas.height = canvas.clientHeight || 340);

  window.addEventListener('resize', () => {
    if (!canvas) return;
    width = canvas.width = canvas.clientWidth || 500;
    height = canvas.height = canvas.clientHeight || 340;
  });

  // 10 Progressive Patrol Missions
  const levels = [
    {
      name: 'Poranny Patrol nad Jeziorem Śniardwy 🐟🦅',
      desc: 'Bielik szybuje nad mazurskim jeziorem. Namierz pływające przy powierzchni leszcze i szczupaki. Kliknij/dotknij, by zanurkować!',
      time: 40,
      targetPrey: 3,
      requiresUv: false,
      preySpeed: 0.8
    },
    {
      name: 'Tatrzańskie Turnie i Świstaki 🏔️',
      desc: 'Orzeł przedni w Dolinie Pięciu Stawów. Wypatruj czujnych świstaków na głazach przed ich schowaniem w norze.',
      time: 38,
      targetPrey: 4,
      requiresUv: false,
      preySpeed: 1.0
    },
    {
      name: 'Ścierniska Mazowsza i Trop UV Nornic 🌾🟣',
      desc: 'Nornice chowają się w ściernisku! Przełącz filtr UV (klawisz U lub przycisk), by zobaczyć świecące ślady moczu gryzoni.',
      time: 36,
      targetPrey: 4,
      requiresUv: true,
      preySpeed: 1.1
    },
    {
      name: 'Bieszczadzkie Połoniny w Prądach Termicznych 💨',
      desc: 'Porywisty wiatr na grzbiecie Wetliny. Szybuj na termice i wypatruj zwinnych gryzoni w wysokich trawach.',
      time: 35,
      targetPrey: 5,
      requiresUv: false,
      preySpeed: 1.2
    },
    {
      name: 'Skalisty Wąwóz Pienin i Zając Szarak 🐇',
      desc: 'Szybkie zające polne kluczą między skałami. Wymaga maksymalnego zoomu i błyskawicznego ataku nurkowego.',
      time: 35,
      targetPrey: 5,
      requiresUv: false,
      preySpeed: 1.4
    },
    {
      name: 'Rozlewiska Biebrzy i Nurkujący Szczupak 🌊',
      desc: 'Bagna i meandry Biebrzy. Zmienna tafla wody — poluj na ryby w oknach czystej wody.',
      time: 32,
      targetPrey: 6,
      requiresUv: false,
      preySpeed: 1.4
    },
    {
      name: 'Mgliste Szczyty Karkonoszy 🌫️🟣',
      desc: 'Poranna mgła ogranicza zwykły wzrok. Filtr ultrafioletowy ujawnia ukryte ścieżki fauny w borówkach!',
      time: 32,
      targetPrey: 6,
      requiresUv: true,
      preySpeed: 1.5
    },
    {
      name: 'Wielki Step i Dwa Dołki Siatkówki ☀️',
      desc: 'Otwarta przestrzeń pod palącym słońcem. Przełączaj między widzeniem szerokim a teleobiektywem centralnym.',
      time: 30,
      targetPrey: 7,
      requiresUv: false,
      preySpeed: 1.6
    },
    {
      name: 'Zimowy Zalew Szczeciński i Łowy na Lodzie ❄️',
      desc: 'Kra lodowa i niska temperatura. Wypatruj ryb w szczelinach lodu i ptaków wodnych.',
      time: 30,
      targetPrey: 7,
      requiresUv: false,
      preySpeed: 1.7
    },
    {
      name: 'Władca Polskiego Nieba — Mistrz Polowania 👑🦅',
      desc: 'Finałowy lot! 8 celów na zróżnicowanym terenie. Połącz filtr UV, zoom 8x i uderz ze szponami!',
      time: 28,
      targetPrey: 8,
      requiresUv: true,
      preySpeed: 1.8
    }
  ];

  let currentLevelIdx = 0;
  let isPlaying = false;
  let timeLeft = 40;
  let timerInterval = null;
  let animId = null;
  let caughtCount = 0;
  let isUvMode = false;

  // Crosshair / Sight
  let sightX = 250;
  let sightY = 170;

  // Preys
  let preys = [];

  function spawnLevelEntities() {
    const lvl = levels[currentLevelIdx];
    preys = [];

    const preyTypes = [
      { emoji: '🐟', name: 'Ryba', uvOnly: false },
      { emoji: '🐇', name: 'Zając', uvOnly: false },
      { emoji: '🐭', name: 'Nornica', uvOnly: true },
      { emoji: '🐿️', name: 'Świstak', uvOnly: false }
    ];

    for (let i = 0; i < lvl.targetPrey; i++) {
      const type = lvl.requiresUv && (i % 2 === 1) ? preyTypes[2] : preyTypes[i % preyTypes.length];
      preys.push({
        x: 60 + Math.random() * (width - 120),
        y: 60 + Math.random() * (height - 120),
        vx: (Math.random() - 0.5) * lvl.preySpeed * 1.8,
        vy: (Math.random() - 0.5) * lvl.preySpeed * 1.8,
        radius: 18,
        emoji: type.emoji,
        uvOnly: type.uvOnly,
        caught: false
      });
    }
  }

  function updateHUD() {
    const isEn = window.swiat_zmyslow_lang === 'en' || (typeof localStorage !== 'undefined' && localStorage.getItem('swiat_zmyslow_lang') === 'en');
    const lvl = levels[currentLevelIdx];
    const lvlName = window.t ? window.t(lvl.name) : lvl.name;
    if (levelBadge) {
      levelBadge.innerHTML = `<span>${isEn ? 'Mission' : 'Misja'} ${currentLevelIdx + 1}/${levels.length}:</span> ${lvlName}`;
    }
    if (levelDotsContainer) {
      if (levelDotsContainer.children.length !== levels.length) {
        levelDotsContainer.innerHTML = levels.map((_, i) => `<span class="level-dot" title="${isEn ? 'Level' : 'Poziom'} ${i + 1}"></span>`).join('');
      }
      const dots = levelDotsContainer.querySelectorAll('.level-dot');
      dots.forEach((dot, idx) => {
        dot.className = 'level-dot';
        if (idx < currentLevelIdx) dot.classList.add('completed');
        else if (idx === currentLevelIdx) dot.classList.add('active');
      });
    }
    if (preyVal) preyVal.textContent = `${caughtCount} / ${lvl.targetPrey}`;
    if (timerVal) timerVal.textContent = `${timeLeft}s`;
    if (uvStatusVal) {
      if (isUvMode) {
        uvStatusVal.textContent = window.t ? window.t('Ultrafiolet UV 🟣 (Ślady widoczne)') : 'Ultrafiolet UV 🟣 (Ślady widoczne)';
        uvStatusVal.style.color = '#C084FC';
      } else {
        uvStatusVal.textContent = window.t ? window.t('RGB (Światło widzialne)') : 'RGB (Światło widzialne)';
        uvStatusVal.style.color = 'var(--amber-light)';
      }
    }
  }

  function handlePointer(e) {
    if (!isPlaying) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    sightX = Math.max(20, Math.min(width - 20, clientX - rect.left));
    sightY = Math.max(20, Math.min(height - 20, clientY - rect.top));
  }

  canvas.addEventListener('mousemove', handlePointer);
  canvas.addEventListener('touchstart', (e) => { e.preventDefault(); handlePointer(e); }, { passive: false });
  canvas.addEventListener('touchmove', (e) => { e.preventDefault(); handlePointer(e); }, { passive: false });

  // Strike on click/tap
  canvas.addEventListener('click', () => {
    if (!isPlaying) return;
    performDiveStrike();
  });

  function performDiveStrike() {
    const lvl = levels[currentLevelIdx];
    preys.forEach(p => {
      if (p.caught) return;
      // If prey is uvOnly and UV is off, cannot catch!
      if (p.uvOnly && !isUvMode) return;

      const dist = Math.hypot(sightX - p.x, sightY - p.y);
      if (dist < 28) {
        p.caught = true;
        caughtCount++;
        updateHUD();

        if (caughtCount >= lvl.targetPrey) {
          endGame(true, `🎉 Sukces! Ukończono Misję ${currentLevelIdx + 1}!`, `Orzeł namierzył i pochwycił wszystkie ${lvl.targetPrey} cele z zawrotną precyzją.`);
        }
      }
    });
  }

  // Toggle UV mode with 'U' key
  window.addEventListener('keydown', (e) => {
    if ((e.key === 'u' || e.key === 'U') && isPlaying) {
      isUvMode = !isUvMode;
      updateHUD();
    }
  });

  // Toggle UV mode with mobile button
  uvToggleBtn?.addEventListener('click', () => {
    if (!isPlaying) return;
    isUvMode = !isUvMode;
    updateHUD();
  });

  function startGame(lvlIdx = 0) {
    currentLevelIdx = lvlIdx;
    const lvl = levels[currentLevelIdx];
    isPlaying = true;
    timeLeft = lvl.time;
    caughtCount = 0;
    isUvMode = false;
    sightX = width / 2;
    sightY = height / 2;

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
        endGame(false, '⏱️ Czas patrolu minął!', 'Prąd wznoszący osłabł i orzeł musiał wrócić na skałę. Spróbuj ponownie namierzyć zwierzynę!');
      }
    }, 1000);

    if (animId) cancelAnimationFrame(animId);
    gameLoop();
  }

  function endGame(won, title, desc) {
    isPlaying = false;
    if (timerInterval) clearInterval(timerInterval);
    if (animId) cancelAnimationFrame(animId);

    overlay.classList.remove('hidden');
    overlay.classList.add('show');
    overlay.style.display = 'flex';

    if (overlayTitle) overlayTitle.textContent = window.t ? window.t(title) : title;
    if (overlayDesc) overlayDesc.textContent = window.t ? window.t(desc) : desc;

    if (won) {
      if (overlayIcon) overlayIcon.textContent = '🎉🦅👑';
      startBtn.style.display = 'none';
      restartBtn.style.display = 'none';

      if (currentLevelIdx < levels.length - 1) {
        nextBtn.style.display = 'inline-block';
        resetBtn.style.display = 'none';
      } else {
        nextBtn.style.display = 'none';
        resetBtn.style.display = 'inline-block';
        if (overlayTitle) overlayTitle.textContent = window.t ? window.t('🏆 WŁADCA POLSKIEGO NIEBA!') : '🏆 WŁADCA POLSKIEGO NIEBA!';
        if (overlayDesc) overlayDesc.textContent = window.t ? window.t('Opanowałeś wszystkie 10 podniebnych patroli! Poznałeś potęgę dwóch dołków siatkówki i widzenia w ultrafiolecie.') : 'Opanowałeś wszystkie 10 podniebnych patroli! Poznałeś potęgę dwóch dołków siatkówki i widzenia w ultrafiolecie.';
      }
    } else {
      if (overlayIcon) overlayIcon.textContent = '⚠️🦅💔';
      startBtn.style.display = 'none';
      nextBtn.style.display = 'none';
      restartBtn.style.display = 'inline-block';
      resetBtn.style.display = 'none';
    }
  }

  function gameLoop() {
    if (!isPlaying) return;

    // Update prey movement
    preys.forEach(p => {
      if (p.caught) return;
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 30 || p.x > width - 30) p.vx *= -1;
      if (p.y < 30 || p.y > height - 30) p.vy *= -1;
    });

    renderCanvas();
    animId = requestAnimationFrame(gameLoop);
  }

  function renderCanvas() {
    ctx.clearRect(0, 0, width, height);

    // Background Aerial View Landscape
    if (isUvMode) {
      // UV Mode: dark violet/indigo world with glowing trails
      ctx.fillStyle = '#110924';
      ctx.fillRect(0, 0, width, height);

      // Glowing UV Trails on ground
      ctx.strokeStyle = '#A855F7';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(40, height * 0.3);
      ctx.bezierCurveTo(width * 0.4, height * 0.2, width * 0.6, height * 0.8, width - 40, height * 0.7);
      ctx.stroke();

      ctx.strokeStyle = '#C084FC';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else {
      // Normal RGB Mode: green meadows and blue lake
      ctx.fillStyle = '#06131F';
      ctx.fillRect(0, 0, width, height);

      // Lake patch
      ctx.fillStyle = '#0E3A5A';
      ctx.beginPath();
      ctx.ellipse(width * 0.3, height * 0.5, width * 0.25, height * 0.3, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Forest green patch
      ctx.fillStyle = '#064E3B';
      ctx.beginPath();
      ctx.ellipse(width * 0.75, height * 0.6, width * 0.2, height * 0.25, -0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Render Prey
    preys.forEach(p => {
      if (p.caught) return;

      if (p.uvOnly && !isUvMode) {
        // Hidden under normal light! Only subtle invisible blur
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Visible prey
        if (p.uvOnly && isUvMode) {
          // Fluorescent glow in UV
          ctx.shadowColor = '#C084FC';
          ctx.shadowBlur = 12;
        }

        ctx.font = '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.emoji, p.x, p.y);
        ctx.shadowBlur = 0;
      }
    });

    // Render Eagle High Altitude Sight (Telephoto Crosshair)
    ctx.save();
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sightX, sightY, 30, 0, Math.PI * 2);
    ctx.stroke();

    // Crosshair Lines
    ctx.beginPath();
    ctx.moveTo(sightX - 40, sightY);
    ctx.lineTo(sightX - 10, sightY);
    ctx.moveTo(sightX + 10, sightY);
    ctx.lineTo(sightX + 40, sightY);
    ctx.moveTo(sightX, sightY - 40);
    ctx.lineTo(sightX, sightY - 10);
    ctx.moveTo(sightX, sightY + 10);
    ctx.lineTo(sightX, sightY + 40);
    ctx.stroke();

    // Eagle Wings Silhouette in Sight
    ctx.fillStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🦅', sightX, sightY);
    ctx.restore();
  }

  // Button hooks
  startBtn.addEventListener('click', () => startGame(0));
  nextBtn.addEventListener('click', () => startGame(currentLevelIdx + 1));
  restartBtn.addEventListener('click', () => startGame(currentLevelIdx));
  resetBtn.addEventListener('click', () => startGame(0));

  window.addEventListener('languageChanged', () => {
    updateHUD();
  });
}

/* ============================================================
   6. 5-QUESTION EDUCATIONAL QUIZ
   ============================================================ */
function initEagleQuiz() {
  const quizBody = document.getElementById('eagleQuizDynamicBody');
  const progressBar = document.getElementById('eagleQuizMeterProgress');
  if (!quizBody || !progressBar) return;

  const questions = [
    {
      q: 'Ile dołków środkowych (fovea centralis) posiada orzeł w każdym oku i jaką pełnią funkcję?',
      options: [
        'Tylko jeden dołek, tak jak człowiek',
        'Dwa dołki: boczny o szerokim kącie i centralny działający jak teleobiektyw powiększający cel 8-krotnie',
        'Trzy dołki: do widzenia w nocy, w dzień i pod wodą',
        'Nie ma dołków siatkówki'
      ],
      correct: 1,
      explanation: 'Zjawisko widzenia dwudołkowego (bifoveal vision) pozwala orłowi jednocześnie kontrolować całe otoczenie i przyglądać się celowi z 8-krotnym powiększeniem bez obracania głowy.'
    },
    {
      q: 'W jaki sposób widzenie w ultrafiolecie (UV) ułatwia orłom polowanie na nornice?',
      options: [
        'Mocz nornic świeci w ultrafiolecie, ujawniając ich podziemne autostrady w trawie',
        'Ultrafiolet prześwietla ziemię jak promienie Rentgena',
        'Ciała gryzoni w nocy emitują ciepło UV',
        'Ultrafiolet pozwala widzieć przez korony drzew'
      ],
      correct: 0,
      explanation: 'Mocz i kał małych gryzoni silnie pochłaniają i fluoryzują w paśmie bliskiego ultrafioletu (UV). Z wysokości setek metrów orzeł widzi na łące świecące fioletowe ścieżki prowadzące prosto do nory!'
    },
    {
      q: 'Jaki promień strefy ochronnej wokół gniazda orła przedniego i bielika obowiązuje w okresie lęgowym w Polsce?',
      options: [
        '50 metrów',
        '500 metrów (od 1 stycznia do 31 lipca)',
        '2 kilometry',
        'Brak stref — ptaki chronione są tylko w parkach narodowych'
      ],
      correct: 1,
      explanation: 'W Polsce obowiązuje ścisła ochrona strefowa: całoroczna strefa 200 m oraz strefa okresowa 500 m w czasie lęgów. Wstęp, hałasowanie czy wycinka w tej strefie to przestępstwo.'
    },
    {
      q: 'Dlaczego bielik w polskim herbie z biologicznego punktu widzenia nie jest prawdziwym orłem?',
      options: [
        'Jest sokołem wędrownym',
        'Należy do orłanów (rodzaj Haliaeetus) — ptaków związanych ze środowiskiem wodnym i rybożernych z nieopierzonymi skokami',
        'Jest podgatunkiem jastrzębia gołębiarza',
        'Bielik to sztuczny ptak legendarny, który nie występuje w naturze'
      ],
      correct: 1,
      explanation: 'Bielik (Haliaeetus albicilla) to orłan rybożerny. Prawdziwe orły (rodzaj Aquila, np. orzeł przedni) mają skoki nóg opierzone aż po same palce i polują głównie na ssaki lądowe.'
    },
    {
      q: 'Co jest jedną z głównych przyczyn zatruć i śmierci dorosłych bielików w Polsce?',
      options: [
        'Zatrucie solą drogową zimą',
        'Ołowica wywołana zjadaniem resztek postrzelonych zwierząt z ołowianą amunicją myśliwską',
        'Ukąszenia kleszczy',
        'Alergia na rybie ości'
      ],
      correct: 1,
      explanation: 'Bieliki chętnie żywią się padliną. Zjedzenie wnętrzności zwierzęcia postrzelonego ołowianym śrutem prowadzi do zatrucia ołowiem (ołowicy), paraliżu żołądka i śmierci ptaka w męczarniach.'
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
      <div id="eagleQuizFeedback"></div>
      <div class="quiz-action-bar" id="eagleQuizNextBar" style="display: none; margin-top: 20px;">
        <button class="btn btn-primary" id="eagleQuizNextBtn" style="background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);">
          ${currentIdx < questions.length - 1 ? (window.t ? window.t('Następne pytanie →') : 'Następne pytanie →') : (window.t ? window.t('Zobacz certyfikat wiedzy →') : 'Zobacz certyfikat wiedzy →')}
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

    const feedbackEl = document.getElementById('eagleQuizFeedback');
    const nextBar = document.getElementById('eagleQuizNextBar');

    optButtons[qData.correct].classList.add('correct');

    const expl = window.t ? window.t(qData.explanation) : qData.explanation;
    const isEn = window.swiat_zmyslow_lang === 'en' || (typeof localStorage !== 'undefined' && localStorage.getItem('swiat_zmyslow_lang') === 'en');
    if (selected === qData.correct) {
      score++;
      feedbackEl.className = 'quiz-feedback-banner success';
      feedbackEl.innerHTML = isEn ? `<strong>Excellent!</strong> ${expl}` : `<strong>Doskonale!</strong> ${expl}`;
    } else {
      optButtons[selected].classList.add('wrong');
      feedbackEl.className = 'quiz-feedback-banner failure';
      feedbackEl.innerHTML = isEn ? `<strong>Not quite.</strong> ${expl}` : `<strong>Niezupełnie.</strong> ${expl}`;
    }

    nextBar.style.display = 'flex';
    document.getElementById('eagleQuizNextBtn').addEventListener('click', () => {
      currentIdx++;
      renderQuestion();
    });
  }

  function renderSummary() {
    progressBar.style.width = '100%';
    const percent = Math.round((score / questions.length) * 100);

    let rankTitle = 'Mistrz Podniebnego Wzroku 🦅';
    let badgeEmoji = '👑';
    let rankDesc = 'Perfekcyjnie! Rozumiesz fizykę dwóch dołków siatkówki, widzenie w ultrafiolecie i zasady ochrony strefowej 500 metrów.';

    if (percent < 80 && percent >= 60) {
      rankTitle = 'Znawca Ptaków Drapieżnych 🪶';
      badgeEmoji = '🎖️';
      rankDesc = 'Bardzo dobry wynik! Wiesz, dlaczego bielik to orłan i jak groźny dla drapieżników jest ołów z amunicji.';
    } else if (percent < 60) {
      rankTitle = 'Adept Obserwacji Nieba 📚';
      badgeEmoji = '🦅';
      rankDesc = 'Warto przejrzeć sekcję zoomu i anatomii szponów raz jeszcze — wzrok orła to absolutny majstersztywk ewolucji!';
    }

    quizBody.innerHTML = `
      <div class="quiz-certificate">
        <div class="certificate-badge-emoji">${badgeEmoji}</div>
        <div class="certificate-score">${score} / ${questions.length}</div>
        <h3 class="certificate-title">${window.t ? window.t(rankTitle) : rankTitle}</h3>
        <p class="certificate-desc">${window.t ? window.t(rankDesc) : rankDesc}</p>
        <button class="btn btn-primary" id="eagleQuizRestartBtn" style="background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);">Rozwiąż quiz ponownie ↺</button>
      </div>
    `;

    document.getElementById('eagleQuizRestartBtn').addEventListener('click', () => {
      currentIdx = 0;
      score = 0;
      renderQuestion();
    });
  }

  renderQuestion();
}

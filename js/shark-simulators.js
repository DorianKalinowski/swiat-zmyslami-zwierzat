/* ============================================================
   SHARK (REKIN / ŻARŁACZ) — SENSORY SIMULATORS & 10-LEVEL GAME
   Author: Dorian Kalinowski for "Świat zmysłami zwierząt"
   Senses: Ampullae of Lorenzini (electroreception), Lateral line, Dermal denticles
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initSharkElectricSimulator();
  initSharkAcousticSimulator();
  initSharkAnatomyInspector();
  initSharkCrisisSimulator();
  initSharkPatrolGame();
  initSharkQuiz();
});

/* ============================================================
   1. AMPULLAE OF LORENZINI (ELECTRORECEPTION) SIMULATOR
   ============================================================ */
function initSharkElectricSimulator() {
  const slider = document.getElementById('sharkVoltageSlider');
  const display = document.getElementById('sharkVoltageDisplay');
  const toggleBtn = document.getElementById('toggleSharkElectricBtn');
  const statusText = document.getElementById('sharkSensorStatusText');
  const aura = document.getElementById('sharkElectricAura');
  const preyIcon = document.getElementById('sharkPreyIcon');
  const preyLabel = document.getElementById('sharkPreyLabel');

  let electricMode = false;

  function updateSense() {
    const val = slider ? parseInt(slider.value) : 5;
    if (display) {
      const range = (2.2 - (val / 50) * 1.5).toFixed(1);
      display.textContent = `Napięcie: ${val} nV/cm • Zasięg wykrywania serca: ${range} m`;
    }

    if (electricMode) {
      if (aura) aura.style.opacity = '1';
      if (preyIcon) {
        preyIcon.style.opacity = '1';
        preyIcon.style.filter = 'drop-shadow(0 0 12px #22D3EE)';
        preyIcon.style.transform = 'scale(1.2)';
      }
      if (preyLabel) {
        preyLabel.innerHTML = `<span style="color: #22D3EE; font-weight: 700;">⚡ Ampułki Lorenziniego:</span> Wykryto biopole flądry zakopanej w piasku (${val} nV)!`;
      }
      if (statusText) {
        statusText.textContent = `Zmysł: Elektrorecepcja aktywna (${val} nV/cm)`;
        statusText.style.color = 'var(--cyan-light)';
      }
      if (toggleBtn) {
        toggleBtn.textContent = '👁️ Przełącz na zwykły wzrok podwodny (Ofiara zniknie w piasku)';
        toggleBtn.style.background = 'rgba(6, 182, 212, 0.2)';
      }
    } else {
      if (aura) aura.style.opacity = '0';
      if (preyIcon) {
        preyIcon.style.opacity = '0.15';
        preyIcon.style.filter = 'none';
        preyIcon.style.transform = 'scale(1)';
      }
      if (preyLabel) {
        preyLabel.textContent = 'Wzrok: Niewidoczna flądra pod 20 cm piasku';
      }
      if (statusText) {
        statusText.textContent = 'Zmysł: Zwykły wzrok podwodny';
        statusText.style.color = 'var(--text-muted)';
      }
      if (toggleBtn) {
        toggleBtn.textContent = '⚡ Włącz szósty zmysł: Ampułki Lorenziniego (Pole elektryczne)';
        toggleBtn.style.background = 'transparent';
      }
    }
  }

  slider?.addEventListener('input', updateSense);

  toggleBtn?.addEventListener('click', () => {
    electricMode = !electricMode;
    updateSense();
  });
}

/* ============================================================
   2. ACOUSTIC & LATERAL LINE SIMULATOR (Web Audio API)
   ============================================================ */
function initSharkAcousticSimulator() {
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

  const fishPulseBtn = document.getElementById('playInjuredFishPulseBtn');
  const whooshBtn = document.getElementById('playHydrodynamicWhooshBtn');

  // Infrasound / low pulsation of struggling fish (25 Hz thump + harmonics)
  fishPulseBtn?.addEventListener('click', () => {
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(35 - i * 3, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(15, ctx.currentTime + 0.12);

          gain.gain.setValueAtTime(0.4, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.12);
        }, i * 160);
      }
    } catch (e) {}
  });

  // Silent hydrodynamic flow of dermal denticles (smooth filtered swoosh)
  whooshBtn?.addEventListener('click', () => {
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      const bufferSize = ctx.sampleRate * 1.2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 1.1);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + 1.2);
    } catch (e) {}
  });
}

/* ============================================================
   3. SHARK ANATOMY & BIOMECHANICS INSPECTOR
   ============================================================ */
function initSharkAnatomyInspector() {
  const buttons = document.querySelectorAll('[data-shark-anatomy]');
  const titleEl = document.getElementById('sharkAnatomyTitle');
  const descEl = document.getElementById('sharkAnatomyDesc');
  const statEl = document.getElementById('sharkAnatomyStat');

  if (!buttons.length || !titleEl) return;

  const data = {
    ampullae: {
      title: 'Ampułki Lorenziniego — Elektrorecepcja Nanowoltów',
      desc: 'Tysiące mikroskopijnych porów na pysku rekina prowadzi do kanalików wypełnionych żelowym przewodnikiem. Wykrywają one pole elektryczne rzędu 5 nanowoltów na centymetr — pozwala to rekinowi zlokalizować bicie serca ryby całkowicie zagrzebanej w morskim mule!',
      stat: 'Czułość: 5 nV/cm (wykrywa baterię AA z odległości 1600 km w teorii)'
    },
    nostrils: {
      title: 'Podwójne Nozdrza — Kierunkowy Stereowęch',
      desc: 'Nozdrza rekina służą wyłącznie do węchu (nie do oddychania). Woda przepływa przez fałdy węchowe o powierzchni równej wielkości kory mózgowej. Rekin potrafi wyczuć jedną kroplę aminokwasów krwi rozcieńczoną w 100 milionach litrów wody (duży basen olimpijski) oraz określić kierunek dzięki mikrosekundowej różnicy dotarcia zapachu do lewego i prawego nozdrza.',
      stat: 'Rozcieńczenie: 1 cząsteczka na 100 000 000 cząsteczek wody morskiej'
    },
    teeth: {
      title: 'Wielorzędowe Zęby — Taśma Produkcyjna Natury',
      desc: 'Zęby rekina nie są osadzone w kości, lecz wyrastają z ruchomej tkanki dziąsłowej. W szczęce znajduje się od 5 do 15 rzędów zębów działających jak schody ruchome. Gdy przedni ząb wyłamie się podczas polowania, kolejny natychmiast przesuwa się w jego miejsce w zaledwie 24–48 godzin.',
      stat: 'Liczba zębów: od 20 000 do 35 000 wymienionych w trakcie życia'
    },
    lateral_line: {
      title: 'Linia Boczna — Podwodny Radar Drgań i Ciśnienia',
      desc: 'Ciągnący się wzdłuż obu boków ciała kanał wypełniony rzęsatymi neuromastami. Wyczuwa najdelikatniejsze fale ciśnienia, wiry prądów morskich i drgania miotającej się rannej ryby z odległości ponad 250 metrów, działając jak zdalny zmysł dotyku.',
      stat: 'Częstotliwość odbioru: 10 Hz – 100 Hz (infradźwiękowe fale hydrodynamiczne)'
    },
    skin: {
      title: 'Ząbki Skórne (Denticles) i Asymetryczna Płetwa',
      desc: 'Skóra rekina pokryta jest milionami miniaturowych ząbków ze szkliwa. Układają się w rowki tłumiące turbulencje wody, co pozwala na bezszelestny pływ z zerowym oporem. Płetwa ogonowa o dłuższym płacie górnym (heterocerkiczna) wytwarza potężną siłę ciągu skierowaną do przodu i w dół.',
      stat: 'Redukcja oporu hydrodynamicznego: do 10% względem gładkiego kadłuba'
    }
  };

  function selectPart(key) {
    buttons.forEach(b => {
      if (b.getAttribute('data-shark-anatomy') === key) {
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
      const key = btn.getAttribute('data-shark-anatomy');
      selectPart(key);
    });
  });
}

/* ============================================================
   4. CRISIS SIMULATOR: SPOTKANIE Z REKINEM W OCEANIE
   ============================================================ */
function initSharkCrisisSimulator() {
  const cards = document.querySelectorAll('.shark-crisis-card');
  const resultBox = document.getElementById('sharkCrisisResult');
  if (!cards.length || !resultBox) return;

  const responses = {
    panic_splash: {
      type: 'danger',
      title: '❌ ŚMIERTELNY BŁĄD: Paniczne chlapanie i ucieczka sprintem!',
      text: 'Chlapanie na powierzchni wody emituje wibracje identyczne z umierającą, szamoczącą się rybą. Dla rekina to bezwarunkowy sygnał do ataku na łatwy cel. Ucieczka wyzwala w nim instynkt drapieżcy goniącego ofiarę!'
    },
    maintain_eye: {
      type: 'success',
      title: '✅ WZOROWY PROTOKÓŁ BEZPIECZEŃSTWA (Zasada Nurków):',
      text: '1. <strong>Utrzymuj kontakt wzrokowy:</strong> Obracaj się razem z rekinem, dając mu do zrozumienia, że go widzisz. Rekin to łowca zasadzek — widząc Twoją czujność, traci impet.<br>2. <strong>Przyjmij postawę pionową:</strong> Ludzka sylwetka pionowa nie przypomina leżącej foki.<br>3. <strong>Płyń spokojnie:</strong> Bez gwałtownych ruchów wycofuj się w stronę łodzi lub rafy.'
    },
    touch_nose: {
      type: 'danger',
      title: '❌ SKRAJNE RYZYKO: Próba głaskania rekina po zębach!',
      text: 'Choć pysk rekina posiada czułe ampułki i dotknięcie może go zdezorientować (toniczna immobilizacja), amator nie powinien wyciągać rąk w stronę szczęk 2-metrowego drapieżnika. Jedno kłapnięcie może odciąć dłoń!'
    },
    play_dead: {
      type: 'danger',
      title: '❌ BŁĄD: Udawanie martwego na dnie!',
      text: 'Wielu drapieżników morskich (szczególnie żarłacze tygrysie) to padlinożercy. Bezwładnie opadające ciało na dno zostanie zbadane próbnym ugryzieniem, które dla człowieka jest śmiertelne.'
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
   5. 10-LEVEL MINIGAME: PATROL RAFI KORALOWEJ — ZMYSŁ ELEKTRYCZNY
   ============================================================ */
function initSharkPatrolGame() {
  const canvas = document.getElementById('sharkGameCanvas');
  const overlay = document.getElementById('sharkGameOverlay');
  const startBtn = document.getElementById('startSharkGameBtn');
  const nextBtn = document.getElementById('nextSharkLevelBtn');
  const restartBtn = document.getElementById('restartSharkGameBtn');
  const resetBtn = document.getElementById('resetSharkCampaignBtn');
  const sensorBtn = document.getElementById('sharkSensorToggleInGameBtn');

  const preyVal = document.getElementById('sharkGamePrey');
  const timerVal = document.getElementById('sharkGameTimer');
  const sensorStatusVal = document.getElementById('sharkGameSensorStatus');
  const levelBadge = document.getElementById('sharkGameLevelBadge');
  const levelDotsContainer = document.getElementById('sharkGameLevelDots');
  const overlayIcon = document.getElementById('sharkGameOverIcon');
  const overlayTitle = document.getElementById('sharkGameOverTitle');
  const overlayDesc = document.getElementById('sharkGameOverDesc');

  if (!canvas || !overlay || !startBtn) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.clientWidth || 500);
  let height = (canvas.height = canvas.clientHeight || 340);

  window.addEventListener('resize', () => {
    if (!canvas) return;
    width = canvas.width = canvas.clientWidth || 500;
    height = canvas.height = canvas.clientHeight || 340;
  });

  // 10 Progressive Underwater Levels
  const levels = [
    {
      name: 'Piaszczysta Mielizna i Ukryte Flądry 🐟🦈',
      desc: 'Włącz ampułki Lorenziniego (klawisz E lub przycisk), by zobaczyć bicie serca 3 fląder ukrytych pod piaskiem.',
      time: 40,
      targetPrey: 3,
      hazards: 0,
      preySpeed: 0.5
    },
    {
      name: 'Płytka Rafa Koralowa i Płaszczki ⚡',
      desc: 'Płaszczki zakopują się w piasku wokół koralowców. Wytrop 4 ofiary za pomocą elektrorecepcji.',
      time: 38,
      targetPrey: 4,
      hazards: 1,
      preySpeed: 0.7
    },
    {
      name: 'Podmorski Kanion i Prądy Znoszące 🌊',
      desc: 'Silny prąd unosi muł. Wzrok nic nie daje — polegaj tylko na wykrywaniu nanowoltów!',
      time: 36,
      targetPrey: 4,
      hazards: 1,
      preySpeed: 0.9
    },
    {
      name: 'Wrak Statku Pirackiego i Zagubione Haki ⚓',
      desc: 'Omijaj zardzewiałe kotwice i liny rybackie. Namierz 5 ryb ukrytych w ładowni.',
      time: 35,
      targetPrey: 5,
      hazards: 2,
      preySpeed: 1.0
    },
    {
      name: 'Mroczny Szelf Kontynentalny 🌙',
      desc: 'Głęboka woda pochłania światło słoneczne. Złap 5 ofiar w mroku oceanu.',
      time: 35,
      targetPrey: 5,
      hazards: 2,
      preySpeed: 1.2
    },
    {
      name: 'Pole Podwodnych Wulkanów i Termoklina 🌋',
      desc: 'Gorące źródła zaburzają pole magnetyczne. Wytrop 6 szybkich ryb dennych.',
      time: 32,
      targetPrey: 6,
      hazards: 2,
      preySpeed: 1.3
    },
    {
      name: 'Sieci Widma Kłusowników — Śmiertelna Pułapka 🕸️',
      desc: 'Dryfujące sieci zabijają miliony rekinów! Omijaj sieci i schwytaj 6 ofiar.',
      time: 32,
      targetPrey: 6,
      hazards: 3,
      preySpeed: 1.4
    },
    {
      name: 'Nocne Łowy na Płaszczki Elektryczne ⚡⚡',
      desc: 'Cel emituje potężne biopola! Złap 7 płaszczek unikając barier skalnych.',
      time: 30,
      targetPrey: 7,
      hazards: 3,
      preySpeed: 1.5
    },
    {
      name: 'Głębia Abisalna — Wykrywanie Ostatnich Biopól 🌊',
      desc: 'Skrajne ciśnienie i ciemność. Złap 7 celów w rekordowym tempie.',
      time: 30,
      targetPrey: 7,
      hazards: 3,
      preySpeed: 1.6
    },
    {
      name: 'Władca Szóstego Zmysłu — Król Oceanów 👑🦈',
      desc: 'Finałowy test drapieżnika szczytowego! Wytrop 8 ofiar szóstym zmysłem elektrorecepcji.',
      time: 28,
      targetPrey: 8,
      hazards: 4,
      preySpeed: 1.7
    }
  ];

  let currentLevelIdx = 0;
  let isPlaying = false;
  let timeLeft = 40;
  let timerInterval = null;
  let animId = null;
  let caughtCount = 0;
  let electricVisionActive = false;

  // Shark player
  let shark = {
    x: 80,
    y: 170,
    targetX: 80,
    targetY: 170,
    radius: 22
  };

  // Preys and Hazards
  let preys = [];
  let hazards = [];

  function spawnLevelEntities() {
    const lvl = levels[currentLevelIdx];
    preys = [];
    hazards = [];

    for (let i = 0; i < lvl.targetPrey; i++) {
      preys.push({
        x: 100 + Math.random() * (width - 150),
        y: height - 50 + (Math.random() * 30 - 15), // buried near sandy bottom
        vx: (Math.random() > 0.5 ? 1 : -1) * lvl.preySpeed * 0.7,
        radius: 16,
        caught: false,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }

    for (let i = 0; i < lvl.hazards; i++) {
      hazards.push({
        x: 140 + Math.random() * (width - 200),
        y: 60 + Math.random() * (height - 140),
        vx: (Math.random() > 0.5 ? 1 : -1) * 0.8,
        vy: (Math.random() > 0.5 ? 0.6 : -0.6),
        radius: 18,
        icon: i % 2 === 0 ? '⚓' : '🕸️'
      });
    }
  }

  function updateHUD() {
    const isEn = window.swiat_zmyslow_lang === 'en' || (typeof localStorage !== 'undefined' && localStorage.getItem('swiat_zmyslow_lang') === 'en');
    const lvl = levels[currentLevelIdx];
    const lvlName = window.t ? window.t(lvl.name) : lvl.name;
    if (preyVal) preyVal.textContent = `${caughtCount} / ${lvl.targetPrey}`;
    if (timerVal) timerVal.textContent = `${timeLeft}s`;
    if (sensorStatusVal) {
      const activeText = window.t ? window.t('⚡ Ampułki (Elektryczność)') : '⚡ Ampułki (Elektryczność)';
      const normalText = window.t ? window.t('👁️ Zwykły wzrok') : '👁️ Zwykły wzrok';
      sensorStatusVal.textContent = electricVisionActive ? activeText : normalText;
      sensorStatusVal.style.color = electricVisionActive ? 'var(--cyan-light)' : 'var(--text-muted)';
    }

    if (levelBadge) {
      levelBadge.innerHTML = `<span>${isEn ? 'Mission' : 'Misja'} ${currentLevelIdx + 1}/10:</span> ${lvlName}`;
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

  function toggleElectricVision() {
    electricVisionActive = !electricVisionActive;
    updateHUD();
  }

  // Keyboard shortcut E
  window.addEventListener('keydown', (e) => {
    if (isPlaying && (e.key === 'e' || e.key === 'E')) {
      toggleElectricVision();
    }
  });

  sensorBtn?.addEventListener('click', () => {
    if (isPlaying) {
      toggleElectricVision();
    }
  });

  // Mouse / Touch movement tracking
  function handlePointer(clientX, clientY) {
    if (!isPlaying) return;
    const rect = canvas.getBoundingClientRect();
    shark.targetX = Math.max(shark.radius, Math.min(width - shark.radius, clientX - rect.left));
    shark.targetY = Math.max(shark.radius, Math.min(height - shark.radius, clientY - rect.top));
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
    caughtCount = 0;
    electricVisionActive = false;
    isPlaying = true;

    shark.x = 60;
    shark.y = height / 2;
    shark.targetX = 60;
    shark.targetY = height / 2;

    spawnLevelEntities();
    updateHUD();

    overlay.style.display = 'none';
    overlay.classList.remove('active');

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      updateHUD();
      if (timeLeft <= 0) {
        gameOver(false, 'Koniec czasu patrolu! Ryby odpłynęły w głąb oceanu.');
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

    const isEn = window.swiat_zmyslow_lang === 'en' || (typeof localStorage !== 'undefined' && localStorage.getItem('swiat_zmyslow_lang') === 'en');

    if (won) {
      if (currentLevelIdx < levels.length - 1) {
        if (overlayIcon) overlayIcon.textContent = '🎉🦈⚡';
        if (overlayTitle) overlayTitle.textContent = isEn ? `Mission ${currentLevelIdx + 1} completed!` : `Misja ${currentLevelIdx + 1} ukończona!`;
        const defMsg = isEn ? 'Your ampullae of Lorenzini flawlessly detected all prey beneath the seabed!' : 'Twoje ampułki Lorenziniego bezbłędnie wykryły wszystkie ofiary pod dnem!';
        if (overlayDesc) overlayDesc.textContent = message ? (window.t ? window.t(message) : message) : defMsg;
        if (nextBtn) nextBtn.style.display = 'inline-block';
      } else {
        if (overlayIcon) overlayIcon.textContent = '👑🦈🌊';
        if (overlayTitle) overlayTitle.textContent = isEn ? 'CONGRATULATIONS! Master of Ocean Senses!' : 'GRATULACJE! Władca Zmysłów Oceanu!';
        if (overlayDesc) overlayDesc.textContent = isEn ? 'You completed all 10 levels! You mastered electroreception, stereo smell, and silent swimming with dermal denticles.' : 'Ukończyłeś wszystkie 10 poziomów! Opanowałeś elektrorecepcję, stereowęch i bezszelestny pływ ząbków skórnych.';
        if (resetBtn) resetBtn.style.display = 'inline-block';
      }
    } else {
      if (overlayIcon) overlayIcon.textContent = '💥🌊';
      if (overlayTitle) overlayTitle.textContent = isEn ? 'Patrol failed!' : 'Patrol nieudany!';
      const defMsg = isEn ? 'Try again to maintain sensory alertness.' : 'Spróbuj ponownie zachować czujność sensoryczną.';
      if (overlayDesc) overlayDesc.textContent = message ? (window.t ? window.t(message) : message) : defMsg;
      if (restartBtn) restartBtn.style.display = 'inline-block';
    }
  }

  function animLoop() {
    if (!isPlaying) return;

    // Smooth movement
    shark.x += (shark.targetX - shark.x) * 0.12;
    shark.y += (shark.targetY - shark.y) * 0.12;

    // Clear background
    ctx.fillStyle = '#03121F';
    ctx.fillRect(0, 0, width, height);

    // Draw sandy seabed
    const sandHeight = 55;
    ctx.fillStyle = electricVisionActive ? '#09212D' : '#1A1810';
    ctx.fillRect(0, height - sandHeight, width, sandHeight);
    ctx.strokeStyle = electricVisionActive ? '#22D3EE' : '#334155';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, height - sandHeight);
    for (let x = 0; x <= width; x += 40) {
      ctx.quadraticCurveTo(x + 20, height - sandHeight + Math.sin(x) * 4, x + 40, height - sandHeight);
    }
    ctx.stroke();

    // Draw light caustics
    if (!electricVisionActive) {
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.08)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        const off = (Date.now() / 30 + i * 80) % width;
        ctx.moveTo(off, 0);
        ctx.lineTo(off + 60, height);
        ctx.stroke();
      }
    }

    // Update & draw preys
    const lvl = levels[currentLevelIdx];
    preys.forEach(p => {
      if (p.caught) return;

      p.x += p.vx;
      if (p.x < 30 || p.x > width - 30) p.vx *= -1;
      p.pulsePhase += 0.08;

      if (electricVisionActive) {
        // Electric heartbeat rings
        const ringRadius = 14 + Math.sin(p.pulsePhase) * 6;
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, ringRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(34, 211, 238, 0.2)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, ringRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '18px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⚡🐟', p.x, p.y);
      } else {
        // Almost completely hidden in the sand
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(p.x, p.y + 6, 12, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '12px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('〰️', p.x, p.y);
      }

      // Check collision with shark
      const dist = Math.hypot(shark.x - p.x, shark.y - p.y);
      if (dist < shark.radius + p.radius) {
        p.caught = true;
        caughtCount++;
        updateHUD();
        if (caughtCount >= lvl.targetPrey) {
          gameOver(true, `Znakomicie! Wytropiłeś wszystkie ${lvl.targetPrey} ofiary!`);
        }
      }
    });

    // Update & draw hazards (anchors, ghost nets)
    hazards.forEach(h => {
      h.x += h.vx;
      h.y += h.vy;
      if (h.x < 30 || h.x > width - 30) h.vx *= -1;
      if (h.y < 40 || h.y > height - sandHeight - 20) h.vy *= -1;

      ctx.font = '22px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(h.icon, h.x, h.y);

      const dist = Math.hypot(shark.x - h.x, shark.y - h.y);
      if (dist < shark.radius + h.radius - 4) {
        gameOver(false, `Uwaga! Zaplątałeś się w ${h.icon === '⚓' ? 'kotwicę' : 'porzuconą sieć widmo'}!`);
      }
    });

    // Draw Shark
    ctx.save();
    ctx.translate(shark.x, shark.y);
    const angle = Math.atan2(shark.targetY - shark.y, shark.targetX - shark.x);
    if (Math.abs(shark.targetX - shark.x) > 2) {
      if (shark.targetX < shark.x) {
        ctx.scale(-1, 1);
      }
    }

    // Glow aura if electric sense is active
    if (electricVisionActive) {
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, shark.radius + 12, 0, Math.PI * 2);
      ctx.stroke();

      // Electric arcs around snout
      ctx.strokeStyle = '#22D3EE';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(18, -6);
      ctx.lineTo(26, -2);
      ctx.lineTo(22, 4);
      ctx.lineTo(30, 8);
      ctx.stroke();
    }

    ctx.font = '32px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🦈', 0, 0);
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
   6. INTERACTIVE 5-QUESTION SHARK QUIZ
   ============================================================ */
function initSharkQuiz() {
  const container = document.getElementById('sharkQuizDynamicBody');
  const meter = document.getElementById('sharkQuizMeterProgress');
  if (!container) return;

  const questions = [
    {
      q: 'Do czego służą ampułki Lorenziniego zlokalizowane na pysku rekina?',
      options: [
        'Do filtrowania planktonu i soli z wody morskiej',
        'Do detekcji mikro-pól elektrycznych generowanych przez skurcze mięśni i bicie serca',
        'Do świecenia w ciemnościach głębinowych (bioluminescencja)',
        'Do regulowania ciśnienia w pęcherzu pławnym'
      ],
      correct: 1,
      explain: 'Ampułki Lorenziniego to pory wypełnione żelem o najwyższym znanym biologicznym przewodnictwie. Wykrywają one napięcia rzędu nanowoltów emitowane przez żywe organizmy.'
    },
    {
      q: 'Z czego składa się szkielet rekina?',
      options: [
        'Z twardych kości pneumatycznych wypełnionych powietrzem',
        'Z chitynowych płytek pancerza zewnętrznego',
        'W 100% ze sprężystej chrząstki (brak tradycyjnych kości)',
        'Ze zmineralizowanych łusek rogowych'
      ],
      correct: 2,
      explain: 'Rekiny należą do ryb chrzęstnoszkieletowych. Ich szkielet jest o połowę lżejszy od kości, nie ulega złamaniom i zapewnia niespotykaną zwrotność.'
    },
    {
      q: 'Co powinieneś zrobić, gdy podczas pływania na rafie zauważysz zbliżającego się rekina?',
      options: [
        'Panicznie chlapać rękami i nogami oraz płynąć sprintem do brzegu',
        'Utrzymywać stały kontakt wzrokowy, przyjąć pozycję pionową i spokojnie się wycofywać',
        'Wypuścić powietrze z płuc i natychmiast uderzyć rekina w pysk',
        'Udać martwego unosząc się bezwładnie na powierzchni'
      ],
      correct: 1,
      explain: 'Rekin to drapieżnik z zasadzki. Gdy widzi, że stale na niego patrzysz, wie, że stracił element zaskoczenia i zazwyczaj odpływa. Chlapanie prowokuje atak!'
    },
    {
      q: 'W jaki sposób ząbki skórne (łuski plakoidalne) pomagają rekinowi w polowaniu?',
      options: [
        'Świecą w ciemności, przywabiając małe krewetki',
        'Wytwarzają rowki redukujące mikrowiry wody, umożliwiając cichy i szybki pływ bez oporu',
        'Wydzielają silną truciznę paraliżującą przeciwnika',
        'Zmieniają kolor w zależności od temperatury wody'
      ],
      correct: 1,
      explain: 'Ząbki skórne rekina przypominają miniaturowe zęby ze szkliwa. Wyciszają szum opływającej wody i drastycznie zmniejszają opór hydrodynamiczny.'
    },
    {
      q: 'Ile zębów rekin może wytworzyć i wymienić w ciągu swojego życia?',
      options: [
        'Tylko 32 zęby, podobnie jak dorosły człowiek',
        'Około 150 zębów (wymieniane raz na 10 lat)',
        'Nawet do 30 000 zębów na przesuwającej się „taśmie transmisyjnej” dziąseł',
        'Rekiny rodzą się z jednym zestawem zębów, który nie odrasta'
      ],
      correct: 2,
      explain: 'Zęby rekina ułożone są w wielu rzędach. Gdy jeden ząb wypadnie, w ciągu 24–48 godzin na jego miejsce przesuwa się kolejny z tylnego rzędu.'
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
      <div style="margin-bottom: 12px; font-size: 0.82rem; color: var(--cyan-light); font-weight: 700; text-transform: uppercase;">
        Pytanie ${currentQ + 1} z ${questions.length}
      </div>
      <h3 style="margin-bottom: 20px; font-size: 1.25rem;">${item.q}</h3>
      <div class="quiz-options-list" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
        ${item.options.map((opt, idx) => `
          <button class="quiz-option-btn" data-opt-idx="${idx}" style="text-align: left; padding: 14px 18px; border-radius: var(--radius-md); border: 1px solid var(--border); background: rgba(255,255,255,0.02); color: var(--text); font-size: 0.95rem; cursor: pointer; transition: all 0.2s ease;">
            <strong style="color: var(--cyan-light); margin-right: 8px;">${String.fromCharCode(65 + idx)}.</strong> ${opt}
          </button>
        `).join('')}
      </div>
      <div id="quizExplainBox" style="display: none; padding: 14px; border-radius: var(--radius-md); font-size: 0.9rem; line-height: 1.5; margin-bottom: 16px;"></div>
      <div style="text-align: right;">
        <button id="nextQBtn" class="btn btn-primary" style="display: none;">${(window.swiat_zmyslow_lang === 'en' || (typeof localStorage !== 'undefined' && localStorage.getItem('swiat_zmyslow_lang') === 'en')) ? 'Next →' : 'Dalej →'}</button>
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
        <div style="font-size: 3.5rem; margin-bottom: 12px;">${perfect ? '🏆🦈⚡' : '🌊🦈'}</div>
        <h3 style="font-size: 1.5rem; margin-bottom: 8px;">Twój wynik: ${score} z ${questions.length} (${pct}%)</h3>
        <p style="color: var(--text-muted); font-size: 0.95rem; max-width: 460px; margin: 0 auto 24px;">
          ${perfect
            ? 'Perfekcyjnie! Znasz fizjologię elektrorecepcji, rolę ząbków skórnych i potrafisz zachować zimną krew w oceanie.'
            : 'Niezły wynik! Przejrzyj sekcje o ampułkach Lorenziniego i zasadach zachowania, a potem spróbuj ponownie!'}
        </p>

        ${perfect ? `
          <div style="display: inline-block; background: linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%); border: 1px dashed var(--cyan-light); border-radius: var(--radius-md); padding: 16px 24px; margin-bottom: 24px;">
            <span style="font-size: 0.85rem; color: var(--cyan-light); font-weight: 700; text-transform: uppercase;">CERTYFIKAT ZMYSŁÓW OTRZYMANY:</span>
            <div style="font-size: 1.1rem; font-weight: 800; color: #fff; margin-top: 4px;">🌊 Mistrz Elektrorecepcji i Badacz Rekinów 🦈</div>
          </div>
        ` : ''}

        <div>
          <button id="retrySharkQuizBtn" class="btn btn-secondary">Spróbuj ponownie ↺</button>
        </div>
      </div>
    `;

    document.getElementById('retrySharkQuizBtn')?.addEventListener('click', () => {
      currentQ = 0;
      score = 0;
      renderQuestion();
    });
  }

  renderQuestion();
}

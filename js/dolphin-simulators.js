/* ============================================================
   DOLPHIN (DELFIN BUTLONOSY) — SENSORY SIMULATORS & 10-LEVEL GAME
   Author: Dorian Kalinowski for "Świat zmysłami zwierząt"
   Senses: 3D Acoustic sonar, Melon lens, Lower jaw acoustic receiver
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initDolphinSonarSimulator();
  initDolphinWhistleSimulator();
  initDolphinAnatomyInspector();
  initDolphinCrisisSimulator();
  initDolphinSonarGame();
  initDolphinQuiz();
});

/* ============================================================
   1. 3D ECHOLOCATION SONAR & X-RAY SIMULATOR (Web Audio API)
   ============================================================ */
function initDolphinSonarSimulator() {
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

  const freqSlider = document.getElementById('dolphinSonarFreqSlider');
  const freqDisplay = document.getElementById('dolphinSonarFreqDisplay');
  const targetBtns = document.querySelectorAll('[data-dolphin-target]');
  const targetIcon = document.getElementById('dolphinSonarTargetIcon');
  const targetTitle = document.getElementById('dolphinSonarTargetTitle');
  const targetDesc = document.getElementById('dolphinSonarTargetDesc');
  const pingBtn = document.getElementById('playDolphinSonarPingBtn');
  const sonarStatus = document.getElementById('dolphinSonarStatus');

  const targets = {
    fish: {
      icon: '🐟🦴',
      title: 'Skan makreli: Pęcherz pławny i szkielet',
      desc: 'Wiązka sonaru przenika przez mięśnie ryby. Pęcherz pławny wypełniony gazem odbija 90% fali akustycznej — delfin widzi dokładny rozmiar, gatunek i stan zdrowia makreli z odległości 70 metrów!'
    },
    squid: {
      icon: '🦑🖤',
      title: 'Skan kałamarnicy: Chitynowy szkielet i worek czernidłowy',
      desc: 'Kałamarnica nie posiada kości ani pęcherza pławnego, więc odbija słabsze echo. Delfin używa wyższej częstotliwości (140 kHz), by wykryć gęstszą chitynową muszlę wewnętrzną i ruch macek.'
    },
    human: {
      icon: '🏊🫁❤️',
      title: 'Skan nurka: Płuca, kości i rytm serca',
      desc: 'Delfin sondujący człowieka widzi płuca wypełnione powietrzem, strukturę klatki piersiowej, a nawet skurcze komór serca! Potrafi też bezbłędnie wykryć ciążę u kąpiącej się kobiety.'
    }
  };

  let currentTargetKey = 'fish';

  targetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      targetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentTargetKey = btn.getAttribute('data-dolphin-target');
      const data = targets[currentTargetKey];
      if (!data) return;

      if (targetIcon) targetIcon.textContent = data.icon;
      if (targetTitle) targetTitle.textContent = data.title;
      if (targetDesc) targetDesc.textContent = data.desc;
    });
  });

  freqSlider?.addEventListener('input', (e) => {
    const val = e.target.value;
    if (freqDisplay) {
      freqDisplay.textContent = `${val} kHz (${val > 100 ? 'Wysoka precyzja USG' : 'Szeroki kąt skanowania'})`;
    }
  });

  // Play dolphin sonar click train
  pingBtn?.addEventListener('click', () => {
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      const freqVal = parseInt(freqSlider?.value || 120);
      const audioPitch = 800 + (freqVal / 150) * 1800; // Scaled to human audible range

      // Rapid train of 6 ultrasonic clicks
      for (let i = 0; i < 6; i++) {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(audioPitch + i * 40, ctx.currentTime);

          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.04);
        }, i * 55);
      }

      if (sonarStatus) {
        const delay = Math.round(10 + Math.random() * 20);
        sonarStatus.textContent = `Echo odebrane przez żuchwę: Rozpoznano ${currentTargetKey === 'fish' ? 'rybę' : currentTargetKey === 'squid' ? 'kałamarnicę' : 'człowieka'} (Opóźnienie: ${delay} ms)`;
      }
    } catch (e) {}
  });
}

/* ============================================================
   2. SIGNATURE WHISTLES SYNTHESIZER (Web Audio API)
   ============================================================ */
function initDolphinWhistleSimulator() {
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

  const btn1 = document.getElementById('playSignatureWhistleBtn1');
  const btn2 = document.getElementById('playSignatureWhistleBtn2');

  // Whistle 1: Rising contour sweep
  btn1?.addEventListener('click', () => {
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';

      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(3200, ctx.currentTime + 0.35);
      osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.65);
      osc.frequency.exponentialRampToValueAtTime(3600, ctx.currentTime + 0.95);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.95);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.95);
    } catch (e) {}
  });

  // Whistle 2: Double FM loop
  btn2?.addEventListener('click', () => {
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';

      osc.frequency.setValueAtTime(2800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.25);
      osc.frequency.exponentialRampToValueAtTime(2900, ctx.currentTime + 0.5);
      osc.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.75);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {}
  });
}

/* ============================================================
   3. DOLPHIN ANATOMY & BIOMECHANICS INSPECTOR
   ============================================================ */
function initDolphinAnatomyInspector() {
  const buttons = document.querySelectorAll('[data-dolphin-anatomy]');
  const titleEl = document.getElementById('dolphinAnatomyTitle');
  const descEl = document.getElementById('dolphinAnatomyDesc');
  const statEl = document.getElementById('dolphinAnatomyStat');

  if (!buttons.length || !titleEl) return;

  const data = {
    melon: {
      title: 'Melon Czołowy — Soczewka Akustyczna Sonaru',
      desc: 'Czoło delfina wypełnia owalna poduszka ze specjalnych estrów woskowych i triglicerydów. Działa jak soczewka wypukła: zbiera fale ultradźwiękowe wytwarzane pod odpowietrznikiem i formuje je w wąską, zogniskowaną wiązkę akustyczną skanującą toń morską.',
      stat: 'Zasięg detekcji sonaru: ponad 120 metrów w mętnej wodzie'
    },
    blowhole: {
      title: 'Odpowietrznik (Spiraculum) i Wargi Foniczne',
      desc: 'Pojedyncze nozdrze na czubku głowy zamykane szczelnym fałdem mięśniowym. Tuż pod nim znajdują się tzw. małpie wargi foniczne (phonic lips), które przepychając powietrze w workach nosowych wytwarzają kliki sonaru bez utraty cennego tlenu.',
      stat: 'Częstotliwość generowania: do 1000 klików na sekundę'
    },
    jaw: {
      title: 'Dolna Żuchwa — Kanał Przewodzenia Echa do Ucha',
      desc: 'Zewnętrzne uszy delfina zanikły. Odbite echo sonaru wnika przez cienką kość dolnej szczęki, która jest wypełniona specjalnym tłuszczem akustycznym. Tłuszcz przewodzi fale bezpośrednio do ucha wewnętrznego z zerowym tłumieniem!',
      stat: 'Czułość słuchowa: odbiór dźwięków do 160 kHz'
    },
    fin: {
      title: 'Płetwa Grzbietowa — Stabilizator i Chłodnica',
      desc: 'Sztywna płetwa z tkanki łącznej bez kości stabilizuje ciało podczas szybkich zwrotów. Pełni również kluczową rolę w termoregulacji: bogata sieć naczyń krwionośnych chłodzi krew delfina podczas intensywnego pływania.',
      stat: 'Współczynnik oporu: jeden z najniższych w przyrodzie (Cd ~0.003)'
    },
    fluke: {
      title: 'Pozioma Płetwa Ogonowa — Silnik Hydrofobowy',
      desc: 'W przeciwieństwie do ryb, które poruszają ogonem na boki, delfin jako ssak macha ogonem góra-dół. Potężne mięśnie grzbietowe pozwalają osiągnąć prędkość 35 km/h oraz wyskakiwać na 6 metrów ponad taflę wody.',
      stat: 'Prędkość maksymalna: do 35 km/h (sprint pogoni)'
    }
  };

  function selectPart(key) {
    buttons.forEach(b => {
      if (b.getAttribute('data-dolphin-anatomy') === key) {
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
      const key = btn.getAttribute('data-dolphin-anatomy');
      selectPart(key);
    });
  });
}

/* ============================================================
   4. CRISIS SIMULATOR: OCHRONA WALENI NA MORZU
   ============================================================ */
function initDolphinCrisisSimulator() {
  const cards = document.querySelectorAll('.dolphin-crisis-card');
  const resultBox = document.getElementById('dolphinCrisisResult');
  if (!cards.length || !resultBox) return;

  const responses = {
    speed_chase: {
      type: 'danger',
      title: '❌ ŚMIERTELNY BŁĄD: Ściganie stada motorówką!',
      text: 'Wpływanie z dużą prędkością w stado delfinów kaleczy i zabija zwierzęta wirującą śrubą napędową. Wywołuje skrajny stres akustyczny i rozdziela matki od karmionych młodych. Prawo morskie zakazuje takiego postępowania!'
    },
    feed_bread: {
      type: 'danger',
      title: '❌ BŁĄD: Karmienie dzikich delfinów!',
      text: 'Pieczywo i resztki jedzenia powodują ciężkie infekcje żołądka u waleni. Dokarmianie uczy delfiny żebractwa przy burtach, co prowadzi do ich okaleczenia przez silniki łodzi i zaplątania w linki wędkarskie.'
    },
    slow_neutral: {
      type: 'success',
      title: '✅ WZOROWE I ETYCZNE POSTĘPOWANIE NA WODZIE:',
      text: '1. Zwolnij obroty silnika do biegu jałowego lub utrzymaj stały, wolny kurs.<br>2. Zachowaj dystans min. 100 metrów i nigdy nie przecinaj trasy płynącego stada.<br>3. Pozwól delfinom zdecydować — jeśli będą miały ochotę, same przypłyną surfować na fali dziobowej łodzi!'
    },
    jump_swim: {
      type: 'danger',
      title: '❌ BŁĄD: Wskakiwanie do wody i próba dotknięcia!',
      text: 'Delfin butlonosy waży 200–400 kg i posiada siłę uderzenia ogona zdolną złamać żebra człowiekowi. Samica w obronie młodego może staranować intruza pod wodą.'
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
   5. 10-LEVEL MINIGAME: OCEANICZNY SONAR 3D — ŁOWY W GŁĘBINACH
   ============================================================ */
function initDolphinSonarGame() {
  const canvas = document.getElementById('dolphinGameCanvas');
  const overlay = document.getElementById('dolphinGameOverlay');
  const startBtn = document.getElementById('startDolphinGameBtn');
  const nextBtn = document.getElementById('nextDolphinLevelBtn');
  const restartBtn = document.getElementById('restartDolphinGameBtn');
  const resetBtn = document.getElementById('resetDolphinCampaignBtn');
  const sonarTriggerBtn = document.getElementById('dolphinSonarTriggerInGameBtn');

  const fishVal = document.getElementById('dolphinGameFish');
  const timerVal = document.getElementById('dolphinGameTimer');
  const sonarStatusVal = document.getElementById('dolphinGameSonarStatus');
  const levelBadge = document.getElementById('dolphinGameLevelBadge');
  const levelDotsContainer = document.getElementById('dolphinGameLevelDots');
  const overlayIcon = document.getElementById('dolphinGameOverIcon');
  const overlayTitle = document.getElementById('dolphinGameOverTitle');
  const overlayDesc = document.getElementById('dolphinGameOverDesc');

  if (!canvas || !overlay || !startBtn) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.clientWidth || 500);
  let height = (canvas.height = canvas.clientHeight || 340);

  window.addEventListener('resize', () => {
    if (!canvas) return;
    width = canvas.width = canvas.clientWidth || 500;
    height = canvas.height = canvas.clientHeight || 340;
  });

  // 10 Progressive Ocean Depths
  const levels = [
    {
      name: 'Słoneczna Laguna i Ławice Sardynek 🐟🐬',
      desc: 'Spokojna rafa koralowa. Wyślij impuls sonaru, by zlokalizować 3 ryby w płytkiej wodzie.',
      time: 40,
      targetFish: 3,
      fishSpeed: 0.6,
      sonarRadius: 180
    },
    {
      name: 'Mętne Ujście Rzeki Amazonki 🌊',
      desc: 'Woda jest pełna osadów — wzrok nie działa! Polegaj wyłącznie na echu sonaru.',
      time: 38,
      targetFish: 4,
      fishSpeed: 0.8,
      sonarRadius: 170
    },
    {
      name: 'Koralowy Kanion i Ukryte Kałamarnice 🦑',
      desc: 'Zwinne kałamarnice kryją się w szczelinach. Wymagają szybkiego namierzenia wiązką akustyczną.',
      time: 36,
      targetFish: 4,
      fishSpeed: 1.0,
      sonarRadius: 160
    },
    {
      name: 'Oceaniczna Noc i Płynące Makrele 🌙',
      desc: 'Ciemna toń oceanu. Ryby poruszają się w zwartych grupach pod osłoną nocy.',
      time: 35,
      targetFish: 5,
      fishSpeed: 1.1,
      sonarRadius: 160
    },
    {
      name: 'Prąd Zatokowy i Pływające Kotwice ⚓',
      desc: 'Silny prąd morski. Zbieraj ryby i uważaj na zardzewiałe łańcuchy kotwic.',
      time: 35,
      targetFish: 5,
      fishSpeed: 1.2,
      sonarRadius: 150
    },
    {
      name: 'Podmorska Jaskinia Echa 🦇🔊',
      desc: 'Ściany skalne odbijają echo sonaru. Precyzyjnie kalkuluj odległość od ofiary.',
      time: 32,
      targetFish: 6,
      fishSpeed: 1.3,
      sonarRadius: 150
    },
    {
      name: 'Zanieczyszczona Zatoka — Uwaga na Śruby 🚤',
      desc: 'Hałas silników zakłóca sonar! Wysyłaj częstsze impulsy, by nie zgubić celu.',
      time: 32,
      targetFish: 6,
      fishSpeed: 1.4,
      sonarRadius: 140
    },
    {
      name: 'Polowanie Zespołowe na Ławice Śledzi 🐟🐟',
      desc: 'Ławica rozprasza się błyskawicznie. Ścigaj ryby hydrodynamicznym sprintem.',
      time: 30,
      targetFish: 7,
      fishSpeed: 1.5,
      sonarRadius: 140
    },
    {
      name: 'Głębia Równikowa i Skrajne Echolokacje 🌊🔊',
      desc: 'Głęboka woda o wysokim ciśnieniu. Ostatni zapas tlenu ucieka bardzo szybko.',
      time: 30,
      targetFish: 7,
      fishSpeed: 1.6,
      sonarRadius: 130
    },
    {
      name: 'Władca Oceanicznych Fal — Mistrz Sonaru 👑🐬',
      desc: 'Finałowy test zmysłów! Złów 8 ryb w rekordowym czasie za pomocą ultradźwięków.',
      time: 28,
      targetFish: 8,
      fishSpeed: 1.7,
      sonarRadius: 130
    }
  ];

  let currentLevelIdx = 0;
  let isPlaying = false;
  let timeLeft = 40;
  let timerInterval = null;
  let animId = null;
  let caughtCount = 0;

  // Dolphin Player
  let dolphin = {
    x: 80,
    y: 170,
    targetX: 80,
    targetY: 170,
    radius: 20
  };

  // Sonar Wave Ring
  let sonarWave = {
    active: false,
    radius: 0,
    maxRadius: 160
  };

  // Fishes
  let fishes = [];

  function spawnLevelEntities() {
    const lvl = levels[currentLevelIdx];
    fishes = [];
    sonarWave.maxRadius = lvl.sonarRadius;

    const emojis = ['🐟', '🐠', '🦑', '🐡'];
    for (let i = 0; i < lvl.targetFish; i++) {
      fishes.push({
        x: 120 + Math.random() * (width - 160),
        y: 40 + Math.random() * (height - 80),
        vx: (Math.random() - 0.5) * lvl.fishSpeed * 1.8,
        vy: (Math.random() - 0.5) * lvl.fishSpeed * 1.8,
        radius: 14,
        emoji: emojis[i % emojis.length],
        revealed: 0,
        caught: false
      });
    }
  }

  function triggerSonarPulse() {
    if (!isPlaying) return;
    sonarWave.active = true;
    sonarWave.radius = 10;
    if (sonarStatusVal) {
      sonarStatusVal.textContent = 'Impuls sonaru w toku! 🔊';
      sonarStatusVal.style.color = '#38BDF8';
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
    if (fishVal) fishVal.textContent = `${caughtCount} / ${lvl.targetFish}`;
    if (timerVal) timerVal.textContent = `${timeLeft}s`;
  }

  function handlePointer(e) {
    if (!isPlaying) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dolphin.targetX = Math.max(25, Math.min(width - 25, clientX - rect.left));
    dolphin.targetY = Math.max(25, Math.min(height - 25, clientY - rect.top));
  }

  canvas.addEventListener('mousemove', handlePointer);
  canvas.addEventListener('touchstart', (e) => { e.preventDefault(); handlePointer(e); triggerSonarPulse(); }, { passive: false });
  canvas.addEventListener('touchmove', (e) => { e.preventDefault(); handlePointer(e); }, { passive: false });
  canvas.addEventListener('click', triggerSonarPulse);

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && isPlaying) {
      e.preventDefault();
      triggerSonarPulse();
    }
  });

  sonarTriggerBtn?.addEventListener('click', triggerSonarPulse);

  function startGame(lvlIdx = 0) {
    currentLevelIdx = lvlIdx;
    const lvl = levels[currentLevelIdx];
    isPlaying = true;
    timeLeft = lvl.time;
    caughtCount = 0;
    dolphin.x = width * 0.2;
    dolphin.y = height * 0.5;
    dolphin.targetX = dolphin.x;
    dolphin.targetY = dolphin.y;
    sonarWave.active = false;

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
        endGame(false, '⏱️ Brak tlenu!', 'Delfin musiał wynurzyć się na powierzchnię. Wracaj pod wodę i skanuj dno sonarem sprawniej!');
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
      if (overlayIcon) overlayIcon.textContent = '🎉🐬👑';
      startBtn.style.display = 'none';
      restartBtn.style.display = 'none';

      if (currentLevelIdx < levels.length - 1) {
        nextBtn.style.display = 'inline-block';
        resetBtn.style.display = 'none';
      } else {
        nextBtn.style.display = 'none';
        resetBtn.style.display = 'inline-block';
        if (overlayTitle) overlayTitle.textContent = window.t ? window.t('🏆 WŁADCA OCEANICZNEGO SONARU!') : '🏆 WŁADCA OCEANICZNEGO SONARU!';
        if (overlayDesc) overlayDesc.textContent = window.t ? window.t('Ukończyłeś wszystkie 10 głębin morskich! Opanowałeś melon akustyczny i echolokację jak prawdziwy delfin.') : 'Ukończyłeś wszystkie 10 głębin morskich! Opanowałeś melon akustyczny i echolokację jak prawdziwy delfin.';
      }
    } else {
      if (overlayIcon) overlayIcon.textContent = '⚠️🐬💔';
      startBtn.style.display = 'none';
      nextBtn.style.display = 'none';
      restartBtn.style.display = 'inline-block';
      resetBtn.style.display = 'none';
    }
  }

  function gameLoop() {
    if (!isPlaying) return;

    // Move dolphin smoothly
    dolphin.x += (dolphin.targetX - dolphin.x) * 0.12;
    dolphin.y += (dolphin.targetY - dolphin.y) * 0.12;

    // Expand sonar wave
    if (sonarWave.active) {
      sonarWave.radius += 5.5;
      if (sonarWave.radius > sonarWave.maxRadius) {
        sonarWave.active = false;
        if (sonarStatusVal) {
          sonarStatusVal.textContent = 'Gotowy do impulsu 🔊';
          sonarStatusVal.style.color = 'var(--purple-light)';
        }
      }
    }

    // Move fishes & check sonar reveal
    const lvl = levels[currentLevelIdx];
    fishes.forEach(f => {
      if (f.caught) return;
      f.x += f.vx;
      f.y += f.vy;
      if (f.x < 30 || f.x > width - 30) f.vx *= -1;
      if (f.y < 30 || f.y > height - 30) f.vy *= -1;

      // Sonar pulse reveals fish
      if (sonarWave.active) {
        const d = Math.hypot(dolphin.x - f.x, dolphin.y - f.y);
        if (Math.abs(d - sonarWave.radius) < 25) {
          f.revealed = 90; // Frame counter for visibility
        }
      }
      if (f.revealed > 0) f.revealed--;

      // Catch fish if close
      const catchDist = Math.hypot(dolphin.x - f.x, dolphin.y - f.y);
      if (catchDist < dolphin.radius + f.radius) {
        f.caught = true;
        caughtCount++;
        updateHUD();

        if (caughtCount >= lvl.targetFish) {
          endGame(true, `🎉 Zwycięstwo! Ukończono Poziom ${currentLevelIdx + 1}!`, `Delfin namierzył sonarem i schwytał wszystkie ${lvl.targetFish} ryby.`);
        }
      }
    });

    renderCanvas();
    animId = requestAnimationFrame(gameLoop);
  }

  function renderCanvas() {
    ctx.clearRect(0, 0, width, height);

    // Deep Ocean Water Gradient
    const waterGrad = ctx.createLinearGradient(0, 0, 0, height);
    waterGrad.addColorStop(0, '#062035');
    waterGrad.addColorStop(1, '#020C17');
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, 0, width, height);

    // Light rays from surface
    ctx.fillStyle = 'rgba(56, 189, 248, 0.04)';
    for (let i = 40; i < width; i += 90) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 40, height);
      ctx.lineTo(i - 20, height);
      ctx.fill();
    }

    // Draw Sonar Rings
    if (sonarWave.active) {
      ctx.strokeStyle = `rgba(56, 189, 248, ${1 - sonarWave.radius / sonarWave.maxRadius})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(dolphin.x, dolphin.y, sonarWave.radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = `rgba(168, 85, 247, ${0.7 - sonarWave.radius / sonarWave.maxRadius})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(dolphin.x, dolphin.y, Math.max(5, sonarWave.radius - 15), 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw Fishes
    fishes.forEach(f => {
      if (f.caught) return;
      if (f.revealed > 0) {
        // Echo revealed! Bright glowing fish
        ctx.save();
        ctx.shadowColor = '#38BDF8';
        ctx.shadowBlur = 12;
        ctx.font = '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(f.emoji, f.x, f.y);
        ctx.restore();
      } else {
        // Murky water: barely visible shadow
        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.beginPath();
        ctx.arc(f.x, f.y, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw Dolphin
    ctx.save();
    ctx.font = '28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🐬', dolphin.x, dolphin.y);
    ctx.restore();
  }

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
function initDolphinQuiz() {
  const quizBody = document.getElementById('dolphinQuizDynamicBody');
  const progressBar = document.getElementById('dolphinQuizMeterProgress');
  if (!quizBody || !progressBar) return;

  const questions = [
    {
      q: 'Jaką rolę pełni melon czołowy w aparacie zmysłowym delfina?',
      options: [
        'Służy jako taran do rozbijania lodu na powierzchni',
        'Działa jak soczewka akustyczna — ogniskuje i kieruje wiązkę ultradźwięków sonaru w wąski stożek',
        'Jest narządem magazynującym tlen pod wodą',
        'Wytwarza prąd elektryczny do paraliżowania ryb'
      ],
      correct: 1,
      explanation: 'Melon czołowy to owalna poduszka ze specjalnych tłuszczów, która skupia fale dźwiękowe w skupioną wiązkę, pozwalając na precyzyjne skanowanie obiektów jak medycznym aparatem USG.'
    },
    {
      q: 'W jaki sposób echo powracające z sonaru trafia do ucha wewnętrznego delfina?',
      options: [
        'Przez widoczne małżowiny uszne na głowie',
        'Przez cienką kość dolnej żuchwy wypełnioną tłuszczem przewodzącym dźwięk',
        'Przez płetwy piersiowe rejestrujące wibracje',
        'Przez odpowietrznik na czubku głowy'
      ],
      correct: 1,
      explanation: 'Zewnętrzne otwory uszne delfina zanikły. Odbite fale dźwiękowe wnikają przez dolną żuchwę wypełnioną lipidami, które bez strat przewodzą fale prosto do puszki słuchowej.'
    },
    {
      q: 'Czym jest tzw. sen unihemisferyczny u delfinów?',
      options: [
        'Snem w pozycji pionowej na dnie oceanu',
        'Odpoczynkiem jednej półkuli mózgu na raz — druga półkula czuwa i kontroluje wynurzanie po tlen',
        'Całkowitym brakiem snu przez całe dorosłe życie',
        'Snem zimowym trwającym 3 miesiące'
      ],
      correct: 1,
      explanation: 'Delfin musi oddychać świadomie, więc nie może stracić przytomności. Jedna połowa mózgu śpi z zamkniętym okiem, a druga czuwa nad oddychaniem i drapieżnikami.'
    },
    {
      q: 'Czym są tzw. „gwizdy podpisowe” (signature whistles) delfinów butlonosych?',
      options: [
        'Odgłosem ostrzegającym przed nadejściem sztormu',
        'Indywidualnymi imionami akustycznymi — każdy delfin tworzy swój własny unikalny gwizd',
        'Dźwiękiem uderzania ogonem o wodę',
        'Mechanicznym dźwiękiem tarcia płetw'
      ],
      correct: 1,
      explanation: 'Każdy delfin w pierwszym roku życia tworzy własny wzorzec gwizdu, który pełni funkcję imienia. Inne delfiny wołają go tym gwizdem i pamiętają go nawet po 20 latach!'
    },
    {
      q: 'Dlaczego wojskowe sonary niskich częstotliwości są śmiertelnie groźne dla waleni?',
      options: [
        'Zmieniają temperaturę wody w oceanie',
        'Generują falę akustyczną o natężeniu do 230 dB, wywołującą krwotoki w uszach i paniczne wynurzanie z chorobą dekompresyjną',
        'Niszczą plankton, którym żywią się delfiny',
        'Odstraszają ryby na setki kilometrów'
      ],
      correct: 1,
      explanation: 'Ekstremalnie głośne sonary wojskowe niszczą delikatny aparat słuchowy waleni i wywołują panikę, zmuszając je do gwałtownego wynurzania z głębokości, co prowadzi do choroby dekompresyjnej i śmierci na plaży.'
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
      <div id="dolphinQuizFeedback"></div>
      <div class="quiz-action-bar" id="dolphinQuizNextBar" style="display: none; margin-top: 20px;">
        <button class="btn btn-primary" id="dolphinQuizNextBtn" style="background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%);">
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

    const feedbackEl = document.getElementById('dolphinQuizFeedback');
    const nextBar = document.getElementById('dolphinQuizNextBar');

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
    document.getElementById('dolphinQuizNextBtn').addEventListener('click', () => {
      currentIdx++;
      renderQuestion();
    });
  }

  function renderSummary() {
    progressBar.style.width = '100%';
    const percent = Math.round((score / questions.length) * 100);

    let rankTitle = 'Mistrz Bioakustyki Delfina 🐬';
    let badgeEmoji = '👑';
    let rankDesc = 'Znakomicie! Rozumiesz fizykę sonaru 3D, budowę melona czołowego i zasady bezpiecznego pływania z waleniami.';

    if (percent < 80 && percent >= 60) {
      rankTitle = 'Znawca Morskich Ssaków 🌊';
      badgeEmoji = '🎖️';
      rankDesc = 'Bardzo dobry wynik! Wiesz, jak delfiny słyszą przez żuchwę i dlaczego sen unihemisferyczny chroni ich życie.';
    } else if (percent < 60) {
      rankTitle = 'Adept Oceanicznych Głębin 📚';
      badgeEmoji = '🐬';
      rankDesc = 'Warto przejrzeć sekcję sonaru i anatomii melona raz jeszcze — świat zmysłów delfina to absolutne arcydzieło ewolucji!';
    }

    quizBody.innerHTML = `
      <div class="quiz-certificate">
        <div class="certificate-badge-emoji">${badgeEmoji}</div>
        <div class="certificate-score">${score} / ${questions.length}</div>
        <h3 class="certificate-title">${window.t ? window.t(rankTitle) : rankTitle}</h3>
        <p class="certificate-desc">${window.t ? window.t(rankDesc) : rankDesc}</p>
        <button class="btn btn-primary" id="dolphinQuizRestartBtn" style="background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%);">Rozwiąż quiz ponownie ↺</button>
      </div>
    `;

    document.getElementById('dolphinQuizRestartBtn').addEventListener('click', () => {
      currentIdx = 0;
      score = 0;
      renderQuestion();
    });
  }

  renderQuestion();
}

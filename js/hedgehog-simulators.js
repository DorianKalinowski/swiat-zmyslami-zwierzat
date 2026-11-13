/* ============================================================
   HEDGEHOG (JEŻ ZACHODNI) — SENSORY SIMULATORS & 10-LEVEL GAME
   Author: Dorian Kalinowski for "Świat zmysłami zwierząt"
   Senses: Jacobson's organ (self-anointing), Ultrasonic hearing, Venom immunity
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initHedgehogScentSimulator();
  initHedgehogAcousticSimulator();
  initHedgehogAnatomyInspector();
  initHedgehogCrisisSimulator();
  initHedgehogForagingGame();
  initHedgehogQuiz();
});

/* ============================================================
   1. SELF-ANOINTING & JACOBSON'S ORGAN SIMULATOR
   ============================================================ */
function initHedgehogScentSimulator() {
  const scentBtns = document.querySelectorAll('[data-hedgehog-scent]');
  const iconEl = document.getElementById('hedgehogAnointIcon');
  const titleEl = document.getElementById('hedgehogAnointTitle');
  const descEl = document.getElementById('hedgehogAnointDesc');
  const statusEl = document.getElementById('hedgehogAnointStatus');
  const triggerBtn = document.getElementById('triggerAnointReactionBtn');

  if (!scentBtns.length || !titleEl) return;

  const scentData = {
    mint: {
      icon: '🌿🦔🫧',
      title: 'Analiza chemiczna: Liść mięty pieprzowej (Mentol)',
      desc: 'Jeż żuje aromatyczny liść mięty, intensywnie spienia ślinę językiem i wygina grzbiet, by rozsmarować białą pianę po kolcach. Mentol działa jako naturalny repelent przeciwko pchłom i kleszczom oraz maskuje zapach jeża przed drapieżnikami.'
    },
    bark: {
      icon: '🌲🦔🫧',
      title: 'Analiza chemiczna: Żywiczna kora sosny (Terpeny)',
      desc: 'Żywice sosnowe zawierają bakteriobójcze fitoncydy. Jeż zeskrobuje korę zębami, puszcza pianę i wciera ją w nasadę kolców, zabezpieczając mikroskopijne ranki na skórze przed infekcjami bakteryjnymi.'
    },
    toad: {
      icon: '🐸🦔🫧',
      title: 'Analiza chemiczna: Skóra ropuchy szarej (Bufotalina i Bufotenina)',
      desc: 'Niezwykły fenomen etologiczny! Jeż zjada ropuchę, ignorując jej toksyny skórne, a część wydzieliny gruczołów przyusznych ropuchy spienia i nanosi na własne kolce! W ten sposób jego kolce stają się trujące dla napastników (tzw. chemiczny pancerz).'
    },
    tobacco: {
      icon: '🍂🦔🫧',
      title: 'Analiza chemiczna: Tytoń / Dym cygara (Nikotyna)',
      desc: 'Jeże w miastach często samosmarują się niedopałkami papierosów lub popiołem. Silny alkaloid (nikotyna) paraliżuje pasożyty bytujące w gęstwinie kolców, przynosząc zwierzęciu ulgę od świądu.'
    }
  };

  let currentScent = 'mint';

  scentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      scentBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentScent = btn.getAttribute('data-hedgehog-scent');
      const data = scentData[currentScent];
      if (!data) return;

      if (iconEl) iconEl.textContent = data.icon;
      titleEl.textContent = data.title;
      if (descEl) descEl.textContent = data.desc;
      if (statusEl) statusEl.textContent = `Wykryto zapach: ${data.title.split(':')[1].trim()}`;
    });
  });

  triggerBtn?.addEventListener('click', () => {
    if (!statusEl) return;
    statusEl.textContent = '🫧 Jeż intensywnie żuje bodziec i pieni ślinę...';
    triggerBtn.disabled = true;

    setTimeout(() => {
      statusEl.textContent = '👅 Wygięcie w łuk! Nanoszenie białej piany na kolce grzbietu!';
    }, 1200);

    setTimeout(() => {
      statusEl.textContent = '✅ Pancerz zdezynfekowany i zamaskowany zapachowo!';
      triggerBtn.disabled = false;
    }, 2800);
  });
}

/* ============================================================
   2. ULTRASONIC HEARING & SOUND SYNTHESIZER (Web Audio API)
   ============================================================ */
function initHedgehogAcousticSimulator() {
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

  const litterSlider = document.getElementById('hedgehogLitterSlider');
  const freqDisplay = document.getElementById('hedgehogFrequencyDisplay');
  const playRustleBtn = document.getElementById('playHedgehogRustleBtn');
  const playSnortBtn = document.getElementById('playHedgehogSnortBtn');

  function updateFreqLabel() {
    if (!litterSlider || !freqDisplay) return;
    const val = parseInt(litterSlider.value);
    const freq = (1.5 + (val / 100) * 8.5).toFixed(1);
    freqDisplay.textContent = `Ściółka liściasta: ${freq} kHz (pasmo owadów)`;
  }

  litterSlider?.addEventListener('input', updateFreqLabel);

  // Play insect rustling in leaf litter
  playRustleBtn?.addEventListener('click', () => {
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      const val = parseInt(litterSlider?.value || 50);
      const centerFreq = 1500 + val * 65;

      const bufferSize = ctx.sampleRate * 0.6;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.18;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(centerFreq, ctx.currentTime);
      filter.Q.setValueAtTime(3.5, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch (e) {}
  });

  // Play hedgehog snort / puff warning sound
  playSnortBtn?.addEventListener('click', () => {
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      // Hedgehog huff: 3 rapid guttural bursts
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(160, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(75, ctx.currentTime + 0.14);
          gain.gain.setValueAtTime(0.35, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.14);
        }, i * 160);
      }
    } catch (e) {}
  });
}

/* ============================================================
   3. HEDGEHOG ANATOMY & BIOMECHANICS INSPECTOR
   ============================================================ */
function initHedgehogAnatomyInspector() {
  const buttons = document.querySelectorAll('[data-hedgehog-anatomy]');
  const titleEl = document.getElementById('hedgehogAnatomyTitle');
  const descEl = document.getElementById('hedgehogAnatomyDesc');
  const statEl = document.getElementById('hedgehogAnatomyStat');

  if (!buttons.length || !titleEl) return;

  const data = {
    spines: {
      title: 'Kolce Keratynowe i Mięsień Okrężny (Panniculus Carnosus)',
      desc: 'Dorosły jeż nosi na grzbiecie od 5000 do 7000 kolców. Każdy kolec to zmodyfikowany, pusty w środku włos wzmocniony podłużnymi komorami powietrznymi. Pod kolcami kryje się mięsień okrężny, który zaciska pancerz dookoła bezbronnego brzucha jak ściągacz worka.',
      stat: 'Liczba kolców: 5000 – 7000 sztuk (amortyzacja upadku)'
    },
    ears: {
      title: 'Uszy i Słuch Ultradźwiękowy (Odbiór do 45 kHz)',
      desc: 'Małe, zaokrąglone uszy jeża są wrażliwe na wysokie częstotliwości. Pozwalają usłyszeć chrobot nóżek biegacza skórzastego lub piszczenie pędraka pod warstwą ziemi i opadłych liści.',
      stat: 'Zakres słuchu: 250 Hz – 45 000 Hz'
    },
    jacobson: {
      title: 'Narząd Lemieszowo-Nosowy Jacobsona (Chemorecepcja)',
      desc: 'Umieszczony w podniebieniu narząd Jacobsona analizuje cząsteczki zapachowe i feromony rozpuszczone w ślinie. To on wyzwala u jeża odruch obfitego ślinienia się i samosmarowania pianą (self-anointing).',
      stat: 'Funkcja: Rozpoznawanie toksyn, feromonów i kamuflażu'
    },
    snout: {
      title: 'Wilgotna Trufla Węchowa i Wibrysy Czynne',
      desc: 'Ciągle wilgotny nos rejestruje zapachy z odległości kilkunastu metrów. Długie wibrysy (włosy czuciowe) wokół pyszczka badają szczeliny w ziemi i pod korzeniami drzew, zastępując słaby wzrok zwierzęcia.',
      stat: 'Węch: Główny zmysł nawigacji i żerowania'
    },
    paws: {
      title: 'Krótkie Łapy z Silnymi Pazurami Grzebnymi',
      desc: 'Przednie łapy jeża wyposażone są w 5 mocnych palców z zakrzywionymi pazurami przystosowanymi do rozgrzebywania zbitej darni, kory i kompostu w poszukiwaniu tłustych pędraków chrabąszczy.',
      stat: 'Dystans nocny: 2 do 3 kilometrów patrolu'
    }
  };

  function selectPart(key) {
    buttons.forEach(b => {
      if (b.getAttribute('data-hedgehog-anatomy') === key) {
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
      const key = btn.getAttribute('data-hedgehog-anatomy');
      selectPart(key);
    });
  });
}

/* ============================================================
   4. CRISIS SIMULATOR: POMOC JEŻOWI W OGRODZIE
   ============================================================ */
function initHedgehogCrisisSimulator() {
  const cards = document.querySelectorAll('.hedgehog-crisis-card');
  const resultBox = document.getElementById('hedgehogCrisisResult');
  if (!cards.length || !resultBox) return;

  const responses = {
    give_milk: {
      type: 'danger',
      title: '❌ ŚMIERTELNY BŁĄD: Krowie mleko to wyrok śmierci!',
      text: 'Jeże nie posiadają enzymu laktazy. Podanie krowiego mleka wywołuje piorunującą biegawkę, martwicze zapalenie jelit i odwodnienie, które w ciągu kilkudziesięciu godzin zabija zwierzę. Jeżom podajemy wyłącznie czystą wodę w płytkiej miseczce!'
    },
    ignore: {
      type: 'danger',
      title: '❌ BŁĄD: Jeż o wadze 250g w październiku nie przeżyje zimy!',
      text: 'Jeż ważący 250 g to młode, które nie zgromadziło zapasów tłuszczu brunatnego. Do bezpiecznej hibernacji w listopadzie potrzebuje minimum 600–700 gramów. Pozostawiony sam sobie zamarznie lub umrze z wycieńczenia.'
    },
    secure_box: {
      type: 'success',
      title: '✅ WZOROWY PROTOKÓŁ RATUNKOWY:',
      text: '1. Umieść malucha w wysokim kartonie wyścielonym ręcznikami papierowymi.<br>2. Obok połóż plastikową butelkę z ciepłą (nie wrzącą!) wodą owiniętą w szmatkę, by się ogrzał.<br>3. Podaj miseczkę z wodą i odrobinę mięsnej karmy dla kociąt.<br>4. Skontaktuj się z najbliższym <em>Ośrodkiem Rehabilitacji Jeży</em> (np. Polskie Stowarzyszenie Ochrony Jeży „Nasze Jeże” lub Jeżurkowo).'
    },
    spray_tick: {
      type: 'danger',
      title: '❌ BŁĄD: Preparaty dla psów mogą zabić jeża!',
      text: 'Wiele domowych środków na pchły i kleszcze dla psów (zwłaszcza permetryna czy fipronil w niewłaściwych dawkach) jest wysoce toksycznych dla jeży i powoduje niewydolność neurologiczną. Odpchlenie i odkleszczenie powinien przeprowadzić weterynarz lub ośrodek.'
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
   5. 10-LEVEL MINIGAME: NOCNA WYPRAWA JEŻA W OGRODZIE
   ============================================================ */
function initHedgehogForagingGame() {
  const canvas = document.getElementById('hedgehogGameCanvas');
  const overlay = document.getElementById('hedgehogGameOverlay');
  const startBtn = document.getElementById('startHedgehogGameBtn');
  const nextBtn = document.getElementById('nextHedgehogLevelBtn');
  const restartBtn = document.getElementById('restartHedgehogGameBtn');
  const resetBtn = document.getElementById('resetHedgehogCampaignBtn');
  const curlUpBtn = document.getElementById('curlUpToggleBtn');

  const foodVal = document.getElementById('hedgehogGameFood');
  const timerVal = document.getElementById('hedgehogGameTimer');
  const modeVal = document.getElementById('hedgehogGameMode');
  const levelBadge = document.getElementById('hedgehogGameLevelBadge');
  const levelDotsContainer = document.getElementById('hedgehogGameLevelDots');
  const overlayIcon = document.getElementById('hedgehogGameOverIcon');
  const overlayTitle = document.getElementById('hedgehogGameOverTitle');
  const overlayDesc = document.getElementById('hedgehogGameOverDesc');

  if (!canvas || !overlay || !startBtn) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.clientWidth || 500);
  let height = (canvas.height = canvas.clientHeight || 340);

  window.addEventListener('resize', () => {
    if (!canvas) return;
    width = canvas.width = canvas.clientWidth || 500;
    height = canvas.height = canvas.clientHeight || 340;
  });

  // 10 Progressive Garden Nights
  const levels = [
    {
      name: 'Cichy Sad Jabłoniowy 🍎🦔',
      desc: 'Pierwsza wyprawa w sadzie. Zbieraj ślimaki i chrząszcze na trawniku. Poruszaj kursorem lub dotknij ekranu.',
      time: 40,
      targetFood: 4,
      mowers: 0,
      foodSpeed: 0.4
    },
    {
      name: 'Przydomowy Warzywnik 🥕',
      desc: 'Wśród grządek marchwi i sałaty czają się tłuste pędraki. Zdobądź zapas energii.',
      time: 38,
      targetFood: 5,
      mowers: 0,
      foodSpeed: 0.6
    },
    {
      name: 'Sterta Suchych Liści 🍂',
      desc: 'Szeleszczące poszycie! Trop chrząszcze i dżdżownice pod warstwą dębowych liści.',
      time: 36,
      targetFood: 5,
      mowers: 0,
      foodSpeed: 0.8
    },
    {
      name: 'Nocny Deszcz i Dżdżownice 🌧️',
      desc: 'Mokra trawa i chłód. Dżdżownice wychodzą na powierzchnię — poruszają się szybciej!',
      time: 35,
      targetFood: 6,
      mowers: 0,
      foodSpeed: 1.0
    },
    {
      name: 'Ogród z Robotem Koszącym 🤖⚠️',
      desc: 'Uwaga! Na trawniku jeździ kosiarka automatyczna. Gdy się zbliża, przytrzymaj Spację lub przycisk, by zwinąć się w kulkę!',
      time: 35,
      targetFood: 6,
      mowers: 1,
      foodSpeed: 1.0
    },
    {
      name: 'Kompostownik Pełen Pędraków 🪱',
      desc: 'Prawdziwa uczta! Duże pędraki w pobliżu kompostu, ale czas ucieka szybko przed świtem.',
      time: 32,
      targetFood: 7,
      mowers: 1,
      foodSpeed: 1.2
    },
    {
      name: 'Mglista Polana Leśna 🌫️',
      desc: 'Wzrok jest zamglony — polegaj na węchu! Dwa roboty patrolują teren.',
      time: 32,
      targetFood: 7,
      mowers: 2,
      foodSpeed: 1.2
    },
    {
      name: 'Ogródki Działkowe i Wąskie Płoty 🏡',
      desc: 'Labirynt siatek ogrodzeniowych. Wymaga zwinnego lawirowania i obrony przed przeszkodami.',
      time: 30,
      targetFood: 8,
      mowers: 2,
      foodSpeed: 1.4
    },
    {
      name: 'Listopadowy Przymrozek ❄️',
      desc: 'Ziemia zamarza! Zdobądź ostatnie kalorie, by osiągnąć wymaganą wagę 700g przed hibernacją.',
      time: 30,
      targetFood: 8,
      mowers: 2,
      foodSpeed: 1.5
    },
    {
      name: 'Wielki Finał: Bezpieczne Zimowisko 👑🦔',
      desc: 'Finałowa noc jesieni! Zbierz 9 owadów, unikaj zagrożeń i bezpiecznie zapadnij w zimowy sen!',
      time: 28,
      targetFood: 9,
      mowers: 3,
      foodSpeed: 1.6
    }
  ];

  let currentLevelIdx = 0;
  let isPlaying = false;
  let timeLeft = 40;
  let timerInterval = null;
  let animId = null;
  let eatenCount = 0;

  // Hedgehog Player
  let hedgehog = {
    x: 100,
    y: 150,
    radius: 18,
    isCurled: false,
    targetX: 100,
    targetY: 150
  };

  // Entities
  let foods = [];
  let mowers = [];

  function spawnLevelEntities() {
    const lvl = levels[currentLevelIdx];
    foods = [];
    mowers = [];

    // Food (Snails & Beetles)
    const foodEmojis = ['🐌', '🪲', '🪱', '🐛'];
    for (let i = 0; i < lvl.targetFood; i++) {
      foods.push({
        x: 60 + Math.random() * (width - 120),
        y: 60 + Math.random() * (height - 120),
        vx: (Math.random() - 0.5) * lvl.foodSpeed * 1.5,
        vy: (Math.random() - 0.5) * lvl.foodSpeed * 1.5,
        radius: 14,
        emoji: foodEmojis[Math.floor(Math.random() * foodEmojis.length)],
        eaten: false
      });
    }

    // Robotic Lawn Mowers
    for (let i = 0; i < lvl.mowers; i++) {
      mowers.push({
        x: width - 80 - i * 60,
        y: 80 + i * 80,
        vx: (Math.random() > 0.5 ? 1 : -1) * (1.6 + i * 0.4),
        vy: (Math.random() > 0.5 ? 1 : -1) * (1.4 + i * 0.4),
        radius: 20
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
    if (foodVal) foodVal.textContent = `${eatenCount} / ${lvl.targetFood}`;
    if (timerVal) timerVal.textContent = `${timeLeft}s`;
    if (modeVal) {
      if (hedgehog.isCurled) {
        modeVal.textContent = window.t ? window.t('Pancerz / Kula 🛡️') : 'Pancerz / Kula 🛡️';
        modeVal.style.color = '#F59E0B';
      } else {
        modeVal.textContent = window.t ? window.t('Eksploracja 🦔') : 'Eksploracja 🦔';
        modeVal.style.color = '#10B981';
      }
    }
  }

  function handlePointer(e) {
    if (!isPlaying) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    hedgehog.targetX = Math.max(25, Math.min(width - 25, clientX - rect.left));
    hedgehog.targetY = Math.max(25, Math.min(height - 25, clientY - rect.top));
  }

  canvas.addEventListener('mousemove', handlePointer);
  canvas.addEventListener('touchstart', (e) => { e.preventDefault(); handlePointer(e); }, { passive: false });
  canvas.addEventListener('touchmove', (e) => { e.preventDefault(); handlePointer(e); }, { passive: false });

  // Spacebar to curl up into spiny ball
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && isPlaying) {
      e.preventDefault();
      hedgehog.isCurled = true;
      updateHUD();
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'Space' && isPlaying) {
      e.preventDefault();
      hedgehog.isCurled = false;
      updateHUD();
    }
  });

  // Mobile curl up button
  if (curlUpBtn) {
    const startCurl = (e) => {
      e.preventDefault();
      hedgehog.isCurled = true;
      curlUpBtn.classList.add('active');
      updateHUD();
    };
    const endCurl = (e) => {
      e.preventDefault();
      hedgehog.isCurled = false;
      curlUpBtn.classList.remove('active');
      updateHUD();
    };
    curlUpBtn.addEventListener('mousedown', startCurl);
    curlUpBtn.addEventListener('mouseup', endCurl);
    curlUpBtn.addEventListener('touchstart', startCurl, { passive: false });
    curlUpBtn.addEventListener('touchend', endCurl, { passive: false });
  }

  function startGame(lvlIdx = 0) {
    currentLevelIdx = lvlIdx;
    const lvl = levels[currentLevelIdx];
    isPlaying = true;
    timeLeft = lvl.time;
    eatenCount = 0;
    hedgehog.x = width / 2;
    hedgehog.y = height / 2;
    hedgehog.targetX = width / 2;
    hedgehog.targetY = height / 2;
    hedgehog.isCurled = false;

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
        endGame(false, '⏱️ Świt nadszedł!', 'Słońce wzeszło, a jeż nie zebrał wystarczająco dużo kalorii. Spróbuj ponownie tej nocy!');
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
      if (overlayIcon) overlayIcon.textContent = '🎉🦔⭐';
      startBtn.style.display = 'none';
      restartBtn.style.display = 'none';

      if (currentLevelIdx < levels.length - 1) {
        nextBtn.style.display = 'inline-block';
        resetBtn.style.display = 'none';
      } else {
        nextBtn.style.display = 'none';
        resetBtn.style.display = 'inline-block';
        if (overlayTitle) overlayTitle.textContent = window.t ? window.t('🏆 MISTRZ PRZETRWANIA JEŻA!') : '🏆 MISTRZ PRZETRWANIA JEŻA!';
        if (overlayDesc) overlayDesc.textContent = window.t ? window.t('Ukończyłeś wszystkie 10 nocy! Twój jeż osiągnął wagę 850g i bezpiecznie zapadł w hibernację w stercie liści.') : 'Ukończyłeś wszystkie 10 nocy! Twój jeż osiągnął wagę 850g i bezpiecznie zapadł w hibernację w stercie liści.';
      }
    } else {
      if (overlayIcon) overlayIcon.textContent = '⚠️🦔💔';
      startBtn.style.display = 'none';
      nextBtn.style.display = 'none';
      restartBtn.style.display = 'inline-block';
      resetBtn.style.display = 'none';
    }
  }

  function gameLoop() {
    if (!isPlaying) return;

    // Smooth movement towards target if not curled
    if (!hedgehog.isCurled) {
      hedgehog.x += (hedgehog.targetX - hedgehog.x) * 0.12;
      hedgehog.y += (hedgehog.targetY - hedgehog.y) * 0.12;
    }

    // Update foods
    foods.forEach(f => {
      if (f.eaten) return;
      f.x += f.vx;
      f.y += f.vy;
      if (f.x < 30 || f.x > width - 30) f.vx *= -1;
      if (f.y < 30 || f.y > height - 30) f.vy *= -1;

      // Check collision with hedgehog (only if not curled)
      if (!hedgehog.isCurled) {
        const dist = Math.hypot(hedgehog.x - f.x, hedgehog.y - f.y);
        if (dist < hedgehog.radius + f.radius) {
          f.eaten = true;
          eatenCount++;
          updateHUD();

          const lvl = levels[currentLevelIdx];
          if (eatenCount >= lvl.targetFood) {
            endGame(true, `🎉 Zwycięstwo! Ukończono Poziom ${currentLevelIdx + 1}!`, `Jeż zjadł ${lvl.targetFood} pożywnych owadów i zgromadził cenny zapas energii.`);
          }
        }
      }
    });

    // Update mowers
    mowers.forEach(m => {
      m.x += m.vx;
      m.y += m.vy;
      if (m.x < 30 || m.x > width - 30) m.vx *= -1;
      if (m.y < 30 || m.y > height - 30) m.vy *= -1;

      // Check collision with hedgehog
      const dist = Math.hypot(hedgehog.x - m.x, hedgehog.y - m.y);
      if (dist < hedgehog.radius + m.radius) {
        if (!hedgehog.isCurled) {
          endGame(false, '💥 Uwaga na kosiarkę!', 'Kosiarka automatyczna zaskoczyła jeża podczas marszu! Gdy słyszysz silnik, natychmiast zwiń się w najeżoną kulkę pancerza.');
        } else {
          // Curled up! Bounce mower back safely!
          m.vx *= -1;
          m.vy *= -1;
        }
      }
    });

    // Render
    renderCanvas();
    animId = requestAnimationFrame(gameLoop);
  }

  function renderCanvas() {
    ctx.clearRect(0, 0, width, height);

    // Night Garden Background
    ctx.fillStyle = '#060B12';
    ctx.fillRect(0, 0, width, height);

    // Grass Tuft Accents
    ctx.fillStyle = '#0D201A';
    for (let i = 40; i < width; i += 70) {
      ctx.beginPath();
      ctx.arc(i, height - 20, 25, Math.PI, 0);
      ctx.fill();
    }

    // Render Mowers
    mowers.forEach(m => {
      ctx.save();
      ctx.fillStyle = '#DC2626';
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#F87171';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Blade Warning Text / Icon
      ctx.fillStyle = '#FFF';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🤖', m.x, m.y);
      ctx.restore();
    });

    // Render Foods
    foods.forEach(f => {
      if (f.eaten) return;
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(f.emoji, f.x, f.y);
    });

    // Render Hedgehog
    ctx.save();
    if (hedgehog.isCurled) {
      // Curled Ball with radiating spikes
      ctx.fillStyle = '#451A03';
      ctx.beginPath();
      ctx.arc(hedgehog.x, hedgehog.y, hedgehog.radius + 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Radiating spikes
      ctx.strokeStyle = '#FCD34D';
      ctx.lineWidth = 2;
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
        const sx = hedgehog.x + Math.cos(a) * (hedgehog.radius + 2);
        const sy = hedgehog.y + Math.sin(a) * (hedgehog.radius + 2);
        const ex = hedgehog.x + Math.cos(a) * (hedgehog.radius + 8);
        const ey = hedgehog.y + Math.sin(a) * (hedgehog.radius + 8);
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.stroke();
      }

      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🛡️', hedgehog.x, hedgehog.y);
    } else {
      // Active Walking Hedgehog
      ctx.fillStyle = '#78350F';
      ctx.beginPath();
      ctx.ellipse(hedgehog.x, hedgehog.y, hedgehog.radius + 4, hedgehog.radius, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Snout
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.arc(hedgehog.x + 14, hedgehog.y + 2, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(hedgehog.x + 18, hedgehog.y + 2, 3, 0, Math.PI * 2);
      ctx.fill();

      // Spines
      ctx.strokeStyle = '#FCD34D';
      ctx.lineWidth = 2;
      for (let i = -10; i <= 6; i += 4) {
        ctx.beginPath();
        ctx.moveTo(hedgehog.x + i, hedgehog.y - 10);
        ctx.lineTo(hedgehog.x + i - 4, hedgehog.y - 18);
        ctx.stroke();
      }
    }
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
function initHedgehogQuiz() {
  const quizBody = document.getElementById('hedgehogQuizDynamicBody');
  const progressBar = document.getElementById('hedgehogQuizMeterProgress');
  if (!quizBody || !progressBar) return;

  const questions = [
    {
      q: 'Dlaczego krowie mleko jest śmiertelnie niebezpieczne dla jeża?',
      options: [
        'Ponieważ zawiera za dużo tłuszczu i jeż nie może się zwinąć w kulkę',
        'Jeże nie wytwarzają laktazy — mleko wywołuje ciężką, odwadniającą biegawkę i martwicę jelit',
        'Mleko przyciąga lisy, które polują na jeże',
        'Mleko zmiękcza keratynę w kolcach jeża'
      ],
      correct: 1,
      explanation: 'Dorosłe i małe jeże nie trawią cukru mlecznego (laktozy). Podanie miski z mlekiem to najczęstszy, tragiczny w skutkach błąd ludzi. Jeżom należy podawać wyłącznie czystą wodę!'
    },
    {
      q: 'Co robi jeż podczas zjawiska tzw. samosmarowania (self-anointing)?',
      options: [
        'Zanurza się w błocie, by schłodzić organizm w upalny dzień',
        'Żuje intensywny zapach, spienia ślinę i językiem nanosi białą pianę na swoje kolce',
        'Ociera się o sierść psa, by przejąć jego zapach',
        'Czyści kolce za pomocą rosy z porannych traw'
      ],
      correct: 1,
      explanation: 'Samosmarowanie (self-anointing) to fascynujący odruch wyzwalany przez narząd Jacobsona. Piana maskuje zapach zwierzęcia oraz nanosi na kolce substancje odstraszające kleszcze i drapieżniki.'
    },
    {
      q: 'Dzięki jakiemu białku jeż jest odporny na jad żmii zygzakowatej?',
      options: [
        'Mioglobinie',
        'Erinaceinie — inhibitorowi krwotocznych metaloproteinaz jadu',
        'Hemoglobinie typu B',
        'Keratynie we krwi'
      ],
      correct: 1,
      explanation: 'Białko erinaceina obecne w osoczu krwi jeża neutralizuje enzymy jadu żmii niszczące tkanki i naczynia krwionośne, dzięki czemu jeż może bezpiecznie polować na żmije.'
    },
    {
      q: 'Ile minimalnie powinien ważyć młody jeż w listopadzie, aby bezpiecznie przetrwać hibernację?',
      options: [
        'Około 150–200 gramów',
        'Minimum 600–700 gramów',
        'Co najmniej 2 kilogramy',
        'Waga nie ma żadnego znaczenia'
      ],
      correct: 1,
      explanation: 'Zimowy sen trwa do 5 miesięcy. Jeż ważący poniżej 600g (a zwłaszcza poniżej 400g) nie posiada wystarczającego zapasu tłuszczu brunatnego i bez pomocy człowieka zamarznie lub umrze z głodu.'
    },
    {
      q: 'Jaka jest prawdziwa natura diety jeża w naturze?',
      options: [
        'Jest roślinożercą i żywi się głównie spadłymi jabłkami i gruszkami',
        'Jest drapieżnym owadożercą — zjada ślimaki, chrząszcze, pędraki, dżdżownice i padlinę',
        'Odżywia się wyłącznie korzonkami traw i grzybami',
        'Żywi się nasionami zbóż i orzechami'
      ],
      correct: 1,
      explanation: 'Jeż jest drapieżnym owadożercą (rząd Eulipotyphla). Opowieść o noszeniu jabłek na kolcach to starożytny mit — przewód pokarmowy jeża nie jest przystosowany do trawienia owoców.'
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
      <div id="hedgehogQuizFeedback"></div>
      <div class="quiz-action-bar" id="hedgehogQuizNextBar" style="display: none; margin-top: 20px;">
        <button class="btn btn-primary" id="hedgehogQuizNextBtn" style="background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);">
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

    const feedbackEl = document.getElementById('hedgehogQuizFeedback');
    const nextBar = document.getElementById('hedgehogQuizNextBar');

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
    document.getElementById('hedgehogQuizNextBtn').addEventListener('click', () => {
      currentIdx++;
      renderQuestion();
    });
  }

  function renderSummary() {
    progressBar.style.width = '100%';
    const percent = Math.round((score / questions.length) * 100);

    let rankTitle = 'Przyjaciel i Obrońca Jeży 🦔';
    let badgeEmoji = '👑';
    let rankDesc = 'Znakomicie! Wiesz, dlaczego mleko to trucizna, jak działa samosmarowanie pianą i jak chronić jeże przed kosiarkami.';

    if (percent < 80 && percent >= 60) {
      rankTitle = 'Świadomy Ogrodnik 🌿';
      badgeEmoji = '🎖️';
      rankDesc = 'Bardzo dobry wynik! Pamiętaj o krytycznej wadze 600g przed hibernacją i bezpiecznych stertach liści.';
    } else if (percent < 60) {
      rankTitle = 'Adept Świata Jeży 📚';
      badgeEmoji = '🦔';
      rankDesc = 'Warto przejrzeć sekcję pierwszej pomocy i zmysłów — jeże to fascynujące i delikatne zwierzęta!';
    }

    quizBody.innerHTML = `
      <div class="quiz-certificate">
        <div class="certificate-badge-emoji">${badgeEmoji}</div>
        <div class="certificate-score">${score} / ${questions.length}</div>
        <h3 class="certificate-title">${window.t ? window.t(rankTitle) : rankTitle}</h3>
        <p class="certificate-desc">${window.t ? window.t(rankDesc) : rankDesc}</p>
        <button class="btn btn-primary" id="hedgehogQuizRestartBtn" style="background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);">Rozwiąż quiz ponownie ↺</button>
      </div>
    `;

    document.getElementById('hedgehogQuizRestartBtn').addEventListener('click', () => {
      currentIdx = 0;
      score = 0;
      renderQuestion();
    });
  }

  renderQuestion();
}

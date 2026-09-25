/* ============================================================
   Wolf Simulators — Świat zmysłami zwierząt
   Author: Dorian Kalinowski
   Features:
   1. Web Audio Synthesizer (Solo Howl, Pack Chorus, Warning Bark)
   2. Interactive Anatomy Inspector (5 Pinned Hotspots)
   3. Forest Encounter Crisis Decision Simulator
   4. Multi-Level Canvas Mini-Game: „Zew Watahy — Nocny Szlak Wilka”
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initWolfAudioSynth();
  initWolfAnatomyInspector();
  initWolfCrisisSimulator();
  initWolfTrackingGame();
});

/* ============================================================
   1. WEB AUDIO SYNTHESIZER: WOLF HOWL & PACK VOICES
   ============================================================ */
function initWolfAudioSynth() {
  const soloBtn = document.getElementById('playWolfSoloHowlBtn');
  const chorusBtn = document.getElementById('playWolfPackChorusBtn');
  const barkBtn = document.getElementById('playWolfWarningBarkBtn');
  const statusEl = document.getElementById('wolfSoundStatus');

  if (!soloBtn || !chorusBtn || !barkBtn) return;

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

  // --- Sound 1: Solo Howl (Piękne, narastające wycie solo) ---
  soloBtn.addEventListener('click', () => {
    const ctx = getAudioCtx();
    if (!ctx) return;

    soloBtn.classList.add('playing');
    if (statusEl) statusEl.textContent = '🔊 Odtwarzanie: Wycie lokalizacyjne solo (częstotliwość 240–480 Hz)...';

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Lowpass filter to give organic, throat resonance
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, now);
    filter.Q.setValueAtTime(3, now);

    // Pitch envelope: starts at 240 Hz, swells to 460 Hz, vibrato, falls to 280 Hz
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(450, now + 1.2);
    osc.frequency.setValueAtTime(450, now + 2.5);
    osc.frequency.exponentialRampToValueAtTime(260, now + 4.2);

    // Vibrato LFO
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(5.5, now); // 5.5 Hz natural wolf vibrato
    lfoGain.gain.setValueAtTime(12, now);
    lfo.connect(osc.frequency);
    lfo.start(now + 0.8);
    lfo.stop(now + 4.2);

    // Volume envelope
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.2, now + 1.0);
    gain.gain.setValueAtTime(0.2, now + 2.6);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 4.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 4.4);

    setTimeout(() => {
      soloBtn.classList.remove('playing');
      if (statusEl) statusEl.textContent = 'Gotowy do odsłuchu.';
    }, 4500);
  });

  // --- Sound 2: Pack Chorus (Chór watahy - polifonia 3 wilków) ---
  chorusBtn.addEventListener('click', () => {
    const ctx = getAudioCtx();
    if (!ctx) return;

    chorusBtn.classList.add('playing');
    if (statusEl) statusEl.textContent = '🔊 Odtwarzanie: Polifoniczny chór watahy (harmoniczne rozbicie fal)...';

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.18, now);
    masterGain.connect(ctx.destination);

    // 3 wolves howling at different base frequencies and start times
    const wolves = [
      { start: 0, baseFreq: 260, peakFreq: 440, duration: 4.8, type: 'sawtooth' },
      { start: 0.6, baseFreq: 310, peakFreq: 520, duration: 4.2, type: 'triangle' },
      { start: 1.2, baseFreq: 210, peakFreq: 360, duration: 3.8, type: 'sawtooth' }
    ];

    wolves.forEach(w => {
      const wTime = now + w.start;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(700, wTime);

      osc.type = w.type;
      osc.frequency.setValueAtTime(w.baseFreq, wTime);
      osc.frequency.exponentialRampToValueAtTime(w.peakFreq, wTime + 1.2);
      osc.frequency.exponentialRampToValueAtTime(w.baseFreq * 0.95, wTime + w.duration - 0.2);

      gain.gain.setValueAtTime(0.001, wTime);
      gain.gain.exponentialRampToValueAtTime(0.12, wTime + 0.8);
      gain.gain.setValueAtTime(0.12, wTime + w.duration - 1.0);
      gain.gain.exponentialRampToValueAtTime(0.001, wTime + w.duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start(wTime);
      osc.stop(wTime + w.duration);
    });

    setTimeout(() => {
      chorusBtn.classList.remove('playing');
      if (statusEl) statusEl.textContent = 'Gotowy do odsłuchu.';
    }, 5600);
  });

  // --- Sound 3: Warning Bark / Huff (Stłumione szczeknięcie ostrzegawcze przed człowiekiem) ---
  barkBtn.addEventListener('click', () => {
    const ctx = getAudioCtx();
    if (!ctx) return;

    barkBtn.classList.add('playing');
    if (statusEl) statusEl.textContent = '🔊 Odtwarzanie: Głuche „Hau!” — sygnał matki do młodych (człowiek w pobliżu)...';

    const now = ctx.currentTime;

    // Deep chest thump
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.18);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);

    // Breathy air puff (noise burst)
    const bufferSize = ctx.sampleRate * 0.18;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(450, now);
    noiseFilter.Q.setValueAtTime(1.5, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.2, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(now);

    setTimeout(() => {
      barkBtn.classList.remove('playing');
      if (statusEl) statusEl.textContent = 'Gotowy do odsłuchu.';
    }, 1200);
  });
}

/* ============================================================
   2. ANATOMY & BIOMECHANICS INSPECTOR (5 PINNED HOTSPOTS)
   ============================================================ */
function initWolfAnatomyInspector() {
  const hotspots = document.querySelectorAll('.wolf-hotspot');
  const titleEl = document.getElementById('wolfHotspotTitle');
  const descEl = document.getElementById('wolfHotspotDesc');
  const tipEl = document.getElementById('wolfHotspotTip');
  const tierEl = document.getElementById('wolfHotspotTier');

  if (!hotspots.length || !titleEl) return;

  const data = {
    jaws: {
      title: 'Szczęki i Kły — Miażdżący nacisk do 15 kg/cm²',
      tier: 'danger',
      tierLabel: '🦴 Biomechanika oręża',
      desc: 'Nacisk szczęk dorosłego wilka jest dwukrotnie większy niż u dużego owczarka niemieckiego i wynosi aż **15 kg/cm² (1500 kPa)**. Taka siła pozwala wilkowi jednym kłapnięciem skruszyć twarde kości udowe łosia lub jelenia, uzyskując dostęp do bogatego w kalorie szpiku.',
      tip: 'Mimo tak potężnej siły, wilki traktują swoje zęby jak cenny skarb — unikają walki z człowiekiem, bo złamanie kła w puszczy oznacza powolną śmierć głodową.'
    },
    chest: {
      title: 'Klatka Piersiowa Maratończyka — Bieg bez zmęczenia',
      tier: 'safe',
      tierLabel: '🏃 Niezrównana wydolność',
      desc: 'Klatka piersiowa wilka jest wąska i bardzo głęboka, co pozwala przednim łapom poruszać się równolegle w jednej linii bez kołysania tułowiem. Ogromne serce i płuca sprawiają, że wilk może biec tzw. kłusem wilczym z prędkością 8–10 km/h przez **50–70 km bez ani jednej przerwy**!',
      tip: 'Człowiek nie ma szans zmęczyć wilka. Gdy wilk czuje obecność ludzi, po prostu oddala się jednostajnym kłusem na dystans kilku kilometrów.'
    },
    tail: {
      title: 'Ogon (Polano) — Barometr emocji noszony nisko',
      tier: 'warning',
      tierLabel: '🐺 Komunikacja wizualna',
      desc: 'Wilczy ogon (zwany przez myśliwych **polanem**) wisi prosto i luźno ku dołowi, sięgając stawu skokowego. W odróżnieniu od wielu psów domowych, wilk NIGDY nie zawija ogona w obwarzanek nad grzbietem. U nasady ogona znajduje się tzw. **gruczoł fiołkowy**, służący do oznaczania terenu.',
      tip: 'Gdy wilk podkula ogon pod brzuch, okazuje szacunek rodzicom w watasze lub sygnalizuje strach przed człowiekiem.'
    },
    paws: {
      title: 'Łapy jak Rakiety Śnieżne — Nacisk zaledwie 100 g/cm²',
      tier: 'safe',
      tierLabel: '❄️ Konstrukcja arktyczna',
      desc: 'Łapy wilka są ogromne (do 12 cm długości u samców), a palce połączone są elastycznymi fałdami skóry (błonami). Dzięki temu masa ciała rozkłada się równomiernie na śniegu: wilk wywiera nacisk zaledwie **100 g na cm²**, podczas gdy dorosły człowiek ponad 450 g/cm². Tam, gdzie człowiek zapada się po pas, wilk biegnie po wierzchu zasp.',
      tip: 'Pomiędzy opuszkami wilk posiada gruczoły zapachowe – każdy krok na śniegu zostawia chemiczną wiadomość dla reszty rodziny.'
    },
    ears: {
      title: 'Uszy z Zimową Barierą — Radar do 15 km i ochrona przed mrozem',
      tier: 'safe',
      tierLabel: '👂 Akustyczna tarcza',
      desc: 'Uszy wilka są krótsze i bardziej zaokrąglone niż u wielu ras psów, a ich wnętrze pokrywa gęsty kożuch sztywnego futra. Zapobiega to utracie ciepła i odmrożeniom w temperaturach sięgających -40°C. Każde ucho obraca się niezależnie, wyłapując pisk myszy pod śniegiem z 50 m i wycie z 15 km.',
      tip: 'Uszy płasko położone w tył połączone z ugiętymi łapami to klasyczny widok wilka, który spostrzegł człowieka i natychmiast cicho się oddala.'
    }
  };

  hotspots.forEach(btn => {
    btn.addEventListener('click', () => {
      hotspots.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const part = btn.dataset.part;
      const info = data[part];
      if (!info) return;

      if (titleEl) titleEl.textContent = info.title;
      if (descEl) descEl.innerHTML = info.desc;
      if (tipEl) tipEl.innerHTML = info.tip;
      if (tierEl) {
        tierEl.className = `hotspot-badge-tier tier-${info.tier}`;
        tierEl.textContent = info.tierLabel;
      }
    });
  });
}

/* ============================================================
   3. FOREST ENCOUNTER CRISIS DECISION SIMULATOR
   ============================================================ */
function initWolfCrisisSimulator() {
  const container = document.getElementById('wolfCrisisSim');
  if (!container) return;

  const options = container.querySelectorAll('.crisis-option-btn');
  const resultCard = document.getElementById('wolfCrisisResult');
  const resultTitle = document.getElementById('wolfCrisisResultTitle');
  const resultDesc = document.getElementById('wolfCrisisResultDesc');

  if (!options.length || !resultCard) return;

  const responses = {
    run: {
      success: false,
      title: '❌ BŁĄD! Nigdy nie rzucaj się do panicznego biegu!',
      desc: 'Ucieczka biegiem wyzwala bezwarunkowy odruch pogoni u każdego drapieżnika na ziemi (od wilka, przez psa, po kota). Choć wilk nie poluje na ludzi, gwałtowny bieg człowieka może wywołać u niego dezorientację i pogoń. Zostań na nogach!'
    },
    stand_speak: {
      success: true,
      title: '✅ IDEALNA REAKCJA! Wilk natychmiast ucieknie w las.',
      desc: 'Wilki są krótkowidzami i z odległości 40 metrów widzą jedynie dwunożny kształt. Gdy uniesiesz ręce (wydasz się większy) i przemówisz głośnym, pewnym, niskim ludzkim głosem: <strong>„Hej! Idź stąd!”</strong> — wilk w ułamku sekundy zidentyfikuje najgroźniejszy dla niego zapach i głos na ziemi: człowieka. W 99,9% przypadków wilk odwróci się i natychmiast ucieknie sprintem.'
    },
    feed: {
      success: false,
      title: '☠️ KARYGODNY BŁĄD! Wyrok śmierci dla wilka!',
      desc: 'Rzucenie jedzenia uczy dzikie zwierzę, że obecność człowieka = darmowy posiłek. To prosta droga do tzw. **habituacji (utraty naturalnego lęku)**. Taki wilk w przyszłości zacznie podchodzić do innych ludzi i ostatecznie zostanie odstrzelony przez służby leśne jako niebezpieczny. NIGDY nie dokarmiaj dzikich zwierząt!'
    },
    play_dead: {
      success: false,
      title: '⚠️ ZŁA STRATEGIA! Udawanie martwego nie ma tu sensu.',
      desc: 'Pozycja żółwia i udawanie martwego to technika stosowana wyłącznie w skrajnych przypadkach ataku niedźwiedzicy broniącej młodych w Tatrach. W przypadku wilka położenie się na ziemi jest błędem — stajesz się mniejszy i nie dajesz wilkowi jasnego sygnału, że jesteś człowiekiem, którego powinien się bać. Stój prosto i mów głośno!'
    }
  };

  options.forEach(btn => {
    btn.addEventListener('click', () => {
      options.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      const action = btn.dataset.action;
      const resp = responses[action];
      if (!resp) return;

      resultCard.style.display = 'block';
      if (resp.success) {
        resultCard.style.borderColor = '#10B981';
        resultCard.style.background = 'rgba(16, 185, 129, 0.08)';
        resultTitle.style.color = '#34D399';
      } else {
        resultCard.style.borderColor = '#EF4444';
        resultCard.style.background = 'rgba(239, 68, 68, 0.08)';
        resultTitle.style.color = '#F87171';
      }

      resultTitle.innerHTML = resp.title;
      resultDesc.innerHTML = resp.desc;
      resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });
}

/* ============================================================
   4. MULTI-LEVEL CANVAS MINI-GAME: „ZEW WATAHY — NOCNY SZLAK”
   ============================================================ */
function initWolfTrackingGame() {
  const canvas = document.getElementById('wolfGameCanvas');
  const overlay = document.getElementById('wolfGameOverlay');
  const startBtn = document.getElementById('startWolfGameBtn');
  const nextBtn = document.getElementById('nextWolfLevelBtn');
  const restartBtn = document.getElementById('restartWolfGameBtn');
  const resetBtn = document.getElementById('resetWolfCampaignBtn');
  const timerVal = document.getElementById('wolfGameTimer');
  const foundVal = document.getElementById('wolfGameFoundCount');
  const radarFill = document.getElementById('wolfGameRadarFill');
  const currentTargetName = document.getElementById('wolfGameTargetName');
  const levelBadge = document.getElementById('wolfGameLevelBadge');
  const levelDotsContainer = document.getElementById('wolfGameLevelDots');
  const overlayIcon = document.getElementById('wolfGameOverIcon');
  const overlayTitle = document.getElementById('wolfGameOverTitle');
  const overlayDesc = document.getElementById('wolfGameOverDesc');

  if (!canvas || !overlay || !startBtn) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.clientWidth || 500);
  let height = (canvas.height = canvas.clientHeight || 360);

  window.addEventListener('resize', () => {
    if (!canvas) return;
    width = canvas.width = canvas.clientWidth;
    height = canvas.height = canvas.clientHeight || 360;
  });

  // Audio beeper
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

  function beep(freq, duration = 0.06, type = 'sine') {
    try {
      const c = getAudioCtx();
      if (!c) return;
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, c.currentTime);
      gain.gain.setValueAtTime(0.08, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start();
      osc.stop(c.currentTime + duration);
    } catch (e) {}
  }

  function playAlertBuzz() {
    beep(120, 0.22, 'sawtooth');
  }

  // 10 Progressive Wilderness Missions Configuration
  const levels = [
    {
      name: 'Młody Wilk w Śnieżnej Puszczy ❄️🌲',
      desc: 'Nauka tropienia zwierzyny pod wiatr w głębokim śniegu. Czyste leśne powietrze, brak ludzi.',
      time: 45,
      bg: '#0B131E',
      accent: 'rgba(56, 189, 248, 0.12)',
      rangeFactor: 0.52,
      hasWind: false,
      targets: [
        { name: '🦌 Ślad stada jeleni', emoji: '🦌', x: 0, y: 0, found: false },
        { name: '🐇 Tropy zająca bielaka', emoji: '🐇', x: 0, y: 0, found: false },
        { name: '🐾 Ślady starszego brata', emoji: '🐾', x: 0, y: 0, found: false }
      ],
      humanThreats: []
    },
    {
      name: 'Brzeg Rzeki San i Przeprawa Przez Bród 🌊🐾',
      desc: 'Przejście doliną rzeki w Bieszczadach. Wytrop bezpieczną płyciznę i ślady zwierzyny.',
      time: 42,
      bg: '#0C1824',
      accent: 'rgba(14, 165, 233, 0.14)',
      rangeFactor: 0.48,
      hasWind: false,
      targets: [
        { name: '🐟 Cień pstrąga w nurcie', emoji: '🐟', x: 0, y: 0, found: false },
        { name: '💧 Bezpieczny kamienisty bród', emoji: '💧', x: 0, y: 0, found: false },
        { name: '🐾 Ślad łapy wydry rzecznej', emoji: '🐾', x: 0, y: 0, found: false }
      ],
      humanThreats: []
    },
    {
      name: 'Dojrzewanie Watahy: Węszenie Jeleni 🦌🌲',
      desc: 'Wytropienie stada jeleni w gęstej buczynie. Ciche poruszanie się po zeszłorocznych liściach.',
      time: 40,
      bg: '#141812',
      accent: 'rgba(34, 197, 94, 0.14)',
      rangeFactor: 0.45,
      hasWind: false,
      targets: [
        { name: '🦌 Zdarta kora na pniu', emoji: '🦌', x: 0, y: 0, found: false },
        { name: '🐾 Ciepły trop łani', emoji: '🐾', x: 0, y: 0, found: false },
        { name: '🌿 Gęsty młodnik jodłowy', emoji: '🌿', x: 0, y: 0, found: false },
        { name: '🌾 Polana z ziołami', emoji: '🌾', x: 0, y: 0, found: false }
      ],
      humanThreats: []
    },
    {
      name: 'Skraj Ludzkich Osad — Paniczny Strach 🏘️⚠️',
      desc: 'Przejście skrajem lasu. Unikaj stref ludzkich (latarki, hałas samochodów). Wilk boi się ludzi ponad wszystko!',
      time: 40,
      bg: '#14141E',
      accent: 'rgba(129, 140, 248, 0.14)',
      rangeFactor: 0.42,
      hasWind: false,
      targets: [
        { name: '🌲 Bezpieczny parów leśny', emoji: '🌲', x: 0, y: 0, found: false },
        { name: '🐾 Stare znakowanie watahy', emoji: '🐾', x: 0, y: 0, found: false },
        { name: '💧 Niezamarznięty potok', emoji: '💧', x: 0, y: 0, found: false },
        { name: '🌿 Gęsty młodnik sosnowy', emoji: '🌿', x: 0, y: 0, found: false }
      ],
      humanThreats: [
        { name: 'Światło latarki leśnika', emoji: '🔦', x: 0, y: 0, radius: 45 },
        { name: 'Szczekający pies wiejski', emoji: '🐕', x: 0, y: 0, radius: 42 },
        { name: 'Droga asfaltowa / auta', emoji: '🚗', x: 0, y: 0, radius: 42 }
      ]
    },
    {
      name: 'Nocny Przemarsz Przez Grzbiet Otrytu 🏔️🌙',
      desc: 'Długi nocny kłus granią. Wiatr przynosi zapachy z odległości 3 kilometrów.',
      time: 38,
      bg: '#0E1426',
      accent: 'rgba(168, 85, 247, 0.15)',
      rangeFactor: 0.40,
      hasWind: false,
      targets: [
        { name: '🪨 Skała punkt widokowy', emoji: '🪨', x: 0, y: 0, found: false },
        { name: '🐾 Świeży trop rodzeństwa', emoji: '🐾', x: 0, y: 0, found: false },
        { name: '💨 Powiew czystego wiatru', emoji: '💨', x: 0, y: 0, found: false },
        { name: '🌲 Bezpieczny wąwóz', emoji: '🌲', x: 0, y: 0, found: false }
      ],
      humanThreats: [
        { name: 'Światło schroniska', emoji: '🏡', x: 0, y: 0, radius: 40 }
      ]
    },
    {
      name: 'Granica Terytorium: Obca Wataha na Horyzoncie 🐺🚩',
      desc: 'Granica sąsiedniego terytorium. Zlokalizuj punkty znakowania zapachem (gruczoł fiołkowy) i unikaj konfrontacji.',
      time: 38,
      bg: '#181320',
      accent: 'rgba(234, 179, 8, 0.15)',
      rangeFactor: 0.38,
      hasWind: false,
      targets: [
        { name: '🌲 Pień znakowany zapachem', emoji: '🌲', x: 0, y: 0, found: false },
        { name: '🐾 Znakowanie moczem na śniegu', emoji: '🐾', x: 0, y: 0, found: false },
        { name: '🔊 Echo dalekiego wycia', emoji: '🔊', x: 0, y: 0, found: false },
        { name: '🛡️ Bezpieczna ścieżka odwrotu', emoji: '🛡️', x: 0, y: 0, found: false }
      ],
      humanThreats: [
        { name: 'Zimowy patrol myśliwski', emoji: '🚙', x: 0, y: 0, radius: 45 }
      ]
    },
    {
      name: 'Bieg Maratoński: 50 km Bez Zmęczenia ❄️🏃',
      desc: 'Anatomia maratończyka: wąska klatka piersiowa i elastyczne ścięgna. Wytrop 5 punktów w zamieci!',
      time: 42,
      bg: '#0F1A24',
      accent: 'rgba(56, 189, 248, 0.16)',
      rangeFactor: 0.36,
      hasWind: true,
      targets: [
        { name: '🫎 Trop bieszczadzkiego łosia', emoji: '🫎', x: 0, y: 0, found: false },
        { name: '🐾 Ślad kłusa starszego wilka', emoji: '🐾', x: 0, y: 0, found: false },
        { name: '🌲 Kryjówka pod wykrotem', emoji: '🌲', x: 0, y: 0, found: false },
        { name: '🧊 Zamarznięte oczko wodne', emoji: '🧊', x: 0, y: 0, found: false },
        { name: '🦌 Ciepłe legowisko stada', emoji: '🦌', x: 0, y: 0, found: false }
      ],
      humanThreats: [
        { name: 'Stare wnyki w zaroślach', emoji: '⚠️', x: 0, y: 0, radius: 40 }
      ]
    },
    {
      name: 'Zimowa Zamieć i Zew Watahy 🌪️🐺',
      desc: 'Gwałtowna śnieżyca i silny wiatr boczny! Podążaj za falami wycia watahy i bezpiecznie połącz się z rodziną.',
      time: 42,
      bg: '#0A1822',
      accent: 'rgba(14, 165, 233, 0.18)',
      rangeFactor: 0.34,
      hasWind: true,
      targets: [
        { name: '🐺 Zew rodziców watahy', emoji: '🐺', x: 0, y: 0, found: false },
        { name: '🐾 Trop rodzeństwa', emoji: '🐾', x: 0, y: 0, found: false },
        { name: '🏔️ Skalny przesmyk', emoji: '🏔️', x: 0, y: 0, found: false },
        { name: '🌲 Zimowa ostoja watahy', emoji: '🌲', x: 0, y: 0, found: false },
        { name: '🐺 Bezpieczna nora rodzinna', emoji: '🐺', x: 0, y: 0, found: false }
      ],
      humanThreats: [
        { name: 'Hałas pił spalinowych', emoji: '🪓', x: 0, y: 0, radius: 42 },
        { name: 'Kłusownicze sidła', emoji: '⚠️', x: 0, y: 0, radius: 38 }
      ]
    },
    {
      name: 'Korytarz Ekologiczny: Zielony Most 🌉🦌',
      desc: 'Przejście ponad ruchliwą drogą ekspresową po specjalnym moście dla zwierzyny. Omiń bariery akustyczne!',
      time: 40,
      bg: '#141E18',
      accent: 'rgba(16, 185, 129, 0.18)',
      rangeFactor: 0.32,
      hasWind: true,
      targets: [
        { name: '🌉 Zielone przejście dla zwierząt', emoji: '🌉', x: 0, y: 0, found: false },
        { name: '🐾 Świeży ślad łani', emoji: '🐾', x: 0, y: 0, found: false },
        { name: '🌲 Spokojny zagajnik bukowy', emoji: '🌲', x: 0, y: 0, found: false },
        { name: '💧 Czyste leśne źródlisko', emoji: '💧', x: 0, y: 0, found: false },
        { name: '🐺 Woń przewodnika watahy', emoji: '🐺', x: 0, y: 0, found: false }
      ],
      humanThreats: [
        { name: 'Reflektory ciężarówek', emoji: '💡', x: 0, y: 0, radius: 46 },
        { name: 'Szum autostrady', emoji: '🚗', x: 0, y: 0, radius: 44 }
      ]
    },
    {
      name: 'Noc Pełni: Zjednoczona Wataha Bieszczadzka 🌕🐺👑',
      desc: 'Wielki finał! Pełnia księżyca nad Połoniną Wetlińską. Cała rodzina śpiewa w polifonicznym chórze wolności.',
      time: 45,
      bg: '#10142A',
      accent: 'rgba(56, 189, 248, 0.22)',
      rangeFactor: 0.30,
      hasWind: true,
      targets: [
        { name: '🌕 Połonina w blasku pełni', emoji: '🌕', x: 0, y: 0, found: false },
        { name: '🐺 Mama i tata (para rodzicielska)', emoji: '🐺', x: 0, y: 0, found: false },
        { name: '🐾 Wilcze szczenięta', emoji: '🐾', x: 0, y: 0, found: false },
        { name: '🌲 Odwieczna Puszcza Karpacka', emoji: '🌲', x: 0, y: 0, found: false },
        { name: '👑 Niezłomny Zew Wolności', emoji: '👑', x: 0, y: 0, found: false }
      ],
      humanThreats: [
        { name: 'Światło latarek turystów', emoji: '🔦', x: 0, y: 0, radius: 40 },
        { name: 'Hałas quada w górach', emoji: '🏍️', x: 0, y: 0, radius: 44 }
      ]
    }
  ];

  let currentLevelIdx = 0;
  let currentTargetIndex = 0;
  let isPlaying = false;
  let timeLeft = 45;
  let timerInterval = null;
  let animId = null;
  let digProgress = 0;
  let lastBeepTime = 0;
  let lastThreatBuzz = 0;

  // Player wolf coordinates
  let wolfX = 60;
  let wolfY = 60;
  let targetWolfX = 60;
  let targetWolfY = 60;

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
    foundVal.textContent = `0 / ${lvl.targets.length}`;
    timerVal.textContent = `${lvl.time}s`;
    currentTargetName.textContent = lvl.targets[0].name;
    radarFill.style.width = '0%';
  }

  function randomizePositions() {
    const lvl = levels[currentLevelIdx];
    lvl.targets.forEach((t) => {
      t.x = Math.floor(60 + Math.random() * (width - 120));
      t.y = Math.floor(60 + Math.random() * (height - 120));
      t.found = false;
    });

    lvl.humanThreats.forEach((th) => {
      th.x = Math.floor(80 + Math.random() * (width - 160));
      th.y = Math.floor(80 + Math.random() * (height - 160));
    });
  }

  function handleMove(clientX, clientY) {
    if (!isPlaying) return;
    const rect = canvas.getBoundingClientRect();
    targetWolfX = Math.max(30, Math.min(width - 30, clientX - rect.left));
    targetWolfY = Math.max(30, Math.min(height - 30, clientY - rect.top));
  }

  canvas.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
  canvas.addEventListener('touchmove', (e) => {
    if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  function startLevel(lvlIdx) {
    getAudioCtx();
    currentLevelIdx = lvlIdx;
    const lvl = levels[currentLevelIdx];

    randomizePositions();
    currentTargetIndex = 0;
    timeLeft = lvl.time;
    digProgress = 0;
    isPlaying = true;

    wolfX = 60;
    wolfY = 60;
    targetWolfX = 60;
    targetWolfY = 60;

    overlay.classList.add('hidden');
    updateHUD();

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      timerVal.textContent = `${timeLeft}s`;
      if (timeLeft <= 0) {
        endGame(false);
      }
    }, 1000);

    gameLoop();
  }

  function endGame(isWin) {
    isPlaying = false;
    clearInterval(timerInterval);
    cancelAnimationFrame(animId);
    overlay.classList.remove('hidden');

    startBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    restartBtn.style.display = 'none';
    resetBtn.style.display = 'none';

    const lvl = levels[currentLevelIdx];

    if (isWin) {
      beep(587, 0.1);
      setTimeout(() => beep(880, 0.25), 100);

      if (currentLevelIdx < levels.length - 1) {
        overlayIcon.textContent = '🎉🐺❄️';
        overlayTitle.textContent = `Misja ${currentLevelIdx + 1} Ukończona!`;
        overlayDesc.innerHTML = `
          Pomyślnie ukończyłeś etap <strong>${lvl.name}</strong> w czasie <strong>${lvl.time - timeLeft}s</strong>!<br>
          Twój wilk zachował czujność i uniknął zagrożeń. Kolejne wyzwanie czeka w głębi puszczy!
        `;
        nextBtn.style.display = 'inline-flex';
        restartBtn.style.display = 'inline-flex';
      } else {
        overlayIcon.textContent = '👑🐺🏔️';
        overlayTitle.textContent = 'Prawdziwy Strażnik Puszczy!';
        overlayDesc.innerHTML = `
          <strong>Ukończyłeś całą kampanię wilczego szlaku!</strong><br>
          Wytropiłeś rodzeństwo, bezpiecznie ominąłeś ludzkie osiedla i powróciłeś do bezpiecznej nory watahy. 
          Udowodniłeś, że wilki to mądre zwierzęta rodzinne unikające człowieka!
        `;
        resetBtn.style.display = 'inline-flex';
      }
    } else {
      playAlertBuzz();
      overlayIcon.textContent = '⏰❄️🐺';
      overlayTitle.textContent = 'Zimowy wicher zatarł ślady!';
      overlayDesc.innerHTML = `
        Czas minął na etapie <strong>${lvl.name}</strong>.<br>
        Obserwuj wskaźnik sonaru zapachu i unikaj ludzkich zagrożeń. Spróbuj ponownie!
      `;
      restartBtn.style.display = 'inline-flex';
      if (currentLevelIdx > 0) resetBtn.style.display = 'inline-flex';
    }
  }

  function gameLoop(time) {
    if (!isPlaying) return;

    const lvl = levels[currentLevelIdx];

    // Smooth movement
    wolfX += (targetWolfX - wolfX) * 0.16;
    wolfY += (targetWolfY - wolfY) * 0.16;

    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = lvl.bg;
    ctx.fillRect(0, 0, width, height);

    // Decorative landscape
    ctx.fillStyle = lvl.accent;
    ctx.beginPath();
    ctx.arc(90, 80, 50, 0, Math.PI * 2);
    ctx.arc(width - 100, 90, 60, 0, Math.PI * 2);
    ctx.arc(width * 0.5, height - 70, 70, 0, Math.PI * 2);
    ctx.fill();

    // Wind indicator on level 3
    if (lvl.hasWind) {
      ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.font = '12px var(--font-mono)';
      ctx.textAlign = 'right';
      ctx.fillText('💨 Zawieja śnieżna: 35 km/h →', width - 20, 26);
    }

    // Active Target
    const activeTarget = lvl.targets[currentTargetIndex];
    let virtualTargetX = activeTarget.x;
    let virtualTargetY = activeTarget.y;

    if (lvl.hasWind) {
      virtualTargetX += Math.sin(time * 0.0025) * 18 + 22;
    }

    const dist = Math.hypot(wolfX - virtualTargetX, wolfY - virtualTargetY);
    const maxDist = Math.hypot(width, height);

    // Scent & sound intensity
    const intensity = Math.max(0, 1 - dist / (maxDist * lvl.rangeFactor));
    radarFill.style.width = `${Math.round(intensity * 100)}%`;

    // Audio pulse
    const now = performance.now();
    const intervalMs = Math.max(90, 700 - intensity * 580);
    if (now - lastBeepTime > intervalMs) {
      lastBeepTime = now;
      const beepFreq = 280 + intensity * 550;
      beep(beepFreq, 0.04);
    }

    // Draw Scent Waves
    ctx.save();
    const waveRadius = (now * 0.05) % 65;
    ctx.strokeStyle = `rgba(56, 189, 248, ${Math.max(0.08, intensity * 0.4)})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(activeTarget.x, activeTarget.y, waveRadius + 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Check Human Threats (Lęk przed człowiekiem!)
    lvl.humanThreats.forEach((th) => {
      const thDist = Math.hypot(wolfX - th.x, wolfY - th.y);

      // Warning circle around human threat
      ctx.save();
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(th.x, th.y, th.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Threat Emoji
      ctx.font = '22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(th.emoji, th.x, th.y + 8);

      if (thDist < th.radius) {
        if (now - lastThreatBuzz > 1200) {
          lastThreatBuzz = now;
          playAlertBuzz();
          timeLeft = Math.max(1, timeLeft - 2); // 2 second penalty for fear retreat
        }
        ctx.fillStyle = '#EF4444';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Strach! LUDZIE! ⚠️', wolfX, wolfY - 36);
      }
    });

    // Check Dig / Inspect target
    if (dist < 34) {
      digProgress += 0.025;
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(wolfX, wolfY - 32, 14, 0, Math.PI * 2 * digProgress);
      ctx.lineTo(wolfX, wolfY - 32);
      ctx.fill();

      ctx.fillStyle = '#FFF';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Węszy...', wolfX, wolfY - 38);

      if (digProgress >= 1) {
        activeTarget.found = true;
        digProgress = 0;
        currentTargetIndex++;
        foundVal.textContent = `${currentTargetIndex} / ${lvl.targets.length}`;

        beep(440, 0.1);
        setTimeout(() => beep(659, 0.15), 100);

        if (currentTargetIndex >= lvl.targets.length) {
          endGame(true);
          return;
        } else {
          currentTargetName.textContent = lvl.targets[currentTargetIndex].name;
        }
      }
    } else {
      digProgress = Math.max(0, digProgress - 0.02);
    }

    // Draw Found Items
    lvl.targets.forEach((t) => {
      if (t.found) {
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(t.emoji, t.x, t.y + 8);
      }
    });

    // Draw Player Wolf
    ctx.save();
    ctx.font = '32px sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(56, 189, 248, 0.5)';
    ctx.shadowBlur = 16;
    ctx.fillText('🐺', wolfX, wolfY + 10);
    ctx.restore();

    animId = requestAnimationFrame(gameLoop);
  }

  // Event Listeners
  startBtn.addEventListener('click', () => startLevel(0));
  nextBtn.addEventListener('click', () => startLevel(currentLevelIdx + 1));
  restartBtn.addEventListener('click', () => startLevel(currentLevelIdx));
  resetBtn.addEventListener('click', () => startLevel(0));

  updateHUD();
}

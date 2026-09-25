/* ============================================================
   Cat Sensory Simulators & Safety Interactive Engine
   Author: Dorian Kalinowski for "Świat zmysłami zwierząt"
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initCatPupilSimulator();
  initCatHearingLab();
  initWhiskerFatigueLab();
  initPettingHeatmap();
  initPurrSynthesizer();
  initCatQuiz();
  initCatReflexGame();
});

/* ============================================================
   1. CAT PUPIL & NIGHT VISION SIMULATOR
   ============================================================ */
function initCatPupilSimulator() {
  const luxSlider = document.getElementById('catLuxSlider');
  const luxVal = document.getElementById('catLuxVal');
  const luxDesc = document.getElementById('catLuxDesc');
  const pupil = document.getElementById('catPupilSlit');
  const humanVisionBox = document.getElementById('catCompareHuman');
  const catVisionBox = document.getElementById('catCompareCat');

  if (!luxSlider || !pupil) return;

  function updateLux(val) {
    // val is 0 to 100
    // 0 = dark night (0.01 lux), 100 = bright noon (100,000 lux)
    const factor = val / 100; // 0 to 1

    // Pupil width: at factor 1 (bright) -> width 5px (thin slit)
    // at factor 0 (dark) -> width 170px (full dilated circle)
    const pupilWidth = Math.round(5 + (1 - factor) * 165);
    pupil.style.width = `${pupilWidth}px`;
    pupil.style.borderRadius = factor > 0.4 ? '50%' : '50%';

    // Lux text description
    if (factor > 0.8) {
      luxVal.textContent = '100 000 Lux';
      luxDesc.textContent = '☀️ Bezchmurne słońce w południe — źrenica kota zwęża się 135-krotnie do mikroskopijnej pionowej szczeliny, by nie uszkodzić siatkówki!';
    } else if (factor > 0.4) {
      luxVal.textContent = '500 Lux';
      luxDesc.textContent = '💡 Oświetlenie domowe / zmierzch — źrenica kota ma kształt elipsy migdałowej.';
    } else if (factor > 0.1) {
      luxVal.textContent = '1 Lux';
      luxDesc.textContent = '🌙 Pełnia księżyca — źrenica niemal całkowicie otwarta, tapetum lucidum odbija fotony.';
    } else {
      luxVal.textContent = '0.01 Lux';
      luxDesc.textContent = '🌌 Głęboka noc — gigantyczna okrągła źrenica. Kot potrzebuje 1/6 światła człowieka, by widzieć mysz w trawie!';
    }

    // Update vision comparisons
    if (humanVisionBox && catVisionBox) {
      // Human: at low light, human is nearly pitch black
      const humanBrightness = Math.max(0.04, Math.pow(factor, 1.4));
      humanVisionBox.style.filter = `brightness(${humanBrightness}) contrast(${0.6 + factor * 0.4})`;

      // Cat: Tapetum lucidum amplifies by 6x in low light
      const catBrightness = Math.max(0.45, Math.pow(factor, 0.4));
      catVisionBox.style.filter = `brightness(${catBrightness}) contrast(1.15)`;
    }
  }

  luxSlider.addEventListener('input', (e) => {
    updateLux(parseFloat(e.target.value));
  });

  updateLux(15); // Initial night view
}

/* ============================================================
   2. CAT HEARING & ULTRASOUND LAB (Web Audio API)
   ============================================================ */
function initCatHearingLab() {
  const slider = document.getElementById('catFreqSlider');
  const display = document.getElementById('catFreqDisplay');
  const tag = document.getElementById('catFreqStatusTag');
  const mouseSoundBtn = document.getElementById('toggleMouseSoundBtn');

  if (!slider || !display) return;

  function updateFreq(f) {
    display.textContent = Math.round(f).toLocaleString('pl-PL');

    if (f <= 20000) {
      tag.textContent = '🧑 Słyszy człowiek, pies i kot';
      tag.style.borderColor = 'rgba(6, 182, 212, 0.4)';
      tag.style.color = '#67E8F9';
    } else if (f <= 65000) {
      tag.textContent = '🐕 Pasmo psa i kota (człowiek nie słyszy)';
      tag.style.borderColor = 'rgba(245, 158, 11, 0.4)';
      tag.style.color = '#FCD34D';
    } else {
      tag.textContent = '🐈 SUPERMOC KOTA (do 85 000 Hz) — komunikacja myszy i młodych kociąt!';
      tag.style.borderColor = 'rgba(168, 85, 247, 0.5)';
      tag.style.color = '#D8B4FE';
    }
  }

  slider.addEventListener('input', (e) => {
    updateFreq(parseFloat(e.target.value));
  });

  // Synthesizer for rodent mouse squeak
  let audioCtx = null;
  mouseSoundBtn?.addEventListener('click', () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    // Generate gentle chirps mimicking rodent ultrasonic chatter brought down to human audible spectrum
    const now = audioCtx.currentTime;
    for (let i = 0; i < 4; i++) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      // Chirping sweep
      const startTime = now + i * 0.16;
      osc.frequency.setValueAtTime(6000 + i * 800, startTime);
      osc.frequency.exponentialRampToValueAtTime(14000, startTime + 0.08);

      gain.gain.setValueAtTime(0.08, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.1);
    }

    mouseSoundBtn.classList.add('playing');
    setTimeout(() => mouseSoundBtn.classList.remove('playing'), 800);
  });
}

/* ============================================================
   3. WHISKER FATIGUE INTERACTIVE LAB
   ============================================================ */
function initWhiskerFatigueLab() {
  const cards = document.querySelectorAll('.whisker-bowl-card');
  const visualStatus = document.getElementById('whiskerVisualStatus');
  const alertBox = document.getElementById('whiskerAlertBox');

  if (!cards.length || !visualStatus) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('active-safe', 'active-danger'));

      const type = card.dataset.bowl;
      if (type === 'deep') {
        card.classList.add('active-danger');
        visualStatus.innerHTML = `
          <div style="font-size: 3rem; margin-bottom: 8px;">😿💥</div>
          <div style="font-weight: 700; color: #F87171;">Głęboka, wąska miska: PRZEBODŹCOWANIE!</div>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 6px;">
            Wąsy kota nieustannie ocierają o krawędź miski przy każdym kęsie. Tysiące impulsów bólowych trafiają do mózgu. Kot wyjada tylko środek i drapie w dno miski lub wyciąga karmę łapą na podłogę!
          </p>
        `;
        alertBox.style.background = 'rgba(239, 68, 68, 0.15)';
        alertBox.style.borderColor = '#F43F5E';
        alertBox.innerHTML = '⚠️ <strong>Whisker Fatigue (Zmęczenie wibrysów):</strong> To nie kaprys kota! Głębokie miski wywołują realny ból sensoryczny.';
      } else {
        card.classList.add('active-safe');
        visualStatus.innerHTML = `
          <div style="font-size: 3rem; margin-bottom: 8px;">😻✨</div>
          <div style="font-weight: 700; color: #6EE7B7;">Płaski talerzyk: PEŁEN KOMFORT</div>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 6px;">
            Wibrysy swobodnie rozpościerają się w powietrzu i nie dotykają żadnych ścianek. Kot je spokojnie, bez stresu i zjada całą porcję do końca.
          </p>
        `;
        alertBox.style.background = 'rgba(16, 185, 129, 0.15)';
        alertBox.style.borderColor = '#10B981';
        alertBox.innerHTML = '✅ <strong>Złota zasada opiekuna:</strong> Zawsze podawaj kotu jedzenie na płaskim talerzyku lub szerokiej, płytkiej miseczce ceramicznej.';
      }
    });
  });
}

/* ============================================================
   4. CAT PETTING HEATMAP (TOUCH CONSENT)
   ============================================================ */
function initPettingHeatmap() {
  const buttons = document.querySelectorAll('.pet-zone-btn');
  const title = document.getElementById('petZoneTitle');
  const desc = document.getElementById('petZoneDesc');
  const alertTier = document.getElementById('petZoneTier');

  if (!buttons.length || !title) return;

  const zones = {
    chin: {
      title: 'Pod brodą i policzki (Strefa Euforii)',
      tier: 'safe',
      tierLabel: '🟢 100% Zgody i Błogostan',
      desc: 'W kącikach pyszczka i pod brodą kot ma gruczoły zapachowe wydzielające feromony F3 (feromony zaufania i bezpieczeństwa). Gdy go tam gładzisz, kot sam ociera się o Twoją dłoń i oznacza Cię jako bezpiecznego przyjaciela.'
    },
    ears: {
      title: 'Nasada uszu i czoło',
      tier: 'safe',
      tierLabel: '🟢 Bardzo lubiane',
      desc: 'Obszar między uszami to miejsce, którego kot sam nie może dosięgnąć językiem. Delikatny masaż kciukiem przypomina mu wylizywanie przez kocią matkę w dzieciństwie.'
    },
    back: {
      title: 'Wzdłuż grzbietu (Strefa Umiarkowana)',
      tier: 'warning',
      tierLabel: '🟡 Dozwolone z umiarem (Limit 5–8 powtórzeń)',
      desc: 'Głaskanie po grzbiecie jest akceptowane, ale szybko kumuluje ładunki elektrostatyczne i przebodźcowuje receptory skóry. Gdy zauważysz falowanie skóry lub nerwowe drganie czubka ogona — natychmiast przerwij!'
    },
    belly: {
      title: 'BRZUCH (ŚMIERTELNA PUŁAPKA!)',
      tier: 'danger',
      tierLabel: '🚨 PUŁAPKA BEHAWIORALNA — NIE DOTYKAJ!',
      desc: 'Gdy kot kładzie się na grzbiecie i odsłania miękki brzuch, ludzie myślą: „o, chce głaskania!”. To fundamentalny błąd! Odsłonięcie brzucha to dowód zaufania lub pozycja bojowa (by móc bronić się 4 łapami z pazurami). Dotknięcie brzucha wyzwala natychmiastowy odruch kleszczowy: chwyt pazurami przednich łap, kopanie tylnymi i gryzienie!'
    }
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const z = zones[btn.dataset.zone];
      if (!z) return;

      title.textContent = z.title;
      desc.textContent = z.desc;
      alertTier.textContent = z.tierLabel;
      alertTier.className = `hotspot-badge-tier tier-${z.tier}`;
    });
  });
}

/* ============================================================
   5. CAT PURR SYNTHESIZER (Web Audio API)
   ============================================================ */
function initPurrSynthesizer() {
  const btn = document.getElementById('togglePurrBtn');
  if (!btn) return;

  let audioCtx = null;
  let isPurring = false;
  let osc = null;
  let lfo = null;
  let gainNode = null;

  btn.addEventListener('click', () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    if (!isPurring) {
      // Create Purr Generator:
      // Base frequency 25 Hz to 35 Hz + LFO amplitude modulation at ~20 Hz
      osc = audioCtx.createOscillator();
      lfo = audioCtx.createOscillator();
      gainNode = audioCtx.createGain();
      const lfoGain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(32, audioCtx.currentTime); // 32 Hz healing purr

      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(18, audioCtx.currentTime); // 18 Hz breathing modulation
      lfoGain.gain.setValueAtTime(0.08, audioCtx.currentTime);

      gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);

      lfo.connect(gainNode.gain);
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start();
      lfo.start();

      isPurring = true;
      btn.classList.add('playing');
      btn.innerHTML = '⏸️ Wyłącz generator mruczenia (32 Hz)';
    } else {
      if (osc) {
        osc.stop();
        lfo.stop();
        osc.disconnect();
        lfo.disconnect();
      }
      isPurring = false;
      btn.classList.remove('playing');
      btn.innerHTML = '😻 Uruchom syntezator mruczenia kota (25–150 Hz)';
    }
  });
}

/* ============================================================
   6. INTERACTIVE CAT QUIZ
   ============================================================ */
function initCatQuiz() {
  const quizBody = document.getElementById('catQuizDynamicBody');
  const progressBar = document.getElementById('catQuizMeterProgress');

  if (!quizBody || !progressBar) return;

  const questions = [
    {
      q: 'Dlaczego kot domowy nie jest w stanie poczuć smaku słodkiego?',
      options: [
        'Bo koty nie lubią deserów',
        'Z powodu trwałej mutacji genu Tas1r2 — kot jest bezwzględnym mięsożercą',
        'Bo cukier natychmiast znieczula ich język',
        'Koty czują słodycz lepiej niż ludzie'
      ],
      correct: 1,
      explanation: 'U kotów gen Tas1r2 jest uszkodzonym pseudogenem. Koty jako jedyne spośród udomowionych ssaków nie mają receptorów smaku słodkiego!'
    },
    {
      q: 'Do jakiej częstotliwości sięga słuch kota domowego?',
      options: [
        'Do 20 000 Hz (jak człowiek)',
        'Do 40 000 Hz',
        'Do 65 000 Hz (jak pies)',
        'Aż do 85 000 Hz (znacznie przewyższa słuch psa i człowieka!)'
      ],
      correct: 3,
      explanation: 'Kot słyszy ultradźwięki aż do 85 kHz. Pozwala mu to bezbłędnie namierzać pisk małych gryzoni i młodych kociąt w trawie.'
    },
    {
      q: 'Co oznacza, gdy kot kładzie się na plecach i odsłania brzuch?',
      options: [
        'Prosi o energiczne podrapanie po brzuszku',
        'Pokazuje bezgraniczne zaufanie lub pozycję obronną — dotknięcie grozi atakiem!',
        'Jest głodny i czeka na miskę',
        'Ma gorączkę i chłodzi ciało'
      ],
      correct: 1,
      explanation: 'Odsłonięcie brzucha to dowód zaufania („ufam, że mnie nie skrzywdzisz”) lub gotowość bojowa z użyciem 4 łap. Dotknięcie brzucha wyzwala natychmiastowy odruch obronny!'
    },
    {
      q: 'Która roślina jest dla kota ŚMIERTELNĄ trucizną nawet w ilości ziarenka pyłku?',
      options: [
        'Zielistka (Spider plant)',
        'Kocimiętka',
        'Lilia (Liliaceae) — każda jej część wywołuje ostrą martwicę nerek',
        'Owies dla kota'
      ],
      correct: 2,
      explanation: 'Lilie są dla kotów skrajnie toksyczne. Zlizanie pyłku z futra lub wypicie wody z wazonu po liliach prowadzi do bezmoczowej martwicy nerek i zgonu w 24-48h.'
    },
    {
      q: 'Dlaczego koty zostawiają chrupki na dnie głębokiej miski i miauczą o więcej?',
      options: [
        'Bo jedzenie na dnie jest dla nich za stare',
        'Cierpią na Whisker Fatigue (zmęczenie wibrysów) — uderzanie wąsami o ścianki wywołuje ból',
        'Bo chcą zwrócić na siebie uwagę',
        'Koty nie widzą nic na odległość mniejszą niż 1 metr'
      ],
      correct: 1,
      explanation: 'Wibrysy kota są naszpikowane receptorami. Dotykanie ścianek głębokiej miski wywołuje bolesne przeciążenie nerwowe (Whisker Fatigue). Koty potrzebują płaskiego talerzyka!'
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
      <div id="catQuizFeedback"></div>
      <div class="quiz-action-bar" id="catQuizNextBar" style="display: none;">
        <button class="btn btn-primary" id="catQuizNextBtn">
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

    const feedbackEl = document.getElementById('catQuizFeedback');
    const nextBar = document.getElementById('catQuizNextBar');

    optButtons[qData.correct].classList.add('correct');

    if (selected === qData.correct) {
      score++;
      feedbackEl.className = 'quiz-feedback-banner success';
      feedbackEl.innerHTML = `<strong>Świetnie!</strong> ${qData.explanation}`;
    } else {
      optButtons[selected].classList.add('wrong');
      feedbackEl.className = 'quiz-feedback-banner failure';
      feedbackEl.innerHTML = `<strong>Nie tym razem.</strong> ${qData.explanation}`;
    }

    nextBar.style.display = 'flex';
    document.getElementById('catQuizNextBtn').addEventListener('click', () => {
      currentIdx++;
      renderQuestion();
    });
  }

  function renderSummary() {
    progressBar.style.width = '100%';
    const percent = Math.round((score / questions.length) * 100);

    let rankTitle = 'Mistrz Kociej Percepcji 🐾';
    let badgeEmoji = '👑';
    let rankDesc = 'Perfekcyjnie! Rozumiesz subtelny świat kocich zmysłów, wibrysów i mowy ciała lepiej niż większość felinologów!';

    if (percent < 80 && percent >= 60) {
      rankTitle = 'Znawca Kociej Natury 🐈';
      badgeEmoji = '🎖️';
      rankDesc = 'Bardzo dobry wynik! Wiesz już, dlaczego nie wolno głaskać kota po brzuchu i jak działa jego słuch 85 kHz.';
    } else if (percent < 60) {
      rankTitle = 'Początkujący Miłośnik Kotów 📚';
      badgeEmoji = '🐱';
      rankDesc = 'Warto przejrzeć sekcję zmysłów i bezpieczeństwa raz jeszcze — znajomość Whisker Fatigue i toksyczności lilii to wiedza ratująca kocie życie!';
    }

    quizBody.innerHTML = `
      <div class="quiz-certificate">
        <div class="certificate-badge-emoji">${badgeEmoji}</div>
        <div class="certificate-score">${score} / ${questions.length}</div>
        <h3 class="certificate-title">${rankTitle}</h3>
        <p class="certificate-desc">${rankDesc}</p>
        <button class="btn btn-primary" id="catQuizRestartBtn">Rozwiąż quiz ponownie ↺</button>
      </div>
    `;

    document.getElementById('catQuizRestartBtn').addEventListener('click', () => {
      currentIdx = 0;
      score = 0;
      renderQuestion();
    });
  }

  renderQuestion();
}

/* ============================================================
   7. MINI GRA: KOCI REFLEKS — NOCNY ŁOWCA (3 POZIOMY)
   ============================================================ */
function initCatReflexGame() {
  const stage = document.getElementById('catReflexStage');
  const overlay = document.getElementById('catGameOverlay');
  const startBtn = document.getElementById('startCatGameBtn');
  const nextBtn = document.getElementById('nextCatLevelBtn');
  const restartBtn = document.getElementById('restartCatGameBtn');
  const resetBtn = document.getElementById('resetCatCampaignBtn');
  const timerVal = document.getElementById('catGameTimer');
  const scoreVal = document.getElementById('catGameScore');
  const reactionVal = document.getElementById('catGameReaction');
  const avgReactionVal = document.getElementById('catGameAvgReaction');
  const levelBadge = document.getElementById('catGameLevelBadge');
  const levelDotsContainer = document.getElementById('catGameLevelDots');
  const overlayIcon = document.getElementById('catGameOverIcon');
  const overlayTitle = document.getElementById('catGameOverTitle');
  const overlayDesc = document.getElementById('catGameOverDesc');

  if (!stage || !overlay || !startBtn) return;

  // Web Audio Synthesizer
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

  function playSqueak() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(3200, ctx.currentTime + 0.06);
      osc.frequency.exponentialRampToValueAtTime(2600, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {}
  }

  function playPawSlash() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      // Noise burst for claw swoosh
      const bufferSize = ctx.sampleRate * 0.08;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800;
      filter.Q.value = 1.2;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();

      // Thud impact
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(350, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.1);
      oscGain.gain.setValueAtTime(0.18, ctx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  }

  function playSting() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {}
  }

  function playEscape() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch (e) {}
  }

  // 10 Progressive Rounds Configuration
  const levels = [
    {
      name: 'Zmierzch w Salonie 🛋️',
      desc: 'Młody kot uczy się polować na ospałe myszki i kłębki wełny. Wolne tempo, idealne na rozgrzewkę.',
      rounds: 4,
      required: 3,
      escapeMin: 1300,
      escapeMax: 1600,
      targets: ['🐁', '🐭', '🧶'],
      traps: [],
      bg: 'radial-gradient(circle at center, #18182E 0%, #080816 100%)'
    },
    {
      name: 'Puszysty Dywan i Karton 📦',
      desc: 'Zabawa w kartonie! Polowanie na poruszające się piórka i uciekające myszy.',
      rounds: 5,
      required: 4,
      escapeMin: 1150,
      escapeMax: 1400,
      targets: ['🧶', '🪶', '🐁'],
      traps: [],
      bg: 'radial-gradient(circle at center, #1E1A2E 0%, #090614 100%)'
    },
    {
      name: 'Kuchenny Blat o Świcie 🍳🐾',
      desc: 'Zwinność kota domowego: chwytanie much i smakołyków. Uważaj na cytrynę 🍋 — koty jej nie znoszą!',
      rounds: 5,
      required: 4,
      escapeMin: 1050,
      escapeMax: 1280,
      targets: ['🪰', '🐭', '🍤'],
      traps: ['🍋'],
      bg: 'radial-gradient(circle at center, #1C222E 0%, #060A14 100%)'
    },
    {
      name: 'Nocne Zarośla i Ogród 🌿🌙',
      desc: 'Polowanie w ogrodzie! Zwinne myszy i ćmy. Uważaj na pułapki: pacnięcie żądlącej osy 🐝 daje karę czasową!',
      rounds: 5,
      required: 4,
      escapeMin: 950,
      escapeMax: 1150,
      targets: ['🐭', '🦗', '🦋'],
      traps: ['🐝', '🌵'],
      bg: 'radial-gradient(circle at center, #0F2018 0%, #050C08 100%)'
    },
    {
      name: 'Strych Pełen Cieni 🏚️🕸️',
      desc: 'Półmrok na poddaszu. Wibrysy i tapetum lucidum w pełnej gotowości. Złap szybkie pająki i myszy.',
      rounds: 6,
      required: 4,
      escapeMin: 880,
      escapeMax: 1050,
      targets: ['🕷️', '🐁', '🪶'],
      traps: ['🕯️'],
      bg: 'radial-gradient(circle at center, #1F1918 0%, #0D0807 100%)'
    },
    {
      name: 'Cichy Staw i Ważki 🌾🐸',
      desc: 'Brzeg szuwarów: skaczące żabki i zwinne jaszczurki. Wymaga maksymalnego skupienia!',
      rounds: 6,
      required: 5,
      escapeMin: 800,
      escapeMax: 960,
      targets: ['🐸', '🦗', '🦎'],
      traps: ['🐝'],
      bg: 'radial-gradient(circle at center, #0D2024 0%, #040E10 100%)'
    },
    {
      name: 'Kocie Safari: Ptasie Piórka 🌳🐦',
      desc: 'Wysokie gałęzie drzew. Złap spadające pióra i zwinne wróbelki, omijając cierniste krzaki 🌵!',
      rounds: 6,
      required: 5,
      escapeMin: 720,
      escapeMax: 880,
      targets: ['🐦', '🦋', '🪶'],
      traps: ['🌵', '🐝'],
      bg: 'radial-gradient(circle at center, #1B2416 0%, #070F05 100%)'
    },
    {
      name: 'Skupienie Drapieżnika: Czas Lasera 🔴⚡',
      desc: 'Ekstremalna próba odruchowa: czerwony punkt lasera znika w mgnieniu oka (< 750 ms)!',
      rounds: 7,
      required: 5,
      escapeMin: 620,
      escapeMax: 780,
      targets: ['🔴', '⚡', '🐁'],
      traps: ['🐝'],
      bg: 'radial-gradient(circle at center, #240E3E 0%, #080312 100%)'
    },
    {
      name: 'Błyskawica w Ciemności: Noktowizja 👁️🌌',
      desc: 'Ultradźwiękowy zmysł kota w akcji. Niewiarygodny czas reakcji (poniżej 650 ms).',
      rounds: 7,
      required: 6,
      escapeMin: 520,
      escapeMax: 680,
      targets: ['⚡', '🐁', '🔴'],
      traps: ['🐝'],
      bg: 'radial-gradient(circle at center, #0B243E 0%, #020812 100%)'
    },
    {
      name: 'Mistrz Kociego Refleksu — Król Nocy 👑🐾',
      desc: 'Ostateczny test kociego instynktu łowieckiego! Maksymalna szybkość, złote puchary i tytuł Króla Puszczy.',
      rounds: 8,
      required: 6,
      escapeMin: 450,
      escapeMax: 600,
      targets: ['👑', '⚡', '🔴', '🐾'],
      traps: ['🐝', '🌵'],
      bg: 'radial-gradient(circle at center, #3E1B0E 0%, #120502 100%)'
    }
  ];

  // Game state
  let currentLevelIdx = 0;
  let isPlaying = false;
  let timeLeft = 30;
  let timerInterval = null;
  let spawnTimeout = null;
  let escapeTimeout = null;
  let targetCount = 0;
  let caughtCount = 0;
  let reactionTimes = [];
  let currentTargetEl = null;
  let isCurrentTargetTrap = false;
  let spawnTimestamp = 0;

  function updateHUD() {
    const lvl = levels[currentLevelIdx];
    if (levelBadge) {
      levelBadge.innerHTML = `<span>Runda ${currentLevelIdx + 1}/${levels.length}:</span> ${lvl.name}`;
    }
    if (levelDotsContainer) {
      if (levelDotsContainer.children.length !== levels.length) {
        levelDotsContainer.innerHTML = levels.map((_, i) => `<span class="level-dot" title="Runda ${i + 1}"></span>`).join('');
      }
      const dots = levelDotsContainer.querySelectorAll('.level-dot');
      dots.forEach((dot, idx) => {
        dot.className = 'level-dot';
        if (idx < currentLevelIdx) dot.classList.add('completed');
        else if (idx === currentLevelIdx) dot.classList.add('active');
      });
    }
    scoreVal.textContent = `0 / ${lvl.rounds}`;
    timerVal.textContent = '30s';
    stage.style.background = lvl.bg;
  }

  function clearActiveTarget() {
    if (escapeTimeout) clearTimeout(escapeTimeout);
    if (currentTargetEl && currentTargetEl.parentNode) {
      currentTargetEl.parentNode.removeChild(currentTargetEl);
    }
    currentTargetEl = null;
    isCurrentTargetTrap = false;
  }

  function startLevel(lvlIdx) {
    getAudioCtx();
    clearActiveTarget();
    if (spawnTimeout) clearTimeout(spawnTimeout);
    if (timerInterval) clearInterval(timerInterval);

    currentLevelIdx = lvlIdx;
    const lvl = levels[currentLevelIdx];

    isPlaying = true;
    timeLeft = 30;
    targetCount = 0;
    caughtCount = 0;
    reactionTimes = [];

    reactionVal.textContent = '--- ms';
    avgReactionVal.textContent = '--- ms';

    overlay.classList.add('hidden');
    updateHUD();

    timerInterval = setInterval(() => {
      timeLeft--;
      timerVal.textContent = `${timeLeft}s`;
      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);

    scheduleNextSpawn(800);
  }

  function scheduleNextSpawn(delay = 1000) {
    if (!isPlaying) return;
    const lvl = levels[currentLevelIdx];
    if (targetCount >= lvl.rounds) {
      setTimeout(endGame, 700);
      return;
    }

    spawnTimeout = setTimeout(() => {
      if (!isPlaying) return;
      spawnTarget();
    }, delay + Math.random() * 600);
  }

  function spawnTarget() {
    clearActiveTarget();
    targetCount++;

    const lvl = levels[currentLevelIdx];
    const stageRect = stage.getBoundingClientRect();
    const stageW = stageRect.width || stage.clientWidth || 500;
    const stageH = stageRect.height || stage.clientHeight || 320;

    const pad = 50;
    const x = Math.floor(pad + Math.random() * Math.max(100, stageW - pad * 2 - 50));
    const y = Math.floor(pad + Math.random() * Math.max(80, stageH - pad * 2 - 50));

    // Determine if trap
    const isTrap = lvl.traps.length > 0 && Math.random() < 0.26;
    isCurrentTargetTrap = isTrap;

    let emoji = '';
    if (isTrap) {
      emoji = lvl.traps[Math.floor(Math.random() * lvl.traps.length)];
    } else {
      emoji = lvl.targets[Math.floor(Math.random() * lvl.targets.length)];
    }

    const targetEl = document.createElement('div');
    targetEl.className = 'cat-target-mouse';
    if (isTrap) targetEl.classList.add('trap-target');
    targetEl.textContent = emoji;
    targetEl.style.left = `${x}px`;
    targetEl.style.top = `${y}px`;

    stage.appendChild(targetEl);
    currentTargetEl = targetEl;
    spawnTimestamp = performance.now();
    playSqueak();

    // Escape window based on level
    const escapeDuration = Math.floor(lvl.escapeMin + Math.random() * (lvl.escapeMax - lvl.escapeMin));

    escapeTimeout = setTimeout(() => {
      if (currentTargetEl === targetEl && isPlaying) {
        if (!isTrap) {
          playEscape();
          reactionVal.textContent = 'Uciekła! 💨';
        } else {
          // Trap avoided!
          reactionVal.textContent = 'Unik! 🛡️';
        }

        targetEl.style.transition = 'all 0.25s ease-in';
        targetEl.style.transform = 'scale(0.2) translate(40px, -20px)';
        targetEl.style.opacity = '0';

        setTimeout(() => {
          clearActiveTarget();
          scheduleNextSpawn(900);
        }, 300);
      }
    }, escapeDuration);

    // Hit event
    targetEl.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (!isPlaying || currentTargetEl !== targetEl) return;

      clearTimeout(escapeTimeout);

      if (isTrap) {
        // Tapped a trap!
        playSting();
        showTrapPenalty(e.clientX, e.clientY);
        reactionTimes.push(950); // Penalty
        reactionVal.textContent = '+250ms (Użądlenie! 🐝)';
        clearActiveTarget();
        scheduleNextSpawn(1200);
        return;
      }

      const reactionTime = Math.round(performance.now() - spawnTimestamp);
      reactionTimes.push(reactionTime);
      caughtCount++;

      playPawSlash();
      createPawSlash(e.clientX, e.clientY);

      reactionVal.textContent = `${reactionTime} ms`;
      scoreVal.textContent = `${caughtCount} / ${lvl.rounds}`;

      const avg = Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length);
      avgReactionVal.textContent = `${avg} ms`;

      clearActiveTarget();
      scheduleNextSpawn(800);
    });
  }

  function showTrapPenalty(clientX, clientY) {
    const stageRect = stage.getBoundingClientRect();
    const x = clientX - stageRect.left - 40;
    const y = clientY - stageRect.top - 40;

    const fx = document.createElement('div');
    fx.className = 'wasp-sting-fx';
    fx.textContent = '⚡🐝 AUA!';
    fx.style.left = `${x}px`;
    fx.style.top = `${y}px`;
    stage.appendChild(fx);

    setTimeout(() => {
      if (fx.parentNode) fx.parentNode.removeChild(fx);
    }, 600);
  }

  function createPawSlash(clientX, clientY) {
    const stageRect = stage.getBoundingClientRect();
    const x = clientX - stageRect.left - 40;
    const y = clientY - stageRect.top - 40;

    const slash = document.createElement('div');
    slash.className = 'paw-slash';
    slash.textContent = '🐾⚡';
    slash.style.left = `${x}px`;
    slash.style.top = `${y}px`;
    stage.appendChild(slash);

    setTimeout(() => {
      if (slash.parentNode) slash.parentNode.removeChild(slash);
    }, 450);
  }

  stage.addEventListener('pointerdown', (e) => {
    if (!isPlaying) return;
    if (e.target.classList.contains('cat-target-mouse')) return;
    if (e.target.closest('#catGameOverlay')) return;

    createPawSlash(e.clientX, e.clientY);
  });

  function endGame() {
    isPlaying = false;
    clearInterval(timerInterval);
    if (spawnTimeout) clearTimeout(spawnTimeout);
    clearActiveTarget();

    overlay.classList.remove('hidden');
    startBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    restartBtn.style.display = 'none';
    resetBtn.style.display = 'none';

    const lvl = levels[currentLevelIdx];
    const passed = caughtCount >= lvl.required;
    const avg = reactionTimes.length > 0 
      ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length) 
      : 999;

    if (passed) {
      if (currentLevelIdx < levels.length - 1) {
        // Advanced to next level
        overlayIcon.textContent = '🎉🐾⚡';
        overlayTitle.textContent = `Poziom ${currentLevelIdx + 1} Zwyciężony!`;
        overlayDesc.innerHTML = `
          Upolowałeś <strong>${caughtCount} z ${lvl.rounds}</strong> celów!<br>
          Twój średni czas reakcji wyniósł: <strong style="color: var(--purple-light); font-size: 1.2rem;">${avg} ms</strong>.<br>
          W kolejnym etapie cele poruszają się jeszcze szybciej. Czy Twoje zmysły są gotowe?
        `;
        nextBtn.style.display = 'inline-flex';
        restartBtn.style.display = 'inline-flex';
      } else {
        // Final Level 3 Mastered
        overlayIcon.textContent = '👑🐯⚡';
        overlayTitle.textContent = 'Nocny Władca Odruchów!';
        overlayDesc.innerHTML = `
          <strong>Ukończyłeś całą kampanię łowcy!</strong><br>
          Złapałeś hiperszybki laser ze średnim refleksem: <strong style="color: #10B981; font-size: 1.3rem;">${avg} ms</strong>!<br>
          Twój układ nerwowy reaguje z prędkością rasowego drapieżnika.
        `;
        resetBtn.style.display = 'inline-flex';
      }
    } else {
      // Failed requirement
      overlayIcon.textContent = '🛋️💤';
      overlayTitle.textContent = 'Za mało upolowanych zdobyczy!';
      overlayDesc.innerHTML = `
        Złapałeś <strong>${caughtCount} z ${lvl.rounds}</strong> (wymagane minimum: <strong>${lvl.required}</strong>).<br>
        Myszki uciekły do nory. Koty nigdy się nie poddają — skup wzrok na środku i uderzaj natychmiast!
      `;
      restartBtn.style.display = 'inline-flex';
      if (currentLevelIdx > 0) resetBtn.style.display = 'inline-flex';
    }
  }

  // Event Listeners
  startBtn.addEventListener('click', () => startLevel(0));
  nextBtn.addEventListener('click', () => startLevel(currentLevelIdx + 1));
  restartBtn.addEventListener('click', () => startLevel(currentLevelIdx));
  resetBtn.addEventListener('click', () => startLevel(0));

  updateHUD();
}



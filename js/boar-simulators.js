/* ============================================================
   Wild Boar Sensory Simulators & Forest Safety Interactive Engine
   Author: Dorian Kalinowski for "Świat zmysłami zwierząt"
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initBoarSensorySimulator();
  initBoarAnatomyInspector();
  initBoarCrisisSimulator();
  initBoarAudioSynthesizer();
  initBoarQuiz();
  initBoarRootingGame();
});

/* ============================================================
   1. SENSORY SIMULATOR: MYOPIA (KRÓTKOWZROCZNOŚĆ) VS SUPER-WĘCH
   ============================================================ */
function initBoarSensorySimulator() {
  const windDirRadios = document.querySelectorAll('input[name="boarWind"]');
  const motionCheck = document.getElementById('boarMotionToggle');
  const resultCard = document.getElementById('boarSimResultCard');
  const reactionEmoji = document.getElementById('boarReactionEmoji');
  const reactionTitle = document.getElementById('boarReactionTitle');
  const reactionDesc = document.getElementById('boarReactionDesc');

  if (!resultCard) return;

  function updateSimulation() {
    const wind = document.querySelector('input[name="boarWind"]:checked')?.value || 'upwind';
    const isMoving = motionCheck?.checked || false;

    if (wind === 'downwind') {
      // Wiatr z Twojej strony do dzika (dzik czuje Twój zapach)
      reactionEmoji.textContent = '💨🐗💨';
      reactionTitle.textContent = 'Dzik ucieka z prędkością 40 km/h!';
      reactionTitle.style.color = '#FCD34D';
      resultCard.style.borderColor = 'rgba(245, 158, 11, 0.4)';
      resultCard.style.background = 'rgba(245, 158, 11, 0.1)';
      reactionDesc.innerHTML = `
        <strong>Super-węch wygrał:</strong> Węch dzika jest 5-krotnie czulszy niż u psa myśliwskiego. Dzik poczuł molekuły Twojego potu i ubrań z odległości <strong>ponad 600 metrów</strong>! Zanim w ogóle zdążyłeś go zauważyć, dzik podniósł gwizd i uciekł w najgłębsze leśne ostoje.
      `;
    } else {
      // Wiatr wieje od dzika do Ciebie (dzik nie czuje zapachu)
      if (isMoving) {
        reactionEmoji.textContent = '⚠️🐗❓';
        reactionTitle.textContent = 'Dzik stawia słuchy i jeży chyb!';
        reactionTitle.style.color = '#F87171';
        resultCard.style.borderColor = 'rgba(239, 68, 68, 0.4)';
        resultCard.style.background = 'rgba(239, 68, 68, 0.1)';
        reactionDesc.innerHTML = `
          <strong>Wykrycie ruchu:</strong> Choć dzik nie czuje zapachu, jego słaby wzrok błyskawicznie rejestruje ruch sylwetki. Dzik zamarł w bezruchu, nastroszył szczecinę na karku (chyb) i głośno fuknął nozdrzami, ostrzegając całą watahę.
        `;
      } else {
        reactionEmoji.textContent = '🌿🐗🍂';
        reactionTitle.textContent = 'Jesteś CAŁKOWICIE NIEWIDZIALNY!';
        reactionTitle.style.color = '#6EE7B7';
        resultCard.style.borderColor = 'rgba(16, 185, 129, 0.4)';
        resultCard.style.background = 'rgba(16, 185, 129, 0.1)';
        reactionDesc.innerHTML = `
          <strong>Paradoks zmysłów dzika:</strong> Wiatr wieje w Twoją stronę (dzik nie ma pojęcia o Twojej obecności), a Ty stoisz w całkowitym bezruchu. Dzik jest <strong>skrajnym krótkowidzem</strong> — może przejść zaledwie 3 metry obok Ciebie i brać Cię za pień zwalonego dębu, spokojnie buchtując ściółkę!
        `;
      }
    }
  }

  windDirRadios.forEach(r => r.addEventListener('change', updateSimulation));
  motionCheck?.addEventListener('change', updateSimulation);
}

/* ============================================================
   2. INTERACTIVE ANATOMY & TUSKS INSPECTOR ("ROZSZYFRUJ ORĘŻ")
   ============================================================ */
function initBoarAnatomyInspector() {
  const hotspots = document.querySelectorAll('.boar-hotspot');
  const title = document.getElementById('boarHotspotTitle');
  const desc = document.getElementById('boarHotspotDesc');
  const tacticalTip = document.getElementById('boarTacticalTip');

  if (!hotspots.length || !title) return;

  const data = {
    tusks: {
      title: 'Szable i Fajki — Żywy, samoostrzący się scyzoryk',
      desc: 'Oręż odyńca składa się z kłów dolnych (**szable**, do 12–15 cm długości) oraz kłów górnych (**fajki**). Przy każdym kłapnięciu pyska i żuciu zęby ocierają się o siebie pod kątem, nieustannie się ostrząc. Mają ostrość skalpela chirurgicznego!',
      tip: 'Uderzenie szablami od dołu do góry może przeciąć tętnicę udową. Dlatego dzik szarżuje zawsze z pochyloną głową, tnąc w górę.'
    },
    snout: {
      title: 'Gwizd i Tablica — Hydrauliczny spychacz leśny',
      desc: 'Ryj dzika (tzw. gwizd) zakończony jest chrzęstną tarczą podpartą specjalną kością przednosową (*os rostri*). Dzik potrafi tym „narzędziem” podważać zmarzniętą ziemię, korzenie dębów i kamienie ważące ponad 50 kg bez cienia bólu.',
      tip: 'Buchtując, dzik napowietrza glebę, umożliwiając kiełkowanie nasion dębu i buka — bez dzików lasy nie byłyby w stanie się odnawiać!'
    },
    armor: {
      title: 'Chyb i Kalandra — Naturalna kamizelka pancerna',
      desc: 'Na łopatkach dorosłego odyńca wykształca się tzw. **płyta chybowa (kalandra)**. To zbita tkanka łączna o grubości 3–4 cm, dodatkowo utwardzona żywicą drzew iglastych i piaskiem podczas kąpieli w błotnych babrzyskach.',
      tip: 'Kalandra chroni narządy wewnętrzne odyńca podczas brutalnych walk godowych (huczki), gdy rywale z pełną siłą uderzają w siebie szablami.'
    },
    ears: {
      title: 'Słuchy — Niezależne mikrofony kierunkowe',
      desc: 'Uszy dzika (słuchy) obracają się we wszystkich kierunkach. Wykrywają pęknięcie patyka z ponad 150 metrów. Słuch dzika natychmiast uzupełnia to, czego nie dostrzegły jego słabe ślepia.',
      tip: 'Idąc lasem, głośno rozmawiaj lub stawiaj pewne kroki — dzik usłyszy Cię z daleka i sam spokojnie ustąpi ze ścieżki.'
    }
  };

  hotspots.forEach(btn => {
    btn.addEventListener('click', () => {
      hotspots.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const part = btn.dataset.part;
      const info = data[part];
      if (!info) return;

      title.textContent = info.title;
      desc.textContent = info.desc;
      tacticalTip.textContent = info.tip;
    });
  });
}

/* ============================================================
   3. FOREST & URBAN CRISIS DECISION SIMULATOR
   ============================================================ */
function initBoarCrisisSimulator() {
  const buttons = document.querySelectorAll('.boar-scenario-btn');
  const scenarioBox = document.getElementById('boarScenarioContent');

  if (!buttons.length || !scenarioBox) return;

  const scenarios = {
    sow: {
      badge: 'Sytuacja 1: Wiosenny spacer w lesie',
      text: 'Idziesz ścieżką i zauważasz w krzakach 5 małych, pasiastych warchlaków. Są urocze i bawią się zaledwie 8 metrów od Ciebie. Lochy jeszcze nie widać, ale zarośla trzeszczą.',
      options: [
        {
          label: 'A) Podchodzę powoli z telefonem, żeby nagrać uroczy filmik na Instagram.',
          correct: false,
          feedback: '❌ <strong>SKRAJNY BŁĄD!</strong> Za sekundę z gęstwiny wypadnie 120-kilogramowa matka z furią obrony młodych. Locha nie będzie ostrzegać — staranuje intruza. Nigdy nie zbliżaj się do pasiastych warchlaków!'
        },
        {
          label: 'B) Zaczynam głośno klaskać i krzyczeć, żeby odstraszyć rodzinę.',
          correct: false,
          feedback: '❌ <strong>ZŁA DECYZJA:</strong> Krzyk i gwałtowne machanie rękami locha zinterpretuje jako bezpośredni atak na jej dzieci i zaatakuje pierwsza, by je chronić.'
        },
        {
          label: 'C) Zatrzymuję się, nie zbliżam, i powoli wycofuję się tą samą drogą, obserwując teren.',
          correct: true,
          feedback: '✅ <strong>IDEALNA REAKCJA:</strong> Dajesz matce przestrzeń. Locha nie chce walki — zależy jej wyłącznie na bezpiecznym wyprowadzeniu młodych w głąb lasu. Powolny odwrót bez paniki neutralizuje zagrożenie.'
        }
      ]
    },
    dog: {
      badge: 'Sytuacja 2: Pies i dzik w zaroślach',
      text: 'Twój pies biega po lesie bez smyczy. Nagle z krzaków dobiega głośne szczekanie. Pies dopadł dużego odyńca i zaczyna go oszczekiwać. Dzik kłapie zębami.',
      options: [
        {
          label: 'A) Pozwalam psu szczekać — pies go przegoni.',
          correct: false,
          feedback: '❌ <strong>PRZYCZYNA 80% POGRYZIEŃ W POLSCE!</strong> Dzik nie ucieka przed jednym psem. Szarżuje, pies w panice ucieka do swojego pana szukać ratunku, i sprowadza 150 kg rozwścieczonego dzika prosto na Twoje nogi!'
        },
        {
          label: 'B) Natychmiast przywołuję psa, zapinam na smycz i spokojnie oddalam się w przeciwnym kierunku.',
          correct: true,
          feedback: '✅ <strong>JEDYNA WŁAŚCIWA DECYZJA:</strong> Pies na smyczy to bezpieczeństwo Twoje i dzika. Gdy pies przestanie prowokować dzika szczekaniem, dzik uzna incydent za zakończony i odejdzie.'
        }
      ]
    },
    city: {
      badge: 'Sytuacja 3: Dzik w mieście przy śmietniku',
      text: 'Wracasz wieczorem do bloku w Gdyni lub Warszawie. Pod wiatą śmietnikową żeruje wataha dzików, blokując wejście do Twojej klatki schodowej.',
      options: [
        {
          label: 'A) Rzucam im kawałek kanapki, żeby odciągnąć je od klatki.',
          correct: false,
          feedback: '❌ <strong>ZBRODNIA WOBEC ZWIERZĄT:</strong> Dokarmianie dzików w miastach powoduje, że zatracają lęk przed człowiekiem. Z czasem stają się roszczeniowe i agresywne, co kończy się przymusowym odstrzałem całej watahy przez miasto!'
        },
        {
          label: 'B) Zachowuję bezpieczny dystans (min. 20-30 metrów), czekam lub obchodzę watahę drugą stroną i dzwonię na Straż Miejską (986).',
          correct: true,
          feedback: '✅ <strong>WZOROWE ZACHOWANIE:</strong> Dziki w mieście nie szukają ludzi — szukają kalorii. Trzymanie dystansu gwarantuje bezpieczeństwo. Służby miejskie zabezpieczą teren.'
        }
      ]
    }
  };

  function renderScenario(key) {
    const sc = scenarios[key];
    if (!sc) return;

    scenarioBox.innerHTML = `
      <div style="font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700; color: var(--amber); margin-bottom: 8px;">
        ${sc.badge}
      </div>
      <p style="font-size: 1rem; color: var(--text); line-height: 1.6; margin-bottom: 20px;">
        ${sc.text}
      </p>
      <div style="display: flex; flex-direction: column; gap: 10px;" id="boarOptionsList">
        ${sc.options.map((opt, i) => `
          <button class="crisis-option-card" data-idx="${i}" style="width: 100%; text-align: left;">
            ${opt.label}
          </button>
        `).join('')}
      </div>
      <div id="boarFeedbackContent" style="margin-top: 18px; padding: 14px 18px; border-radius: var(--radius-md); display: none; line-height: 1.6;"></div>
    `;

    const optButtons = scenarioBox.querySelectorAll('.crisis-option-card');
    const fbBox = scenarioBox.querySelector('#boarFeedbackContent');

    optButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx);
        const chosen = sc.options[idx];

        optButtons.forEach(b => b.classList.remove('correct', 'wrong'));
        if (chosen.correct) {
          btn.classList.add('correct');
          fbBox.style.background = 'rgba(16, 185, 129, 0.15)';
          fbBox.style.border = '1px solid #10B981';
          fbBox.style.color = '#E2E8F0';
        } else {
          btn.classList.add('wrong');
          fbBox.style.background = 'rgba(239, 68, 68, 0.15)';
          fbBox.style.border = '1px solid #F43F5E';
          fbBox.style.color = '#E2E8F0';
        }

        fbBox.innerHTML = chosen.feedback;
        fbBox.style.display = 'block';
      });
    });
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderScenario(btn.dataset.scenario);
    });
  });

  renderScenario('sow'); // Initial
}

/* ============================================================
   4. BOAR WARNING SOUNDS SYNTHESIZER (Web Audio API)
   ============================================================ */
function initBoarAudioSynthesizer() {
  const fukBtn = document.getElementById('playBoarFukBtn');
  const tuskBtn = document.getElementById('playBoarTusksBtn');

  let audioCtx = null;
  function getAudioCtx() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  // 1. Fukanie (sapanie powietrza przez nos)
  fukBtn?.addEventListener('click', () => {
    const ctx = getAudioCtx();
    const now = ctx.currentTime;

    // Filtered pink/white noise simulating explosive blast of air
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, now);
    filter.Q.setValueAtTime(2.5, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    fukBtn.classList.add('playing');
    setTimeout(() => fukBtn.classList.remove('playing'), 500);
  });

  // 2. Kłapanie orężem (suche trzaski zgrzytających szabel)
  tuskBtn?.addEventListener('click', () => {
    const ctx = getAudioCtx();
    const now = ctx.currentTime;

    // Simulate 3 rapid wooden/enamel clacks
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + i * 0.12;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800 + Math.random() * 200, t);
      osc.frequency.exponentialRampToValueAtTime(150, t + 0.04);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.05);
    }

    tuskBtn.classList.add('playing');
    setTimeout(() => tuskBtn.classList.remove('playing'), 500);
  });
}

/* ============================================================
   5. MINI QUIZ ABOUT WILD BOARS
   ============================================================ */
function initBoarQuiz() {
  const quizBody = document.getElementById('boarQuizDynamicBody');
  const progressBar = document.getElementById('boarQuizMeterProgress');

  if (!quizBody || !progressBar) return;

  const questions = [
    {
      q: 'Jaki zmysł dzika jest absolutną supermocą lasu?',
      options: [
        'Wzrok — dzik widzi w podczerwieni',
        'Węch — wyczuwa żołędzie 1 m pod ziemią i człowieka z ponad 500 m',
        'Smak — potrafi odróżniać rodzaje kory',
        'Echolokacja ultradźwiękowa'
      ],
      correct: 1,
      explanation: 'Węch dzika (gwizd) jest 5-krotnie silniejszy niż u psa myśliwskiego. Pozwala mu wyczuwać pędraki pod metrową warstwą zmarzliny!'
    },
    {
      q: 'Co jest statystycznie NAJCZĘSTSZYM powodem ataku dzika na człowieka w Polsce?',
      options: [
        'Głód dzika w środku zimy',
        'Kolor ubrań spacerowicza',
        'Pies biegający bez smyczy, który prowokuje dzika i ucieka pod nogi właściciela',
        'Śpiewanie piosenek w lesie'
      ],
      correct: 2,
      explanation: 'Ponad 80% konfrontacji z dzikami wywołuje luźno biegający pies. Dzik kontratakuje, a przerażony pies szuka ratunku u swego opiekuna.'
    },
    {
      q: 'Dlaczego człowiek stojący w bezruchu pod wiatr jest dla dzika niemal niewidzialny?',
      options: [
        'Bo dzik jest skrajnym krótkowidzem i reaguje niemal wyłącznie na ruch',
        'Bo dziki zamykają oczy podczas buchtowania',
        'Dzik widzi tylko obiekty w kolorze czerwonym',
        'Dzik ignoruje obiekty wyższe niż 1 metr'
      ],
      correct: 0,
      explanation: 'Ślepia dzika są małe i krótkowzroczne. Jeśli wiatr nie niesie zapachu, dzik minie nieruchomego człowieka o 2–3 metry, biorąc go za pień drzewa!'
    },
    {
      q: 'Co oznacza głośne zgrzytanie szablami (kłapanie zębami) u odyńca?',
      options: [
        'Dzik czyści zęby po zjedzeniu żołędzi',
        'Ostateczne ostrzeżenie przed atakiem — za ułamek sekundy może nastąpić szarża',
        'Sygnał powitania dla watahy',
        'Prośba o jedzenie'
      ],
      correct: 1,
      explanation: 'Kłapanie orężem to demonstracja siły i sygnał alarmowy: „jesteś za blisko, atakuję!”. Należy natychmiast, bez paniki, wycofać się tyłem.'
    },
    {
      q: 'Dlaczego dzików w miastach NIE WOLNO dokarmiać resztkami ze stołu?',
      options: [
        'Bo dziki jedzą wyłącznie mięso',
        'Bo tracą naturalny lęk przed ludźmi i stają się roszczeniowe, co kończy się ich odstrzałem',
        'Bo od pieczywa wypadają im szable',
        'Dziki w mieście i tak mają za dużo jedzenia'
      ],
      correct: 1,
      explanation: 'Dokarmianie to wyrok śmierci na dzika. Dzik traci dystans, zaczyna wymuszać jedzenie i w końcu stwarza zagrożenie, przez co miasto zmuszone jest go uśmiercić.'
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
      <div id="boarQuizFeedback"></div>
      <div class="quiz-action-bar" id="boarQuizNextBar" style="display: none;">
        <button class="btn btn-primary" id="boarQuizNextBtn">
          ${currentIdx < questions.length - 1 ? 'Następne pytanie →' : 'Zobacz certyfikat leśnego bezpieczeństwa →'}
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

    const feedbackEl = document.getElementById('boarQuizFeedback');
    const nextBar = document.getElementById('boarQuizNextBar');

    optButtons[qData.correct].classList.add('correct');

    if (selected === qData.correct) {
      score++;
      feedbackEl.className = 'quiz-feedback-banner success';
      feedbackEl.innerHTML = `<strong>Doskonale!</strong> ${qData.explanation}`;
    } else {
      optButtons[selected].classList.add('wrong');
      feedbackEl.className = 'quiz-feedback-banner failure';
      feedbackEl.innerHTML = `<strong>Nie do końca.</strong> ${qData.explanation}`;
    }

    nextBar.style.display = 'flex';
    document.getElementById('boarQuizNextBtn').addEventListener('click', () => {
      currentIdx++;
      renderQuestion();
    });
  }

  function renderSummary() {
    progressBar.style.width = '100%';
    const percent = Math.round((score / questions.length) * 100);

    let rankTitle = 'Strażnik Leśnego Bezpieczeństwa 🌲🐗';
    let badgeEmoji = '🛡️';
    let rankDesc = 'Genialnie! Wiesz dokładnie, jak funkcjonują zmysły dzika i wiesz jak bezpiecznie zachować się w lesie i w mieście!';

    if (percent < 80 && percent >= 60) {
      rankTitle = 'Świadomy Wędrowiec 🌿';
      badgeEmoji = '🧭';
      rankDesc = 'Bardzo dobry wynik! Znasz najważniejsze zasady — wiesz, że pies na smyczy to klucz do bezpiecznego spaceru.';
    } else if (percent < 60) {
      rankTitle = 'Początkujący Obserwator Przyrody 📚';
      badgeEmoji = '💡';
      rankDesc = 'Warto przejrzeć sekcję o bezpieczeństwie i Zasadzie Odwrotu jeszcze raz — to wiedza, która może przydać się na każdym spacerze!';
    }

    quizBody.innerHTML = `
      <div class="quiz-certificate">
        <div class="certificate-badge-emoji">${badgeEmoji}</div>
        <div class="certificate-score">${score} / ${questions.length}</div>
        <h3 class="certificate-title">${rankTitle}</h3>
        <p class="certificate-desc">${rankDesc}</p>
        <button class="btn btn-primary" id="boarQuizRestartBtn">Rozwiąż quiz ponownie ↺</button>
      </div>
    `;

    document.getElementById('boarQuizRestartBtn').addEventListener('click', () => {
      currentIdx = 0;
      score = 0;
      renderQuestion();
    });
  }

  renderQuestion();
}

/* ============================================================
   7. MINI GRA: BUCHTOWANIE W PUSZCZY — TRUFLOWY TARAN (3 SEZONY)
   ============================================================ */
function initBoarRootingGame() {
  const grid = document.getElementById('boarSoilGrid');
  const overlay = document.getElementById('boarGameOverlay');
  const startBtn = document.getElementById('startBoarGameBtn');
  const nextBtn = document.getElementById('nextBoarLevelBtn');
  const restartBtn = document.getElementById('restartBoarGameBtn');
  const resetBtn = document.getElementById('resetBoarCampaignBtn');
  const timerVal = document.getElementById('boarGameTimer');
  const weightVal = document.getElementById('boarGameWeight');
  const targetWeightVal = document.getElementById('boarGameTargetWeight');
  const trufflesVal = document.getElementById('boarGameTruffles');
  const levelBadge = document.getElementById('boarGameLevelBadge');
  const levelDotsContainer = document.getElementById('boarGameLevelDots');
  const overlayIcon = document.getElementById('boarGameOverIcon');
  const overlayTitle = document.getElementById('boarGameOverTitle');
  const overlayDesc = document.getElementById('boarGameOverDesc');

  if (!grid || !overlay || !startBtn) return;

  // Web Audio Synthesizer for Boar
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

  function playRootSound() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      // Deep boar grunt (chrumknięcie)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.12);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, ctx.currentTime);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {}
  }

  function playTruffleChime() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      const freqs = [523, 659, 784, 1046];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.05);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.05 + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.05);
        osc.stop(ctx.currentTime + i * 0.05 + 0.15);
      });
    } catch (e) {}
  }

  function playRockClunk() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  }

  // 10 Progressive Seasons Configuration
  const seasons = [
    {
      name: 'Wiosenne Przebudzenie i Młode Pędy 🌱🐗',
      desc: 'Młody przelatkek szuka pierwszych pędów traw i miękkich korzonków po zejściu śniegu.',
      startWeight: 45,
      targetWeight: 65,
      time: 35,
      items: [
        { type: 'root', name: 'Młody pęd', emoji: '🌱', delta: 6, label: '+6 kg' },
        { type: 'root', name: 'Młody pęd', emoji: '🌱', delta: 6, label: '+6 kg' },
        { type: 'root', name: 'Kłącze paproci', emoji: '🌿', delta: 5, label: '+5 kg' },
        { type: 'grub', name: 'Dżdżownica', emoji: '🪱', delta: 6, label: '+6 kg' },
        { type: 'grub', name: 'Dżdżownica', emoji: '🪱', delta: 6, label: '+6 kg' },
        { type: 'acorn', name: 'Ubiegłoroczny żołądź', emoji: '🌰', delta: 7, label: '+7 kg' },
        { type: 'acorn', name: 'Ubiegłoroczny żołądź', emoji: '🌰', delta: 7, label: '+7 kg' },
        { type: 'root', name: 'Soczysty korzonek', emoji: '🥕', delta: 6, label: '+6 kg' },
        { type: 'stone', name: 'Kamień rzeczny', emoji: '🪨', delta: -4, label: '-4 kg' },
        { type: 'root', name: 'Kłącze paproci', emoji: '🌿', delta: 5, label: '+5 kg' },
        { type: 'grub', name: 'Larwa', emoji: '🐛', delta: 8, label: '+8 kg' },
        { type: 'root', name: 'Młody pęd', emoji: '🌱', delta: 6, label: '+6 kg' },
        { type: 'root', name: 'Młody pęd', emoji: '🌱', delta: 6, label: '+6 kg' },
        { type: 'acorn', name: 'Ubiegłoroczny żołądź', emoji: '🌰', delta: 7, label: '+7 kg' },
        { type: 'grub', name: 'Dżdżownica', emoji: '🪱', delta: 6, label: '+6 kg' },
        { type: 'root', name: 'Kłącze paproci', emoji: '🌿', delta: 5, label: '+5 kg' }
      ]
    },
    {
      name: 'Brzegi Rzeczne i Kłącza Tataraku 💧🌾',
      desc: 'Błotniste brzegi rzeki kryją soczyste kłącza tataraku i mięczaki. Nabieraj siły!',
      startWeight: 65,
      targetWeight: 85,
      time: 35,
      items: [
        { type: 'root', name: 'Kłącze tataraku', emoji: '🌾', delta: 7, label: '+7 kg' },
        { type: 'root', name: 'Kłącze tataraku', emoji: '🌾', delta: 7, label: '+7 kg' },
        { type: 'grub', name: 'Pędrak nadrzeczny', emoji: '🐛', delta: 8, label: '+8 kg' },
        { type: 'grub', name: 'Pędrak nadrzeczny', emoji: '🐛', delta: 8, label: '+8 kg' },
        { type: 'root', name: 'Bulwa wodna', emoji: '🌿', delta: 6, label: '+6 kg' },
        { type: 'truffle', name: 'Młoda letnia trufla', emoji: '🍄', delta: 12, label: '+12 kg' },
        { type: 'root', name: 'Kłącze tataraku', emoji: '🌾', delta: 7, label: '+7 kg' },
        { type: 'stone', name: 'Śliski otoczak', emoji: '🪨', delta: -5, label: '-5 kg' },
        { type: 'root', name: 'Bulwa wodna', emoji: '🌿', delta: 6, label: '+6 kg' },
        { type: 'grub', name: 'Pędrak nadrzeczny', emoji: '🐛', delta: 8, label: '+8 kg' },
        { type: 'root', name: 'Kłącze tataraku', emoji: '🌾', delta: 7, label: '+7 kg' },
        { type: 'stone', name: 'Śliski otoczak', emoji: '🪨', delta: -5, label: '-5 kg' },
        { type: 'root', name: 'Bulwa wodna', emoji: '🌿', delta: 6, label: '+6 kg' },
        { type: 'grub', name: 'Larwa', emoji: '🐛', delta: 8, label: '+8 kg' },
        { type: 'root', name: 'Bulwa wodna', emoji: '🌿', delta: 6, label: '+6 kg' },
        { type: 'root', name: 'Kłącze tataraku', emoji: '🌾', delta: 7, label: '+7 kg' }
      ]
    },
    {
      name: 'Letnie Jagodowisko i Chrząszcze 🫐🪲',
      desc: 'Letnia obfitość w borze sosnowym. Chrząszcze, larwy i jagody budują sylwetkę wycinka.',
      startWeight: 85,
      targetWeight: 105,
      time: 34,
      items: [
        { type: 'grub', name: 'Tłusty pędrak', emoji: '🐛', delta: 9, label: '+9 kg' },
        { type: 'grub', name: 'Tłusty pędrak', emoji: '🐛', delta: 9, label: '+9 kg' },
        { type: 'root', name: 'Borówki leśne', emoji: '🫐', delta: 6, label: '+6 kg' },
        { type: 'root', name: 'Borówki leśne', emoji: '🫐', delta: 6, label: '+6 kg' },
        { type: 'truffle', name: 'Trufla leśna', emoji: '🍄', delta: 14, label: '+14 kg' },
        { type: 'root', name: 'Korzenie wrzosu', emoji: '🌿', delta: 5, label: '+5 kg' },
        { type: 'grub', name: 'Żuk gnojowy', emoji: '🪲', delta: 7, label: '+7 kg' },
        { type: 'stone', name: 'Kamień granitowy', emoji: '🪨', delta: -6, label: '-6 kg' },
        { type: 'root', name: 'Borówki leśne', emoji: '🫐', delta: 6, label: '+6 kg' },
        { type: 'grub', name: 'Tłusty pędrak', emoji: '🐛', delta: 9, label: '+9 kg' },
        { type: 'root', name: 'Korzenie wrzosu', emoji: '🌿', delta: 5, label: '+5 kg' },
        { type: 'stone', name: 'Kamień granitowy', emoji: '🪨', delta: -6, label: '-6 kg' },
        { type: 'grub', name: 'Tłusty pędrak', emoji: '🐛', delta: 9, label: '+9 kg' },
        { type: 'truffle', name: 'Trufla leśna', emoji: '🍄', delta: 14, label: '+14 kg' },
        { type: 'root', name: 'Borówki leśne', emoji: '🫐', delta: 6, label: '+6 kg' },
        { type: 'root', name: 'Korzenie wrzosu', emoji: '🌿', delta: 5, label: '+5 kg' }
      ]
    },
    {
      name: 'Złota Jesień — Sezon Żołędzi 🍂🌰',
      desc: 'Ściółka w dąbrowie jest miękka i bogata w opadłe żołędzie. Zgromadź pierwsze zapasy tłuszczu na zimę!',
      startWeight: 105,
      targetWeight: 130,
      time: 33,
      items: [
        { type: 'acorn', name: 'Żołędzie dębu', emoji: '🌰', delta: 8, label: '+8 kg' },
        { type: 'acorn', name: 'Żołędzie dębu', emoji: '🌰', delta: 8, label: '+8 kg' },
        { type: 'acorn', name: 'Żołędzie dębu', emoji: '🌰', delta: 8, label: '+8 kg' },
        { type: 'acorn', name: 'Żołędzie dębu', emoji: '🌰', delta: 8, label: '+8 kg' },
        { type: 'grub', name: 'Pędrak chrabąszcza', emoji: '🐛', delta: 10, label: '+10 kg' },
        { type: 'grub', name: 'Pędrak chrabąszcza', emoji: '🐛', delta: 10, label: '+10 kg' },
        { type: 'truffle', name: 'Młoda trufla', emoji: '🍄', delta: 15, label: '+15 kg' },
        { type: 'truffle', name: 'Młoda trufla', emoji: '🍄', delta: 15, label: '+15 kg' },
        { type: 'root', name: 'Kłącze paproci', emoji: '🌿', delta: 5, label: '+5 kg' },
        { type: 'stone', name: 'Kamień', emoji: '🪨', delta: -5, label: '-5 kg' },
        { type: 'acorn', name: 'Żołędzie dębu', emoji: '🌰', delta: 8, label: '+8 kg' },
        { type: 'grub', name: 'Pędrak chrabąszcza', emoji: '🐛', delta: 10, label: '+10 kg' },
        { type: 'root', name: 'Kłącze paproci', emoji: '🌿', delta: 5, label: '+5 kg' },
        { type: 'stone', name: 'Kamień', emoji: '🪨', delta: -5, label: '-5 kg' },
        { type: 'acorn', name: 'Żołędzie dębu', emoji: '🌰', delta: 8, label: '+8 kg' },
        { type: 'grub', name: 'Pędrak chrabąszcza', emoji: '🐛', delta: 10, label: '+10 kg' }
      ]
    },
    {
      name: 'Bukowy Las — Orzeszki Bukwi 🌳🌰',
      desc: 'Stara buczyna karpacka obrodziła bukwiami (wysokotłuszczowe orzeszki). Wyczuj je nosem pod liśćmi!',
      startWeight: 130,
      targetWeight: 155,
      time: 32,
      items: [
        { type: 'acorn', name: 'Tłusta bukiew', emoji: '🌰', delta: 9, label: '+9 kg' },
        { type: 'acorn', name: 'Tłusta bukiew', emoji: '🌰', delta: 9, label: '+9 kg' },
        { type: 'acorn', name: 'Tłusta bukiew', emoji: '🌰', delta: 9, label: '+9 kg' },
        { type: 'truffle', name: 'Czarna trufla', emoji: '🍄', delta: 18, label: '+18 kg' },
        { type: 'grub', name: 'Larwa kornika', emoji: '🐛', delta: 8, label: '+8 kg' },
        { type: 'grub', name: 'Larwa kornika', emoji: '🐛', delta: 8, label: '+8 kg' },
        { type: 'root', name: 'Korzeń buka', emoji: '🌿', delta: 6, label: '+6 kg' },
        { type: 'stone', name: 'Wapienny głaz', emoji: '🪨', delta: -7, label: '-7 kg' },
        { type: 'acorn', name: 'Tłusta bukiew', emoji: '🌰', delta: 9, label: '+9 kg' },
        { type: 'truffle', name: 'Czarna trufla', emoji: '🍄', delta: 18, label: '+18 kg' },
        { type: 'root', name: 'Korzeń buka', emoji: '🌿', delta: 6, label: '+6 kg' },
        { type: 'stone', name: 'Wapienny głaz', emoji: '🪨', delta: -7, label: '-7 kg' },
        { type: 'acorn', name: 'Tłusta bukiew', emoji: '🌰', delta: 9, label: '+9 kg' },
        { type: 'grub', name: 'Larwa kornika', emoji: '🐛', delta: 8, label: '+8 kg' },
        { type: 'root', name: 'Korzeń buka', emoji: '🌿', delta: 6, label: '+6 kg' },
        { type: 'acorn', name: 'Tłusta bukiew', emoji: '🌰', delta: 9, label: '+9 kg' }
      ]
    },
    {
      name: 'Puszcza Trufli i Próchnicy 🍄🌧️',
      desc: 'Wilgotna puszcza kryje bezcenne czarne trufle podziemne (+20 kg)! Uważaj na twarde głazy w podszycie.',
      startWeight: 155,
      targetWeight: 180,
      time: 30,
      items: [
        { type: 'truffle', name: 'Czarna trufla', emoji: '🍄', delta: 20, label: '+20 kg' },
        { type: 'truffle', name: 'Czarna trufla', emoji: '🍄', delta: 20, label: '+20 kg' },
        { type: 'truffle', name: 'Czarna trufla', emoji: '🍄', delta: 20, label: '+20 kg' },
        { type: 'grub', name: 'Tłusty pędrak', emoji: '🐛', delta: 10, label: '+10 kg' },
        { type: 'grub', name: 'Tłusty pędrak', emoji: '🐛', delta: 10, label: '+10 kg' },
        { type: 'acorn', name: 'Dojrzałe żołędzie', emoji: '🌰', delta: 8, label: '+8 kg' },
        { type: 'acorn', name: 'Dojrzałe żołędzie', emoji: '🌰', delta: 8, label: '+8 kg' },
        { type: 'root', name: 'Kłącze paproci', emoji: '🌿', delta: 5, label: '+5 kg' },
        { type: 'stone', name: 'Ostry głaz', emoji: '🪨', delta: -8, label: '-8 kg' },
        { type: 'trash', name: 'Puszka w lesie', emoji: '🥫', delta: -6, label: '-6 kg' },
        { type: 'truffle', name: 'Czarna trufla', emoji: '🍄', delta: 20, label: '+20 kg' },
        { type: 'grub', name: 'Tłusty pędrak', emoji: '🐛', delta: 10, label: '+10 kg' },
        { type: 'stone', name: 'Ostry głaz', emoji: '🪨', delta: -8, label: '-8 kg' },
        { type: 'root', name: 'Kłącze paproci', emoji: '🌿', delta: 5, label: '+5 kg' },
        { type: 'acorn', name: 'Dojrzałe żołędzie', emoji: '🌰', delta: 8, label: '+8 kg' },
        { type: 'grub', name: 'Tłusty pędrak', emoji: '🐛', delta: 10, label: '+10 kg' }
      ]
    },
    {
      name: 'Skraj Pola Kukurydzy — Nocne Żerowanie 🌽🌙',
      desc: 'Kuszące pole kukurydzy przy ścianie lasu. Słodkie kolby (+12 kg), ale uważaj na ogrodzenia i druty!',
      startWeight: 180,
      targetWeight: 205,
      time: 29,
      items: [
        { type: 'acorn', name: 'Kolba kukurydzy', emoji: '🌽', delta: 12, label: '+12 kg' },
        { type: 'acorn', name: 'Kolba kukurydzy', emoji: '🌽', delta: 12, label: '+12 kg' },
        { type: 'acorn', name: 'Kolba kukurydzy', emoji: '🌽', delta: 12, label: '+12 kg' },
        { type: 'truffle', name: 'Podziemna trufla', emoji: '🍄', delta: 18, label: '+18 kg' },
        { type: 'grub', name: 'Pędrak glebowy', emoji: '🐛', delta: 9, label: '+9 kg' },
        { type: 'grub', name: 'Pędrak glebowy', emoji: '🐛', delta: 9, label: '+9 kg' },
        { type: 'trash', name: 'Drut kolczasty', emoji: '⛓️', delta: -10, label: '-10 kg' },
        { type: 'stone', name: 'Polny głaz', emoji: '🪨', delta: -8, label: '-8 kg' },
        { type: 'acorn', name: 'Kolba kukurydzy', emoji: '🌽', delta: 12, label: '+12 kg' },
        { type: 'truffle', name: 'Podziemna trufla', emoji: '🍄', delta: 18, label: '+18 kg' },
        { type: 'root', name: 'Korzeń perzu', emoji: '🌿', delta: 5, label: '+5 kg' },
        { type: 'stone', name: 'Polny głaz', emoji: '🪨', delta: -8, label: '-8 kg' },
        { type: 'acorn', name: 'Kolba kukurydzy', emoji: '🌽', delta: 12, label: '+12 kg' },
        { type: 'grub', name: 'Pędrak glebowy', emoji: '🐛', delta: 9, label: '+9 kg' },
        { type: 'trash', name: 'Drut kolczasty', emoji: '⛓️', delta: -10, label: '-10 kg' },
        { type: 'acorn', name: 'Kolba kukurydzy', emoji: '🌽', delta: 12, label: '+12 kg' }
      ]
    },
    {
      name: 'Podmokłe Olchy i Tłuściutkie Pędraki 🪵🐛',
      desc: 'Bagnisty ols. Odyniec wbija potężny gwizd w gęste błoto — tu zimują największe larwy!',
      startWeight: 205,
      targetWeight: 225,
      time: 28,
      items: [
        { type: 'grub', name: 'Wielki pędrak olszowy', emoji: '🐛', delta: 14, label: '+14 kg' },
        { type: 'grub', name: 'Wielki pędrak olszowy', emoji: '🐛', delta: 14, label: '+14 kg' },
        { type: 'truffle', name: 'Trufla bagnista', emoji: '🍄', delta: 20, label: '+20 kg' },
        { type: 'root', name: 'Kłącze twarde', emoji: '🪵', delta: 6, label: '+6 kg' },
        { type: 'root', name: 'Kłącze twarde', emoji: '🪵', delta: 6, label: '+6 kg' },
        { type: 'stone', name: 'Ukryty pniak', emoji: '🪵', delta: -7, label: '-7 kg' },
        { type: 'stone', name: 'Kamień bagnisty', emoji: '🪨', delta: -8, label: '-8 kg' },
        { type: 'trash', name: 'Butelka plastikowa', emoji: '🍾', delta: -9, label: '-9 kg' },
        { type: 'grub', name: 'Wielki pędrak olszowy', emoji: '🐛', delta: 14, label: '+14 kg' },
        { type: 'truffle', name: 'Trufla bagnista', emoji: '🍄', delta: 20, label: '+20 kg' },
        { type: 'acorn', name: 'Ostatnie żołędzie', emoji: '🌰', delta: 8, label: '+8 kg' },
        { type: 'stone', name: 'Kamień bagnisty', emoji: '🪨', delta: -8, label: '-8 kg' },
        { type: 'grub', name: 'Wielki pędrak olszowy', emoji: '🐛', delta: 14, label: '+14 kg' },
        { type: 'root', name: 'Kłącze twarde', emoji: '🪵', delta: 6, label: '+6 kg' },
        { type: 'truffle', name: 'Trufla bagnista', emoji: '🍄', delta: 20, label: '+20 kg' },
        { type: 'stone', name: 'Kamień bagnisty', emoji: '🪨', delta: -8, label: '-8 kg' }
      ]
    },
    {
      name: 'Przedzimie — Zmarzlina i Śmieci ❄️🐗',
      desc: 'Pierwsze silne mrozy. Gleba stwardniała, zmarzlina utrudnia buchtowanie. Pokonaj chłód!',
      startWeight: 225,
      targetWeight: 245,
      time: 26,
      items: [
        { type: 'truffle', name: 'Zimowa trufla', emoji: '🍄', delta: 20, label: '+20 kg' },
        { type: 'truffle', name: 'Zimowa trufla', emoji: '🍄', delta: 20, label: '+20 kg' },
        { type: 'grub', name: 'Zimujący pędrak', emoji: '🐛', delta: 12, label: '+12 kg' },
        { type: 'grub', name: 'Zimujący pędrak', emoji: '🐛', delta: 12, label: '+12 kg' },
        { type: 'acorn', name: 'Zimowe żołędzie', emoji: '🌰', delta: 10, label: '+10 kg' },
        { type: 'root', name: 'Zmarznięta bulwa', emoji: '🌿', delta: 6, label: '+6 kg' },
        { type: 'stone', name: 'Głaz w zmarzlinie', emoji: '🪨', delta: -8, label: '-8 kg' },
        { type: 'stone', name: 'Głaz w zmarzlinie', emoji: '🪨', delta: -8, label: '-8 kg' },
        { type: 'trash', name: 'Odpady / drut', emoji: '🥫', delta: -12, label: '-12 kg' },
        { type: 'trash', name: 'Odpady / drut', emoji: '🥫', delta: -12, label: '-12 kg' },
        { type: 'truffle', name: 'Zimowa trufla', emoji: '🍄', delta: 20, label: '+20 kg' },
        { type: 'grub', name: 'Zimujący pędrak', emoji: '🐛', delta: 12, label: '+12 kg' },
        { type: 'stone', name: 'Głaz w zmarzlinie', emoji: '🪨', delta: -8, label: '-8 kg' },
        { type: 'acorn', name: 'Zimowe żołędzie', emoji: '🌰', delta: 10, label: '+10 kg' },
        { type: 'root', name: 'Zmarznięta bulwa', emoji: '🌿', delta: 6, label: '+6 kg' },
        { type: 'stone', name: 'Głaz w zmarzlinie', emoji: '🪨', delta: -8, label: '-8 kg' }
      ]
    },
    {
      name: 'Głęboka Zima — Król Puszczy 265 kg 👑🐗❄️',
      desc: 'Potężny Odyniec w zimowej sukni chybowej. Ostateczna próba przetrwania w puszczańskiej zmarzlinie!',
      startWeight: 245,
      targetWeight: 265,
      time: 25,
      items: [
        { type: 'truffle', name: 'Królewska trufla puszczy', emoji: '🍄', delta: 25, label: '+25 kg' },
        { type: 'truffle', name: 'Królewska trufla puszczy', emoji: '🍄', delta: 25, label: '+25 kg' },
        { type: 'grub', name: 'Głęboki pędrak', emoji: '🐛', delta: 15, label: '+15 kg' },
        { type: 'grub', name: 'Głęboki pędrak', emoji: '🐛', delta: 15, label: '+15 kg' },
        { type: 'acorn', name: 'Święty żołądź', emoji: '🌰', delta: 12, label: '+12 kg' },
        { type: 'stone', name: 'Zamarznięty głaz', emoji: '🪨', delta: -10, label: '-10 kg' },
        { type: 'stone', name: 'Zamarznięty głaz', emoji: '🪨', delta: -10, label: '-10 kg' },
        { type: 'trash', name: 'Metalowy złom', emoji: '⛓️', delta: -15, label: '-15 kg' },
        { type: 'truffle', name: 'Królewska trufla puszczy', emoji: '🍄', delta: 25, label: '+25 kg' },
        { type: 'grub', name: 'Głęboki pędrak', emoji: '🐛', delta: 15, label: '+15 kg' },
        { type: 'stone', name: 'Zamarznięty głaz', emoji: '🪨', delta: -10, label: '-10 kg' },
        { type: 'acorn', name: 'Święty żołądź', emoji: '🌰', delta: 12, label: '+12 kg' },
        { type: 'stone', name: 'Zamarznięty głaz', emoji: '🪨', delta: -10, label: '-10 kg' },
        { type: 'truffle', name: 'Królewska trufla puszczy', emoji: '🍄', delta: 25, label: '+25 kg' },
        { type: 'trash', name: 'Metalowy złom', emoji: '⛓️', delta: -15, label: '-15 kg' },
        { type: 'grub', name: 'Głęboki pędrak', emoji: '🐛', delta: 15, label: '+15 kg' }
      ]
    }
  ];

  // Game state
  let currentSeasonIdx = 0;
  let isPlaying = false;
  let timeLeft = 35;
  let timerInterval = null;
  let currentWeight = 45;
  let trufflesFound = 0;
  let dugCountInWave = 0;

  function updateHUD() {
    const s = seasons[currentSeasonIdx];
    if (levelBadge) {
      levelBadge.innerHTML = `<span>Sezon ${currentSeasonIdx + 1}/${seasons.length}:</span> ${s.name}`;
    }
    if (levelDotsContainer) {
      if (levelDotsContainer.children.length !== seasons.length) {
        levelDotsContainer.innerHTML = seasons.map((_, i) => `<span class="level-dot" title="Sezon ${i + 1}"></span>`).join('');
      }
      const dots = levelDotsContainer.querySelectorAll('.level-dot');
      dots.forEach((dot, idx) => {
        dot.className = 'level-dot';
        if (idx < currentSeasonIdx) dot.classList.add('completed');
        else if (idx === currentSeasonIdx) dot.classList.add('active');
      });
    }
    timerVal.textContent = `${s.time}s`;
    weightVal.textContent = `${currentWeight} kg`;
    if (targetWeightVal) targetWeightVal.textContent = `${s.targetWeight} kg`;
    trufflesVal.textContent = trufflesFound;
  }

  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function renderGrid() {
    grid.innerHTML = '';
    dugCountInWave = 0;
    const s = seasons[currentSeasonIdx];
    const shuffledItems = shuffle(s.items);

    shuffledItems.forEach((item) => {
      const tile = document.createElement('div');
      tile.className = 'soil-tile';
      tile.innerHTML = `
        <span class="soil-cover">🌱</span>
        <span class="soil-content" style="display: none; flex-direction: column; align-items: center;">
          <span style="font-size: 1.8rem;">${item.emoji}</span>
          <span style="font-size: 0.72rem; font-weight: 700; color: ${item.delta > 0 ? '#4ADE80' : '#F87171'}; font-family: var(--font-mono); margin-top: 2px;">${item.label}</span>
        </span>
      `;

      tile.addEventListener('click', () => {
        if (!isPlaying || tile.classList.contains('dug')) return;
        digTile(tile, item);
      });

      grid.appendChild(tile);
    });
  }

  function digTile(tile, item) {
    tile.classList.add('dug');
    dugCountInWave++;

    const cover = tile.querySelector('.soil-cover');
    const content = tile.querySelector('.soil-content');
    if (cover) cover.style.display = 'none';
    if (content) content.style.display = 'flex';

    // Apply outcome
    currentWeight += item.delta;
    if (currentWeight < 50) currentWeight = 50;
    weightVal.textContent = `${currentWeight} kg`;

    if (item.type === 'truffle') {
      trufflesFound++;
      trufflesVal.textContent = trufflesFound;
      playTruffleChime();
    } else if (item.delta < 0) {
      playRockClunk();
      tile.style.borderColor = '#EF4444';
    } else {
      playRootSound();
    }

    const s = seasons[currentSeasonIdx];

    // Check Win
    if (currentWeight >= s.targetWeight) {
      setTimeout(() => endGame(true), 300);
      return;
    }

    // Auto-regenerate fresh forest patch if wave exhausted
    if (dugCountInWave >= 16) {
      setTimeout(() => {
        if (!isPlaying) return;
        renderGrid();
      }, 500);
    }
  }

  function startSeason(sIdx) {
    getAudioCtx();
    currentSeasonIdx = sIdx;
    const s = seasons[currentSeasonIdx];

    isPlaying = true;
    timeLeft = s.time;
    currentWeight = s.startWeight;
    trufflesFound = 0;

    overlay.classList.add('hidden');
    updateHUD();
    renderGrid();

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      timerVal.textContent = `${timeLeft}s`;
      if (timeLeft <= 0) {
        endGame(currentWeight >= s.targetWeight);
      }
    }, 1000);
  }

  function endGame(isWin) {
    isPlaying = false;
    clearInterval(timerInterval);
    overlay.classList.remove('hidden');

    startBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    restartBtn.style.display = 'none';
    resetBtn.style.display = 'none';

    const s = seasons[currentSeasonIdx];

    if (isWin) {
      playTruffleChime();

      if (currentSeasonIdx < seasons.length - 1) {
        // Season complete, next season ready
        overlayIcon.textContent = '🎉🐗🍂';
        overlayTitle.textContent = `Sezon ${currentSeasonIdx + 1} Zakończony Sukcesem!`;
        overlayDesc.innerHTML = `
          Odyniec osiągnął wymaganą wagę <strong style="color: #4ADE80; font-size: 1.25rem;">${currentWeight} kg</strong>!<br>
          Znalazłeś <strong>${trufflesFound} trufli</strong> 🍄 w czasie <strong>${s.time - timeLeft}s</strong>.<br>
          Przed Tobą kolejny etap puszczańskiego cyklu!
        `;
        nextBtn.style.display = 'inline-flex';
        restartBtn.style.display = 'inline-flex';
      } else {
        // Campaign Complete: 200 kg King of Forest
        overlayIcon.textContent = '👑🐗🌲';
        overlayTitle.textContent = 'Potężny Odyniec — Król Puszczy!';
        overlayDesc.innerHTML = `
          <strong>Ukończyłeś wszystkie 3 sezony buchtowania!</strong><br>
          Osiągnąłeś monumentalną wagę <strong style="color: #4ADE80; font-size: 1.3rem;">${currentWeight} kg</strong>!<br>
          Twoje buchtowanie napowietrzyło glebę całego lasu, rozsiało zarodniki mikoryzowe i przygotowało puszczę na nadejście wiosny. Prawdziwy inżynier leśnego ekosystemu!
        `;
        resetBtn.style.display = 'inline-flex';
      }
    } else {
      // Season Failed
      playRockClunk();
      overlayIcon.textContent = '⏰❄️🐗';
      overlayTitle.textContent = 'Za mało kalorii przed końcem sezonu!';
      overlayDesc.innerHTML = `
        Zgromadziłeś masę <strong>${currentWeight} kg</strong> (wymagany cel: <strong>${s.targetWeight} kg</strong>).<br>
        Zima w puszczy bywa sroga — unikaj kamieni i śmieci, wybieraj bogate w tłuszcz pędraki i trufle. Spróbuj ponownie!
      `;
      restartBtn.style.display = 'inline-flex';
      if (currentSeasonIdx > 0) resetBtn.style.display = 'inline-flex';
    }
  }

  // Event Listeners
  startBtn.addEventListener('click', () => startSeason(0));
  nextBtn.addEventListener('click', () => startSeason(currentSeasonIdx + 1));
  restartBtn.addEventListener('click', () => startSeason(currentSeasonIdx));
  resetBtn.addEventListener('click', () => startSeason(0));

  updateHUD();
  renderGrid();
}



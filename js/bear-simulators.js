/* ============================================================
   BEAR (NIEDŹWIEDŹ BRUNATNY) — SENSORY SIMULATORS & 10-LEVEL GAME
   Author: Dorian Kalinowski for "Świat zmysłami zwierząt"
   Senses: Scent over 20 km, Mountain trail crisis protocols, Winter torpor
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initBearAudioSynthesizer();
  initBearScentCanvas();
  initBearAnatomyInspector();
  initBearCrisisSimulator();
  initBearForagingGame();
  initBearQuiz();
});

/* ============================================================
   1. BEAR VOCALS & WARNING AUDIO SYNTHESIZER
   ============================================================ */
function initBearAudioSynthesizer() {
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

  const playHuffBtn = document.getElementById('playBearHuffBtn');
  const playPopBtn = document.getElementById('playBearPopBtn');
  const playRoarBtn = document.getElementById('playBearRoarBtn');

  // Guttural huff (fukanie ostrzegawcze nosowe)
  function playHuff() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      const bufferSize = ctx.sampleRate * 0.35;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.25;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch (e) {}
  }

  // Jaw popping / teeth clack (kłapanie zębami jako objaw silnego stresu)
  function playJawPop() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      [0, 0.08, 0.16].forEach((delay) => {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(180, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.04);
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.04);
        }, delay * 1000);
      });
    } catch (e) {}
  }

  // Deep roar (głęboki, basowy ryk terytorialny 70-130 Hz)
  function playRoar() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(95, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(75, ctx.currentTime + 0.8);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(140, ctx.currentTime);
      osc2.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.8);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.85);

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc2.start();
      osc.stop(ctx.currentTime + 0.85);
      osc2.stop(ctx.currentTime + 0.85);
    } catch (e) {}
  }

  playHuffBtn?.addEventListener('click', playHuff);
  playPopBtn?.addEventListener('click', playJawPop);
  playRoarBtn?.addEventListener('click', playRoar);
}

/* ============================================================
   2. SCENT CLOUD WIND DRIFT CANVAS
   ============================================================ */
function initBearScentCanvas() {
  const canvas = document.getElementById('bearScentCanvas');
  const windSlider = document.getElementById('bearWindSlider');
  const foodSelect = document.getElementById('bearFoodSelect');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.clientWidth || 600);
  let height = (canvas.height = 280);

  window.addEventListener('resize', () => {
    if (!canvas) return;
    width = canvas.width = canvas.clientWidth || 600;
  });

  let particles = [];
  let windSpeed = 3.5;

  windSlider?.addEventListener('input', () => {
    windSpeed = parseFloat(windSlider.value);
  });

  function render() {
    ctx.fillStyle = '#0D110D';
    ctx.fillRect(0, 0, width, height);

    // Mountain ridge silhouette
    ctx.fillStyle = '#070A07';
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, height - 70);
    ctx.lineTo(160, height - 120);
    ctx.lineTo(340, height - 80);
    ctx.lineTo(width, height - 130);
    ctx.lineTo(width, height);
    ctx.fill();

    // Source of scent (food) at left: (70, height - 90)
    const sourceX = 70;
    const sourceY = height - 90;
    const foodEmoji = foodSelect?.value === 'honey' ? '🍯' : (foodSelect?.value === 'berries' ? '🫐' : '🥩');

    ctx.save();
    ctx.font = '28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(foodEmoji, sourceX, sourceY);
    ctx.restore();

    // Bear at right (width - 70, height - 100)
    const bearX = width - 70;
    const bearY = height - 100;
    ctx.save();
    ctx.font = '34px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🐻', bearX, bearY);
    ctx.restore();

    // Spawn scent particles
    if (Math.random() < 0.6) {
      particles.push({
        x: sourceX + 15,
        y: sourceY + (Math.random() - 0.5) * 20,
        vx: windSpeed * (0.8 + Math.random() * 0.4),
        vy: (Math.random() - 0.5) * 1.5,
        r: 3 + Math.random() * 5,
        alpha: 0.8
      });
    }

    // Process particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.r += 0.15; // scent expands in air cone
      p.alpha = Math.max(0, p.alpha - 0.007);

      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245, 158, 11, ${p.alpha * 0.6})`;
      ctx.fill();
      ctx.restore();

      // Check if reaches bear
      const d = Math.hypot(p.x - bearX, p.y - bearY);
      if (d < 40) {
        ctx.save();
        ctx.fillStyle = '#10B981';
        ctx.font = '12px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('WĘCH WYKRYTY! (20 km)', bearX, bearY - 45);
        ctx.restore();
      }

      if (p.x > width + 20 || p.alpha <= 0.01) {
        particles.splice(i, 1);
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ============================================================
   3. BEAR ANATOMY & BIOMECHANICS INSPECTOR
   ============================================================ */
function initBearAnatomyInspector() {
  const buttons = document.querySelectorAll('[data-bear-anatomy]');
  const titleEl = document.getElementById('bearAnatomyTitle');
  const descEl = document.getElementById('bearAnatomyDesc');
  const statEl = document.getElementById('bearAnatomyStat');

  if (!buttons.length || !titleEl) return;

  const data = {
    hump: {
      title: 'Garb Mięśniowy Łopatek (Potęga Kopania)',
      desc: 'Masywny garb na karku niedźwiedzia brunatnego to nie tłuszcz, lecz potężny zespół mięśni łączący łopatki z kręgosłupem. Daje mu nieludzką siłę do rozrywania pni drzew, przewracania głazów ważących 200 kg i kopania głębokich gawr zimowych.',
      stat: 'Siła uderzenia łapy: do 1200 kg'
    },
    claws: {
      title: 'Niechowane Pazury o Długości do 10 cm',
      desc: 'W odróżnieniu od kotów, niedźwiedź nie chowa pazurów. Są lekko zakrzywione, tępe i potężne jak kilofy. Służą do wykopywania korzeni, rozłupywania mrowisk i wspinaczki po stromych tatrzańskich żlebach.',
      stat: 'Długość: 8–10 cm (konstrukcja kilofa)'
    },
    nose: {
      title: 'Super-Nos z Labiryntem Małżowin Węchowych',
      desc: 'Powierzchnia nabłonka węchowego niedźwiedzia jest 100-krotnie większa niż u człowieka i 7-krotnie większa niż u psa ogara. Niedźwiedź czuje zapach padliny przez litą ścianę lasu z odległości 20 km i wyczuwa obecność człowieka pod wiatr z 2 km!',
      stat: 'Zasięg węchu: do 20 km w górach'
    },
    teeth: {
      title: 'Wszystkożerne Zęby i Spłaszczone Trzonowce',
      desc: 'Choć niedźwiedź należy do rzędu drapieżnych, 75% jego diety to rośliny (jagody, bukiew, trawy, zioła). Jego zęby trzonowe są szerokie i spłaszczone jak u roślinożerców, idealne do miażdżenia twardego pokarmu roślinnego.',
      stat: 'Dieta: 75% rośliny, 25% białko'
    },
    ears: {
      title: 'Okrągłe Uszy o Czułym Słuchu Kierunkowym',
      desc: 'Niedźwiedź posiada małe, gęsto owłosione uszy chroniące przed mrozem i odmrożeniami. Słyszy szelest łamanej gałązki z kilkuset metrów i natychmiast unosi głowę, weryfikując dźwięk swoim genialnym węchem.',
      stat: 'Słuch: do 50 kHz'
    }
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.getAttribute('data-bear-anatomy');
      const item = data[key];
      if (!item) return;

      titleEl.textContent = item.title;
      descEl.textContent = item.desc;
      if (statEl) statEl.textContent = item.stat;
    });
  });
}

/* ============================================================
   4. CRISIS SIMULATOR: SPOTKANIE Z NIEDŹWIEDZIEM NA SZLAKU
   ============================================================ */
function initBearCrisisSimulator() {
  const cards = document.querySelectorAll('.bear-crisis-card');
  const resultBox = document.getElementById('bearCrisisResult');
  if (!cards.length || !resultBox) return;

  const responses = {
    run: {
      type: 'danger',
      title: '❌ ŚMIERTELNY BŁĄD: Ucieczka biegiem!',
      text: 'NIGDY nie uciekaj przed niedźwiedziem! Niedźwiedź osiąga prędkość 50 km/h (jest szybszy od Usaina Bolta) i bez trudu dogoni człowieka pod górę i w dół stoku. Ucieczka automatycznie odpala w mózgu niedźwiedzia instynkt pogoni za uciekającą ofiarą.'
    },
    scream_attack: {
      type: 'danger',
      title: '❌ Błąd krytyczny: Piskliwy krzyk i rzucanie kamieniami!',
      text: 'Wysoki, histeryczny krzyk lub rzucanie plecakiem zostanie odebrane jako atak. Niedźwiedź nie kalkuluje — w obronie własnej natychmiast wykona kontratak.'
    },
    tree: {
      type: 'danger',
      title: '⚠️ Złudne bezpieczeństwo: Wspinaczka na drzewo',
      text: 'Młode niedźwiedzie wspinają się po pniach z gracją wiewiórki, a dorosłe potrafią potrząsnąć drzewem lub wejść za Tobą na wysokość kilku metrów. Wspinaczka zabiera też cenny czas.'
    },
    calm_retreat: {
      type: 'success',
      title: '✅ IDEALNY PROTOKÓŁ BEZPIECZEŃSTWA (100% zaleceń TPN/GOPR):',
      text: '1. Zatrzymaj się i zachowaj spokój. Gdy stoi na dwóch łapach — NIE atakuje, tylko węszy!<br>2. Mów do niego spokojnym, niskim i stanowczym ludzkim głosem (*„Hej niedźwiedziu, spokojnie, już odchodzę”*).<br>3. Powoli, bez gwałtownych ruchów, wycofuj się tyłem tą samą ścieżką, trzymając ręce spokojnie wzdłuż ciała.<br>4. Jeśli dojdzie do rzadkiego ataku kontaktowego (np. matka z młodymi): **Pozycja Żółwia** (brzuch do ziemi, dłonie zaplecione na karku, łokcie przy głowie).'
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
   5. 10-LEVEL MINIGAME: ZAPACHOWY SZLAK BIESZCZADÓW
   ============================================================ */
function initBearForagingGame() {
  const canvas = document.getElementById('bearGameCanvas');
  const overlay = document.getElementById('bearGameOverlay');
  const startBtn = document.getElementById('startBearGameBtn');
  const nextBtn = document.getElementById('nextBearLevelBtn');
  const restartBtn = document.getElementById('restartBearGameBtn');
  const resetBtn = document.getElementById('resetBearCampaignBtn');

  const timerVal = document.getElementById('bearGameTimer');
  const caloriesVal = document.getElementById('bearGameCalories');
  const targetCaloriesVal = document.getElementById('bearGameTargetCalories');
  const levelBadge = document.getElementById('bearGameLevelBadge');
  const levelDotsContainer = document.getElementById('bearGameLevelDots');
  const overlayIcon = document.getElementById('bearGameOverIcon');
  const overlayTitle = document.getElementById('bearGameOverTitle');
  const overlayDesc = document.getElementById('bearGameOverDesc');

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

  function playChompSound() {
    const c = getAudioCtx();
    if (!c) return;
    try {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, c.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, c.currentTime + 0.12);
      gain.gain.setValueAtTime(0.2, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start();
      osc.stop(c.currentTime + 0.12);
    } catch (e) {}
  }

  // 10 Progressive Mountain Foraging Levels
  const levels = [
    {
      name: 'Wiosenne Polany nad Potokiem 🌿🐻',
      desc: 'Wiosenne przebudzenie z gawry. Zgłodniały niedźwiedź szuka świeżych traw, ziół i korzonków.',
      time: 40,
      targetCalories: 600,
      tourists: 0
    },
    {
      name: 'Buczyna Karpacka i Korzenie 🌳',
      desc: 'Stara buczyna. Pnie pełne owadów i zeszłoroczne orzeszki bukwi pod liśćmi.',
      time: 38,
      targetCalories: 800,
      tourists: 1
    },
    {
      name: 'Dzika Pasieka w Dziupli 🍯',
      desc: 'Słodki zapach miodu z odległości 3 km! Uważaj na żądlące pszczoły i wędrowców.',
      time: 36,
      targetCalories: 950,
      tourists: 1
    },
    {
      name: 'Jagodowisko na Połoninie Caryńskiej 🫐',
      desc: 'Setki krzaczków borówek! Niedźwiedź zjada do 40 kg jagód dziennie przed zimą.',
      time: 36,
      targetCalories: 1100,
      tourists: 2
    },
    {
      name: 'Padlina w Wąwozie pod Otrytem 🥩',
      desc: 'Wąwóz bieszczadzki kryje resztki upolowanego jelenia. Bogate źródło białka i tłuszczu.',
      time: 34,
      targetCalories: 1250,
      tourists: 2
    },
    {
      name: 'Zmierzch nad Solinką: Pstrągi 🌊🐟',
      desc: 'Ciche polowanie w górskim nurcie. Złap zwinne ryby i unikaj obozowiczów.',
      time: 34,
      targetCalories: 1400,
      tourists: 2
    },
    {
      name: 'Zbieracze Poroża w Głębokiej Puszczy 🫎⚠️',
      desc: 'Ludzie z psami przeczesują las. Pamiętaj: omijaj zapach człowieka wielkim łukiem!',
      time: 32,
      targetCalories: 1550,
      tourists: 3
    },
    {
      name: 'Deszczowa Noc w Bieszczadzkim Parku 🌧️',
      desc: 'Wiatr i deszcz znoszą zapachy. Użyj super-węchu, by odnaleźć kalorie w błocie.',
      time: 32,
      targetCalories: 1700,
      tourists: 3
    },
    {
      name: 'Przygotowanie do Gawry — Ostatnie Kalorie 🍂',
      desc: 'Pierwsze przymrozki. Ostatnie dni żerowania przed zapadnięciem w 5-miesięczny letarg.',
      time: 30,
      targetCalories: 1850,
      tourists: 3
    },
    {
      name: 'Władca Karpackiej Puszczy — Sen Zimowy 👑🐻❄️',
      desc: 'Finałowe wyzwanie! Zgromadź 2000 kcal tłuszczu i wejdź bezpiecznie do ciepłej gawry.',
      time: 32,
      targetCalories: 2000,
      tourists: 4
    }
  ];

  let currentLevelIdx = 0;
  let isPlaying = false;
  let timeLeft = 40;
  let timerInterval = null;
  let animId = null;
  let currentCalories = 0;

  // Bear Pos
  let bearX = 60;
  let bearY = 170;
  let targetBearX = 60;
  let targetBearY = 170;

  // Entities
  let foods = [];
  let tourists = [];

  function spawnLevelEntities() {
    const lvl = levels[currentLevelIdx];
    foods = [];
    tourists = [];

    const foodTypes = [
      { emoji: '🫐', cal: 150 },
      { emoji: '🍯', cal: 300 },
      { emoji: '🥩', cal: 400 },
      { emoji: '🐟', cal: 250 },
      { emoji: '🌰', cal: 120 }
    ];

    for (let i = 0; i < 9; i++) {
      const f = foodTypes[Math.floor(Math.random() * foodTypes.length)];
      foods.push({
        x: 100 + Math.random() * (width - 140),
        y: 40 + Math.random() * (height - 80),
        emoji: f.emoji,
        cal: f.cal,
        collected: false
      });
    }

    for (let i = 0; i < lvl.tourists; i++) {
      tourists.push({
        x: 150 + Math.random() * (width - 180),
        y: 40 + Math.random() * (height - 80),
        vx: (Math.random() - 0.5) * 1.6,
        vy: (Math.random() - 0.5) * 1.6
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
    if (caloriesVal) caloriesVal.textContent = `${currentCalories} kcal`;
    if (targetCaloriesVal) targetCaloriesVal.textContent = `${lvl.targetCalories} kcal`;
    if (timerVal) timerVal.textContent = `${timeLeft}s`;
  }

  function handlePointer(e) {
    if (!isPlaying) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    targetBearX = Math.max(25, Math.min(width - 25, clientX - rect.left));
    targetBearY = Math.max(25, Math.min(height - 25, clientY - rect.top));
  }

  canvas.addEventListener('mousemove', handlePointer);
  canvas.addEventListener('touchstart', (e) => { e.preventDefault(); handlePointer(e); }, { passive: false });
  canvas.addEventListener('touchmove', (e) => { e.preventDefault(); handlePointer(e); }, { passive: false });

  function startGame(lvlIdx = 0) {
    currentLevelIdx = lvlIdx;
    const lvl = levels[currentLevelIdx];
    isPlaying = true;
    timeLeft = lvl.time;
    currentCalories = 0;
    bearX = 60;
    bearY = height / 2;
    targetBearX = 60;
    targetBearY = height / 2;

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
        endGame(false, '⏱️ Zmierzch w Bieszczadach!', 'Zabrakło kalorii na zimę. Węszyj uważniej i unikaj spotkań z turystami.');
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
      overlayIcon.textContent = '🏆🐻👑';
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
      overlayIcon.textContent = '🐻⚠️';
      startBtn.style.display = 'none';
      nextBtn.style.display = 'none';
      restartBtn.style.display = 'inline-block';
      resetBtn.style.display = 'none';
    }
  }

  function loop() {
    if (!isPlaying) return;

    bearX += (targetBearX - bearX) * 0.12;
    bearY += (targetBearY - bearY) * 0.12;

    ctx.fillStyle = '#0F140D';
    ctx.fillRect(0, 0, width, height);

    // Tourists
    tourists.forEach(t => {
      t.x += t.vx;
      t.y += t.vy;
      if (t.x < 40 || t.x > width - 40) t.vx *= -1;
      if (t.y < 40 || t.y > height - 40) t.vy *= -1;

      ctx.save();
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🎒', t.x, t.y);
      ctx.restore();

      // Threat check
      const d = Math.hypot(bearX - t.x, bearY - t.y);
      if (d < 38) {
        endGame(false, '⚠️ Spotkanie z turystą na szlaku!', 'Podszedłeś zbyt blisko człowieka! Niedźwiedź unika ludzi za wszelką cenę. Trzymaj dystans minimum 50 metrów!');
      }
    });

    // Foods
    const lvl = levels[currentLevelIdx];
    foods.forEach(f => {
      if (f.collected) return;

      ctx.save();
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(f.emoji, f.x, f.y);
      ctx.restore();

      // Eat check
      const d = Math.hypot(bearX - f.x, bearY - f.y);
      if (d < 28) {
        f.collected = true;
        currentCalories += f.cal;
        playChompSound();
        if (caloriesVal) caloriesVal.textContent = `${currentCalories} kcal`;

        if (currentCalories >= lvl.targetCalories) {
          endGame(true, `🎉 Poziom ${currentLevelIdx + 1} Ukończony!`, `Niedźwiedź zgromadził wymaganą porcję kalorii (${currentCalories} kcal).`);
        }
      }
    });

    // Draw Bear
    ctx.save();
    ctx.font = '32px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🐻', bearX, bearY);
    ctx.restore();

    animId = requestAnimationFrame(loop);
  }

  startBtn?.addEventListener('click', () => startGame(0));
  restartBtn?.addEventListener('click', () => startGame(currentLevelIdx));
  nextBtn?.addEventListener('click', () => startGame(currentLevelIdx + 1));
  resetBtn?.addEventListener('click', () => startGame(0));
}

/* ============================================================
   INTERACTIVE QUIZ: MISTRZ ZMYSŁÓW NIEDŹWIEDZIA
   ============================================================ */
function initBearQuiz() {
  const quizBody = document.getElementById('bearQuizDynamicBody');
  const progressBar = document.getElementById('bearQuizMeterProgress');

  if (!quizBody || !progressBar) return;

  const questions = [
    {
      q: 'O ile razy węch niedźwiedzia brunatnego przewyższa węch psa domowego (np. bloodhounda)?',
      options: [
        'Jest słabszy od węchu psa',
        'Jest dokładnie taki sam',
        'Jest około 7 razy czulszy od węchu psa (i ponad 2100 razy czulszy od człowieka!)',
        'Niedźwiedzie w ogóle nie posługują się węchem'
      ],
      correct: 2,
      explanation: 'Opuszka węchowa w mózgu niedźwiedzia jest 5 razy większa niż u człowieka, a nabłonek węchowy ma powierzchnię setek centymetrów kwadratowych. Niedźwiedź potrafi wyczuć padlinę lub zapach jedzenia z odległości ponad 20–30 km!'
    },
    {
      q: 'Dlaczego ucieczka sprintem lub wdrapywanie się na drzewo przed niedźwiedziem to fatalny błąd?',
      options: [
        'Niedźwiedź biega z prędkością do 50 km/h, świetnie wspina się na drzewa, a bieg wyzwala u niego instynkt pogoni',
        'Na drzewach w polskich lasach nie ma wystarczająco grubych gałęzi',
        'Niedźwiedzie potrafią latać',
        'Ucieczka jest akurat najlepszą i w 100% skuteczną metodą'
      ],
      correct: 0,
      explanation: 'Nawet 300-kilogramowy niedźwiedź rozwija na krótkim dystansie prędkość 50 km/h (szybciej niż Usain Bolt!). Dodatkowo instynkt drapieżnika nakazuje mu ścigać uciekający obiekt. Młodsze niedźwiedzie wspinają się na drzewa z zawrotną zwinnością!'
    },
    {
      q: 'Jak należy się zachować, jeśli dojdzie do bezpośredniego ataku niedźwiedzia i kontaktu fizycznego?',
      options: [
        'Krzyczeć głośno i zadawać ciosy pięściami w pysk',
        'Przyjąć pozycję „żółwia”: położyć się płasko na brzuchu, spleść dłonie na karku i osłonić łokciami głowę i twarz',
        'Próbować złapać niedźwiedzia za uszy',
        'Zacząć gwałtownie turlać się w dół zbocza'
      ],
      correct: 1,
      explanation: 'Pozycja żółwia chroni najważniejsze narządy: szyję, kark, twarz i brzuch. Nogi należy rozstawić szeroko, by niedźwiedziowi trudno było obrócić Cię na plecy. Leż bez ruchu i bez dźwięku — gdy niedźwiedź uzna, że nie stanowisz zagrożenia, odejdzie.'
    },
    {
      q: 'Co w rzeczywistości oznacza, gdy niedźwiedź na szlaku staje na tylnych łapach?',
      options: [
        'To bezpośrednia zapowiedź skoku i ataku bojowego',
        'Niedźwiedź prosi o jedzenie jak pies w cyrku',
        'Próbuje lepiej zwęszyć otoczenie i rozejrzeć się ponad krzakami — to gest zaciekawienia, a nie agresji',
        'Świadczy o tym, że niedźwiedź jest chory na wściekliznę'
      ],
      correct: 2,
      explanation: 'Wzrok niedźwiedzia jest przeciętny, więc stając na tylnych łapach unosi nos wysoko w powietrze, by złapać strugi wiatru i zidentyfikować obiekt. Dopóki nie szarżuje na czterech łapach z kłapaniem szczęk, po prostu bada sytuację!'
    },
    {
      q: 'Z czego składa się większość diety polskiego niedźwiedzia brunatnego w Bieszczadach i Tatrach?',
      options: [
        'Jest bezwzględnym mięsożercą polującym wyłącznie na jelenie i sarny',
        'Jest wszystkożerny — aż 70–80% jego pożywienia stanowią rośliny: jagody, pędy, orzeszki bukowe (bukiew), trawy i owady',
        'Żywi się wyłącznie rybami łososiowatymi jak niedźwiedź na Alasce',
        'Zjada wyłącznie miód z barci'
      ],
      correct: 1,
      explanation: 'Mimo imponujących kłów i potężnych łap niedźwiedź brunatny w Polsce jest w przeważającej mierze roślinożercą i owadożercą! Na mięso (padlinę lub polowanie) przypada zaledwie ułamek jego rocznego zapotrzebowania kalorycznego.'
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
      <div id="bearQuizFeedback"></div>
      <div class="quiz-action-bar" id="bearQuizNextBar" style="display: none; margin-top: 20px;">
        <button class="btn btn-primary" id="bearQuizNextBtn" style="background: linear-gradient(135deg, #F59E0B 0%, #B45309 100%);">
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

    const feedbackEl = document.getElementById('bearQuizFeedback');
    const nextBar = document.getElementById('bearQuizNextBar');

    optButtons[qData.correct].classList.add('correct');

    if (selected === qData.correct) {
      score++;
      feedbackEl.className = 'quiz-feedback-banner success';
      feedbackEl.innerHTML = `<strong>Wspaniale!</strong> ${qData.explanation}`;
    } else {
      optButtons[selected].classList.add('wrong');
      feedbackEl.className = 'quiz-feedback-banner failure';
      feedbackEl.innerHTML = `<strong>Niestety nie.</strong> ${qData.explanation}`;
    }

    nextBar.style.display = 'flex';
    document.getElementById('bearQuizNextBtn').addEventListener('click', () => {
      currentIdx++;
      renderQuestion();
    });
  }

  function renderSummary() {
    progressBar.style.width = '100%';
    const percent = Math.round((score / questions.length) * 100);

    let rankTitle = 'Strażnik Karpackiej Puszczy 🐻';
    let badgeEmoji = '👑';
    let rankDesc = 'Perfekcyjna wiedza! Znasz potęgę węchu niedźwiedzia, zasady bezpieczeństwa na szlaku i pozycję żółwia ratującą życie.';

    if (percent < 80 && percent >= 60) {
      rankTitle = 'Wytrawny Wędrowiec Górski 🌲';
      badgeEmoji = '🎖️';
      rankDesc = 'Bardzo dobry wynik! Wiesz, jak zachować się w gawrze i dlaczego ucieczka sprintem jest bezcelowa.';
    } else if (percent < 60) {
      rankTitle = 'Początkujący Turysta Tatrzański 📚';
      badgeEmoji = '🐾';
      rankDesc = 'Warto odświeżyć procedury bezpieczeństwa TPN i BPN — szacunek do niedźwiedzia i wiedza to gwarancja bezpiecznych wędrówek!';
    }

    quizBody.innerHTML = `
      <div class="quiz-certificate">
        <div class="certificate-badge-emoji">${badgeEmoji}</div>
        <div class="certificate-score">${score} / ${questions.length}</div>
        <h3 class="certificate-title">${rankTitle}</h3>
        <p class="certificate-desc">${rankDesc}</p>
        <button class="btn btn-primary" id="bearQuizRestartBtn" style="background: linear-gradient(135deg, #F59E0B 0%, #B45309 100%);">Rozwiąż quiz ponownie ↺</button>
      </div>
    `;

    document.getElementById('bearQuizRestartBtn').addEventListener('click', () => {
      currentIdx = 0;
      score = 0;
      renderQuestion();
    });
  }

  renderQuestion();
}


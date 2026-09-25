/* ============================================================
   Dog Sensory Simulators & Safety Interactive Engine
   Author: Dorian Kalinowski for "Świat zmysłami zwierząt"
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initDogVisionSimulator();
  initHearingLab();
  initStereoScentTracker();
  initBodyLanguageInspector();
  initCrisisSimulator();
  initInteractiveQuiz();
  initDogScentGame();
});

/* ============================================================
   1. DOG VISION SIMULATOR 2.0 (Split-Slider, Motion, Tapetum)
   ============================================================ */
function initDogVisionSimulator() {
  const viewport = document.getElementById('visionViewport');
  const splitHandle = document.getElementById('visionSplitHandle');
  const dogSide = document.getElementById('visionDogSide');
  const motionToggle = document.getElementById('motionToggle');
  const nightToggle = document.getElementById('nightToggle');
  const humanCanvas = document.getElementById('canvasHuman');
  const dogCanvas = document.getElementById('canvasDog');

  if (!viewport || !humanCanvas || !dogCanvas) return;

  const ctxH = humanCanvas.getContext('2d');
  const ctxD = dogCanvas.getContext('2d');

  let width = (humanCanvas.width = dogCanvas.width = viewport.clientWidth || 600);
  let height = (humanCanvas.height = dogCanvas.height = 340);

  window.addEventListener('resize', () => {
    if (!viewport) return;
    width = humanCanvas.width = dogCanvas.width = viewport.clientWidth;
    height = humanCanvas.height = dogCanvas.height = viewport.clientHeight || 340;
  });

  // Simulation state
  let splitPercent = 50;
  let isDragging = false;
  let isMotionActive = false;
  let isNightActive = false;

  // Scene elements
  let ball = { x: 120, y: height - 60, vx: 2.8, vy: 0, radius: 18, bounceY: 0 };
  let rabbit = { x: width - 100, y: height - 50, vx: -2, frame: 0 };
  let animId;

  // Render Loop
  function drawScene() {
    // 1. Clear canvases
    ctxH.clearRect(0, 0, width, height);
    ctxD.clearRect(0, 0, width, height);

    // Update motion if active
    if (isMotionActive) {
      ball.x += ball.vx;
      ball.bounceY += 0.12;
      ball.y = height - 70 + Math.sin(ball.bounceY) * 35;
      if (ball.x > width - 40 || ball.x < 40) ball.vx *= -1;

      rabbit.x += rabbit.vx;
      rabbit.frame += 0.15;
      if (rabbit.x < 50 || rabbit.x > width - 60) rabbit.vx *= -1;
    }

    // --- DRAW HUMAN VIEW (Trichromatic, Sharp, Full Spectrum) ---
    drawParkBackground(ctxH, false);
    drawSceneObjects(ctxH, false);

    // --- DRAW DOG VIEW (Dichromatic: Blue/Yellow, 20/75 acuity, motion glow) ---
    drawParkBackground(ctxD, true);
    drawSceneObjects(ctxD, true);

    animId = requestAnimationFrame(drawScene);
  }

  function drawParkBackground(ctx, isDog) {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.65);
    if (isNightActive) {
      if (isDog) {
        // Tapetum Lucidum amplifies light 5x in dark!
        skyGrad.addColorStop(0, '#1E293B');
        skyGrad.addColorStop(1, '#334155');
      } else {
        skyGrad.addColorStop(0, '#05070B');
        skyGrad.addColorStop(1, '#0F172A');
      }
    } else {
      if (isDog) {
        // Blue spectrum preserved, cyan sky
        skyGrad.addColorStop(0, '#7DD3FC');
        skyGrad.addColorStop(1, '#BAE6FD');
      } else {
        skyGrad.addColorStop(0, '#38BDF8');
        skyGrad.addColorStop(1, '#93C5FD');
      }
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // Grass Hills
    const grassGrad = ctx.createLinearGradient(0, height * 0.55, 0, height);
    if (isNightActive) {
      if (isDog) {
        grassGrad.addColorStop(0, '#475569');
        grassGrad.addColorStop(1, '#334155');
      } else {
        grassGrad.addColorStop(0, '#0F172A');
        grassGrad.addColorStop(1, '#020617');
      }
    } else {
      if (isDog) {
        // Green grass appears dull brownish-yellow to dogs (dichromatism)
        grassGrad.addColorStop(0, '#B5A642');
        grassGrad.addColorStop(1, '#8C7D2D');
      } else {
        // Lush green to human
        grassGrad.addColorStop(0, '#22C55E');
        grassGrad.addColorStop(1, '#15803D');
      }
    }
    ctx.fillStyle = grassGrad;
    ctx.beginPath();
    ctx.moveTo(0, height * 0.62);
    ctx.quadraticCurveTo(width * 0.35, height * 0.52, width * 0.7, height * 0.65);
    ctx.quadraticCurveTo(width * 0.85, height * 0.7, width, height * 0.6);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

    // Distant tree
    ctx.fillStyle = isDog ? '#807743' : '#166534';
    ctx.beginPath();
    ctx.arc(width * 0.82, height * 0.52, 45, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = isDog ? '#5A4E2C' : '#78350F';
    ctx.fillRect(width * 0.82 - 8, height * 0.52 + 30, 16, 45);
  }

  function drawSceneObjects(ctx, isDog) {
    // 1. Red Ball
    // Critical distinction: Humans see intense vibrant red against green.
    // Dogs lack red cones: Red looks dull brownish-gray, camouflaged in grass!
    ctx.save();
    if (isDog) {
      if (isMotionActive) {
        // Canine motion sensitivity: moving objects stand out with motion aura
        ctx.shadowColor = '#FDE047';
        ctx.shadowBlur = 18;
        ctx.fillStyle = '#C8B265';
      } else {
        // Stationary ball blends in
        ctx.fillStyle = '#8F8569';
      }
    } else {
      ctx.fillStyle = '#EF4444'; // Bright human red
      ctx.shadowColor = 'rgba(239, 68, 68, 0.4)';
      ctx.shadowBlur = 10;
    }
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // Ball highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(ball.x - 5, ball.y - 5, ball.radius * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Running Rabbit
    ctx.save();
    ctx.font = '32px sans-serif';
    ctx.textAlign = 'center';
    if (isDog && isMotionActive) {
      ctx.shadowColor = '#38BDF8';
      ctx.shadowBlur = 20;
    }
    ctx.fillText(rabbit.vx > 0 ? '🐇' : '🐇', rabbit.x, rabbit.y);
    ctx.restore();

    // 3. Blue Flower (Both human and dog see blue brightly!)
    ctx.save();
    ctx.font = '24px sans-serif';
    ctx.fillText('🪻', width * 0.25, height - 30);
    ctx.fillText('🫐', width * 0.45, height - 25);
    ctx.restore();
  }

  drawScene();

  // Split Drag Interaction
  function updateSplit(clientX) {
    const rect = viewport.getBoundingClientRect();
    let x = clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));
    splitPercent = (x / rect.width) * 100;
    splitHandle.style.left = `${splitPercent}%`;
    dogSide.style.width = `${splitPercent}%`;
  }

  viewport.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSplit(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (isDragging) updateSplit(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch Support
  viewport.addEventListener('touchstart', (e) => {
    isDragging = true;
    if (e.touches[0]) updateSplit(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches[0]) updateSplit(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Toggles
  motionToggle?.addEventListener('click', () => {
    isMotionActive = !isMotionActive;
    motionToggle.classList.toggle('active', isMotionActive);
  });

  nightToggle?.addEventListener('click', () => {
    isNightActive = !isNightActive;
    nightToggle.classList.toggle('active', isNightActive);
  });
}

/* ============================================================
   2. HEARING LAB & WEB AUDIO API SYNTHESIZER
   ============================================================ */
function initHearingLab() {
  const slider = document.getElementById('freqSlider');
  const freqDisplay = document.getElementById('freqDisplay');
  const statusTag = document.getElementById('freqStatusTag');
  const soundBtn = document.getElementById('toggleSoundBtn');
  const earL = document.getElementById('radarEarL');
  const earR = document.getElementById('radarEarR');

  if (!slider || !freqDisplay) return;

  let audioCtx = null;
  let oscillator = null;
  let gainNode = null;
  let isPlaying = false;

  function updateFrequency(freq) {
    freqDisplay.textContent = Math.round(freq).toLocaleString('pl-PL');

    // Update status tag
    if (freq <= 20000) {
      statusTag.textContent = '🧑 Słyszy człowiek i pies';
      statusTag.style.borderColor = 'rgba(6, 182, 212, 0.4)';
      statusTag.style.color = '#67E8F9';
    } else if (freq <= 45000) {
      statusTag.textContent = '🐕 Ultradźwięki — słyszy tylko pies!';
      statusTag.style.borderColor = 'rgba(168, 85, 247, 0.4)';
      statusTag.style.color = '#D8B4FE';
    } else {
      statusTag.textContent = '🦇 Pasmo gryzoni i nietoperzy (pies wyłapuje)';
      statusTag.style.borderColor = 'rgba(245, 158, 11, 0.4)';
      statusTag.style.color = '#FCD34D';
    }

    // Update ear radar rotation to simulate tracking
    if (earL && earR) {
      const angleL = -25 + (freq / 65000) * 50;
      const angleR = 25 - (freq / 65000) * 50;
      earL.style.transform = `rotate(${angleL}deg)`;
      earR.style.transform = `rotate(${angleR}deg)`;
    }

    // Update Web Audio oscillator if active
    if (oscillator && audioCtx && isPlaying) {
      // Human speaker limits: cap synth frequency at 18000Hz to prevent damage
      const safeFreq = Math.min(freq, 18000);
      oscillator.frequency.setTargetAtTime(safeFreq, audioCtx.currentTime, 0.05);

      if (freq > 20000) {
        // Fade out tone gently because human ear/speaker won't reproduce
        gainNode.gain.setTargetAtTime(0.01, audioCtx.currentTime, 0.1);
      } else {
        gainNode.gain.setTargetAtTime(0.12, audioCtx.currentTime, 0.1);
      }
    }
  }

  slider.addEventListener('input', (e) => {
    updateFrequency(parseFloat(e.target.value));
  });

  // Sound generator toggle
  soundBtn?.addEventListener('click', () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (!isPlaying) {
      // Start tone
      oscillator = audioCtx.createOscillator();
      gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      const freq = parseFloat(slider.value);
      oscillator.frequency.setValueAtTime(Math.min(freq, 18000), audioCtx.currentTime);

      gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();

      isPlaying = true;
      soundBtn.classList.add('playing');
      soundBtn.innerHTML = '🔊 Wyłącz symulator dźwięku';
    } else {
      // Stop tone
      if (oscillator) {
        oscillator.stop();
        oscillator.disconnect();
      }
      isPlaying = false;
      soundBtn.classList.remove('playing');
      soundBtn.innerHTML = '🔈 Włącz próbkę audio (Web Audio API)';
    }
  });
}

/* ============================================================
   3. STEREOSCOPIC SCENT RADAR & NOSTRIL AIRFLOW
   ============================================================ */
function initStereoScentTracker() {
  const canvas = document.getElementById('scentCanvas');
  const nostrilL = document.getElementById('nostrilValL');
  const nostrilR = document.getElementById('nostrilValR');

  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.clientWidth || 500);
  let height = (canvas.height = 220);

  window.addEventListener('resize', () => {
    if (!canvas) return;
    width = canvas.width = canvas.clientWidth;
    height = canvas.height = 220;
  });

  // Particles
  const particles = [];
  const PARTICLE_COUNT = 45;
  let targetX = width * 0.75;
  let targetY = 50;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: targetX + (Math.random() - 0.5) * 80,
      y: targetY + Math.random() * 40,
      vx: (Math.random() - 0.5) * 1.5,
      vy: 1.2 + Math.random() * 1.8,
      size: 2.5 + Math.random() * 3,
      alpha: 0.2 + Math.random() * 0.7
    });
  }

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    targetX = e.clientX - rect.left;
    targetY = Math.max(20, e.clientY - rect.top);
  });

  canvas.addEventListener('touchmove', (e) => {
    if (e.touches[0]) {
      const rect = canvas.getBoundingClientRect();
      targetX = e.touches[0].clientX - rect.left;
      targetY = Math.max(20, e.touches[0].clientY - rect.top);
    }
  }, { passive: true });

  function renderScent() {
    ctx.clearRect(0, 0, width, height);

    // Dog nose base at bottom center
    const noseX = width / 2;
    const noseY = height - 20;

    // Draw Scent Source
    ctx.save();
    const sourceGrad = ctx.createRadialGradient(targetX, targetY, 0, targetX, targetY, 35);
    sourceGrad.addColorStop(0, 'rgba(245, 158, 11, 0.8)');
    sourceGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = sourceGrad;
    ctx.beginPath();
    ctx.arc(targetX, targetY, 35, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🥩', targetX, targetY + 6);
    ctx.restore();

    // Dual Nostrils at bottom
    const leftNostrilX = noseX - 22;
    const rightNostrilX = noseX + 22;

    // Update & Draw scent particles flowing toward nostrils
    particles.forEach(p => {
      // Gravitate toward closest nostril
      const targetNostrilX = p.x < noseX ? leftNostrilX : rightNostrilX;
      p.x += (targetNostrilX - p.x) * 0.02 + p.vx;
      p.y += p.vy;

      if (p.y > noseY) {
        p.y = targetY + (Math.random() - 0.5) * 20;
        p.x = targetX + (Math.random() - 0.5) * 40;
      }

      ctx.fillStyle = `rgba(245, 158, 11, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw dog nostrils
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.ellipse(leftNostrilX, noseY, 9, 14, -0.2, 0, Math.PI * 2);
    ctx.ellipse(rightNostrilX, noseY, 9, 14, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Calculate real-time left vs right intensity
    const distL = Math.hypot(targetX - leftNostrilX, targetY - noseY);
    const distR = Math.hypot(targetX - rightNostrilX, targetY - noseY);

    const intL = Math.round(Math.max(10, Math.min(100, (300 / distL) * 60)));
    const intR = Math.round(Math.max(10, Math.min(100, (300 / distR) * 60)));

    if (nostrilL && nostrilR) {
      nostrilL.textContent = `${intL}%`;
      nostrilR.textContent = `${intR}%`;
    }

    requestAnimationFrame(renderScent);
  }

  renderScent();
}

/* ============================================================
   4. BODY LANGUAGE INSPECTOR ("ROZKODUJ PSA")
   ============================================================ */
function initBodyLanguageInspector() {
  const hotspots = document.querySelectorAll('.anatomy-hotspot');
  const titleEl = document.getElementById('hotspotTitle');
  const descEl = document.getElementById('hotspotDesc');
  const adviceEl = document.getElementById('hotspotAdvice');
  const tierEl = document.getElementById('hotspotTier');

  if (!hotspots.length || !titleEl) return;

  const data = {
    eyes: {
      title: 'Oczy i spojrzenie („Whale Eye")',
      tier: 'danger',
      tierLabel: '⚠️ Stan podwyższonego ryzyka',
      desc: 'Jeśli widzisz białka psich oczu (tzw. wielorybie oko / whale eye) w kształcie półksiężyca, pies czuje się skrajnie osaczony lub zagrożony. Nigdy nie wpatruj się psu prosto w źrenice — dla drapieżnika to bezpośrednie rzucenie wyzwania.',
      advice: 'Odwróć wzrok lekko w bok i w dół, nie pochylaj się nad psem. Daj mu natychmiast przestrzeń do odejścia.'
    },
    ears: {
      title: 'Uszy — radar nastroju',
      tier: 'warning',
      tierLabel: '⚡ Sygnał ostrzegawczy / niepewność',
      desc: 'Uszy skierowane swobodnie na boki oznaczają relaks. Jednak uszy płasko przyklejone do czaszki świadczą o panice i strachu (pies może ugryźć w obronie własnej). Z kolei uszy sztywno postawione w przód to gotowość bojowa.',
      advice: 'Nie zbliżaj ręki od góry ku uszom. To najczęstszy błąd ludzi, odbierany przez psa jako cios z powietrza.'
    },
    mouth: {
      title: 'Pysk: ziewanie ze stresu i obnażone kły',
      tier: 'warning',
      tierLabel: '🔍 Dyskretne sygnały uspokajające',
      desc: 'Zanim pies zawarczy, wysyła sygnały wczesnego ostrzeżenia (tzw. Calming Signals): ziewa (mimo że nie jest śpiący) oraz szybko i nerwowo oblizuje nos językiem. Uniesienie warg i widok zębów to ostatni krok przed atakiem.',
      advice: 'Nigdy nie karz psa za warczenie! Warczenie to bezpiecznik — pies mówi: „boję się, przestań". Pies ukarany za warczenie w przyszłości ugryzie bez ostrzeżenia.'
    },
    tail: {
      title: 'Ogon — mit „merdania z radości"',
      tier: 'danger',
      tierLabel: '🧠 Krytyczna wiedza behawioralna',
      desc: 'Merdający ogon NIE ZAWSZE oznacza radość! Radość to luźne ruchy całym zadem i nisko noszony ogon. Wysoko uniesiony, zesztywniały ogon wykonujący szybkie, drobne drgania (jak metronom) oznacza skrajne pobudzenie i gotowość do ataku.',
      advice: 'Zwracaj uwagę na całe ciało: czy pies jest miękki i sprężysty, czy zamrożony w bezruchu?'
    },
    body: {
      title: 'Postawa ciała: „Freeze" (Zesztywnienie)',
      tier: 'danger',
      tierLabel: '🚨 OSTATNIA SEKUNDA PRZED ATAKIEM',
      desc: 'Najgroźniejszym sygnałem u psa jest nagłe, całkowite zesztywnienie (tzw. freeze). Pies zamiera, przestaje dyszeć, zamyka pysk i wpatruje się w jeden punkt. To ułamek sekundy, w którym mózg psa podejmuje decyzję o ataku.',
      advice: 'Jeśli pies przy głaskaniu nagle znieruchomieje — ZASTYGNIEJ RÓWNIEŻ. Powoli wycofaj ręce i spokojnie zrób krok w tył.'
    }
  };

  hotspots.forEach(btn => {
    btn.addEventListener('click', () => {
      hotspots.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const part = btn.dataset.part;
      const info = data[part];
      if (!info) return;

      titleEl.textContent = info.title;
      descEl.textContent = info.desc;
      adviceEl.textContent = info.advice;

      tierEl.textContent = info.tierLabel;
      tierEl.className = `hotspot-badge-tier tier-${info.tier}`;
    });
  });
}

/* ============================================================
   5. CRISIS SIMULATOR ("ZASADA DRZEWA")
   ============================================================ */
function initCrisisSimulator() {
  const options = document.querySelectorAll('.crisis-option-card');
  const feedbackBox = document.getElementById('crisisFeedback');

  if (!options.length || !feedbackBox) return;

  const feedbacks = {
    run: {
      correct: false,
      text: '❌ <strong>Błąd krytyczny!</strong> Ucieczka natychmiast uruchamia u psa instynkt łowiecki. Nawet leniwy pies biegnie z prędkością 35–45 km/h (charty do 70 km/h). Człowiek nie ma szans uciec, a krzyk dodatkowo stymuluje agresję łowcy.'
    },
    stare: {
      correct: false,
      text: '❌ <strong>Bardzo niebezpieczne!</strong> Bezpośredni kontakt wzrokowy u psowatych to groźba i rzucenie wyzwania. Wymachiwanie rękami pies zinterpretuje jako zamiar uderzenia i zaatakuje z wyprzedzeniem.'
    },
    tree: {
      correct: true,
      text: '✅ <strong>Doskonale! To Zasada Drzewa (Tree Rule):</strong> Stań nieruchomo ze złączonymi stopami, ręce trzymaj przy ciele, wzrok skieruj w bok/dół i nie wydawaj dźwięków. Dla psa nieruchomy obiekt natychmiast traci atrakcyjność łowiecką — obwącha Cię i odejdzie zdezorientowany.'
    }
  };

  options.forEach(card => {
    card.addEventListener('click', () => {
      options.forEach(c => c.classList.remove('correct', 'wrong'));

      const choice = card.dataset.choice;
      const fb = feedbacks[choice];
      if (!fb) return;

      if (fb.correct) {
        card.classList.add('correct');
        feedbackBox.style.background = 'rgba(16, 185, 129, 0.15)';
        feedbackBox.style.border = '1px solid #10B981';
      } else {
        card.classList.add('wrong');
        feedbackBox.style.background = 'rgba(239, 68, 68, 0.15)';
        feedbackBox.style.border = '1px solid #F43F5E';
      }

      feedbackBox.innerHTML = fb.text;
      feedbackBox.classList.add('show');
    });
  });
}

/* ============================================================
   6. INTERACTIVE QUIZ ENGINE WITH WEB AUDIO FX
   ============================================================ */
function initInteractiveQuiz() {
  const quizBody = document.getElementById('quizDynamicBody');
  const progressBar = document.getElementById('quizMeterProgress');

  if (!quizBody || !progressBar) return;

  const questions = [
    {
      q: 'Jak pies widzi czerwoną piłkę rzuconą na zieloną trawę?',
      options: [
        'Widzi jaskrawą czerwień i zieleń jak człowiek',
        'Widzi czarno-białe piksele',
        'Widzi ją jako żółtawo-szarą na żółto-brązowej trawie (dichromatyzm)',
        'Nie widzi jej wcale, bo jest całkowicie niewidoczna'
      ],
      correct: 2,
      explanation: 'Psy są dichromatami — nie posiadają czopków wrażliwych na czerwień. Czerwona piłka zlewa się z trawnikiem, dopóki się nie poruszy!'
    },
    {
      q: 'Dlaczego u psa warczenie jest sygnałem, za który NIE wolno go karać?',
      options: [
        'Bo pies warczy tylko wtedy, gdy się cieszy',
        'Bo warczenie to bezpiecznik komunikacyjny — ukarany pies ugryzie bez ostrzeżenia',
        'Bo warczenie oznacza, że pies prosi o jedzenie',
        'Bo pies i tak nic z tego nie rozumie'
      ],
      correct: 1,
      explanation: 'Warczenie to desperacka prośba o przestrzeń. Jeśli ukarzesz psa za warczenie, wygaszasz ostrzeżenie — pies natychmiast przejdzie do ataku zębami.'
    },
    {
      q: 'Do jakiej częstotliwości sięga słuch psa domowego?',
      options: [
        'Do 20 000 Hz (identycznie jak ucho ludzkie)',
        'Do 30 000 Hz',
        'Aż do ok. 65 000 Hz (ultradźwięki niesłyszalne dla człowieka)',
        'Pies słyszy tylko dźwięki poniżej 100 Hz'
      ],
      correct: 2,
      explanation: 'Pies odbiera dźwięki do 65 kHz — pozwala mu to słyszeć pisk polnych myszy pod śniegiem oraz komendy z bezgłośnego gwizdka ultradźwiękowego.'
    },
    {
      q: 'Który z poniższych produktów jest dla psa ŚMIERTELNĄ trucizną nawet w małej dawce?',
      options: [
        'Marchewka',
        'Ksylitol (słodzik w gumach do żucia) i czekolada',
        'Ugotowane mięso z indyka',
        'Kawałek jabłka bez pestek'
      ],
      correct: 1,
      explanation: 'Ksylitol wywołuje gwałtowny wyrzut insuliny i ostrą niewydolność wątroby, a teobromina w czekoladzie niszczy układ krążenia i serce psa.'
    },
    {
      q: 'Co oznacza zjawisko „Whale Eye" (wielorybie oko) u psa?',
      options: [
        'Pies ma wadę wzroku i potrzebuje okularów',
        'Widoczne białka oczu — sygnał skrajnego stresu, strachu i ryzyka obrony',
        'Pies mruga z sympatii do właściciela',
        'Pies widzi obiekty pod wodą'
      ],
      correct: 1,
      explanation: 'Gdy pies zastyga i pokazuje białka oczu, czuje się skrajnie zagrożony. To najwyższy poziom alarmu przed kłapnięciem zębami.'
    }
  ];

  let currentIdx = 0;
  let score = 0;

  // Web Audio Synth for feedback
  function playAudioChime(isCorrect) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (isCorrect) {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.15); // G5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(130, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch (e) {
      // Audio not permitted without interaction
    }
  }

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
      <div id="quizDynamicFeedback"></div>
      <div class="quiz-action-bar" id="quizNextBar" style="display: none;">
        <button class="btn btn-primary" id="quizNextBtn">
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

    const feedbackEl = document.getElementById('quizDynamicFeedback');
    const nextBar = document.getElementById('quizNextBar');

    optButtons[qData.correct].classList.add('correct');

    if (selected === qData.correct) {
      score++;
      playAudioChime(true);
      feedbackEl.className = 'quiz-feedback-banner success';
      feedbackEl.innerHTML = `<strong>Świetnie!</strong> ${qData.explanation}`;
    } else {
      optButtons[selected].classList.add('wrong');
      playAudioChime(false);
      feedbackEl.className = 'quiz-feedback-banner failure';
      feedbackEl.innerHTML = `<strong>Nie do końca.</strong> ${qData.explanation}`;
    }

    nextBar.style.display = 'flex';
    document.getElementById('quizNextBtn').addEventListener('click', () => {
      currentIdx++;
      renderQuestion();
    });
  }

  function renderSummary() {
    progressBar.style.width = '100%';
    const percent = Math.round((score / questions.length) * 100);

    let rankTitle = 'Mistrz Psiej Percepcji 🐾';
    let badgeEmoji = '🏆';
    let rankDesc = 'Niesamowita wiedza! Rozumiesz zmysły psa oraz jego mowę ciała lepiej niż 95% ludzi. Twój pies ma wspaniałego opiekuna!';

    if (percent < 80 && percent >= 60) {
      rankTitle = 'Zaawansowany Odkrywca Zmysłów 🐕';
      badgeEmoji = '🎖️';
      rankDesc = 'Bardzo dobry wynik! Wiesz już, jak pies słyszy i widzi oraz znasz podstawy bezpieczeństwa.';
    } else if (percent < 60) {
      rankTitle = 'Początkujący Obserwator Przyrody 📚';
      badgeEmoji = '💡';
      rankDesc = 'Warto przejrzeć sekcję zmysłów i bezpieczeństwa raz jeszcze — wiedza o sygnałach uspokajających może kiedyś uratować Cię przed ugryzieniem!';
    }

    quizBody.innerHTML = `
      <div class="quiz-certificate">
        <div class="certificate-badge-emoji">${badgeEmoji}</div>
        <div class="certificate-score">${score} / ${questions.length}</div>
        <h3 class="certificate-title">${rankTitle}</h3>
        <p class="certificate-desc">${rankDesc}</p>
        <button class="btn btn-primary" id="quizRestartBtn">Rozwiąż quiz ponownie ↺</button>
      </div>
    `;

    document.getElementById('quizRestartBtn').addEventListener('click', () => {
      currentIdx = 0;
      score = 0;
      renderQuestion();
    });
  }

  renderQuestion();
}

/* ============================================================
   7. MINI GRA: SUPER-NOS — TROPICIEL ZAPACHÓW (3 POZIOMY)
   ============================================================ */
function initDogScentGame() {
  const canvas = document.getElementById('dogGameCanvas');
  const overlay = document.getElementById('dogGameOverlay');
  const startBtn = document.getElementById('startDogGameBtn');
  const nextBtn = document.getElementById('nextDogLevelBtn');
  const restartBtn = document.getElementById('restartDogGameBtn');
  const resetBtn = document.getElementById('resetDogCampaignBtn');
  const timerVal = document.getElementById('dogGameTimer');
  const foundVal = document.getElementById('dogGameFoundCount');
  const radarFill = document.getElementById('dogGameRadarFill');
  const currentTargetName = document.getElementById('dogGameTargetName');
  const levelBadge = document.getElementById('dogGameLevelBadge');
  const levelDotsContainer = document.getElementById('dogGameLevelDots');
  const overlayIcon = document.getElementById('dogGameOverIcon');
  const overlayTitle = document.getElementById('dogGameOverTitle');
  const overlayDesc = document.getElementById('dogGameOverDesc');

  if (!canvas || !overlay || !startBtn) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.clientWidth || 500);
  let height = (canvas.height = canvas.clientHeight || 320);

  window.addEventListener('resize', () => {
    if (!canvas) return;
    width = canvas.width = canvas.clientWidth;
    height = canvas.height = canvas.clientHeight || 320;
  });

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
      const ctx = getAudioCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  }

  function playBuzzer() {
    beep(130, 0.18, 'sawtooth');
  }

  // 10-Level Progressive Campaign Config
  const levels = [
    {
      name: 'Młody Szczeniak w Ogrodzie 🏡',
      desc: 'Nauka tropienia zapachów w przydomowym ogrodzie. Czyste powietrze, brak rozpraszaczy.',
      time: 45,
      bg: '#122316',
      accent: 'rgba(34, 197, 94, 0.15)',
      rangeFactor: 0.55,
      hasWind: false,
      targets: [
        { name: '🦴 Smakowita kość', emoji: '🦴', x: 0, y: 0, found: false },
        { name: '🎾 Żółta piłeczka', emoji: '🎾', x: 0, y: 0, found: false },
        { name: '🥩 Soczysta kiełbasa', emoji: '🥩', x: 0, y: 0, found: false }
      ],
      distractors: []
    },
    {
      name: 'Domowy Labirynt Pokoi 🛋️',
      desc: 'Wytrop przedmioty domowników pośród dywanów i mebli. Zapach właściciela prowadzi do celu.',
      time: 42,
      bg: '#181A22',
      accent: 'rgba(148, 163, 184, 0.15)',
      rangeFactor: 0.50,
      hasWind: false,
      targets: [
        { name: '🥿 Pantofel pana', emoji: '🥿', x: 0, y: 0, found: false },
        { name: '🧸 Ulubiony pluszak', emoji: '🧸', x: 0, y: 0, found: false },
        { name: '🍖 Chrupki wołowe', emoji: '🍖', x: 0, y: 0, found: false }
      ],
      distractors: []
    },
    {
      name: 'Wiejski Sad Jabłoniowy 🍎🌳',
      desc: 'Pierwsze próby ignorowania zwodniczych zapachów ziół i owoców na wiejskim podwórku.',
      time: 40,
      bg: '#1E1D13',
      accent: 'rgba(234, 179, 8, 0.15)',
      rangeFactor: 0.46,
      hasWind: false,
      targets: [
        { name: '🍏 Dojrzałe jabłko', emoji: '🍏', x: 0, y: 0, found: false },
        { name: '🪵 Drewniany patyk', emoji: '🪵', x: 0, y: 0, found: false },
        { name: '🎾 Piłeczka aportowa', emoji: '🎾', x: 0, y: 0, found: false }
      ],
      distractors: [
        { name: 'Kwiatki rumianku', emoji: '🌼', x: 0, y: 0 }
      ]
    },
    {
      name: 'Miejski Park Zapachów 🌳🏙️',
      desc: 'Dyskryminacja węchowa: odnajdź 4 przedmioty, ignorując fałszywe tropy i miejskie rozpraszacze!',
      time: 40,
      bg: '#1A1C16',
      accent: 'rgba(234, 179, 8, 0.15)',
      rangeFactor: 0.42,
      hasWind: false,
      targets: [
        { name: '🔑 Zgubione klucze', emoji: '🔑', x: 0, y: 0, found: false },
        { name: '👟 But biegacza', emoji: '👟', x: 0, y: 0, found: false },
        { name: '🧤 Rękawiczka', emoji: '🧤', x: 0, y: 0, found: false },
        { name: '🥪 Kanapka z serem', emoji: '🥪', x: 0, y: 0, found: false }
      ],
      distractors: [
        { name: 'Zapach obcego psa', emoji: '💩', x: 0, y: 0 },
        { name: 'Wylana kawa', emoji: '☕', x: 0, y: 0 }
      ]
    },
    {
      name: 'Deszczowy Bulwar Nad Rzeką 🌧️🦆',
      desc: 'Krople deszczu przybijają cząsteczki zapachowe do podłoża. Wytrop zguby w wilgotnym piasku.',
      time: 38,
      bg: '#0E171E',
      accent: 'rgba(14, 165, 233, 0.15)',
      rangeFactor: 0.40,
      hasWind: false,
      targets: [
        { name: '🥏 Gumowe frisbee', emoji: '🥏', x: 0, y: 0, found: false },
        { name: '🧣 Wełniany szalik', emoji: '🧣', x: 0, y: 0, found: false },
        { name: '🦴 Chrupiący gryzak', emoji: '🦴', x: 0, y: 0, found: false },
        { name: '🧢 Daszek biegacza', emoji: '🧢', x: 0, y: 0, found: false }
      ],
      distractors: [
        { name: 'Ślad kaczki', emoji: '🦆', x: 0, y: 0 },
        { name: 'Kałuża z benzyną', emoji: '⛽', x: 0, y: 0 }
      ]
    },
    {
      name: 'Dąbrowa i Tropienie Trzech Ścieżek 🍄🐾',
      desc: 'Bogata leśna ściółka. Rozpoznaj woń człowieka wśród setek leśnych bodźców natury.',
      time: 38,
      bg: '#17140F',
      accent: 'rgba(217, 119, 6, 0.15)',
      rangeFactor: 0.38,
      hasWind: false,
      targets: [
        { name: '🦌 Zrzut poroża', emoji: '🦌', x: 0, y: 0, found: false },
        { name: '📜 Mapa leśna', emoji: '📜', x: 0, y: 0, found: false },
        { name: '🎒 Mały plecak', emoji: '🎒', x: 0, y: 0, found: false },
        { name: '🍶 Metalowy bidon', emoji: '🍶', x: 0, y: 0, found: false }
      ],
      distractors: [
        { name: 'Świeża buchtowisko dzika', emoji: '🐗', x: 0, y: 0 },
        { name: 'Borowik leśny', emoji: '🍄', x: 0, y: 0 }
      ]
    },
    {
      name: 'Leśny Szlak O Zmierzchu 🌲🦉',
      desc: 'Zapada zmrok — wzrok traci znaczenie, działa wyłącznie nos (300 mln komórek węchowych)!',
      time: 36,
      bg: '#10101C',
      accent: 'rgba(168, 85, 247, 0.15)',
      rangeFactor: 0.36,
      hasWind: false,
      targets: [
        { name: '🔦 Latarka czołowa', emoji: '🔦', x: 0, y: 0, found: false },
        { name: '☕ Termos z herbatą', emoji: '☕', x: 0, y: 0, found: false },
        { name: '🧭 Turystyczny kompas', emoji: '🧭', x: 0, y: 0, found: false },
        { name: '🧤 Skórzana rękawica', emoji: '🧤', x: 0, y: 0, found: false }
      ],
      distractors: [
        { name: 'Nora lisa', emoji: '🦊', x: 0, y: 0 },
        { name: 'Ptak nocny', emoji: '🦉', x: 0, y: 0 }
      ]
    },
    {
      name: 'Pies Ratownik w Puszczy ❄️🌲',
      desc: 'Ekstremalna misja ratunkowa w mroźnym wietrze! Wiatr boczny znosi zapach — węszymy zygzakiem pod wiatr.',
      time: 42,
      bg: '#0E1A1E',
      accent: 'rgba(56, 189, 248, 0.15)',
      rangeFactor: 0.34,
      hasWind: true,
      targets: [
        { name: '🧭 Kompas turysty', emoji: '🧭', x: 0, y: 0, found: false },
        { name: '🎒 Plecak zaginionego', emoji: '🎒', x: 0, y: 0, found: false },
        { name: '🔦 Zguba nocna', emoji: '🔦', x: 0, y: 0, found: false },
        { name: '🧥 Ciepła kurtka', emoji: '🧥', x: 0, y: 0, found: false },
        { name: '📱 Telefon turysty', emoji: '📱', x: 0, y: 0, found: false }
      ],
      distractors: [
        { name: 'Leśny jeż', emoji: '🦔', x: 0, y: 0 },
        { name: 'Muchomor czerwony', emoji: '🍄', x: 0, y: 0 }
      ]
    },
    {
      name: 'Lawina w Tatrach — Poszukiwanie Zasypanych 🏔️⚠️',
      desc: 'Pies lawinowy TOPR. Cząsteczki oddechu przenikają przez śnieg. Znajdź 5 śladów ekwipunku!',
      time: 40,
      bg: '#131826',
      accent: 'rgba(129, 140, 248, 0.18)',
      rangeFactor: 0.32,
      hasWind: true,
      targets: [
        { name: '🎿 Narta turysty', emoji: '🎿', x: 0, y: 0, found: false },
        { name: '🧤 Rękawica narciarska', emoji: '🧤', x: 0, y: 0, found: false },
        { name: '🧢 Ciepła czapka', emoji: '🧢', x: 0, y: 0, found: false },
        { name: '⛏️ Czekan wspinaczkowy', emoji: '⛏️', x: 0, y: 0, found: false },
        { name: '🫖 Termos górski', emoji: '🫖', x: 0, y: 0, found: false }
      ],
      distractors: [
        { name: 'Zmrożona skała', emoji: '🪨', x: 0, y: 0 },
        { name: 'Ptasie pióro', emoji: '🪶', x: 0, y: 0 }
      ]
    },
    {
      name: 'Mistrz Węchu: Operacja GOPR 🚁🎖️',
      desc: 'Finałowa próba! Ekstremalny wicher, zapach osoby poszkodowanej. Prawdziwy psi bohater narodowy!',
      time: 45,
      bg: '#181226',
      accent: 'rgba(236, 72, 153, 0.18)',
      rangeFactor: 0.30,
      hasWind: true,
      targets: [
        { name: '🩹 Apteczka pierwszej pomocy', emoji: '🩹', x: 0, y: 0, found: false },
        { name: '📻 Radiotelefon GOPR', emoji: '📻', x: 0, y: 0, found: false },
        { name: '🪢 Lina asekuracyjna', emoji: '🪢', x: 0, y: 0, found: false },
        { name: '🧨 Flara ratunkowa', emoji: '🧨', x: 0, y: 0, found: false },
        { name: '👤 Poszkodowany turysta', emoji: '👤', x: 0, y: 0, found: false }
      ],
      distractors: [
        { name: 'Górski wicher', emoji: '🌪️', x: 0, y: 0 },
        { name: 'Rozbita gałąź kosówki', emoji: '🌲', x: 0, y: 0 }
      ]
    }
  ];

  // Game State
  let currentLevelIdx = 0;
  let isPlaying = false;
  let timeLeft = 45;
  let timerInterval = null;
  let animId = null;
  let currentTargetIndex = 0;
  let digProgress = 0;
  let lastBeepTime = 0;
  let lastDistractorBuzz = 0;

  // Player Dog Pos
  let dogX = 60;
  let dogY = 60;
  let targetDogX = 60;
  let targetDogY = 60;

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

    lvl.distractors.forEach((d) => {
      d.x = Math.floor(70 + Math.random() * (width - 140));
      d.y = Math.floor(70 + Math.random() * (height - 140));
    });
  }

  function handleMove(clientX, clientY) {
    if (!isPlaying) return;
    const rect = canvas.getBoundingClientRect();
    targetDogX = Math.max(30, Math.min(width - 30, clientX - rect.left));
    targetDogY = Math.max(30, Math.min(height - 30, clientY - rect.top));
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

    dogX = 60;
    dogY = 60;
    targetDogX = 60;
    targetDogY = 60;

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
        // Level completed, more levels remaining
        overlayIcon.textContent = '🎉🐾✨';
        overlayTitle.textContent = `Misja ${currentLevelIdx + 1} Ukończona!`;
        overlayDesc.innerHTML = `
          Znalazłeś wszystkie cele poziomu <strong>${lvl.name}</strong> w czasie <strong>${lvl.time - timeLeft}s</strong>!<br>
          Twój pies udowodnił niezwykłą sprawność węchową. Przed Tobą kolejne, trudniejsze wyzwanie!
        `;
        nextBtn.style.display = 'inline-flex';
        restartBtn.style.display = 'inline-flex';
      } else {
        // Campaign Complete
        overlayIcon.textContent = '🏅🐕🏆';
        overlayTitle.textContent = 'Certyfikowany Mistrz Tropienia K-9!';
        overlayDesc.innerHTML = `
          <strong>Ukończyłeś wszystkie 3 poziomy tropienia!</strong><br>
          Pokonałeś trudny boczny wiatr i miejskie rozpraszacze. Twój pies wytropił każdy zaginiony przedmiot z precyzją prawdziwego psa ratownika GOPR.
        `;
        resetBtn.style.display = 'inline-flex';
      }
    } else {
      // Level Failed
      playBuzzer();
      overlayIcon.textContent = '⏰🌧️🐕';
      overlayTitle.textContent = 'Czas minął — zapach wywietrzał!';
      overlayDesc.innerHTML = `
        Nie udało się odnaleźć wszystkich zapachów na poziomie <strong>${lvl.name}</strong>.<br>
        Śledź uważnie pasek sonaru i węszyj zygzakiem. Spróbuj ponownie!
      `;
      restartBtn.style.display = 'inline-flex';
      if (currentLevelIdx > 0) resetBtn.style.display = 'inline-flex';
    }
  }

  function gameLoop(time) {
    if (!isPlaying) return;

    const lvl = levels[currentLevelIdx];

    // Smooth movement
    dogX += (targetDogX - dogX) * 0.15;
    dogY += (targetDogY - dogY) * 0.15;

    // Clear Canvas
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = lvl.bg;
    ctx.fillRect(0, 0, width, height);

    // Decorative landscape elements
    ctx.fillStyle = lvl.accent;
    ctx.beginPath();
    ctx.arc(80, 70, 45, 0, Math.PI * 2);
    ctx.arc(width - 90, 80, 50, 0, Math.PI * 2);
    ctx.arc(width * 0.45, height - 60, 55, 0, Math.PI * 2);
    ctx.fill();

    // Wind indicator on level 3
    if (lvl.hasWind) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.font = '12px var(--font-mono)';
      ctx.textAlign = 'right';
      ctx.fillText('💨 Wiatr boczny: 25 km/h →', width - 20, 26);
    }

    // Active Target
    const activeTarget = lvl.targets[currentTargetIndex];
    let virtualTargetX = activeTarget.x;
    let virtualTargetY = activeTarget.y;

    // If lateral wind -> scent trail drifts
    if (lvl.hasWind) {
      virtualTargetX += Math.sin(time * 0.002) * 15 + 20;
    }

    const dist = Math.hypot(dogX - virtualTargetX, dogY - virtualTargetY);
    const maxDist = Math.hypot(width, height);

    // Scent intensity
    const intensity = Math.max(0, 1 - dist / (maxDist * lvl.rangeFactor));
    radarFill.style.width = `${Math.round(intensity * 100)}%`;

    // Sound pulse
    const now = performance.now();
    const intervalMs = Math.max(90, 700 - intensity * 580);
    if (now - lastBeepTime > intervalMs) {
      lastBeepTime = now;
      const beepFreq = 300 + intensity * 600;
      beep(beepFreq, 0.04);
    }

    // Draw Scent Waves
    ctx.save();
    const waveRadius = (now * 0.05) % 60;
    ctx.strokeStyle = `rgba(245, 158, 11, ${Math.max(0.06, intensity * 0.35)})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(activeTarget.x, activeTarget.y, waveRadius + 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Check Distractors
    lvl.distractors.forEach((d) => {
      const dDist = Math.hypot(dogX - d.x, dogY - d.y);
      if (dDist < 36) {
        if (now - lastDistractorBuzz > 1200) {
          lastDistractorBuzz = now;
          playBuzzer();
        }
        ctx.fillStyle = '#EF4444';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Rozproszenie! ⚠️', dogX, dogY - 36);
      }
      // Draw distractor item
      ctx.font = '22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(d.emoji, d.x, d.y + 8);
    });

    // If close to actual target -> Digging
    if (dist < 34) {
      digProgress += 0.025;
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(dogX, dogY - 32, 14, 0, Math.PI * 2 * digProgress);
      ctx.lineTo(dogX, dogY - 32);
      ctx.fill();

      ctx.fillStyle = '#FFF';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Węszy...', dogX, dogY - 38);

      if (digProgress >= 1) {
        activeTarget.found = true;
        digProgress = 0;
        currentTargetIndex++;
        foundVal.textContent = `${currentTargetIndex} / ${lvl.targets.length}`;

        beep(523, 0.1);
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

    // Draw Player Dog
    ctx.save();
    ctx.font = '32px sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(245, 158, 11, 0.4)';
    ctx.shadowBlur = 15;
    ctx.fillText('🐕', dogX, dogY + 10);
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



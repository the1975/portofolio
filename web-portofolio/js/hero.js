/* ==========================================================
   03. TEXT TYPING DI HERO
   Ganti isi array WORDS untuk mengubah teks yang diketik.
   ========================================================== */
(() => {
  const WORDS = ['Web Developer', 'Data Analytics'];
  const typedEl = document.getElementById('typed');
  if (!typedEl) return;

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function type() {
    const word = WORDS[wordIndex];
    typedEl.textContent = word.slice(0, charIndex);

    // Kata selesai diketik -> tunggu, lalu mulai menghapus
    if (!deleting && charIndex === word.length) {
      deleting = true;
      return setTimeout(type, 1500);
    }

    // Kata selesai dihapus -> pindah ke kata berikutnya
    if (deleting && charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % WORDS.length;
      return setTimeout(type, 400);
    }

    charIndex += deleting ? -1 : 1;
    setTimeout(type, deleting ? 40 : 80);
  }

  type();
})();


/* ==========================================================
   05. GLITCH HEADLINE HERO
   Menambah class .glitch-active selama 180ms, diulang acak
   tiap 5-10 detik. Efek visual ada di style.css bagian 04.
   ========================================================== */
(() => {
  const targets = document.querySelectorAll('.hero-glitch');
  if (!targets.length) return;

  function triggerGlitch() {
    targets.forEach((el) => {
      el.classList.add('glitch-active');
      setTimeout(() => el.classList.remove('glitch-active'), 180);
    });
    setTimeout(triggerGlitch, 5000 + Math.random() * 5000);
  }

  setTimeout(triggerGlitch, 4000);
})();


/* ==========================================================
   11. CHIP MINDSET HERO
   Klik chip -> teks, ikon, dan posisinya berganti.
   Tambah mindset baru: isi MINDSETS + ICONS dengan nama yang sama.
   ========================================================== */
(() => {
  const chip1 = document.getElementById('mindsetChip1');
  const chip2 = document.getElementById('mindsetChip2');
  const text1 = document.getElementById('mindsetText1');
  const text2 = document.getElementById('mindsetText2');
  if (!chip1 || !chip2 || !text1 || !text2) return;

  /* ----- Daftar teks mindset ----- */
  const MINDSETS = [
    'PROBLEM SOLVING',
    'SYSTEM THINKING',
    'ANALYTICAL THINKING',
    'CRITICAL THINKING',
    'LOGICAL THINKING',
    'ADAPTABILITY',
    'CREATIVE THINKING',
    'CONTINUOUS LEARNING'
  ];

  /* ----- Isi SVG tiap mindset (kunci harus sama dengan MINDSETS) ----- */
  const ICONS = {
    'PROBLEM SOLVING': `
      <path d="M9.5 3a3.5 3.5 0 0 0-3.5 3.5A3.5 3.5 0 0 0 3 10a3.5 3.5 0 0 0 3 3.5A3.5 3.5 0 0 0 9.5 17H12V3H9.5Z"/>
      <path d="M14.5 3A3.5 3.5 0 0 1 18 6.5a3.5 3.5 0 0 1 3 3.5 3.5 3.5 0 0 1-3 3.5 3.5 3.5 0 0 1-3.5 3.5H12V3h2.5Z"/>
      <path d="M12 7h2"/><path d="M12 12h2"/><path d="M8 10h2"/>`,
    'SYSTEM THINKING': `
      <path d="M9 18h6"/><path d="M10 22h4"/>
      <path d="M15 14.5a7 7 0 1 0-6 0c.6.4 1 1.1 1 1.8V18h4v-1.7c0-.7.4-1.4 1-1.8Z"/>
      <path d="M12 2v1"/><path d="m4.9 4.9.7.7"/><path d="M2 12h1"/>
      <path d="m19.1 4.9-.7.7"/><path d="M21 12h-1"/>`,
    'ANALYTICAL THINKING': `
      <line x1="6" y1="20" x2="6" y2="14"/>
      <line x1="12" y1="20" x2="12" y2="8"/>
      <line x1="18" y1="20" x2="18" y2="4"/>`,
    'CRITICAL THINKING': `
      <path d="M12 3v18"/><path d="M3 7h18"/>
      <path d="M5 7l-3 5h6L5 7Z"/><path d="M19 7l-3 5h6l-3-5Z"/>`,
    'LOGICAL THINKING': `
      <rect x="3" y="3" width="6" height="6" rx="1"/>
      <rect x="15" y="15" width="6" height="6" rx="1"/>
      <path d="M9 6h3a3 3 0 0 1 3 3v6"/><path d="M15 18h-3a3 3 0 0 1-3-3v-1"/>`,
    'ADAPTABILITY': `
      <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8"/><path d="M21 3v5h-5"/>
      <path d="M21 12a9 9 0 0 1-15.5 6.2L3 16"/><path d="M3 21v-5h5"/>`,
    'CREATIVE THINKING': `
      <path d="M9 18h6"/><path d="M10 22h4"/>
      <path d="M15 14.5a7 7 0 1 0-6 0"/>
      <path d="M12 2v1"/><path d="m4.9 4.9.7.7"/><path d="m19.1 4.9-.7.7"/>`,
    'CONTINUOUS LEARNING': `
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z"/>
      <path d="M4 18h16"/><path d="M8 7h7"/><path d="M8 11h5"/>`
  };

  /* ----- Posisi chip: tiap klik pindah ke posisi berikutnya ----- */
  const LEFT_POSITIONS = [
    { left: '-48px', top: '64px' },
    { left: '-48px', top: '45%' },
    { left: '-48px', bottom: '80px' }
  ];
  const RIGHT_POSITIONS = [
    { right: '-42px', top: '80px' },
    { right: '-42px', top: '42%' },
    { right: '-42px', bottom: '70px' }
  ];

  // Pindahkan chip: reset posisi lama (dari class Tailwind) lalu pasang yang baru
  function moveChip(chip, position) {
    chip.style.left = 'auto';
    chip.style.right = 'auto';
    chip.style.top = 'auto';
    chip.style.bottom = 'auto';
    Object.entries(position).forEach(([key, value]) => { chip.style[key] = value; });
  }

  /* ----- Pasang perilaku klik + keyboard ke satu chip ----- */
  function setupChip(chip, textEl, positions, startIndex) {
    const icon = chip.querySelector('svg');
    let index = startIndex;

    function change() {
      index = (index + 1) % MINDSETS.length;
      const mindset = MINDSETS[index];

      // Restart animasi glitch chip
      chip.classList.remove('mindset-change');
      void chip.offsetWidth;
      chip.classList.add('mindset-change');

      // Ganti isi di tengah glitch supaya terasa "pecah"
      setTimeout(() => {
        textEl.textContent = mindset;
        if (icon) icon.innerHTML = ICONS[mindset] || '';
        moveChip(chip, positions[index % positions.length]);
      }, 120);

      setTimeout(() => chip.classList.remove('mindset-change'), 500);
    }

    chip.addEventListener('click', change);
    chip.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        change();
      }
    });
  }

  setupChip(chip1, text1, LEFT_POSITIONS, 0);
  setupChip(chip2, text2, RIGHT_POSITIONS, 1);
})();

/* 06. DAUN MUSIMAN MUNCUL MENGIKUTI KURSOR / JARI
   Layer .hero-leaves di-mask lingkaran yang ngikutin pointer.
   Pointer diam 1,2 detik -> daun memudar. */
(() => {
  const hero = document.querySelector('.hero');
  const leaves = hero && hero.querySelector('.hero-leaves');
  if (!leaves) return;

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FOLLOW = 0.18;    // makin besar makin cepat ngejar
  const IDLE_MS = 1200;   // jeda sebelum memudar

  let targetX = 0, targetY = 0, curX = 0, curY = 0;
  let raf = null, idleTimer = null, started = false;

  function render() {
    curX += (targetX - curX) * FOLLOW;
    curY += (targetY - curY) * FOLLOW;
    leaves.style.setProperty('--mx', curX.toFixed(1) + 'px');
    leaves.style.setProperty('--my', curY.toFixed(1) + 'px');
    const done = Math.abs(targetX - curX) < .5 && Math.abs(targetY - curY) < .5;
    raf = done ? null : requestAnimationFrame(render);
  }

  function hide() { leaves.style.opacity = '0'; }

  function onMove(e) {
    const rect = hero.getBoundingClientRect();
    const inside = e.clientX >= rect.left && e.clientX <= rect.right &&
                   e.clientY >= rect.top  && e.clientY <= rect.bottom;
    if (!inside) return hide();

    targetX = e.clientX - rect.left;
    targetY = e.clientY - rect.top;
    if (!started || reduceMotion) { curX = targetX; curY = targetY; started = true; }

    leaves.style.opacity = '1';
    if (!raf) raf = requestAnimationFrame(render);

    clearTimeout(idleTimer);
    idleTimer = setTimeout(hide, IDLE_MS);
  }

  // pointer events = mouse + sentuhan HP
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerdown', onMove, { passive: true });
  document.addEventListener('pointerleave', hide);
})();
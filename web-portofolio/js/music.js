/* ==========================================================
   MUSIC.JS - Ganti-ganti playlist Spotify dalam satu kotak
   Tambah playlist: tambah satu baris di PLAYLISTS.
   ID = bagian setelah /playlist/ di link Spotify (tanpa ?si=...).
   Playlist harus Public.
   ========================================================== */
(() => {
  /* ---------- 1. PENGATURAN ---------- */
  const PLAYLISTS = [
    { name: 'FAVORITES', id: '0rrZvtqBxtelJycIUBh449' },
    { name: 'CHILL',     id: '1W5EDOA0xOYKroTcsfP8ia' },
    { name: 'FOCUS',     id: '0QvcKY0WILLAqIZDy1wCTw' },
  ];

  const SETTLE_MS = 350;      // tunggu sebentar setelah iframe selesai, biar isinya sempat tampil
  const MAX_WAIT_MS = 6000;   // pengaman: loading tidak boleh nyangkut selamanya
  const REST_MS = 250;        // anti-loncat: halaman diam selama ini lalu tiba-tiba bergerak = mencurigakan
  const INPUT_GRACE = 1200;   // anti-loncat: ms setelah pengunjung scroll/tap, gerakan dianggap sengaja
  const LOCK_MS = 1500;       // anti-loncat: ms menahan lanjutan animasi loncatan

  /* ---------- 2. ELEMEN ---------- */
  const frame = document.getElementById('musicFrame');
  const nameEl = document.getElementById('musicName');
  const countEl = document.getElementById('musicCount');
  const prev = document.getElementById('musicPrev');
  const next = document.getElementById('musicNext');
  if (!frame || !nameEl) return;

  const stack = frame.parentElement;
  let index = 0;
  let safetyTimer = null;

  /* ---------- 3. LAYAR LOADING ---------- */
  function startLoading() {
    stack.classList.add('is-loading');
    clearTimeout(safetyTimer);
    safetyTimer = setTimeout(stopLoading, MAX_WAIT_MS);
  }

  function stopLoading() {
    clearTimeout(safetyTimer);
    stack.classList.remove('is-loading');
    frame.classList.remove('is-swapping');
  }

  // Setiap iframe selesai dimuat (awal maupun ganti playlist), tunggu sebentar lalu tampilkan
  frame.addEventListener('load', () => setTimeout(stopLoading, SETTLE_MS));
  startLoading();   // loading awal saat halaman pertama dibuka

    /* ---------- 4. ANTI-LONCAT ----------
     Saat Spotify ganti lagu, isi iframe mengambil fokus dan browser menggulung
     halaman ke kotak Spotify (di situs ini gulungannya halus/animasi). Kalau halaman
     tiba-tiba bergerak sendiri padahal pengunjung tidak sedang scroll, fokus ada di
     kotak Spotify, dan kotak itu tadinya di luar layar, halaman dikembalikan. */
  let anchorY = window.scrollY;   // posisi terakhir yang "sah" (hasil scroll pengunjung)
  let lastInput = -Infinity;
  let lastScrollAt = -Infinity;
  let lockUntil = 0;
  let pending = false;
  let frameVisible = false;

  new IntersectionObserver(([entry]) => { frameVisible = entry.isIntersecting; }).observe(frame);

  const markInput = () => { lastInput = performance.now(); };
  ['wheel', 'touchstart', 'touchmove', 'keydown', 'pointerdown'].forEach((ev) =>
    window.addEventListener(ev, markInput, { passive: true, capture: true }));
  window.addEventListener('pointermove', (e) => { if (e.buttons) markInput(); },   // seret scrollbar
    { passive: true, capture: true });

  function restore() {
    window.scrollTo({ top: anchorY, behavior: 'instant' });            // instant: batalkan animasi
    if (window.lenis) window.lenis.scrollTo(anchorY, { immediate: true });
  }

  window.addEventListener('scroll', () => {
    const now = performance.now();
    const wasResting = now - lastScrollAt > REST_MS;   // halaman tadinya diam, lalu mulai bergerak
    lastScrollAt = now;
    if (pending) return;

    const focusInFrame = document.activeElement === frame;
    const userIdle = now - lastInput > INPUT_GRACE;

    // a) Lanjutan loncatan yang sudah terdeteksi: terus tahan
    if (now < lockUntil && userIdle && focusInFrame) {
      lockUntil = now + LOCK_MS;
      if (Math.abs(window.scrollY - anchorY) > 2) restore();
      return;
    }

    // b) Gerakan baru: halaman diam, fokus di Spotify, kotak Spotify di luar layar, tanpa sentuhan
    if (wasResting && userIdle && focusInFrame && !frameVisible) {
      pending = true;                                   // tunggu sebentar, pastikan bukan input yang telat tiba
      setTimeout(() => {
        pending = false;
        if (performance.now() - lastInput > 300) {
          lockUntil = performance.now() + LOCK_MS;
          restore();
        } else {
          anchorY = window.scrollY;
        }
      }, 50);
      return;
    }

    anchorY = window.scrollY;
  }, { passive: true });

  /* ---------- 5. GANTI PLAYLIST ---------- */
  function updateLabel() {
    nameEl.textContent = PLAYLISTS[index].name;
    countEl.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(PLAYLISTS.length).padStart(2, '0');
  }

  function show(i) {
    index = (i + PLAYLISTS.length) % PLAYLISTS.length;
    updateLabel();

    startLoading();
    frame.classList.add('is-swapping');           // pudarkan iframe lama
    setTimeout(() => {
      frame.src = 'https://open.spotify.com/embed/playlist/' + PLAYLISTS[index].id + '?utm_source=generator';
    }, 250);
  }

  /* ---------- 6. MULAI ---------- */
  updateLabel();

  if (PLAYLISTS.length < 2) {                     // cuma satu playlist: sembunyikan panah
    prev.hidden = next.hidden = countEl.hidden = true;
    return;
  }

  prev.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));
})();
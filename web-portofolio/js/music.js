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


  /* ---------- 4. GANTI PLAYLIST ---------- */
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

  /* ---------- 5. MULAI ---------- */
  updateLabel();

  if (PLAYLISTS.length < 2) {                     // cuma satu playlist: sembunyikan panah
    prev.hidden = next.hidden = countEl.hidden = true;
    return;
  }

  prev.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));
})();
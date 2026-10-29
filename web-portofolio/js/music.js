/* ==========================================================
   MUSIC.JS - Ganti-ganti playlist Spotify dalam satu kotak
   Tambah playlist: tambah satu baris di PLAYLISTS.
   ID = bagian setelah /playlist/ di link Spotify (tanpa ?si=...).
   Playlist harus Public.
   ========================================================== */
(() => {
  const PLAYLISTS = [
    { name: 'FAVORITES', id: '0rrZvtqBxtelJycIUBh449' },
    { name: 'CHILL',  id: '1W5EDOA0xOYKroTcsfP8ia' },
    { name: 'FOCUS',  id: '0QvcKY0WILLAqIZDy1wCTw' },
  ];

  const SETTLE_MS = 350;      // tunggu sebentar setelah iframe selesai, biar isinya sempat tampil
  const MAX_WAIT_MS = 6000;   // pengaman: loading tidak boleh nyangkut selamanya

  const frame = document.getElementById('musicFrame');
  const nameEl = document.getElementById('musicName');
  const countEl = document.getElementById('musicCount');
  const prev = document.getElementById('musicPrev');
  const next = document.getElementById('musicNext');
  if (!frame || !nameEl) return;

  const stack = frame.parentElement;
  let index = 0;
  let safetyTimer = null;

  // Tampilkan / sembunyikan layar loading
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

  // Loading awal saat halaman pertama dibuka
  startLoading();
  frame.addEventListener('load', () => setTimeout(stopLoading, SETTLE_MS), { once: true });

  function show(i) {
    index = (i + PLAYLISTS.length) % PLAYLISTS.length;
    const p = PLAYLISTS[index];
    nameEl.textContent = p.name;
    countEl.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(PLAYLISTS.length).padStart(2, '0');

    startLoading();
    frame.classList.add('is-swapping');           // pudarkan iframe lama
    setTimeout(() => {
      frame.addEventListener('load', () => setTimeout(stopLoading, SETTLE_MS), { once: true });
      frame.src = 'https://open.spotify.com/embed/playlist/' + p.id + '?utm_source=generator';
    }, 250);
  }

  // Kalau playlist cuma satu, sembunyikan panah
  if (PLAYLISTS.length < 2) {
    prev.hidden = next.hidden = countEl.hidden = true;
    nameEl.textContent = PLAYLISTS[0].name;
    return;
  }

  prev.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));

  nameEl.textContent = PLAYLISTS[0].name;
  countEl.textContent = '01 / ' + String(PLAYLISTS.length).padStart(2, '0');
})();
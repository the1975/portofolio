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
    // { name: 'FOCUS',  id: 'ISI_ID_PLAYLIST' },
  ];

  const frame = document.getElementById('musicFrame');
  const nameEl = document.getElementById('musicName');
  const countEl = document.getElementById('musicCount');
  const prev = document.getElementById('musicPrev');
  const next = document.getElementById('musicNext');
  if (!frame || !nameEl) return;

  let index = 0;

  function show(i) {
    index = (i + PLAYLISTS.length) % PLAYLISTS.length;
    const p = PLAYLISTS[index];
    nameEl.textContent = p.name;
    countEl.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(PLAYLISTS.length).padStart(2, '0');

    frame.classList.add('is-swapping');           // pudar dulu
    setTimeout(() => {
      frame.src = 'https://open.spotify.com/embed/playlist/' + p.id + '?utm_source=generator';
      frame.onload = () => frame.classList.remove('is-swapping');
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
/* ==========================================================
   INTRO.JS - Intro ala kolom pencarian Google
   Dipakai index.html dan projects.html. Isi diatur lewat atribut
   data-query, data-suggest, data-key di elemen #intro.
   Alur: ketik -> saran menyempit -> panah bawah -> Enter -> garis loading -> naik.
   Ini mengasah: async/await + render ulang daftar tiap huruf.
   ========================================================== */
(() => {
  // false = intro tampil SETIAP halaman dibuka. true = cukup sekali per sesi tab.
  const ONCE_PER_SESSION = false;
  const TYPE_MIN = 55;   // kecepatan ketik: 55 sampai 110 ms per huruf (acak)
  const TYPE_VAR = 55;

  const intro = document.getElementById('intro');
  if (!intro) return;

  const root = document.documentElement;
  const key = 'intro:' + (intro.dataset.key || location.pathname);

  // Lewati total: pengguna mengurangi gerak, atau sudah pernah tampil di sesi ini
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || (ONCE_PER_SESSION && sessionStorage.getItem(key))) { intro.remove(); return; }

  root.classList.add('intro-lock');

  const search = document.getElementById('introSearch');
  const bar = document.getElementById('introBar');
  const text = document.getElementById('introText');
  const list = document.getElementById('introSuggest');
  const progress = document.getElementById('introProgress');
  const query = intro.dataset.query || '';
  const suggest = (intro.dataset.suggest || '').split('|').filter(Boolean);
    /* ---------- 0. HURUF MEREK: pecah per huruf supaya bisa jatuh satu-satu ---------- */
  const brand = intro.querySelector('.intro-brand');
  brand.innerHTML = [...brand.textContent.trim()]
    .map((c, i) => '<span style="--i:' + i + '">' + c + '</span>').join('');
  brand.classList.add('is-ready');

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  // Cegah gulir roda mouse/sentuhan menembus ke halaman (dan ke Lenis) di belakang
  ['wheel', 'touchstart', 'touchmove'].forEach((ev) =>
    intro.addEventListener(ev, (e) => e.stopPropagation(), { passive: true }));

  /* ---------- 1. SARAN: tampilkan yang cocok dengan teks, bagian lanjutan = tebal ---------- */
  const ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';

  function renderSuggest(typed) {
    const t = typed.toLowerCase();
    const hits = suggest.filter((s) => s.toLowerCase().startsWith(t)).slice(0, 4);   // maksimal 4 baris
    list.innerHTML = hits.map((s) =>
      '<li>' + ICON + '<span>' + s.slice(0, typed.length) + '<b>' + s.slice(typed.length) + '</b></span></li>').join('');
    search.classList.toggle('is-open', hits.length > 0);                            // kosong = daftar menutup
    return hits;
  }

  /* ---------- 2. ALUR ---------- */
    async function play() {
    await sleep(800);                                  // huruf merek jatuh satu per satu
    search.classList.add('is-in');                     // kolom pencarian muncul
    await sleep(450);
    bar.classList.add('is-focus');

    let typed = '';
    let hits = [];
    for (const ch of query) {
      typed += ch;
      text.textContent = typed;
      hits = renderSuggest(typed);                     // daftar menyempit tiap huruf
      await sleep(TYPE_MIN + Math.random() * TYPE_VAR);
    }
    await sleep(400);

    // "Panah bawah": saran pertama terpilih, teks kolom berubah jadi saran lengkap
    if (hits.length) {
      list.firstElementChild.classList.add('is-hit');
      text.textContent = hits[0];
      await sleep(500);
    }

    // "Enter": kolom ditekan, daftar menutup, garis loading berjalan
    bar.classList.add('is-press');
    search.classList.remove('is-open');
    await sleep(250);
    progress.classList.add('is-run');
    await sleep(500);
  }

  /* ---------- 3. KELUAR: layar naik lalu dibuang ---------- */
  async function leave() {
    intro.classList.add('is-leaving');
    await sleep(800);
    intro.remove();
    root.classList.remove('intro-lock');
    if (ONCE_PER_SESSION) sessionStorage.setItem(key, '1');
    dispatchEvent(new Event('intro:done'));            // kalau nanti ada yang perlu menunggu intro
  }

  play().catch(() => {}).finally(leave);               // finally = intro pasti selesai walau ada error
})();
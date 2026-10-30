/* ==========================================================
   INTRO.JS - Intro ala kolom pencarian Google
   Dipakai index.html dan projects.html. Isi diatur lewat atribut
   data-query, data-suggest, data-key di elemen #intro.
   Ini mengasah: async/await + timer yang bisa dibatalkan (skip).
   ========================================================== */
(() => {
  // false = intro tampil SETIAP halaman dibuka. true = cukup sekali per sesi tab.
  const ONCE_PER_SESSION = false;

  const intro = document.getElementById('intro');
  if (!intro) return;

  const root = document.documentElement;
  const key = 'intro:' + (intro.dataset.key || location.pathname);

  // Lewati total: pengguna mengurangi gerak, atau sudah pernah tampil di sesi ini
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || (ONCE_PER_SESSION && sessionStorage.getItem(key))) { intro.remove(); return; }

  root.classList.add('intro-lock');

  const text = document.getElementById('introText');
  const bar = document.getElementById('introBar');
  const list = document.getElementById('introSuggest');
  const query = intro.dataset.query || '';
  const suggest = (intro.dataset.suggest || '').split('|').filter(Boolean);

  /* ---------- 1. DAFTAR SARAN (dibuat dari data-suggest) ---------- */
  const ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
  list.innerHTML = suggest.map((s, i) =>
    '<li class="' + (i === 0 ? 'is-first' : '') + '">' + ICON + '<span>' + s + '</span></li>').join('');

  /* ---------- 2. TIMER YANG BISA DILEWATI ---------- */
  let skipped = false;
  let wake = null;
  const sleep = (ms) => skipped ? Promise.resolve() : new Promise((res) => {
    const t = setTimeout(res, ms);
    wake = () => { clearTimeout(t); res(); };
  });
  const skip = () => { skipped = true; if (wake) wake(); };

  intro.addEventListener('click', skip);
  addEventListener('keydown', skip, { once: true });

  // Cegah gulir roda mouse/sentuhan menembus ke halaman (dan ke Lenis) di belakang
  ['wheel', 'touchstart', 'touchmove'].forEach((ev) =>
    intro.addEventListener(ev, (e) => e.stopPropagation(), { passive: true }));

  /* ---------- 3. ALUR: ketik -> saran -> "tekan Enter" ---------- */
  async function play() {
    await sleep(600);                          // jeda sebelum mengetik
    bar.classList.add('is-focus');

    for (const ch of query) {
      if (skipped) break;
      text.textContent += ch;
      await sleep(55 + Math.random() * 55);    // kecepatan acak = terasa diketik manusia
    }
    text.textContent = query;                  // kalau dilewati, teks tetap tampil lengkap

    if (!skipped) { list.classList.add('is-show'); await sleep(900); }
    if (!skipped) { bar.classList.add('is-press'); await sleep(250); }
  }

  /* ---------- 4. KELUAR: layar naik lalu dibuang ---------- */
  async function leave() {
    intro.classList.add('is-leaving');
    await new Promise((r) => setTimeout(r, 800));
    intro.remove();
    root.classList.remove('intro-lock');
    if (ONCE_PER_SESSION) sessionStorage.setItem(key, '1');
    dispatchEvent(new Event('intro:done'));    // kalau nanti ada yang perlu menunggu intro
  }

  play().catch(() => {}).finally(leave);       // finally = intro pasti selesai walau ada error
})();

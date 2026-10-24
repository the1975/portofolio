/* ==========================================================
/* ==========================================================
   07. GITHUB CONTRIBUTIONS
   Data diambil dari API publik, lalu digambar jadi kalender.
   ========================================================== */
(() => {
  const USER = 'the1975';   // ganti kalau username GitHub berubah
  const API  = 'https://github-contributions-api.jogruber.de/v4/' + USER + '?y=last';

  const cal      = document.getElementById('ghCalendar');
  const scroller = document.getElementById('ghScroll');
  if (!cal) return;

  let CELL = 12;          // ukuran kotak (dihitung ulang sesuai lebar kartu)
  const GAP = 3;          // jarak antar kotak
  const LABEL_W = 36;     // lebar kolom label hari (Sen/Rab/Jum)

  // Tentukan level warna (0-4). Pakai level dari API kalau ada.
  const levelOf = (d) =>
    d.level !== undefined ? d.level
    : d.count === 0 ? 0 : d.count < 3 ? 1 : d.count < 6 ? 2 : d.count < 10 ? 3 : 4;

  const parse = (s) => new Date(s + 'T00:00:00');

  function showError() {
    cal.innerHTML =
      '<p class="font-mono text-xs tracking-widest text-ink/50 py-16 px-4">' +
      'DATA GITHUB BELUM BISA DIMUAT. ' +
      '<a class="underline" href="https://github.com/' + USER + '" target="_blank" rel="noopener">BUKA PROFIL →</a></p>';
  }

  function render(list) {
    const days = [...list].sort((a, b) => a.date.localeCompare(b.date));
    if (!days.length) return showError();

    /* ---- Ukuran kotak menyesuaikan lebar kartu (min 12px, maks 28px) ---- */
    const weekCount = Math.ceil((days.length + parse(days[0].date).getDay()) / 7);
    CELL = Math.max(12, Math.min(28, Math.floor((scroller.clientWidth - LABEL_W - GAP * (weekCount - 1)) / weekCount)));
    cal.style.setProperty('--cell', CELL + 'px');

    /* ---- Statistik: total, streak terpanjang, hari aktif ---- */
    let total = 0, active = 0, run = 0, longest = 0;
    days.forEach((d) => {
      total += d.count;
      if (d.count > 0) { active++; run++; longest = Math.max(longest, run); }
      else run = 0;
    });
    document.getElementById('ghTotal').textContent  = total.toLocaleString('id-ID');
    document.getElementById('ghStreak').textContent = longest + ' hari';
    document.getElementById('ghActive').textContent = active + ' hari';

    /* ---- Susun per minggu (kolom mulai hari Minggu) ---- */
    const cells = Array(parse(days[0].date).getDay()).fill(null).concat(days);
    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

    /* ---- Label bulan di atas kalender ---- */
    const months = document.createElement('div');
    months.style.cssText =
      'display:grid;grid-template-columns:repeat(' + weeks.length + ',' + CELL + 'px);gap:' + GAP + 'px;' +
      'margin-left:' + LABEL_W + 'px;margin-bottom:6px;' +
      'font:10px "JetBrains Mono",monospace;letter-spacing:.08em;color:rgba(232,232,228,.55)';

    let lastMonth = -1;
    weeks.forEach((w, i) => {
      const m = parse(w.find(Boolean).date).getMonth();
      if (m === lastMonth) return;
      lastMonth = m;
      if (i > weeks.length - 3) return;   // hindari label terpotong di ujung kanan
      const s = document.createElement('span');
      s.textContent = parse(w.find(Boolean).date).toLocaleDateString('id-ID', { month: 'short' }).toUpperCase();
      s.style.cssText = 'grid-column-start:' + (i + 1) + ';white-space:nowrap';
      months.appendChild(s);
    });

    /* ---- Label hari di kiri (Sen / Rab / Jum) ---- */
    const dayLabels = document.createElement('div');
    dayLabels.style.cssText =
      'display:grid;grid-template-rows:repeat(7,' + CELL + 'px);gap:' + GAP + 'px;' +
      'width:' + (LABEL_W - 8) + 'px;margin-right:8px;' +
      'font:10px "JetBrains Mono",monospace;color:rgba(232,232,228,.55)';
    ['', 'Sen', '', 'Rab', '', 'Jum', ''].forEach((t) => {
      const s = document.createElement('span');
      s.textContent = t;
      s.style.lineHeight = CELL + 'px';
      dayLabels.appendChild(s);
    });

    /* ---- Kotak-kotak kontribusi ---- */
    const grid = document.createElement('div');
    grid.style.cssText =
      'display:grid;grid-auto-flow:column;grid-template-rows:repeat(7,' + CELL + 'px);' +
      'grid-auto-columns:' + CELL + 'px;gap:' + GAP + 'px';

    cells.forEach((d) => {
      const el = document.createElement('i');
      el.className = 'gh-cell';
      if (d) {
        el.dataset.level = levelOf(d);
        el.title = d.count + ' kontribusi pada ' +
          parse(d.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      } else {
        el.style.visibility = 'hidden';   // sel kosong sebelum tanggal pertama
      }
      grid.appendChild(el);
    });

    const row = document.createElement('div');
    row.style.display = 'flex';
    row.append(dayLabels, grid);

    cal.innerHTML = '';
    cal.append(months, row);
    scroller.scrollLeft = scroller.scrollWidth;   // tampilkan data terbaru (kanan) di HP
  }

  /* ---- Ambil data dari API ---- */
  let lastData = null;

  fetch(API)
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then((data) => { lastData = data.contributions || []; render(lastData); })
    .catch(showError);

  /* ---- Gambar ulang kalau ukuran layar berubah ---- */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { if (lastData) render(lastData); }, 150);
  });
})();

/* ==========================================================
   PROJECTS-PAGE.JS - Logika halaman projects.html
   Alur: data (projects-data.js) -> filter (kategori + search) -> tampil.
   Ini mengasah: state sederhana (active, query) + render ulang.
   ========================================================== */
(() => {
  /* ---------- 1. IKON (isi <svg>, gaya garis) ---------- */
  const ICONS = {
    all:       '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    web:       '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    data:      '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    iot:       '<rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>',
    statistik: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  };
  const icon = (key) =>
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">' +
    (ICONS[key] || ICONS.all) + '</svg>';

  /* ---------- 2. ELEMEN + STATE ---------- */
  const sideEl   = document.getElementById('sideNav');
  const bottomEl = document.getElementById('bottomNav');
  const listEl   = document.getElementById('projectList');
  const titleEl  = document.getElementById('listTitle');
  const countEl  = document.getElementById('listCount');
  const searchEl = document.getElementById('searchInput');

  let active = 'all';   // kategori yang dipilih
  let query = '';       // teks pencarian

  /* ---------- 3. NAVIGASI (sidebar + bar bawah dari data yang sama) ---------- */
  const ON  = 'bg-ink text-paper';
  const OFF = 'text-ink/50 hover:text-ink';

  function renderNav() {
    // Sidebar laptop: ikon saja (title = tooltip)
    sideEl.innerHTML = PROJECT_CATEGORIES.map((c) =>
      '<button type="button" data-cat="' + c.key + '" title="' + c.label + '" aria-label="' + c.label + '" ' +
      'class="w-11 h-11 rounded-2xl grid place-items-center transition ' + (c.key === active ? ON : OFF) + '">' +
      icon(c.key) + '</button>').join('');

    // Bar bawah HP: ikon + label pendek (kata pertama, mis. "Data Processing" -> "Data")
    bottomEl.innerHTML = PROJECT_CATEGORIES.map((c) =>
      '<button type="button" data-cat="' + c.key + '" aria-label="' + c.label + '" ' +
      'class="flex-1 min-w-0 flex flex-col items-center gap-1 py-2 rounded-xl font-mono text-[10px] tracking-wide transition ' +
      (c.key === active ? ON : OFF) + '">' + icon(c.key) + '<span>' + c.label.split(' ')[0] + '</span></button>').join('');
  }

  /* ---------- 4. FILTER ---------- */
  function filtered() {
    const q = query.trim().toLowerCase();
    return PROJECTS.filter((p) => {
      const okCat = active === 'all' || p.category === active;
      // cari di judul, deskripsi, dan tag
      const okQuery = !q || (p.title + ' ' + p.desc + ' ' + p.tags.join(' ')).toLowerCase().includes(q);
      return okCat && okQuery;
    });
  }

  /* ---------- 5. TAMPILKAN ---------- */
  function renderList() {
    const items = filtered();
    const cat = PROJECT_CATEGORIES.find((c) => c.key === active);
    titleEl.textContent = active === 'all' ? 'Semua Project' : cat.label;
    countEl.textContent = items.length + ' PROJECT';

    // SEMENTARA: baris teks. Langkah 2 diganti kartu beneran.
    listEl.innerHTML = items.length
      ? items.map((p) =>
          '<p class="font-mono text-sm py-3 border-t border-ink/15">' + p.title + ' · ' + p.category + '</p>').join('')
      : '<p class="text-sm text-ink/50 border-t border-ink/15 pt-4">Belum ada project di sini.</p>';
  }

  /* ---------- 6. EVENT ---------- */
  // Satu listener untuk semua tombol kategori (sidebar maupun bar bawah)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-cat]');
    if (!btn) return;
    active = btn.dataset.cat;
    renderNav();
    renderList();
  });

  searchEl.addEventListener('input', () => {
    query = searchEl.value;
    renderList();
  });

  /* ---------- 7. MULAI ---------- */
  renderNav();
  renderList();
})();
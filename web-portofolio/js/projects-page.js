/* ==========================================================
   PROJECTS-PAGE.JS - Logika halaman projects.html
   Alur: data (projects-data.js) -> filter (kategori + search) -> etalase kartu.
   Ini mengasah: state sederhana + render ulang + animasi bertahap.
   ========================================================== */
(() => {
  /* ---------- 1. IKON ---------- */
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

  /* ---------- 3. NAVIGASI ----------
     Tombol dibuat SEKALI. Saat ganti kategori cuma class "is-active" yang
     berpindah, jadi transisi CSS bisa berjalan (kalau dibuat ulang, animasinya hilang). */
  function buildNav() {
    // Sidebar laptop: ikon saja (title = tooltip)
    sideEl.innerHTML = PROJECT_CATEGORIES.map((c) =>
      '<button type="button" data-cat="' + c.key + '" title="' + c.label + '" aria-label="' + c.label + '" ' +
      'class="nav-btn w-11 h-11 rounded-2xl grid place-items-center">' + icon(c.key) + '</button>').join('');

    // Bar bawah HP: ikon + label pendek ("Data Processing" -> "Data")
    bottomEl.innerHTML = PROJECT_CATEGORIES.map((c) =>
      '<button type="button" data-cat="' + c.key + '" aria-label="' + c.label + '" ' +
      'class="nav-btn flex-1 min-w-0 flex flex-col items-center gap-1 py-2 rounded-xl font-mono text-[10px] tracking-wide">' +
      icon(c.key) + '<span>' + c.label.split(' ')[0] + '</span></button>').join('');
  }

  function setActive() {
    document.querySelectorAll('[data-cat]').forEach((btn) =>
      btn.classList.toggle('is-active', btn.dataset.cat === active));
  }

  /* ---------- 4. FILTER ---------- */
  function filtered() {
    const q = query.trim().toLowerCase();
    return PROJECTS.filter((p) => {
      const okCat = active === 'all' || p.category === active;
      const okQuery = !q || (p.title + ' ' + p.desc + ' ' + p.tags.join(' ')).toLowerCase().includes(q);
      return okCat && okQuery;
    });
  }

  /* ---------- 5. KARTU ETALASE ---------- */
  function cardHTML(p, i) {
    const num = String(i + 1).padStart(2, '0');        // nomor urut di daftar yang tampil
    const cover = p.shots && p.shots[0];               // foto pertama jadi sampul
    const delay = Math.min(i, 8) * 60;                 // muncul bertahap, maksimal 8 kartu

    return '<button type="button" data-open="' + PROJECTS.indexOf(p) + '" ' +
      'class="showcase-card card-in text-left bg-white rounded-3xl p-4 w-full" style="animation-delay:' + delay + 'ms">' +
        '<div class="flex justify-between font-mono text-[11px] tracking-widest text-ink/50 mb-3 px-1">' +
          '<span>' + num + ' / PROJECT</span><span>' + p.year + '</span></div>' +
        // Sampul: tulisan NO PREVIEW tampil di belakang, tertutup foto kalau fotonya ada
        '<div class="relative aspect-[16/10] rounded-2xl overflow-hidden bg-ink/5 grid place-items-center font-mono text-[10px] tracking-widest text-ink/30">' +
          '<span>NO PREVIEW</span>' +
          (cover ? '<img src="' + cover + '" alt="' + p.title + '" loading="lazy" decoding="async" ' +
                   'class="absolute inset-0 w-full h-full object-cover" onerror="this.style.display=\'none\'">' : '') +
        '</div>' +
        '<h3 class="font-serif text-xl mt-4 px-1">' + p.title + '</h3>' +
        '<div class="flex flex-wrap gap-2 mt-3 px-1">' + p.tags.map((t) => '<span class="tag">' + t + '</span>').join('') + '</div>' +
      '</button>';
  }

  function renderList() {
    const items = filtered();
    const cat = PROJECT_CATEGORIES.find((c) => c.key === active);
    titleEl.textContent = active === 'all' ? 'Semua Project' : cat.label;
    countEl.textContent = items.length + ' PROJECT';

    listEl.innerHTML = items.length
      ? items.map(cardHTML).join('')
      : '<p class="text-sm text-ink/50 col-span-full">Belum ada project di sini.</p>';
  }

    /* ---------- 5b. POPUP DETAIL ---------- */
  const modal      = document.getElementById('projectModal');
  const modalBody  = document.getElementById('pmBody');
  const modalClose = document.getElementById('pmClose');

  const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  // Cerita: string (pisahkan paragraf dengan baris kosong) atau array. Kosong -> pakai desc.
  function storyHTML(p) {
    const raw = p.story || p.desc || '';
    const parts = Array.isArray(raw) ? raw : String(raw).split(/\n\s*\n/);
    return parts.map((t) => '<p>' + t.trim() + '</p>').join('');
  }

  // Foto besar + deretan thumbnail (thumbnail hanya muncul kalau fotonya lebih dari 1)
  function galleryHTML(p) {
    const shots = p.shots || [];
    const main =
      '<div class="relative aspect-[16/10] rounded-2xl overflow-hidden bg-ink/5 grid place-items-center font-mono text-[10px] tracking-widest text-ink/30">' +
        '<span>NO PREVIEW</span>' +
        (shots[0] ? '<img id="pmMain" src="' + shots[0] + '" alt="' + p.title + '" decoding="async" ' +
                    'class="absolute inset-0 w-full h-full object-contain" onerror="this.style.display=\'none\'">' : '') +
      '</div>';
    const thumbs = shots.length > 1
      ? '<div class="flex gap-2 mt-3 overflow-x-auto pb-1">' + shots.map((s, i) =>
          '<button type="button" data-shot="' + s + '" aria-label="Foto ' + (i + 1) + '" class="pm-thumb' + (i === 0 ? ' is-active' : '') + '">' +
          '<img src="' + s + '" alt="" loading="lazy" onerror="this.style.display=\'none\'"></button>').join('') + '</div>'
      : '';
    return main + thumbs;
  }

  // Tombol link: yang pertama berisi (hitam), sisanya berbingkai. Panah ketikan diganti ikon.
  function linksHTML(p) {
    return (p.links || []).map((l, i) => {
      const label = l.label.replace(/\s*[↗→]\s*$/, '');
      const look = i === 0 ? 'bg-ink text-paper' : 'border border-ink';
      return '<a href="' + l.url + '" target="_blank" rel="noopener" ' +
        'class="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-mono text-xs tracking-widest transition active:scale-95 ' + look + '">' +
        label + ARROW + '</a>';
    }).join('');
  }

  function openProject(i) {
    const p = PROJECTS[i];
    if (!p) return;
    const cat = PROJECT_CATEGORIES.find((c) => c.key === p.category);

    modalBody.innerHTML =
      '<div class="grid md:grid-cols-[1.15fr_1fr] gap-8 md:gap-10 p-5 pt-16 md:p-10">' +
        '<div>' + galleryHTML(p) + '</div>' +
        '<div>' +
          '<p class="font-mono text-[11px] tracking-widest text-ink/50 mb-4">' + (cat ? cat.label.toUpperCase() : '') + ' · ' + p.year + '</p>' +
          '<h2 id="pmTitle" class="font-serif text-3xl md:text-4xl leading-tight md:pr-12">' + p.title + '</h2>' +
          '<div class="flex flex-wrap gap-2 mt-4">' + p.tags.map((t) => '<span class="tag">' + t + '</span>').join('') + '</div>' +
          '<div class="mt-6 space-y-4 text-sm md:text-[15px] font-light text-ink/75 leading-relaxed">' + storyHTML(p) + '</div>' +
          '<div class="mt-8 flex flex-wrap gap-3">' + linksHTML(p) + '</div>' +
        '</div>' +
      '</div>';

    modal.querySelector('.pm-scroll').scrollTop = 0;   // selalu mulai dari atas
    document.documentElement.classList.add('modal-open');
    modal.showModal();
  }

  // Tutup: tombol X, klik area gelap, atau tombol Esc (bawaan <dialog>)
  modalClose.addEventListener('click', () => modal.close());
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });
  modal.addEventListener('close', () => document.documentElement.classList.remove('modal-open'));

  // Ganti foto besar saat thumbnail ditekan
  modal.addEventListener('click', (e) => {
    const t = e.target.closest('[data-shot]');
    if (!t) return;
    const main = document.getElementById('pmMain');
    main.style.display = '';
    main.src = t.dataset.shot;
    modal.querySelectorAll('.pm-thumb').forEach((b) => b.classList.toggle('is-active', b === t));
  });

  /* ---------- 6. EVENT ---------- */
  document.addEventListener('click', (e) => {
    const catBtn = e.target.closest('[data-cat]');
    if (catBtn) {
      active = catBtn.dataset.cat;
      setActive();
      renderList();
      return;
    }
        // Klik kartu -> buka popup
    const openBtn = e.target.closest('[data-open]');
    if (openBtn) openProject(Number(openBtn.dataset.open));
  });

  searchEl.addEventListener('input', () => {
    query = searchEl.value;
    renderList();
  });

  

  /* ---------- 7. MULAI ---------- */
  buildNav();
  setActive();
  renderList();
})();

    // Sidebar laptop: ikon + teks yang muncul saat di-hover
    sideEl.innerHTML = PROJECT_CATEGORIES.map((c) =>
      '<button type="button" data-cat="' + c.key + '" aria-label="' + c.label + '" ' +
      'class="nav-btn w-11 h-11 rounded-2xl grid place-items-center">' + icon(c.key) +
      '<span class="nav-tip">' + c.label + '</span></button>').join('');
/* ==========================================================
   SCRIPT.JS - Portfolio Leonardo
   ----------------------------------------------------------
   DAFTAR ISI (cari pakai Ctrl+F nomor section):
   01. Animasi muncul saat scroll
   02. Galeri marquee (gandakan foto)
   03. Text typing di hero
   04. Kartu bertumpuk (stacking)
   05. Glitch headline hero
   06. Sertifikat (coverflow)  <- DATA SERTIFIKAT DI SINI
   07. GitHub contributions
   08. Contact: judul loncat + popup + kirim pesan  <- ISI EMAIL/WA DI SINI
   09. Tumpukan screenshot project
   10. About: kata menyala + ticker teknologi + glow
   11. Chip mindset hero
   12. Scroll halus ke About
   ----------------------------------------------------------
   Tips debug: tiap section dibungkus IIFE (() => {...})(),
   jadi variabel antar section tidak saling bentrok.
   ========================================================== */


/* ==========================================================
   01. ANIMASI MUNCUL SAAT SCROLL
   Elemen ber-class .reveal diberi .show saat masuk layar.
   Setelah selesai, class dilepas supaya tidak mengganggu hover.
   ========================================================== */
(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      el.classList.add('show');
      setTimeout(() => el.classList.remove('reveal', 'show'), 900);
      observer.unobserve(el);
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
})();


/* ==========================================================
   02. GALERI MARQUEE
   Foto digandakan supaya animasi geser terlihat tanpa putus.
   ========================================================== */
(() => {
  const marquee = document.getElementById('marquee');
  if (!marquee) return;

  [...marquee.children].forEach((img) => {
    const clone = img.cloneNode(true);
    clone.alt = '';
    clone.setAttribute('aria-hidden', 'true');
    marquee.appendChild(clone);
  });
})();


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
   04. KARTU BERTUMPUK (STACKING)
   Kartu .stack-card menempel (sticky) lalu mengecil & menggelap
   saat kartu berikutnya menimpa. Hanya aktif di layar >= 768px.
   ========================================================== */
(() => {
  const cards = [...document.querySelectorAll('.stack-card')];
  const mq = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');

  // Hitung progres tumpukan tiap kartu saat scroll
  function update() {
    if (!mq.matches) return;

    cards.forEach((card) => {
      const next = card.nextElementSibling;
      if (!next) return;

      // Seberapa jauh kartu berikutnya sudah menimpa (0 sampai 1)
      const raw = Math.min(1, Math.max(0, 1 - next.getBoundingClientRect().top / window.innerHeight));

      // smoothstep: awal & akhir gerakan melambat, terasa mengalir
      const p = raw * raw * (3 - 2 * raw);

      card.style.transform = `scale(${1 - 0.035 * p})`;
      card.style.setProperty('--dim', (0.3 * p).toFixed(3));
      card.style.visibility = raw >= 0.995 ? 'hidden' : '';
    });
  }

  // Atur mode sticky (desktop) atau kartu biasa (HP / reduced motion)
  function layout() {
    cards.forEach((card) => {
      if (mq.matches) {
        card.style.position = 'sticky';
        card.style.top = Math.min(24, window.innerHeight - card.offsetHeight - 24) + 'px';
      } else {
        card.style.position = 'static';
        card.style.top = '';
        card.style.transform = '';
        card.style.visibility = '';
        card.style.setProperty('--dim', 0);
      }
    });
    update();
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }, { passive: true });

  window.addEventListener('resize', layout);
  window.addEventListener('load', layout);
  layout();
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
   06. SERTIFIKAT (COVERFLOW)
   Tambah / edit sertifikat cukup di array CERTS di bawah.
   ========================================================== */
(() => {
  /* ----- DATA SERTIFIKAT ----- */
  const CERTS = [
    { title: 'Dasar Pemrograman Web', issuer: 'Dicoding / Google Developers', date: '2026',
      desc: 'Menyelesaikan kelas Dasar Pemrograman Web dari Dicoding dengan mempelajari dasar HTML dan CSS untuk membangun halaman web.',
      image: 'img/DasarPemogramanWeb.jpg', link: 'https://drive.google.com/file/d/1SHUnZHOastnwDPW0b03U6syp8VG7NEl7/view?usp=drivesdk' },
    { title: 'Dasar Pemrograman JavaScript', issuer: 'Dicoding', date: '2026',
      desc: 'Menyelesaikan kelas Dasar Pemrograman JavaScript dari Dicoding dengan mempelajari fundamental JavaScript untuk membangun interaksi pada website.',
      image: 'img/Dasar-Js.jpg', link: 'https://drive.google.com/file/d/1hVj94UYxid7y2K5bTA0i1sCboJo9PTWk/view?usp=drivesdk' },
    { title: 'Membuat Front-End Web Untuk Pemula', issuer: 'Dicoding', date: '2026',
      desc: 'Menyelesaikan kelas Belajar Membuat Front-End Web untuk Pemula dari Dicoding dengan mempelajari dasar pengembangan front-end menggunakan HTML, CSS, dan JavaScript.',
      image: 'img/FrontEndPemula.jpg', link: 'https://drive.google.com/file/d/17J2L7T68c4_-K9LA3QaoXKJeQxhf2m8s/view?usp=drivesdk' },
    { title: 'Strategi Pengembangan Diri', issuer: 'Dicoding', date: '2026',
      desc: 'Mempelajari strategi untuk mengembangkan potensi diri dan meningkatkan kesiapan menghadapi dunia profesional.',
      image: 'img/StrategiPengembangan.jpg', link: 'https://drive.google.com/file/d/1VnrJMLuFk6R4L7AbXaiVLVrh1nbeK0Fk/view?usp=drivesdk' },
    { title: 'Financial Literacy', issuer: 'Dicoding', date: '2026',
      desc: 'Mempelajari dasar literasi keuangan, termasuk pengelolaan keuangan pribadi, perencanaan finansial, dan pengambilan keputusan keuangan yang bijak.',
      image: 'img/Financial-literacy.jpg', link: 'https://drive.google.com/file/d/1PSoQsLV6AHzc2aYxRYmeeXfKFZ70kzGV/view?usp=drivesdk' },
    { title: 'Spec-Driven Development dengan Kiro', issuer: 'Dicoding / AWS', date: '2026',
      desc: 'Mempelajari pendekatan Spec-Driven Development untuk merancang dan mengembangkan perangkat lunak secara terstruktur dengan bantuan Kiro.',
      image: 'img/Spec-DrivenDevelopmentdenganKiro.jpg', link: 'https://drive.google.com/file/d/137NBaeVzkzd7YpttS8Kox5CmnDGQ-Ow7/view?usp=drivesdk' },
    { title: 'Python Programming With RedHat', issuer: 'RedHat Academy', date: '2026',
      desc: 'Mempelajari dasar pemrograman Python, termasuk sintaks, struktur data, fungsi, serta penerapan logika pemrograman untuk menyelesaikan masalah.',
      image: 'img/RedHat.jpg', link: 'https://drive.google.com/file/d/1l0JW3VjHuyMq6YhwMUUre6qwnaWjVQT3/view?usp=drivesdk' },
    { title: 'Etika, Kesadaran, dan Identitas Manusia di Era Sistem Informasi Digital', issuer: 'UNP Kediri / UM', date: '2025',
      desc: 'Mempelajari etika, kesadaran, dan identitas manusia serta penerapan etika AI dalam perspektif Sistem Informasi.',
      image: 'img/KuliahTamu.jpg', link: 'https://drive.google.com/file/d/1oF7OXaSraGDbcMCNdTlp7QE5U4mnXmgH/view?usp=drivesdk' }
  ];

  /* ----- ELEMEN HTML ----- */
  const stage   = document.getElementById('certStage');
  const track   = document.getElementById('certTrack');
  const info    = document.getElementById('certInfo');
  const elTitle = document.getElementById('certTitle');
  const elMeta  = document.getElementById('certMeta');
  const elDesc  = document.getElementById('certDesc');
  const elLink  = document.getElementById('certLink');
  const elCount = document.getElementById('certCount');
  const btnPrev = document.getElementById('certPrev');
  const btnNext = document.getElementById('certNext');
  if (!stage || !track) return;

  let active = 0;        // index sertifikat yang sedang di tengah
  let startX = null;     // posisi awal sentuh/drag
  let dragged = false;   // true kalau baru selesai drag (supaya tidak dianggap klik)

  /* ----- BUAT KARTU DARI DATA ----- */
  const cards = CERTS.map((c, i) => {
    const card = document.createElement('div');
    card.className = 'cert-card';
    card.innerHTML =
      '<img src="' + c.image + '" alt="' + c.title + '" draggable="false" loading="lazy" onerror="this.style.opacity=0">';

    card.addEventListener('click', () => {
      if (dragged) { dragged = false; return; }
      if (i === active) {
        if (c.link && c.link !== '#') window.open(c.link, '_blank', 'noopener'); // klik kartu tengah = buka sertifikat
      } else {
        go(i);                                                                   // klik kartu samping = geser ke sana
      }
    });

    track.appendChild(card);
    return card;
  });

  /* ----- POSISI TIAP KARTU RELATIF KE KARTU AKTIF ----- */
  function layout() {
    cards.forEach((card, i) => {
      const d = i - active;       // jarak dari kartu aktif
      const a = Math.abs(d);
      const scale = Math.max(0.6, 1 - 0.13 * a);

      card.style.transform = 'translateX(calc(-50% + ' + (d * 58) + '%)) rotateY(' + (-d * 12) + 'deg) scale(' + scale + ')';
      card.style.opacity = a === 0 ? 1 : a === 1 ? 0.75 : a === 2 ? 0.3 : 0;
      card.style.filter = 'brightness(' + (1 - 0.25 * Math.min(a, 2)) + ')';
      card.style.zIndex = String(10 - a);
      card.style.pointerEvents = a > 2 ? 'none' : 'auto';
      card.style.cursor = 'pointer';
    });
  }

  /* ----- TEKS DI BAWAH KARTU (pudar dulu, lalu ganti isi) ----- */
  function renderInfo() {
    const c = CERTS[active];
    info.style.opacity = 0;

    setTimeout(() => {
      elTitle.textContent = c.title;
      elMeta.textContent = (c.issuer + ' · ' + c.date).toUpperCase();
      elDesc.textContent = c.desc;
      elLink.href = c.link || '#';
      info.style.opacity = 1;
    }, 180);

    elCount.textContent = String(active + 1).padStart(2, '0') + ' / ' + String(CERTS.length).padStart(2, '0');
    btnPrev.style.opacity = active === 0 ? 0.3 : 1;
    btnNext.style.opacity = active === CERTS.length - 1 ? 0.3 : 1;
  }

  /* ----- PINDAH KE SERTIFIKAT KE-n ----- */
  function go(n) {
    active = Math.max(0, Math.min(CERTS.length - 1, n));
    layout();
    renderInfo();
  }

  /* ----- KONTROL: tombol, keyboard, swipe ----- */
  btnPrev.addEventListener('click', () => go(active - 1));
  btnNext.addEventListener('click', () => go(active + 1));

  stage.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') go(active - 1);
    if (e.key === 'ArrowRight') go(active + 1);
  });

  stage.addEventListener('pointerdown', (e) => { startX = e.clientX; dragged = false; });
  stage.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 40) {
      dragged = true;
      go(active + (dx < 0 ? 1 : -1));
    }
  });
  stage.addEventListener('pointercancel', () => { startX = null; });

  go(0);
})();


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


/* ==========================================================
   08. CONTACT: JUDUL LONCAT + POPUP + KIRIM PESAN
   ========================================================== */
(() => {
  /* ----- PENGATURAN ----- */
  const FORM_ENDPOINT = '';   // isi URL Formspree, contoh: 'https://formspree.io/f/abcdwxyz'
                              // (kosong = buka aplikasi email bawaan)
  const TO_EMAIL  = 'leonardoyanuarianto907@gmail.com';
  const WA_NUMBER = '6285733283841';   // format internasional: 62 + nomor tanpa 0 di depan

  /* ----- 8a. HURUF "LET'S WORK TOGETHER" LONCAT-LONCAT ----- */
  // Memecah teks jadi <span> per huruf; --i dipakai CSS untuk delay animasi
  function splitLetters(root) {
    let i = 0;
    root.setAttribute('aria-label', root.textContent.replace(/\s+/g, ' ').trim());

    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === 3) {                       // node teks
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }

            const word = document.createElement('span');
            word.className = 'bounce-word';
            word.setAttribute('aria-hidden', 'true');
            [...part].forEach((ch) => {
              const s = document.createElement('span');
              s.className = 'bounce-ch';
              s.style.setProperty('--i', i++);
              s.textContent = ch;
              word.appendChild(s);
            });
            frag.appendChild(word);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) {                // elemen (mis. <em>)
          walk(child);
        }
      });
    };
    walk(root);
  }

  const title = document.getElementById('contactTitle');
  if (title) splitLetters(title);

  /* ----- 8b. POPUP (dipakai untuk Email dan WhatsApp) ----- */
  const modal      = document.getElementById('contactModal');
  const form       = document.getElementById('contactForm');
  const emailField = document.getElementById('emailField');
  const modalLabel = document.getElementById('modalLabel');
  const modalTitle = document.getElementById('modalTitle');
  const status     = document.getElementById('formStatus');
  const btn        = document.getElementById('sendBtn');
  if (!modal || !form) return;

  let mode = 'email';   // 'email' atau 'whatsapp'

  const COPY = {
    email:    { label: 'EMAIL',    title: 'Send an Email directly.', button: 'SEND MESSAGE',  placeholder: 'Your message here...' },
    whatsapp: { label: 'WHATSAPP', title: 'Chat me on WhatsApp.',    button: 'OPEN WHATSAPP', placeholder: 'Tulis pesan kamu di sini...' }
  };

  function openModal(m) {
    mode = m;
    const c = COPY[m];

    modalLabel.textContent = c.label;
    modalTitle.textContent = c.title;
    btn.textContent = c.button;
    form.elements['message'].placeholder = c.placeholder;
    emailField.style.display = m === 'whatsapp' ? 'none' : '';   // WA tidak butuh kolom email
    form.elements['email'].required = m === 'email';
    status.textContent = '';

    document.body.style.overflow = 'hidden';   // kunci scroll halaman
    modal.showModal();
    form.elements['name'].focus();
  }

  document.querySelectorAll('[data-open-modal]').forEach((b) => {
    b.addEventListener('click', () => openModal(b.dataset.openModal));
  });

  document.getElementById('modalClose').addEventListener('click', () => modal.close());
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });   // klik backdrop = tutup
  modal.addEventListener('close', () => { document.body.style.overflow = ''; });

  /* ----- 8c. KIRIM PESAN ----- */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const data = Object.fromEntries(new FormData(form));
    if (data._gotcha) return;   // jebakan spam: bot mengisi field tersembunyi

    // --- WhatsApp: buka chat dengan pesan sudah terisi ---
    if (mode === 'whatsapp') {
      const text = 'Halo Leonardo, saya ' + data.name + '.\n\n' + data.message;
      status.textContent = 'MEMBUKA WHATSAPP…';
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
      return;
    }

    // --- Email tanpa layanan form: buka aplikasi email ---
    if (!FORM_ENDPOINT) {
      const subject = encodeURIComponent('Pesan dari portfolio: ' + data.name);
      const body = encodeURIComponent(data.message + '\n\n— ' + data.name + ' (' + data.email + ')');
      status.textContent = 'MEMBUKA APLIKASI EMAIL…';
      window.location.href = 'mailto:' + TO_EMAIL + '?subject=' + subject + '&body=' + body;
      return;
    }

    // --- Email lewat Formspree: langsung masuk inbox ---
    btn.disabled = true;
    btn.textContent = 'SENDING…';
    status.textContent = '';

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      status.textContent = 'TERKIRIM. TERIMA KASIH, SAYA AKAN SEGERA MEMBALAS!';
      setTimeout(() => modal.close(), 2200);
    } catch (err) {
      status.textContent = 'GAGAL MENGIRIM. COBA LAGI ATAU HUBUNGI LEWAT WHATSAPP.';
    } finally {
      btn.disabled = false;
      btn.textContent = COPY.email.button;
    }
  });
})();


/* ==========================================================
   09. TUMPUKAN SCREENSHOT PROJECT
   Tiap <div class="shot-stack" data-shots="a.jpg, b.jpg">
   diubah jadi tumpukan kartu yang bisa digeser.
   ========================================================== */
(() => {
  // Transparansi kartu berdasarkan posisinya di tumpukan
  const opacityFor = (pos) => (pos === 0 ? 1 : pos === 1 ? 0.85 : pos === 2 ? 0.6 : 0);

  // Posisi kartu di tumpukan: 0 = paling atas, makin besar = makin ke belakang
  const place = (card, pos) => {
    const k = Math.min(pos, 2);
    card.style.zIndex = String(10 - pos);
    card.style.transform = 'translateY(' + (-14 * k) + 'px) scale(' + (1 - 0.05 * k) + ')';
    card.style.opacity = opacityFor(pos);
  };

  document.querySelectorAll('.shot-stack').forEach((root) => {
    const shots = (root.dataset.shots || '').split(',').map((s) => s.trim()).filter(Boolean);
    const label = root.dataset.label || 'project';
    if (!shots.length) return;

    const n = shots.length;
    const stage = document.createElement('div');
    stage.className = 'shot-stage';
    stage.tabIndex = 0;
    stage.setAttribute('role', 'group');
    stage.setAttribute('aria-label', 'Screenshot ' + label);

    /* ---- Buat kartu (jendela browser mini) dari daftar gambar ---- */
    const cards = shots.map((src, i) => {
      const card = document.createElement('div');
      card.className = 'shot-card';
      card.innerHTML =
        '<div class="shot-bar"><i></i><i></i><i></i><span>' + label + '</span></div>' +
        '<img src="' + src + '" alt="' + label + ' (' + (i + 1) + ')" loading="lazy" decoding="async" draggable="false">';
      card.querySelector('img').addEventListener('error', function () {
        this.style.display = 'none';
        card.classList.add('no-img');   // tampilkan placeholder kalau gambar tidak ada
      });
      stage.appendChild(card);
      return card;
    });

    /* ---- Kontrol: penanda angka + tombol panah ---- */
    const ui = document.createElement('div');
    ui.className = 'shot-ui';
    ui.innerHTML =
      '<span class="shot-count"></span>' +
      '<div class="shot-btns">' +
        '<button type="button" class="shot-btn" aria-label="Sebelumnya"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>' +
        '<button type="button" class="shot-btn" aria-label="Berikutnya"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></button>' +
      '</div>';
    const count = ui.querySelector('.shot-count');
    const [btnPrev, btnNext] = ui.querySelectorAll('.shot-btn');

    root.append(stage, ui);
    if (n < 2) ui.style.display = 'none';

    /* ---- Urutan tumpukan: order[0] = kartu paling atas ---- */
    let order = cards.map((_, i) => i);
    let busy = false;   // cegah klik beruntun saat animasi jalan

    const update = () => {
      count.textContent = String(order[0] + 1).padStart(2, '0') + ' / ' + String(n).padStart(2, '0');
    };
    const layout = () => order.forEach((ci, pos) => place(cards[ci], pos));

    // Kartu atas meluncur ke kanan, lalu pindah ke belakang tumpukan
    function next() {
      if (n < 2 || busy) return;
      busy = true;

      const topIdx = order[0];
      const top = cards[topIdx];
      order = [...order.slice(1), topIdx];

      order.forEach((ci, pos) => { if (ci !== topIdx) place(cards[ci], pos); });   // kartu lain maju

      top.style.zIndex = '20';
      top.style.transform = 'translateX(115%) rotate(5deg)';
      top.style.opacity = '0';

      setTimeout(() => {   // setelah keluar layar, taruh di belakang tanpa animasi
        const pos = order.length - 1;
        top.style.transition = 'none';
        place(top, pos);
        top.style.opacity = '0';
        void top.offsetWidth;   // paksa browser menerapkan style sebelum transisi dinyalakan lagi
        top.style.transition = '';
        top.style.opacity = opacityFor(pos);
        busy = false;
      }, 450);

      update();
    }

    // Kartu paling belakang meluncur masuk ke paling atas
    function prev() {
      if (n < 2 || busy) return;
      busy = true;

      const backIdx = order[order.length - 1];
      const card = cards[backIdx];

      card.style.transition = 'none';   // taruh di luar kanan tanpa animasi
      card.style.zIndex = '20';
      card.style.transform = 'translateX(115%) rotate(5deg)';
      card.style.opacity = '0';
      void card.offsetWidth;
      card.style.transition = '';

      order = [backIdx, ...order.slice(0, -1)];
      layout();   // meluncur masuk ke paling atas

      setTimeout(() => { busy = false; }, 450);
      update();
    }

    btnNext.addEventListener('click', (e) => { e.stopPropagation(); next(); });
    btnPrev.addEventListener('click', (e) => { e.stopPropagation(); prev(); });

    /* ---- Klik gambar = berikutnya, geser = ganti arah ---- */
    let startX = null;
    let dragged = false;

    stage.addEventListener('pointerdown', (e) => { startX = e.clientX; dragged = false; });
    stage.addEventListener('pointerup', (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 40) { dragged = true; dx < 0 ? next() : prev(); }
    });
    stage.addEventListener('pointercancel', () => { startX = null; });
    stage.addEventListener('click', () => { if (dragged) { dragged = false; return; } next(); });

    stage.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    });

    layout();
    update();
  });
})();


/* ==========================================================
   10. ABOUT: KATA MENYALA + TICKER TEKNOLOGI + GLOW
   ========================================================== */
(() => {
  const text = document.getElementById('aboutText');
  const sec  = document.getElementById('about');
  if (!text || !sec) return;

  /* ----- 10a. PECAH KALIMAT JADI KATA (kata di <b> = kata kunci) ----- */
  text.setAttribute('aria-label', text.textContent.replace(/\s+/g, ' ').trim());

  const walk = (node, isKey) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('span');
          w.className = 'about-word' + (isKey ? ' is-key' : '');
          w.setAttribute('aria-hidden', 'true');
          w.textContent = part;
          frag.appendChild(w);
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === 1) {
        walk(child, isKey || child.tagName === 'B');
      }
    });
  };
  walk(text, false);

  const words = [...text.querySelectorAll('.about-word')];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----- 10b. KATA MENYALA SATU PER SATU SESUAI SCROLL ----- */
  function update() {
    const r  = text.getBoundingClientRect();
    const vh = window.innerHeight;
    const center = r.top + r.height / 2;
    const p  = reduce ? 1 : Math.min(1, Math.max(0, (vh * 0.95 - center) / (vh * 0.55)));   // progres 0 sampai 1
    const n  = words.length;

    words.forEach((w, i) => {
      const t   = Math.min(1, Math.max(0, (p * (n + 3) - i) / 3));   // kemajuan tiap kata
      const max = w.classList.contains('is-key') ? 1 : 0.6;          // kata kunci lebih terang
      w.style.opacity   = (0.15 + (max - 0.15) * t).toFixed(3);
      w.style.transform = 'translateY(' + ((1 - t) * 0.25).toFixed(3) + 'em)';
    });
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', update);
  window.addEventListener('load', update);
  update();

  /* ----- 10c. TICKER TEKNOLOGI (gandakan isi supaya loop mulus) ----- */
  const ticker = document.getElementById('techTicker');
  if (ticker) {
    [...ticker.children].forEach((el) => {
      const c = el.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      ticker.appendChild(c);
    });
  }

  /* ----- 10d. GLOW MENGIKUTI KURSOR (hanya perangkat dengan mouse) ----- */
  const glow = document.getElementById('aboutGlow');
  if (glow && !window.matchMedia('(hover: none)').matches) {
    sec.addEventListener('mousemove', (e) => {
      const r = sec.getBoundingClientRect();
      glow.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      glow.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  }
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


/* ==========================================================
   12. SCROLL HALUS KE ABOUT
   Karena About berupa kartu sticky, posisinya dihitung dari
   dasar hero, bukan lewat anchor biasa.
   ========================================================== */
(() => {
  const hero = document.querySelector('.hero');
  const about = document.getElementById('about');
  if (!hero || !about) return;

  document.querySelectorAll('a[href="#about"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      // Posisi About = dasar hero (jarak antar kartu 24px sudah impas dengan offset top 24px)
      const y = hero.getBoundingClientRect().bottom + window.scrollY;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
})();
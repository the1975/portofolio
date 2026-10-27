/* ==========================================================
   06. SERTIFIKAT (COVERFLOW)
   Tambah / edit sertifikat cukup di array CERTS di bawah.
   ========================================================== */
(() => {
  /* ----- DATA SERTIFIKAT ----- */
  const CERTS = [
    { title: 'Dasar Pemrograman Web', issuer: 'Dicoding / Google Developers', date: '2026',
      desc: 'Menyelesaikan kelas Dasar Pemrograman Web dari Dicoding dengan mempelajari dasar HTML dan CSS untuk membangun halaman web.',
      image: '../img/DasarPemogramanWeb.jpg', link: 'https://drive.google.com/file/d/1SHUnZHOastnwDPW0b03U6syp8VG7NEl7/view?usp=drivesdk' },
    { title: 'Dasar Pemrograman JavaScript', issuer: 'Dicoding', date: '2026',
      desc: 'Menyelesaikan kelas Dasar Pemrograman JavaScript dari Dicoding dengan mempelajari fundamental JavaScript untuk membangun interaksi pada website.',
      image: '../img/Dasar-Js.jpg', link: 'https://drive.google.com/file/d/1hVj94UYxid7y2K5bTA0i1sCboJo9PTWk/view?usp=drivesdk' },
    { title: 'Membuat Front-End Web Untuk Pemula', issuer: 'Dicoding', date: '2026',
      desc: 'Menyelesaikan kelas Belajar Membuat Front-End Web untuk Pemula dari Dicoding dengan mempelajari dasar pengembangan front-end menggunakan HTML, CSS, dan JavaScript.',
      image: '../img/FrontEndPemula.jpg', link: 'https://drive.google.com/file/d/17J2L7T68c4_-K9LA3QaoXKJeQxhf2m8s/view?usp=drivesdk' },
    { title: 'Strategi Pengembangan Diri', issuer: 'Dicoding', date: '2026',
      desc: 'Mempelajari strategi untuk mengembangkan potensi diri dan meningkatkan kesiapan menghadapi dunia profesional.',
      image: '../img/StrategiPengembangan.jpg', link: 'https://drive.google.com/file/d/1VnrJMLuFk6R4L7AbXaiVLVrh1nbeK0Fk/view?usp=drivesdk' },
    { title: 'Financial Literacy', issuer: 'Dicoding', date: '2026',
      desc: 'Mempelajari dasar literasi keuangan, termasuk pengelolaan keuangan pribadi, perencanaan finansial, dan pengambilan keputusan keuangan yang bijak.',
      image: '../img/Financial-literacy.jpg', link: 'https://drive.google.com/file/d/1PSoQsLV6AHzc2aYxRYmeeXfKFZ70kzGV/view?usp=drivesdk' },
    { title: 'Spec-Driven Development dengan Kiro', issuer: 'Dicoding / AWS', date: '2026',
      desc: 'Mempelajari pendekatan Spec-Driven Development untuk merancang dan mengembangkan perangkat lunak secara terstruktur dengan bantuan Kiro.',
      image: '../img/Spec-DrivenDevelopmentdenganKiro.jpg', link: 'https://drive.google.com/file/d/137NBaeVzkzd7YpttS8Kox5CmnDGQ-Ow7/view?usp=drivesdk' },
    { title: 'Python Programming With RedHat', issuer: 'RedHat Academy', date: '2026',
      desc: 'Mempelajari dasar pemrograman Python, termasuk sintaks, struktur data, fungsi, serta penerapan logika pemrograman untuk menyelesaikan masalah.',
      image: '../img/RedHat.jpg', link: 'https://drive.google.com/file/d/1l0JW3VjHuyMq6YhwMUUre6qwnaWjVQT3/view?usp=drivesdk' },
    { title: 'Etika, Kesadaran, dan Identitas Manusia di Era Sistem Informasi Digital', issuer: 'UNP Kediri / UM', date: '2025',
      desc: 'Mempelajari etika, kesadaran, dan identitas manusia serta penerapan etika AI dalam perspektif Sistem Informasi.',
      image: '../img/KuliahTamu.jpg', link: 'https://drive.google.com/file/d/1oF7OXaSraGDbcMCNdTlp7QE5U4mnXmgH/view?usp=drivesdk' }
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

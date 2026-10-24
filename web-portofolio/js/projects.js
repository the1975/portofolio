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

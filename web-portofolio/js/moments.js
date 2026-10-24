/* ==========================================================
   13. CAROUSEL MOMENTS
   - Tombol panah + angka "01 — 04"
   - Laptop: geser pakai mouse (klik tahan lalu tarik)
   - HP: tetap geser jari bawaan browser
   - Keyboard: panah kiri/kanan saat carousel difokus
   ========================================================== */
(() => {
  const carousel = document.querySelector('.moments-carousel');
  const cards = carousel ? [...carousel.querySelectorAll('.moment-card')] : [];
  const prevBtn = document.querySelector('.moments-prev');
  const nextBtn = document.querySelector('.moments-next');
  const countEl = document.querySelector('.moments-count');
  if (cards.length < 2 || !prevBtn || !nextBtn || !countEl) return;

  const pad = (n) => String(n).padStart(2, '0');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // scrollLeft yang membuat kartu ke-i tepat di tepi kiri (setelah padding carousel)
  const targetLeft = (i) => {
    const padLeft = parseFloat(getComputedStyle(carousel).paddingLeft) || 0;
    const c = cards[i].getBoundingClientRect();
    const k = carousel.getBoundingClientRect();
    return c.left - k.left + carousel.scrollLeft - padLeft;
  };

  // Kartu yang posisinya paling dekat dengan posisi scroll sekarang
  const nearestIndex = () => {
    const max = carousel.scrollWidth - carousel.clientWidth;
    if (carousel.scrollLeft >= max - 2) return cards.length - 1;   // mentok kanan = kartu terakhir
    let best = 0;
    let bestDist = Infinity;
    cards.forEach((_, i) => {
      const d = Math.abs(targetLeft(i) - carousel.scrollLeft);
      if (d < bestDist) { best = i; bestDist = d; }
    });
    return best;
  };

  // Perbarui angka dan status tombol
  const update = () => {
    const i = nearestIndex();
    countEl.textContent = pad(i + 1) + ' — ' + pad(cards.length);
    prevBtn.disabled = i === 0;
    nextBtn.disabled = i === cards.length - 1;
  };

  // Geser ke kartu ke-i
  const goTo = (i) => {
    const n = Math.max(0, Math.min(cards.length - 1, i));
    carousel.scrollTo({ left: targetLeft(n), behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  prevBtn.addEventListener('click', () => goTo(nearestIndex() - 1));
  nextBtn.addEventListener('click', () => goTo(nearestIndex() + 1));

  // Angka ikut berubah saat di-scroll (dibatasi 1x per frame supaya ringan)
  let ticking = false;
  carousel.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', update);

  /* ---- Geser pakai mouse (khusus mouse; sentuhan sudah ditangani browser) ---- */
  let dragging = false;
  let startX = 0;
  let startLeft = 0;
  let startIndex = 0;

  carousel.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    if (e.target.closest('.shot-stage, button, a')) return;   // foto punya geser sendiri (tumpukan)
    dragging = true;
    startX = e.clientX;
    startLeft = carousel.scrollLeft;
    startIndex = nearestIndex();
    carousel.classList.add('is-dragging');                     // matikan snap sementara + kursor grabbing
    carousel.setPointerCapture(e.pointerId);
  });

  carousel.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    carousel.scrollLeft = startLeft - (e.clientX - startX);   // kartu ikut ditarik
  });

  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    carousel.classList.remove('is-dragging');
    // Tarik lebih dari 60px = pindah satu kartu; kurang dari itu = kembali ke kartu semula
    const dx = e.clientX - startX;
    goTo(dx < -60 ? startIndex + 1 : dx > 60 ? startIndex - 1 : startIndex);
  };
  carousel.addEventListener('pointerup', endDrag);
  carousel.addEventListener('pointercancel', endDrag);

  /* ---- Keyboard: panah kiri/kanan ---- */
  carousel.addEventListener('keydown', (e) => {
    if (e.target.closest('.shot-stage')) return;               // panah di foto = ganti foto, bukan kartu
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(nearestIndex() + 1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(nearestIndex() - 1); }
  });

  update();
})();

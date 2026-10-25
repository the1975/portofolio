/* ==========================================================
   js/smooth.js - Scroll halus untuk mouse/touchpad (library Lenis).
========================================================== */

(() => {
  if (typeof window.Lenis === 'undefined') return;                                // CDN gagal -> scroll biasa
  if (new URLSearchParams(location.search).get('smooth') === 'off') return;      // sakelar debugging

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (reduceMotion || !hasMouse) return;

  // lerp = seberapa cepat scroll "mengejar" posisi tujuan (makin kecil makin meluncur)
  const lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
  window.lenis = lenis;                      // dipakai juga oleh core.js (tombol About)

  // Satu loop animasi yang menggerakkan Lenis tiap frame
  const loop = (time) => {
    lenis.raf(time);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  /* ---- Klik link anchor (#skills, #projects, "BACK TO TOP") ----
     Lenis mematikan scroll halus bawaan browser, jadi klik anchor harus
     lewat Lenis supaya tetap meluncur dan tidak loncat. */
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented) return;
    const link = e.target.closest('a[href^="#"]');
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

    const hash = link.getAttribute('href');
    if (hash === '#about') return;           // ditangani core.js (section 12): About berupa kartu sticky

    if (hash === '#') {                      // "BACK TO TOP"
      e.preventDefault();
      lenis.scrollTo(0);
      return;
    }

    let target = null;
    try { target = document.querySelector(hash); } catch (err) { /* hash tidak valid */ }
    if (!target) return;

    e.preventDefault();
    // Hormati jarak atas dari class scroll-mt-* (supaya tidak ketutup navbar)
    const offset = -(parseFloat(getComputedStyle(target).scrollMarginTop) || 0);
    lenis.scrollTo(target, { offset });
    history.pushState(null, '', hash);
  });
})();

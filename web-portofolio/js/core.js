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
      if (window.lenis) window.lenis.scrollTo(y);              // laptop: ikut scroll halus Lenis
      else window.scrollTo({ top: y, behavior: 'smooth' });    // HP / tanpa Lenis: bawaan browser
    });
  });
})();

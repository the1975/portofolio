// RIPPLE: cincin riak muncul di titik yang diketuk di hero
(() => {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  // Hormati pengguna yang mematikan animasi di perangkatnya
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  hero.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a, button')) return;   // jangan ganggu tombol dan link
    const box = hero.getBoundingClientRect();
    for (let i = 0; i < 3; i++) {                // 3 cincin berurutan
      const ring = document.createElement('span');
      ring.className = 'ripple-ring';
      ring.style.left = `${e.clientX - box.left}px`;
      ring.style.top = `${e.clientY - box.top}px`;
      ring.style.animationDelay = `${i * 140}ms`;
      ring.addEventListener('animationend', () => ring.remove());  // bersihkan sendiri
      hero.appendChild(ring);
    }
  });
})();
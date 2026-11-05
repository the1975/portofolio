// RIPPLE: cincin riak air hanya di section On Repeat (hero tidak dipakai lagi)
(() => {
  // Hormati pengguna yang mematikan animasi di perangkatnya
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const pond = document.querySelector('.music-pond');
  if (!pond) return;

  // Bikin n cincin berurutan di titik (x, y)
  const drop = (x, y, n = 3, size = 300) => {
    for (let i = 0; i < n; i++) {
      const ring = document.createElement('span');
      ring.className = 'ripple-ring ripple-water';
      ring.style.cssText = `left:${x}px;top:${y}px;--s:${size}px;animation-delay:${i * 140}ms`;
      ring.addEventListener('animationend', () => ring.remove());  // bersihkan sendiri
      pond.appendChild(ring);
    }
  };

  // Ketuk/klik: riak muncul di titik jari
  pond.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a, button, iframe, [role="button"]')) return;  // jangan ganggu tombol
    const box = pond.getBoundingClientRect();
    drop(e.clientX - box.left, e.clientY - box.top);
  });

  // Gerimis: tetesan kecil jatuh sendiri, hanya saat section terlihat
  let visible = false;
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(pond);
  const rain = () => {
    if (visible && !document.hidden) {
      const box = pond.getBoundingClientRect();
      drop(Math.random() * box.width, Math.random() * box.height, 2, 200);
    }
    setTimeout(rain, 2500 + Math.random() * 2500);   // tiap 2,5 sampai 5 detik
  };
  rain();
})();
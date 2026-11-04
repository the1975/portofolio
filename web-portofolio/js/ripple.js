// RIPPLE: cincin riak air di hero (tinta gelap) dan On Repeat (air putih)
(() => {
  // Hormati pengguna yang mematikan animasi di perangkatnya
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const hero = document.querySelector('.hero');
  const pond = document.querySelector('.music-pond');

  // Satu fungsi untuk bikin cincin: n cincin berurutan di titik (x, y)
  const drop = (el, x, y, cls, n = 3, size = 300) => {
    for (let i = 0; i < n; i++) {
      const ring = document.createElement('span');
      ring.className = `ripple-ring ${cls}`;
      ring.style.cssText = `left:${x}px;top:${y}px;--s:${size}px;animation-delay:${i * 140}ms`;
      ring.addEventListener('animationend', () => ring.remove());  // bersihkan sendiri
      el.appendChild(ring);
    }
  };

  // Ketuk/klik: riak muncul di titik jari
  const onTap = (el, cls) => el.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a, button, [role="button"]')) return;  // jangan ganggu tombol
    const box = el.getBoundingClientRect();
    drop(el, e.clientX - box.left, e.clientY - box.top, cls);
  });
  if (hero) onTap(hero, 'ripple-ink');
  if (pond) onTap(pond, 'ripple-water');

  // Gerimis: tetesan kecil jatuh sendiri, hanya saat section terlihat
  if (pond) {
    let visible = false;
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(pond);
    const rain = () => {
      if (visible && !document.hidden) {
        const box = pond.getBoundingClientRect();
        drop(pond, Math.random() * box.width, Math.random() * box.height, 'ripple-water', 2, 200);
      }
      setTimeout(rain, 2500 + Math.random() * 2500);   // tiap 2,5 sampai 5 detik
    };
    rain();
  }
})();
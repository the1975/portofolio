/* 06. DAUN MUSIMAN MUNCUL MENGIKUTI KURSOR / JARI
   Dipakai di hero dan section lain yang punya class .leaf-zone.
   Tiap zona butuh satu <div class="hero-leaves"> di dalamnya. */
(() => {
  const zones = document.querySelectorAll('.hero, .leaf-zone');
  if (!zones.length) return;

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FOLLOW = 0.18;    // makin besar makin cepat ngejar
  const IDLE_MS = 2500;   // jeda sebelum memudar

  zones.forEach((zone) => {
    const leaves = zone.querySelector(':scope > .hero-leaves');
    if (!leaves) return;

    const MAX_OPACITY = zone.classList.contains('hero') ? 1 : 0.6; // luar hero lebih redup
    let targetX = 0, targetY = 0, curX = 0, curY = 0;
    let raf = null, idleTimer = null, started = false;

    function render() {
      curX += (targetX - curX) * FOLLOW;
      curY += (targetY - curY) * FOLLOW;
      leaves.style.setProperty('--mx', curX.toFixed(1) + 'px');
      leaves.style.setProperty('--my', curY.toFixed(1) + 'px');
      const done = Math.abs(targetX - curX) < .5 && Math.abs(targetY - curY) < .5;
      raf = done ? null : requestAnimationFrame(render);
    }

    function hide() { leaves.style.opacity = '0'; }

    function onMove(e) {
      const rect = zone.getBoundingClientRect();
      const inside = e.clientX >= rect.left && e.clientX <= rect.right &&
                     e.clientY >= rect.top  && e.clientY <= rect.bottom;
      if (!inside) return hide();

      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      if (!started || reduceMotion) { curX = targetX; curY = targetY; started = true; }

      leaves.style.opacity = String(MAX_OPACITY);
      if (!raf) raf = requestAnimationFrame(render);

      clearTimeout(idleTimer);
      idleTimer = setTimeout(hide, IDLE_MS);
    }

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onMove, { passive: true });
    document.addEventListener('pointerleave', hide);
  });
})();
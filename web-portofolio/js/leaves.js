/* ==========================================================
   LEAVES.JS - Daun musiman muncul seperti embun di kaca
   Kursor / jari meninggalkan jejak daun, lalu jejaknya
   memudar pelan-pelan dari yang paling lama.
   Pakai: beri class .leaf-zone (atau .hero) pada section, lalu
   taruh <div class="hero-leaves" aria-hidden="true"></div>
   sebagai anak pertamanya.
   ========================================================== */
(() => {
  const zones = document.querySelectorAll('.hero, .leaf-zone');
  if (!zones.length) return;

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TAU = reduceMotion ? 250 : 650;   // ms: makin besar makin lama memudar
  const IDLE_MS = 2600;                   // diam selama ini, lalu mulai pudar total
  const FADE_STEP = 64;                   // ms: seberapa sering jejak dipudarkan
  const FADE_OUT_MS = 900;                // ms: pudar terakhir sampai benar-benar hilang
  const isMobile = () => matchMedia('(max-width: 768px)').matches;

  zones.forEach((zone) => {
    const layer = zone.querySelector(':scope > .hero-leaves');
    if (!layer) return;

    // Ambil gambar musim dari CSS (leaves.css), lalu sembunyikan versi CSS-nya
    const found = /url\(["']?(.*?)["']?\)/.exec(getComputedStyle(layer).backgroundImage);
    if (!found) return;
    layer.style.backgroundImage = 'none';

    const img = new Image();
    let ready = false;
    img.onload = () => { ready = true; };
    img.src = found[1];

    const isHero = zone.classList.contains('hero');
    const baseOpacity = isHero ? '1' : '0.6';             // luar hero lebih redup

    const cv = document.createElement('canvas');          // yang terlihat
    const ctx = cv.getContext('2d');
    const mk = document.createElement('canvas');          // "embun": area yang terbuka
    const mctx = mk.getContext('2d');
    cv.style.opacity = baseOpacity;
    layer.appendChild(cv);

    let W = 0, H = 0, R = 0, brush = null;
    let last = null, raf = null, lastMove = 0, lastT = 0, acc = 0;
    let closing = false, closeTimer = null;
    let offset = 0;                                       // posisi kanvas di dalam zona (untuk zona tinggi)

    function makeBrush() {
      R = (isHero ? 115 : 100) * (isMobile() ? 0.65 : 1);  // ukuran sapuan
      brush = document.createElement('canvas');
      brush.width = brush.height = R * 2;
      const b = brush.getContext('2d');
      const g = b.createRadialGradient(R, R, 0, R, R, R);
      g.addColorStop(0, 'rgba(0,0,0,1)');
      g.addColorStop(0.45, 'rgba(0,0,0,.6)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      b.fillStyle = g;
      b.fillRect(0, 0, R * 2, R * 2);
    }

    // Kanvas dibuat paling tinggi setinggi layar, supaya zona yang panjang
    // (misalnya Projects) tidak membuat kanvas raksasa yang gagal di HP.
    function resize() {
      const r = zone.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width));
      H = Math.max(1, Math.round(Math.min(r.height, window.innerHeight)));
      cv.width = mk.width = W;
      cv.height = mk.height = H;
      cv.style.height = H + 'px';
      makeBrush();
      place();
    }

    // Geser kanvas supaya selalu berada di area layar yang sedang terlihat
    function place() {
      const r = zone.getBoundingClientRect();
      const o = Math.min(Math.max(-r.top, 0), Math.max(0, r.height - H));
      if (o !== offset) { offset = o; last = null; }       // zona bergeser: putus garis sapuan
      cv.style.transform = 'translateY(' + o + 'px)';
      return r;
    }

    new ResizeObserver(resize).observe(zone);
    window.addEventListener('resize', resize);
    resize();

    // Tempel sapuan di titik pointer (disambung garis supaya jejak mulus)
    function stamp(x, y) {
      if (last) {
        const dx = x - last.x, dy = y - last.y;
        const n = Math.max(1, Math.floor(Math.hypot(dx, dy) / (R * 0.25)));
        for (let i = 1; i <= n; i++) {
          const t = i / n;
          mctx.drawImage(brush, last.x + dx * t - R, last.y + dy * t - R);
        }
      } else {
        mctx.drawImage(brush, x - R, y - R);
      }
      last = { x, y };
    }

    // Setelah pudar total: bersihkan kanvas dan kembalikan opacity normal
    function finish() {
      mctx.clearRect(0, 0, W, H);
      ctx.clearRect(0, 0, W, H);
      cv.style.transition = 'none';
      cv.style.opacity = baseOpacity;
      closing = false;
    }

    function frame(now) {
      const dt = Math.min(now - (lastT || now), 64);
      lastT = now;
      place();

      // Pudarkan jejak sedikit demi sedikit
      acc += dt;
      if (acc >= FADE_STEP) {
        mctx.globalCompositeOperation = 'destination-out';
        mctx.fillStyle = 'rgba(0,0,0,' + (1 - Math.exp(-acc / TAU)).toFixed(3) + ')';
        mctx.fillRect(0, 0, W, H);
        mctx.globalCompositeOperation = 'source-over';
        acc = 0;
      }

      // Gambar daun, lalu potong sesuai area jejak
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, W, H);
      if (ready) {
        const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);   // cover
        const w = img.naturalWidth * s, h = img.naturalHeight * s;
        ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
      }
      ctx.globalCompositeOperation = 'destination-in';
      ctx.drawImage(mk, 0, 0);

      // Sudah lama diam: pudarkan seluruh kanvas dengan halus, lalu bersihkan
      if (now - lastMove > IDLE_MS) {
        raf = null; lastT = 0; acc = 0;
        closing = true;
        cv.style.transition = 'opacity ' + FADE_OUT_MS + 'ms ease';
        cv.style.opacity = '0';
        closeTimer = setTimeout(finish, FADE_OUT_MS + 60);
        return;
      }

      raf = requestAnimationFrame(frame);
    }

    function onMove(e) {
      const r = place();
      const x = e.clientX - r.left, y = e.clientY - r.top - offset;
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) { last = null; return; }

      // Bergerak lagi saat sedang memudar: batalkan pudarnya
      if (closing) {
        clearTimeout(closeTimer);
        cv.style.transition = 'opacity .15s ease';
        cv.style.opacity = baseOpacity;
        closing = false;
      }

      stamp(x, y);
      lastMove = performance.now();
      if (!raf) { lastT = 0; acc = 0; raf = requestAnimationFrame(frame); }
    }

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', (e) => { last = null; onMove(e); }, { passive: true });
    window.addEventListener('pointercancel', () => { last = null; });
    document.addEventListener('pointerleave', () => { last = null; });
  });
})();
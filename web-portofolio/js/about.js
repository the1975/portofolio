/* ==========================================================
   04. KARTU BERTUMPUK (STACKING)
   Kartu .stack-card menempel (sticky) lalu mengecil & menggelap
   saat kartu berikutnya menimpa. Hanya aktif di layar >= 768px.
   ========================================================== */
(() => {
  const cards = [...document.querySelectorAll('.stack-card')];
  const mq = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');

  // Hitung progres tumpukan tiap kartu saat scroll
  function update() {
    if (!mq.matches) return;

    cards.forEach((card) => {
      const next = card.nextElementSibling;
      if (!next) return;

      // Seberapa jauh kartu berikutnya sudah menimpa (0 sampai 1)
      const raw = Math.min(1, Math.max(0, 1 - next.getBoundingClientRect().top / window.innerHeight));

      // smoothstep: awal & akhir gerakan melambat, terasa mengalir
      const p = raw * raw * (3 - 2 * raw);

      card.style.transform = `scale(${1 - 0.035 * p})`;
      card.style.setProperty('--dim', (0.3 * p).toFixed(3));
      card.style.visibility = raw >= 0.995 ? 'hidden' : '';
    });
  }

  // Atur mode sticky (desktop) atau kartu biasa (HP / reduced motion)
  function layout() {
    cards.forEach((card) => {
      if (mq.matches) {
        card.style.position = 'sticky';
        card.style.top = Math.min(24, window.innerHeight - card.offsetHeight - 24) + 'px';
      } else {
        card.style.position = 'static';
        card.style.top = '';
        card.style.transform = '';
        card.style.visibility = '';
        card.style.setProperty('--dim', 0);
      }
    });
    update();
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }, { passive: true });

  window.addEventListener('resize', layout);
  window.addEventListener('load', layout);
  layout();
})();


/* ==========================================================
   10. ABOUT: KATA MENYALA + TICKER TEKNOLOGI + GLOW
   ========================================================== */
(() => {
  const text = document.getElementById('aboutText');
  const sec  = document.getElementById('about');
  if (!text || !sec) return;

  /* ----- 10a. PECAH KALIMAT JADI KATA (kata di <b> = kata kunci) ----- */
  text.setAttribute('aria-label', text.textContent.replace(/\s+/g, ' ').trim());

  const walk = (node, isKey) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('span');
          w.className = 'about-word' + (isKey ? ' is-key' : '');
          w.setAttribute('aria-hidden', 'true');
          w.textContent = part;
          frag.appendChild(w);
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === 1) {
        walk(child, isKey || child.tagName === 'B');
      }
    });
  };
  walk(text, false);

  const words = [...text.querySelectorAll('.about-word')];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----- 10b. KATA MENYALA SATU PER SATU SESUAI SCROLL ----- */
  function update() {
    const r  = text.getBoundingClientRect();
    const vh = window.innerHeight;
    const center = r.top + r.height / 2;
    const p  = reduce ? 1 : Math.min(1, Math.max(0, (vh * 0.95 - center) / (vh * 0.55)));   // progres 0 sampai 1
    const n  = words.length;

    words.forEach((w, i) => {
      const t   = Math.min(1, Math.max(0, (p * (n + 3) - i) / 3));   // kemajuan tiap kata
      const max = w.classList.contains('is-key') ? 1 : 0.6;          // kata kunci lebih terang
      w.style.opacity   = (0.15 + (max - 0.15) * t).toFixed(3);
      w.style.transform = 'translateY(' + ((1 - t) * 0.25).toFixed(3) + 'em)';
    });
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', update);
  window.addEventListener('load', update);
  update();

  /* ----- 10c. TICKER TEKNOLOGI (gandakan isi supaya loop mulus) ----- */
  const ticker = document.getElementById('techTicker');
  if (ticker) {
    [...ticker.children].forEach((el) => {
      const c = el.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      ticker.appendChild(c);
    });
  }

  /* ----- 10d. GLOW MENGIKUTI KURSOR (hanya perangkat dengan mouse) ----- */
  const glow = document.getElementById('aboutGlow');
  if (glow && !window.matchMedia('(hover: none)').matches) {
    sec.addEventListener('mousemove', (e) => {
      const r = sec.getBoundingClientRect();
      glow.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      glow.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  }
})();

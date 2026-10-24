/* ==========================================================
   08. CONTACT: JUDUL LONCAT + POPUP + KIRIM PESAN
   ========================================================== */
(() => {
  /* ----- PENGATURAN ----- */
  const FORM_ENDPOINT = '';   // isi URL Formspree, contoh: 'https://formspree.io/f/abcdwxyz'
                              // (kosong = buka aplikasi email bawaan)
  const TO_EMAIL  = 'leonardoyanuarianto907@gmail.com';
  const WA_NUMBER = '6285733283841';   // format internasional: 62 + nomor tanpa 0 di depan

  /* ----- 8a. HURUF "LET'S WORK TOGETHER" LONCAT-LONCAT ----- */
  // Memecah teks jadi <span> per huruf; --i dipakai CSS untuk delay animasi
  function splitLetters(root) {
    let i = 0;
    root.setAttribute('aria-label', root.textContent.replace(/\s+/g, ' ').trim());

    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === 3) {                       // node teks
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }

            const word = document.createElement('span');
            word.className = 'bounce-word';
            word.setAttribute('aria-hidden', 'true');
            [...part].forEach((ch) => {
              const s = document.createElement('span');
              s.className = 'bounce-ch';
              s.style.setProperty('--i', i++);
              s.textContent = ch;
              word.appendChild(s);
            });
            frag.appendChild(word);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) {                // elemen (mis. <em>)
          walk(child);
        }
      });
    };
    walk(root);
  }

  const title = document.getElementById('contactTitle');
  if (title) splitLetters(title);

  /* ----- 8b. POPUP (dipakai untuk Email dan WhatsApp) ----- */
  const modal      = document.getElementById('contactModal');
  const form       = document.getElementById('contactForm');
  const emailField = document.getElementById('emailField');
  const modalLabel = document.getElementById('modalLabel');
  const modalTitle = document.getElementById('modalTitle');
  const status     = document.getElementById('formStatus');
  const btn        = document.getElementById('sendBtn');
  if (!modal || !form) return;

  let mode = 'email';   // 'email' atau 'whatsapp'

  const COPY = {
    email:    { label: 'EMAIL',    title: 'Send an Email directly.', button: 'SEND MESSAGE',  placeholder: 'Your message here...' },
    whatsapp: { label: 'WHATSAPP', title: 'Chat me on WhatsApp.',    button: 'OPEN WHATSAPP', placeholder: 'Tulis pesan kamu di sini...' }
  };

  function openModal(m) {
    mode = m;
    const c = COPY[m];

    modalLabel.textContent = c.label;
    modalTitle.textContent = c.title;
    btn.textContent = c.button;
    form.elements['message'].placeholder = c.placeholder;
    emailField.style.display = m === 'whatsapp' ? 'none' : '';   // WA tidak butuh kolom email
    form.elements['email'].required = m === 'email';
    status.textContent = '';

    document.body.style.overflow = 'hidden';   // kunci scroll halaman
    modal.showModal();
    form.elements['name'].focus();
  }

  document.querySelectorAll('[data-open-modal]').forEach((b) => {
    b.addEventListener('click', () => openModal(b.dataset.openModal));
  });

  document.getElementById('modalClose').addEventListener('click', () => modal.close());
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });   // klik backdrop = tutup
  modal.addEventListener('close', () => { document.body.style.overflow = ''; });

  /* ----- 8c. KIRIM PESAN ----- */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const data = Object.fromEntries(new FormData(form));
    if (data._gotcha) return;   // jebakan spam: bot mengisi field tersembunyi

    // --- WhatsApp: buka chat dengan pesan sudah terisi ---
    if (mode === 'whatsapp') {
      const text = 'Halo Leonardo, saya ' + data.name + '.\n\n' + data.message;
      status.textContent = 'MEMBUKA WHATSAPP…';
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
      return;
    }

    // --- Email tanpa layanan form: buka aplikasi email ---
    if (!FORM_ENDPOINT) {
      const subject = encodeURIComponent('Pesan dari portfolio: ' + data.name);
      const body = encodeURIComponent(data.message + '\n\n— ' + data.name + ' (' + data.email + ')');
      status.textContent = 'MEMBUKA APLIKASI EMAIL…';
      window.location.href = 'mailto:' + TO_EMAIL + '?subject=' + subject + '&body=' + body;
      return;
    }

    // --- Email lewat Formspree: langsung masuk inbox ---
    btn.disabled = true;
    btn.textContent = 'SENDING…';
    status.textContent = '';

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      status.textContent = 'TERKIRIM. TERIMA KASIH, SAYA AKAN SEGERA MEMBALAS!';
      setTimeout(() => modal.close(), 2200);
    } catch (err) {
      status.textContent = 'GAGAL MENGIRIM. COBA LAGI ATAU HUBUNGI LEWAT WHATSAPP.';
    } finally {
      btn.disabled = false;
      btn.textContent = COPY.email.button;
    }
  });
})();

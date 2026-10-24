/* ==========================================================
   SEASON.JS - Gambar frame ganti sesuai musim
   ========================================================== */
(() => {
  // Pembagian bulan tiap musim (1 = Januari ... 12 = Desember). Gambarnya di img/frame/,
  // aturan CSS-nya di css/base.css bagian 01. Urutan musim belahan utara (hanya tema visual).
  const SEASONS = [
    { name: 'spring', months: [3, 4, 5] },
    { name: 'summer', months: [6, 7, 8] },
    { name: 'autumn', months: [9, 10, 11] },
    { name: 'winter', months: [12, 1, 2] },
  ];
  const DEFAULT_SEASON = 'autumn';   // dipakai kalau bulan ini tidak masuk daftar mana pun

  const month = new Date().getMonth() + 1;
  const wanted = new URLSearchParams(location.search).get('season');   // untuk uji coba lewat URL
  const forced = SEASONS.find((s) => s.name === wanted);
  const byMonth = SEASONS.find((s) => s.months.includes(month));

  document.documentElement.dataset.season = (forced || byMonth || { name: DEFAULT_SEASON }).name;
})();

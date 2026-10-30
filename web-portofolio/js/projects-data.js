/* ==========================================================
   PROJECTS-DATA.JS - Daftar semua project (dipakai halaman projects.html)
   Tambah project = salin satu blok { ... } lalu isi.
   Ini mengasah: memisahkan DATA dari TAMPILAN (dasar proyek "lego").
   ========================================================== */

// Daftar kategori untuk chip filter (key harus sama dengan field "category")
const PROJECT_CATEGORIES = [
  { key: 'all',       label: 'Semua' },
  { key: 'web',       label: 'Web' },
  { key: 'data',      label: 'Data Processing' },
  { key: 'iot',       label: 'IoT' },
  { key: 'statistik', label: 'Statistik' },
];

const PROJECTS = [
  {
    title: 'Freelance Skill Analytics',
    category: 'data',
    year: 2026,
    tags: ['PYTHON', 'COLAB'],
    desc: 'Analisis peluang dan tren skill IT di pasar freelance global berdasarkan permintaan dan nilai proyek.',
    story: `Project ini bertujuan untuk memahami peluang dan tren skill IT di pasar freelance global, dengan melihat seberapa besar peluang sebuah skill berdasarkan tingkat permintaan dan nilai proyeknya.

    Data dari website Freelancer dikumpulkan melalui web scraping, kemudian diolah untuk menemukan skill yang paling banyak dicari, memiliki nilai proyek tinggi, dan berpotensi menjadi sweet spot antara demand dan value.`,
    shots: ['img/A1.jpg', 'img/A2.jpg', 'img/A3.jpg'],
    links: [
      { label: 'OPEN COLAB ↗', url: 'https://colab.research.google.com/drive/14TdyTDhSKAlRcBkwaUGnxMaxDU43MT_z' },
      { label: 'GITHUB ↗',     url: 'https://github.com/the1975/Data-Processing/blob/2e960a080a2ce43fa99c0c95393953f921428b32/Project_Data_Processing/Project_Data_Processing_Analisis_Pasar_Freelance.ipynb' },
    ],
  },
  {
    title: 'iPhone Price Scraper',
    category: 'data',
    year: 2026,
    tags: ['SCRAPING', 'API'],
    desc: 'Scraping harga iPhone dari listing Google Shopping untuk melihat variasi dan pola harga antar model.',
    story: `Project ini bertujuan untuk memahami perbedaan dan pola harga produk iPhone di pasar online, dengan melihat seberapa besar variasi harga antar model dan varian.

    Data harga dari berbagai listing Google Shopping dikumpulkan melalui web scraping, kemudian dibersihkan dan diolah untuk menghasilkan perbandingan harga yang lebih terstruktur serta menemukan pola harga di setiap model iPhone.`,
    shots: ['img/S1.jpg', 'img/S2.jpg', 'img/S3.jpg'],
    links: [
      { label: 'OPEN COLAB ↗', url: 'https://colab.research.google.com/drive/1DL0Ov7engivoRUmWcvVl5spf7mZmnSQd' },
      { label: 'GITHUB ↗',     url: 'https://github.com/the1975/Data-Processing/blob/2e960a080a2ce43fa99c0c95393953f921428b32/Project_Data_Processing/scrapping_harga.ipynb' },
    ],
  },

  /* ----- TEMPLATE: salin blok ini untuk project baru -----
  {
    title: '',
    category: 'web',          // web | data | iot | statistik
    year: 2026,
    tags: [],
    desc: '',
    shots: [],                // boleh kosong dulu
    links: [],                // boleh kosong dulu
  },
  */
];
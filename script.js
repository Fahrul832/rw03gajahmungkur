// Data Lokasi Fasilitas Umum & UMKM RW 03 Gajahmungkur
const dataLokasi = [
  {
    id: 1,
    title: "Puskesmas Pegandan",
    category: "fasum",
    tag: "Fasilitas Kesehatan",
    tagClass: "tag-fasum",
    address: "Jl. Lamongan Raya No. 2, Gajahmungkur",
    desc: "Puskesmas pembina untuk wilayah Gajahmungkur. Melayani imunisasi balita bulanan, poli umum, BPJS, dan posbindu lansia.",
    lat: -7.0051,
    lng: 110.4078,
    link: "https://maps.google.com/?q=Puskesmas+Pegandan+Semarang",
    pinColor: "#DC2626",
  },
  {
    id: 2,
    title: "Balai Pertemuan RW 03",
    category: "fasum",
    tag: "Balai Warga",
    tagClass: "tag-fasum",
    address: "Jl. Gajahmungkur Asri RT 03/RW 03",
    desc: "Pusat sekretariat paguyuban warga, posko siaga ronda malam kamling, penimbangan posyandu, dan lapangan badminton.",
    lat: -7.0125,
    lng: 110.414,
    link: "https://maps.google.com/?q=-7.0125,110.4140",
    pinColor: "#DC2626",
  },
  {
    id: 3,
    title: "Kantor Kelurahan Gajahmungkur",
    category: "fasum",
    tag: "Pemerintahan",
    tagClass: "tag-fasum",
    address: "Kecamatan Gajahmungkur, Kota Semarang",
    desc: "Layanan legalitas surat pengantar kependudukan, pengurusan berkas administrasi nikah/domisili, serta program kemasyarakatan.",
    lat: -7.0102,
    lng: 110.4128,
    link: "https://maps.google.com/?q=Kantor+Kelurahan+Gajahmungkur+Semarang",
    pinColor: "#DC2626",
  },
  {
    id: 4,
    title: "Sambal Kemasan Dapur Bu RT",
    category: "umkm",
    tag: "UMKM Kuliner (RT 02)",
    tagClass: "tag-umkm",
    address: "Dapur Produksi RT 02 / RW 03",
    desc: "Spesialis sambal kemasan botol cumi asin, sambal bawang gurih tanpa pengawet kimia, dan tumpeng mini untuk acara warga.",
    lat: -7.0134,
    lng: 110.4132,
    link: "https://wa.me/6281234567890",
    pinColor: "#16A34A",
  },
  {
    id: 5,
    title: "Lestari Handicraft & Hampers",
    category: "umkm",
    tag: "Kriya & Jasa (RT 04)",
    tagClass: "tag-umkm",
    address: "Workshop Kreasi RT 04 / RW 03",
    desc: "Produk kreasi dasawisma dan pemuda: buket bunga wisuda, hampers syukuran hari raya, kado custom, dan souvenir rajut tangan.",
    lat: -7.0118,
    lng: 110.4155,
    link: "https://wa.me/6281234567890",
    pinColor: "#16A34A",
  },
];

// ==========================================
// PETA LEAFLET DENGAN LAYER DARK & LIGHT
// ==========================================
const map = L.map("map", { scrollWheelZoom: false }).setView(
  [-7.0115, 110.413],
  15,
);

const lightTileLayer = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  {
    attribution: "&copy; OpenStreetMap &copy; CARTO",
    maxZoom: 19,
  },
);

const darkTileLayer = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  {
    attribution: "&copy; OpenStreetMap &copy; CARTO",
    maxZoom: 19,
  },
);

let currentTileLayer = lightTileLayer.addTo(map);

let markers = {};

function createCustomPin(color) {
  return L.divIcon({
    className: "clean-map-pin",
    html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.35);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

dataLokasi.forEach((item) => {
  const marker = L.marker([item.lat, item.lng], {
    icon: createCustomPin(item.pinColor),
  }).addTo(map);

  const popupContent = `
    <div style="font-family: inherit; padding: 4px;">
      <div style="font-weight: 700; font-size: 13px; margin-bottom: 2px;">${item.title}</div>
      <div style="font-size: 11px; opacity: 0.75; margin-bottom: 6px;">${item.address}</div>
      <a href="${item.link}" target="_blank" style="font-size: 11px; font-weight: 700; color: ${item.pinColor}; text-decoration: none;">
        Buka Tautan &rsaquo;
      </a>
    </div>
  `;

  marker.bindPopup(popupContent);
  markers[item.id] = marker;
});

// ==========================================
// RENDER DAFTAR TEMPAT
// ==========================================
const placesContainer = document.getElementById("placesContainer");

function renderPlaces(list) {
  placesContainer.innerHTML = "";

  if (list.length === 0) {
    placesContainer.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 32px; color: var(--text-muted); font-size: 13px;">
        Tidak ada fasilitas atau UMKM yang sesuai dengan pencarian.
      </div>
    `;
    return;
  }

  list.forEach((item) => {
    const card = document.createElement("div");
    card.className = "place-card";

    card.onclick = () => {
      map.flyTo([item.lat, item.lng], 17, { duration: 1 });
      if (markers[item.id]) markers[item.id].openPopup();
      window.scrollTo({
        top: document.querySelector(".map-box").offsetTop - 90,
        behavior: "smooth",
      });
    };

    card.innerHTML = `
      <span class="place-tag ${item.tagClass}">${item.tag}</span>
      <h4 class="place-title">${item.title}</h4>
      <p class="place-address">📍 ${item.address}</p>
      <p class="place-desc">${item.desc}</p>
      <a href="${item.link}" target="_blank" class="place-link ${item.category === "umkm" ? "umkm" : ""}" onclick="event.stopPropagation()">
        ${item.category === "umkm" ? "Hubungi via WhatsApp ›" : "Petunjuk Rute ›"}
      </a>
    `;

    placesContainer.appendChild(card);
  });
}

// ==========================================
// FILTER PENCARIAN & KATEGORI
// ==========================================
let currentCategory = "all";
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".pill-btn");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.getAttribute("data-filter");
    filterData();
  });
});

searchInput.addEventListener("input", filterData);

function filterData() {
  const keyword = searchInput.value.toLowerCase().trim();

  const filtered = dataLokasi.filter((item) => {
    const matchCategory =
      currentCategory === "all" || item.category === currentCategory;
    const matchSearch =
      item.title.toLowerCase().includes(keyword) ||
      item.desc.toLowerCase().includes(keyword) ||
      item.address.toLowerCase().includes(keyword);
    return matchCategory && matchSearch;
  });

  renderPlaces(filtered);
}

// ==========================================
// LOGIKA DARK / LIGHT MODE DENGAN LOCALSTORAGE
// ==========================================
const themeBtn = document.getElementById("themeBtn");
const sunIcon = document.getElementById("sunIcon");
const moonIcon = document.getElementById("moonIcon");

function applyTheme(isDark) {
  if (isDark) {
    document.body.classList.add("dark-mode");
    sunIcon.classList.remove("hidden");
    moonIcon.classList.add("hidden");

    // Ganti basemap leaflet ke versi gelap
    map.removeLayer(currentTileLayer);
    currentTileLayer = darkTileLayer.addTo(map);
  } else {
    document.body.classList.remove("dark-mode");
    sunIcon.classList.add("hidden");
    moonIcon.classList.remove("hidden");

    // Ganti basemap leaflet ke versi terang
    map.removeLayer(currentTileLayer);
    currentTileLayer = lightTileLayer.addTo(map);
  }
}

// Cek simpanan tema pengguna
const savedTheme = localStorage.getItem("rw03-theme");
if (savedTheme === "dark") {
  applyTheme(true);
} else {
  applyTheme(false);
}

themeBtn.addEventListener("click", () => {
  const isCurrentlyDark = document.body.classList.contains("dark-mode");
  const targetDark = !isCurrentlyDark;

  applyTheme(targetDark);
  localStorage.setItem("rw03-theme", targetDark ? "dark" : "light");
});

// Render Awal
renderPlaces(dataLokasi);

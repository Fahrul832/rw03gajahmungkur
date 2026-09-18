// =========================================================================
// DATA LOKASI RESMI RW 03 GAJAHMUNGKUR
// Balai RW 03: 356 Jl. Cikuray III (https://maps.app.goo.gl/x8bKYuooY7FfSCmd7)
// =========================================================================
const dataLokasi = [
  {
    id: 1,
    title: "Balai RW 03 Gajahmungkur",
    category: "fasum",
    tag: "Balai Warga",
    tagClass: "tag-fasum",
    address: "356 Jl. Cikuray III, RT 03/RW 03, Gajahmungkur",
    desc: "Sekretariat utama warga RW 03, pusat pelayanan administrasi kependudukan, kegiatan PKK, rapat warga, dan posko keamanan siaga.",
    lat: -7.009495,
    lng: 110.407987,
    link: "https://maps.app.goo.gl/x8bKYuooY7FfSCmd7",
    pinColor: "#B91C1C",
  },
  {
    id: 2,
    title: "Puskesmas Pegandan",
    category: "fasum",
    tag: "Fasilitas Kesehatan",
    tagClass: "tag-fasum",
    address: "Jl. Lamongan Raya No. 2, Gajahmungkur",
    desc: "Puskesmas pembina wilayah kerja Gajahmungkur. Melayani imunisasi balita terpadu, poli umum, BPJS, dan posyandu lansia rutin.",
    lat: -7.00512,
    lng: 110.40781,
    link: "https://maps.google.com/?q=Puskesmas+Pegandan+Semarang",
    pinColor: "#B91C1C",
  },
  {
    id: 3,
    title: "Kantor Kelurahan Gajahmungkur",
    category: "fasum",
    tag: "Pemerintahan",
    tagClass: "tag-fasum",
    address: "Kecamatan Gajahmungkur, Kota Semarang",
    desc: "Layanan legalisir dokumen resmi kelurahan, pengantar surat nikah/domisili, serta koordinasi lembaga kemasyarakatan.",
    lat: -7.01021,
    lng: 110.41282,
    link: "https://maps.google.com/?q=Kantor+Kelurahan+Gajahmungkur+Semarang",
    pinColor: "#B91C1C",
  },
];

// =========================================================================
// INISIALISASI PETA LEAFLET (FOKUS BALAI RW 03)
// =========================================================================
const map = L.map("map", { scrollWheelZoom: false }).setView(
  [-7.009495, 110.407987],
  16,
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

function renderMarkers() {
  dataLokasi.forEach((item) => {
    const marker = L.marker([item.lat, item.lng], {
      icon: createCustomPin(item.pinColor),
    }).addTo(map);

    const popupContent = `
      <div style="font-family: inherit; padding: 4px;">
        <div style="font-weight: 700; font-size: 13px; margin-bottom: 2px;">${item.title}</div>
        <div style="font-size: 11px; opacity: 0.75; margin-bottom: 6px;">${item.address}</div>
        <a href="${item.link}" target="_blank" style="font-size: 11px; font-weight: 700; color: ${item.pinColor}; text-decoration: none;">
          Buka di Google Maps &rsaquo;
        </a>
      </div>
    `;

    marker.bindPopup(popupContent);
    markers[item.id] = marker;
  });
}
renderMarkers();

// =========================================================================
// RENDER DAFTAR KARTU
// =========================================================================
const placesContainer = document.getElementById("placesContainer");

function renderPlaces(list) {
  placesContainer.innerHTML = "";

  if (list.length === 0) {
    placesContainer.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px 20px; border: 1px dashed var(--border-color); border-radius: 14px; background: var(--bg-surface);">
        <p style="font-size: 14px; font-weight: 600; color: var(--text-main); margin-bottom: 4px;">Belum Ada Data UMKM</p>
        <p style="font-size: 12px; color: var(--text-muted); line-height: 1.5;">Data produk dan usaha unggulan warga RW 03 saat ini sedang dalam proses pendataan oleh pengurus.</p>
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
        Buka di Google Maps &rsaquo;
      </a>
    `;

    placesContainer.appendChild(card);
  });
}

// =========================================================================
// FILTER PENCARIAN & KATEGORI
// =========================================================================
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

// =========================================================================
// DARK / LIGHT THEME TOGGLE DENGAN LOCALSTORAGE
// =========================================================================
const themeBtn = document.getElementById("themeBtn");
const sunIcon = document.getElementById("sunIcon");
const moonIcon = document.getElementById("moonIcon");

function applyTheme(isDark) {
  if (isDark) {
    document.body.classList.add("dark-mode");
    sunIcon.classList.remove("hidden");
    moonIcon.classList.add("hidden");

    map.removeLayer(currentTileLayer);
    currentTileLayer = darkTileLayer.addTo(map);
  } else {
    document.body.classList.remove("dark-mode");
    sunIcon.classList.add("hidden");
    moonIcon.classList.remove("hidden");

    map.removeLayer(currentTileLayer);
    currentTileLayer = lightTileLayer.addTo(map);
  }
}

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

// =========================================================================
// NAVIGASI MOBILE DRAWER
// =========================================================================
const menuToggle = document.getElementById("menuToggle");
const drawerClose = document.getElementById("drawerClose");
const mobileDrawer = document.getElementById("mobileDrawer");
const mobileOverlay = document.getElementById("mobileOverlay");
const drawerNavItems = document.querySelectorAll(".drawer-nav-item");

function openDrawer() {
  mobileDrawer.classList.add("active");
  mobileOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  mobileDrawer.classList.remove("active");
  mobileOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

menuToggle.addEventListener("click", openDrawer);
drawerClose.addEventListener("click", closeDrawer);
mobileOverlay.addEventListener("click", closeDrawer);

drawerNavItems.forEach((item) => {
  item.addEventListener("click", closeDrawer);
});

// Render awal saat halaman dimuat
renderPlaces(dataLokasi);

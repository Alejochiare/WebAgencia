/* ═══════════════════════════════════════════════
   MOTORWAGEN AUTOMOTORES — index.js
   ═══════════════════════════════════════════════ */

const WA_NUMBER = '5493564410038';
const WA_BASE   = `https://wa.me/${WA_NUMBER}`;

/* ─── DEFAULT VEHICLES (used only if admin hasn't saved any) ─── */
const DEFAULT_VEHICLES = [
  {
    id: 1, marca: 'Chevrolet', modelo: 'S-10 4x4', anio: 2021,
    precio: 48000000, km: 32000, comb: 'Diesel', trans: 'Manual',
    color: 'Gris', motor: '2.8L TD 200cv', ubicacion: 'Balnearia, Córdoba',
    tipo: 'pickup', badge: 'Destacado',
    desc: 'Chevrolet S-10 High Country 4x4 en excelente estado. Un solo dueño, service al día, nunca patinada. Equipamiento completo con cuero, pantalla tactil y cámara trasera.',
    fotos: [
      'https://images.unsplash.com/photo-1558981285-501cd373af7e?w=900&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&q=80'
    ]
  },
  {
    id: 2, marca: 'Toyota', modelo: 'Hilux SRX', anio: 2022,
    precio: 57000000, km: 18000, comb: 'Diesel', trans: 'Automática',
    color: 'Blanco', motor: '2.8L TDI 204cv', ubicacion: 'Balnearia, Córdoba',
    tipo: 'pickup', badge: 'Nuevo',
    desc: 'Toyota Hilux SRX AT 4x4. La pickup más confiable del mercado. Garantía de fábrica vigente. Cero cuotas impagas.',
    fotos: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&q=80',
      'https://images.unsplash.com/photo-1558981033-a35b48e72bf2?w=900&q=80'
    ]
  },
  {
    id: 3, marca: 'Volkswagen', modelo: 'Amarok V6', anio: 2023,
    precio: 72000000, km: 7500, comb: 'Diesel', trans: 'Automática',
    color: 'Negro', motor: '3.0L V6 TDI 258cv', ubicacion: 'Balnearia, Córdoba',
    tipo: 'pickup', badge: 'Premium',
    desc: 'Volkswagen Amarok V6 de máxima categoría. La pickup más potente del segmento. Todos los extras. Garantía vigente.',
    fotos: [
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&q=80'
    ]
  },
  {
    id: 4, marca: 'Ford', modelo: 'Ranger XLS', anio: 2020,
    precio: 36000000, km: 62000, comb: 'Diesel', trans: 'Manual',
    color: 'Azul', motor: '2.2L TDCi 160cv', ubicacion: 'Balnearia, Córdoba',
    tipo: 'pickup', badge: '',
    desc: 'Ford Ranger XLS 4x2 en impecable estado. Mantenimiento completo. Ideal para trabajo y familia.',
    fotos: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&q=80',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=900&q=80'
    ]
  },
  {
    id: 5, marca: 'Jeep', modelo: 'Compass Sport', anio: 2022,
    precio: 41000000, km: 22000, comb: 'Nafta', trans: 'Automática',
    color: 'Rojo', motor: '1.3L Turbo 150cv', ubicacion: 'Balnearia, Córdoba',
    tipo: 'suv', badge: '',
    desc: 'Jeep Compass Sport 4x2 automático. Un solo dueño, impecable. Financiación disponible.',
    fotos: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=900&q=80',
      'https://images.unsplash.com/photo-1617469767104-a3e450b3e9ef?w=900&q=80'
    ]
  },
  {
    id: 6, marca: 'Volkswagen', modelo: 'Polo Track', anio: 2023,
    precio: 24000000, km: 9000, comb: 'Nafta', trans: 'Manual',
    color: 'Blanco', motor: '1.0L 84cv', ubicacion: 'Balnearia, Córdoba',
    tipo: 'hatchback', badge: 'Nuevo',
    desc: 'Volkswagen Polo Track 0km prácticamente. Económico, moderno y con garantía de fábrica.',
    fotos: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&q=80',
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=900&q=80'
    ]
  }
];

/* ─── STATE ─── */
let vehicles   = [];
let favorites  = [];
let siteTexts  = {};
let currentModal     = null;
let galleryIndex     = 0;
let currentGalleryImgs = [];

/* ─── INIT ─── */
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  renderVehicles(vehicles);
  applySiteTexts();
  initFavoriteCount();
  observeFadeUps();
  initNav();
});

/* ─── LOAD DATA FROM LOCALSTORAGE ─── */
function loadData() {
  const saved = localStorage.getItem('mw_vehicles');
  // Si la clave existe (aunque sea array vacío), respetarla.
  // Solo usar DEFAULT_VEHICLES si nunca se guardó nada (primera visita).
  if (saved !== null) {
    vehicles = JSON.parse(saved);
  } else {
    vehicles = DEFAULT_VEHICLES;
  }

  const favSaved = localStorage.getItem('mw_favorites');
  favorites  = favSaved ? JSON.parse(favSaved) : [];

  const textSaved = localStorage.getItem('mw_texts');
  siteTexts  = textSaved ? JSON.parse(textSaved) : {};
}

/* ─── APPLY SITE TEXTS (from admin) ─── */
function applySiteTexts() {
  const map = {
    'hero-title-line1': 'hero-title-l1',
    'hero-title-line2': 'hero-title-l2',
    'hero-subtitle':    'hero-sub',
    'nosotros-title':   'nosotros-title-el',
    'nosotros-desc':    'nosotros-desc-el',
  };
  Object.entries(map).forEach(([key, id]) => {
    if (siteTexts[key]) {
      const el = document.getElementById(id);
      if (el) el.textContent = siteTexts[key];
    }
  });

  // Stats
  ['stat-vehiculos','stat-clientes','stat-anos','stat-satisfaccion'].forEach(key => {
    if (siteTexts[key]) {
      const el = document.getElementById(key);
      if (el) el.textContent = siteTexts[key];
    }
  });
}

/* ─── RENDER VEHICLES ─── */
function renderVehicles(data) {
  const grid = document.getElementById('vehiclesGrid');
  if (!data || data.length === 0) {
    grid.innerHTML = `<div class="no-results">🚗 No hay vehículos disponibles en este momento.<br><small style="color:#8a95a3">Consultanos por WhatsApp para ver stock actualizado.</small></div>`;
    return;
  }
  grid.innerHTML = data.map(v => `
    <div class="vehicle-card fade-up" onclick="openModal(${v.id})">
      <div class="vehicle-img">
        <img src="${(v.fotos && v.fotos[0]) || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=700&q=80'}"
             alt="${v.marca} ${v.modelo}" loading="lazy"
             onerror="this.src='https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=700&q=80'">
        ${v.badge ? `<div class="vehicle-badge">${v.badge}</div>` : ''}
        <button class="vehicle-fav ${favorites.includes(v.id) ? 'active' : ''}"
                onclick="toggleFav(event,${v.id})" title="Guardar favorito">
          <svg fill="${favorites.includes(v.id) ? 'white' : 'none'}" stroke="white" stroke-width="2" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
      <div class="vehicle-body">
        <div class="vehicle-name">${v.marca} ${v.modelo}</div>
        <div class="vehicle-year">${v.anio} · ${v.ubicacion || 'Balnearia, Córdoba'}</div>
        <div class="vehicle-specs">
          <div class="vehicle-spec">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            ${Number(v.km).toLocaleString('es-AR')} km
          </div>
          <div class="vehicle-spec">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/></svg>
            ${v.comb}
          </div>
          <div class="vehicle-spec">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
            ${v.trans}
          </div>
        </div>
        <div class="vehicle-price">$${(Number(v.precio)/1000000).toFixed(1)}M <span>ARS</span></div>
        <div class="vehicle-btns">
          <button class="btn-card-detail" onclick="event.stopPropagation();openModal(${v.id})">Ver detalles</button>
          <a class="btn-card-wa"
             href="${WA_BASE}?text=${encodeURIComponent('Hola, quiero consultar por el ' + v.marca + ' ' + v.modelo + ' ' + v.anio)}"
             target="_blank" onclick="event.stopPropagation()">
            <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </a>
          <button class="btn-share" onclick="event.stopPropagation();shareVehicle(${v.id})" title="Compartir">
            <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          </button>
        </div>
      </div>
    </div>
  `).join('');
  observeFadeUps();
}

/* ─── TABS FILTER ─── */
function filterTab(tipo, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filtered = tipo === 'todos' ? vehicles : vehicles.filter(v => v.tipo === tipo);
  renderVehicles(filtered);
}

/* ─── SEARCH / FILTER ─── */
function searchVehicles() {
  const marca    = document.getElementById('f-marca').value;
  const comb     = document.getElementById('f-comb').value;
  const trans    = document.getElementById('f-trans').value;
  const precioMin = parseInt(document.getElementById('f-precio-min').value) || 0;
  const precioMax = parseInt(document.getElementById('f-precio-max').value) || Infinity;
  const kmMax    = parseInt(document.getElementById('f-km').value) || Infinity;

  const filtered = vehicles.filter(v =>
    (!marca || v.marca === marca) &&
    (!comb  || v.comb  === comb)  &&
    (!trans || v.trans === trans) &&
    Number(v.precio) >= precioMin && Number(v.precio) <= precioMax &&
    Number(v.km)     <= kmMax
  );

  document.getElementById('vehiculos').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => {
    renderVehicles(filtered);
    showNotification(
      filtered.length ? `${filtered.length} vehículo${filtered.length > 1 ? 's' : ''} encontrado${filtered.length > 1 ? 's' : ''} 🎯` : 'Sin resultados. Mostrando todo el stock.',
      'success'
    );
  }, 350);
}

/* ─── MODAL ─── */
function openModal(id) {
  const v = vehicles.find(x => x.id === id);
  if (!v) return;
  currentModal = v;
  galleryIndex = 0;
  currentGalleryImgs = v.fotos && v.fotos.length ? v.fotos : ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&q=80'];

  document.getElementById('modalMainImg').src = currentGalleryImgs[0];
  document.getElementById('modalName').textContent  = `${v.marca} ${v.modelo}`;
  document.getElementById('modalYear').textContent  = `${v.anio} · ${v.ubicacion || 'Balnearia, Córdoba'}`;
  document.getElementById('modalPrice').textContent = `$${(Number(v.precio)/1000000).toFixed(1)}M ARS`;
  document.getElementById('modalDesc').textContent  = v.desc || '';
  document.getElementById('modalWaBtn').href =
    `${WA_BASE}?text=${encodeURIComponent('Hola, quiero consultar por el ' + v.marca + ' ' + v.modelo + ' ' + v.anio)}`;

  document.getElementById('modalSpecs').innerHTML = [
    ['Marca',        v.marca],
    ['Modelo',       v.modelo],
    ['Año',          v.anio],
    ['Kilometraje',  `${Number(v.km).toLocaleString('es-AR')} km`],
    ['Combustible',  v.comb],
    ['Motor',        v.motor || '—'],
    ['Transmisión',  v.trans],
    ['Color',        v.color || '—'],
    ['Ubicación',    v.ubicacion || 'Balnearia, Córdoba']
  ].map(([k, val]) =>
    `<div class="spec-row"><span class="spec-key">${k}</span><span class="spec-val">${val}</span></div>`
  ).join('');

  const dots = document.getElementById('galleryDots');
  dots.innerHTML = currentGalleryImgs.map((_, i) =>
    `<div class="gallery-dot ${i === 0 ? 'active' : ''}" onclick="goGallery(${i})"></div>`
  ).join('');

  document.getElementById('vehicleModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('vehicleModal').classList.remove('open');
  document.body.style.overflow = '';
}
function closeModalOnOverlay(e) {
  if (e.target === document.getElementById('vehicleModal')) closeModal();
}
function galleryNav(dir) {
  goGallery((galleryIndex + dir + currentGalleryImgs.length) % currentGalleryImgs.length);
}
function goGallery(i) {
  galleryIndex = i;
  document.getElementById('modalMainImg').src = currentGalleryImgs[i];
  document.querySelectorAll('.gallery-dot').forEach((d, idx) => d.classList.toggle('active', idx === i));
}

/* ─── FAVORITES ─── */
function toggleFav(e, id) {
  e.stopPropagation();
  if (favorites.includes(id)) {
    favorites = favorites.filter(x => x !== id);
    showNotification('Eliminado de favoritos', '');
  } else {
    favorites.push(id);
    showNotification('¡Guardado en favoritos! ❤️', 'success');
  }
  localStorage.setItem('mw_favorites', JSON.stringify(favorites));
  initFavoriteCount();
  renderVehicles(vehicles);
}
function initFavoriteCount() {
  const badge = document.getElementById('fav-badge');
  if (badge) badge.textContent = favorites.length || '';
}

/* ─── SHARE ─── */
function shareVehicle(id) {
  const v = vehicles.find(x => x.id === id);
  if (!v) return;
  const text = `${v.marca} ${v.modelo} ${v.anio} — $${(Number(v.precio)/1000000).toFixed(1)}M ARS | Motorwagen Automotores, Balnearia`;
  if (navigator.share) {
    navigator.share({ title: `${v.marca} ${v.modelo} - Motorwagen`, text, url: window.location.href });
  } else {
    navigator.clipboard.writeText(text);
    showNotification('¡Info copiada! 📋', 'success');
  }
}

/* ─── CONTACT FORM ─── */
function submitContactForm() {
  const nombre  = document.getElementById('c-nombre')?.value?.trim();
  const tel     = document.getElementById('c-tel')?.value?.trim();
  const consulta = document.getElementById('c-consulta')?.value?.trim();
  if (!nombre || !tel || !consulta) {
    showNotification('Completá todos los campos ⚠️', '');
    return;
  }
  // Save message to localStorage
  const msgs = JSON.parse(localStorage.getItem('mw_messages') || '[]');
  msgs.push({ id: Date.now(), nombre, tel, consulta, fecha: new Date().toLocaleString('es-AR'), leido: false });
  localStorage.setItem('mw_messages', JSON.stringify(msgs));

  document.getElementById('c-nombre').value  = '';
  document.getElementById('c-tel').value     = '';
  document.getElementById('c-consulta').value = '';
  showNotification('¡Consulta enviada! Te respondemos pronto ✉️', 'success');
}

function submitFinanciacion() {
  const msgs = JSON.parse(localStorage.getItem('mw_messages') || '[]');
  const nombre = document.getElementById('fin-nombre')?.value?.trim();
  const tel    = document.getElementById('fin-tel')?.value?.trim();
  const vehic  = document.getElementById('fin-vehiculo')?.value?.trim();
  const ingreso = document.getElementById('fin-ingreso')?.value;
  if (!nombre || !tel) { showNotification('Completá los campos obligatorios ⚠️', ''); return; }
  msgs.push({ id: Date.now(), nombre, tel, consulta: `[FINANCIACIÓN] ${vehic || '—'} — Ingreso: ${ingreso || '—'}`, fecha: new Date().toLocaleString('es-AR'), leido: false });
  localStorage.setItem('mw_messages', JSON.stringify(msgs));
  showNotification('¡Solicitud enviada! Te contactamos en menos de 24hs 🚀', 'success');
}

function submitVender() {
  const msgs = JSON.parse(localStorage.getItem('mw_messages') || '[]');
  const nombre = document.getElementById('v-nombre')?.value?.trim();
  const tel    = document.getElementById('v-tel')?.value?.trim();
  if (!nombre || !tel) { showNotification('Completá los campos obligatorios ⚠️', ''); return; }
  msgs.push({ id: Date.now(), nombre, tel, consulta: '[VENDER AUTO] Solicitud de tasación', fecha: new Date().toLocaleString('es-AR'), leido: false });
  localStorage.setItem('mw_messages', JSON.stringify(msgs));
  showNotification('¡Solicitud de tasación enviada! ✅', 'success');
}

/* ─── NOTIFICATION ─── */
function showNotification(msg, type) {
  const n = document.getElementById('notification');
  n.textContent = msg;
  n.className = `notification ${type} show`;
  clearTimeout(n._timer);
  n._timer = setTimeout(() => n.classList.remove('show'), 3200);
}

/* ─── NAV SCROLL ─── */
function initNav() {
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
  });
}

/* ─── MOBILE MENU ─── */
function toggleMenu() { document.getElementById('mobileMenu').classList.toggle('open'); }
function closeMobileMenu() { document.getElementById('mobileMenu').classList.remove('open'); }

/* ─── FADE UP OBSERVER ─── */
function observeFadeUps() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.fade-up:not(.visible)').forEach(el => observer.observe(el));
}

/* ─── KEYBOARD ─── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
  if (document.getElementById('vehicleModal').classList.contains('open')) {
    if (e.key === 'ArrowLeft')  galleryNav(-1);
    if (e.key === 'ArrowRight') galleryNav(1);
  }
});

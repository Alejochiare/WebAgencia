/* ═══════════════════════════════════════════════
   MOTORWAGEN — admin.js
   Panel de Administración
   ═══════════════════════════════════════════════ */

/* ─── DEFAULT DATA ─── */
const DEFAULT_VEHICLES = [
  { id:1, marca:'Chevrolet', modelo:'S-10 4x4', anio:2021, precio:48000000, km:32000, comb:'Diesel', trans:'Manual', color:'Gris', motor:'2.8L TD 200cv', ubicacion:'Balnearia, Córdoba', tipo:'pickup', badge:'Destacado', activo:true,
    desc:'Chevrolet S-10 High Country 4x4 en excelente estado.',
    fotos:['https://images.unsplash.com/photo-1558981285-501cd373af7e?w=900&q=80'] },
  { id:2, marca:'Toyota', modelo:'Hilux SRX', anio:2022, precio:57000000, km:18000, comb:'Diesel', trans:'Automática', color:'Blanco', motor:'2.8L TDI 204cv', ubicacion:'Balnearia, Córdoba', tipo:'pickup', badge:'Nuevo', activo:true,
    desc:'Toyota Hilux SRX AT 4x4. Garantía vigente.',
    fotos:['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&q=80'] },
  { id:3, marca:'Volkswagen', modelo:'Amarok V6', anio:2023, precio:72000000, km:7500, comb:'Diesel', trans:'Automática', color:'Negro', motor:'3.0L V6 TDI 258cv', ubicacion:'Balnearia, Córdoba', tipo:'pickup', badge:'Premium', activo:true,
    desc:'Volkswagen Amarok V6 TDI. Todos los extras.',
    fotos:['https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80'] },
  { id:4, marca:'Volkswagen', modelo:'Polo Track', anio:2023, precio:24000000, km:9000, comb:'Nafta', trans:'Manual', color:'Blanco', motor:'1.0L 84cv', ubicacion:'Balnearia, Córdoba', tipo:'hatchback', badge:'', activo:true,
    desc:'Volkswagen Polo Track, económico y moderno.',
    fotos:['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&q=80'] }
];

const DEFAULT_TEXTS = {
  'hero-title-line1': 'Te asesoramos',
  'hero-title-line2': 'para que llegués',
  'hero-subtitle': 'Venta de autos usados y 0km. Financiación a medida, toma de usados y atención personalizada en Balnearia, Córdoba.',
  'nosotros-title': 'Más de 10 años de confianza',
  'nosotros-desc': 'Motorwagen Automotores nació con una misión simple: hacer que comprar o vender un auto sea una experiencia transparente, ágil y satisfactoria.',
  'stat-vehiculos': '50+',
  'stat-clientes': '500+',
  'stat-anos': '+10 años',
  'stat-satisfaccion': '100%'
};

/* ─── STATE ─── */
let vehicles = [];
let messages = [];
let siteTexts = {};
let editingId = null;
let currentFotos = [];
let activeSection = 'dashboard';

/* ─── INIT ─── */
document.addEventListener('DOMContentLoaded', () => {
  loadAll();
  renderDashboard();
  renderVehiclesTable();
  renderMessages();
  renderTextsForm();
  navigate('dashboard');
});

/* ─── STORAGE ─── */
function loadAll() {
  const v = localStorage.getItem('mw_vehicles');
  vehicles = v ? JSON.parse(v) : DEFAULT_VEHICLES;
  const m = localStorage.getItem('mw_messages');
  messages = m ? JSON.parse(m) : [];
  const t = localStorage.getItem('mw_texts');
  siteTexts = t ? JSON.parse(t) : { ...DEFAULT_TEXTS };
}
function saveVehicles()  { localStorage.setItem('mw_vehicles', JSON.stringify(vehicles)); }
function saveMessages()  { localStorage.setItem('mw_messages', JSON.stringify(messages)); }
function saveTexts()     { localStorage.setItem('mw_texts',    JSON.stringify(siteTexts)); }

/* ─── NAVIGATION ─── */
function navigate(section) {
  activeSection = section;
  document.querySelectorAll('.section-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const panel = document.getElementById('panel-' + section);
  const navEl  = document.getElementById('nav-' + section);
  if (panel) panel.classList.add('active');
  if (navEl)  navEl.classList.add('active');

  // Update topbar title
  const titles = {
    dashboard:  'Dashboard',
    vehiculos:  'Gestión de Vehículos',
    mensajes:   'Mensajes y Consultas',
    textos:     'Textos del Sitio',
    imagenes:   'Imágenes y Fotos'
  };
  const tb = document.getElementById('topbar-title');
  if (tb) tb.textContent = titles[section] || section;

  // Close mobile sidebar
  document.getElementById('sidebar').classList.remove('mobile-open');
}

/* ─── DASHBOARD ─── */
function renderDashboard() {
  document.getElementById('dash-total').textContent  = vehicles.length;
  document.getElementById('dash-activos').textContent = vehicles.filter(v => v.activo !== false).length;
  document.getElementById('dash-msgs').textContent   = messages.filter(m => !m.leido).length;
  document.getElementById('dash-pickups').textContent = vehicles.filter(v => v.tipo === 'pickup').length;

  // Recent vehicles
  const recent = [...vehicles].reverse().slice(0, 5);
  const tbody = document.getElementById('recent-tbody');
  if (!recent.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--gray);padding:30px">Sin vehículos cargados</td></tr>`;
    return;
  }
  tbody.innerHTML = recent.map(v => `
    <tr>
      <td class="td-name">${v.marca} ${v.modelo}</td>
      <td>${v.anio}</td>
      <td class="td-price">$${(Number(v.precio)/1000000).toFixed(1)}M</td>
      <td><span class="td-badge ${v.activo !== false ? 'active' : 'inactive'}">${v.activo !== false ? 'Activo' : 'Oculto'}</span></td>
      <td><div class="td-actions">
        <button class="btn-icon edit" onclick="editVehicle(${v.id})" title="Editar"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
      </div></td>
    </tr>
  `).join('');

  // Recent messages
  const recentMsgs = [...messages].reverse().slice(0, 3);
  const msgDiv = document.getElementById('recent-msgs');
  if (!recentMsgs.length) {
    msgDiv.innerHTML = `<p style="color:var(--gray);font-size:13px;text-align:center;padding:20px">Sin mensajes recibidos</p>`;
    return;
  }
  msgDiv.innerHTML = recentMsgs.map(m => `
    <div class="msg-card ${m.leido ? '' : 'unread'}" style="margin-bottom:10px">
      <div class="msg-top">
        <span class="msg-name">${escHtml(m.nombre)}</span>
        <span class="msg-tel">${escHtml(m.tel)}</span>
        <span class="msg-date">${m.fecha}</span>
      </div>
      <div class="msg-text">${escHtml(m.consulta)}</div>
    </div>
  `).join('');
}

/* ─── VEHICLES TABLE ─── */
function renderVehiclesTable(filter = '') {
  const tbody = document.getElementById('vehicles-tbody');
  let list = vehicles;
  if (filter) list = list.filter(v =>
    (`${v.marca} ${v.modelo}`).toLowerCase().includes(filter.toLowerCase())
  );
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg><p>No hay vehículos</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(v => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <div style="width:48px;height:34px;border-radius:6px;overflow:hidden;flex-shrink:0;background:var(--panel)">
            <img src="${v.fotos?.[0] || ''}" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display='none'">
          </div>
          <div class="td-name">${escHtml(v.marca)} ${escHtml(v.modelo)}</div>
        </div>
      </td>
      <td>${v.anio}</td>
      <td class="td-price">$${(Number(v.precio)/1000000).toFixed(1)}M</td>
      <td>${Number(v.km).toLocaleString('es-AR')} km</td>
      <td>${v.tipo ? capFirst(v.tipo) : '—'}</td>
      <td>
        <span class="td-badge ${v.activo !== false ? 'active' : 'inactive'}" 
              onclick="toggleActive(${v.id})" style="cursor:pointer" title="Click para cambiar">
          ${v.activo !== false ? 'Activo' : 'Oculto'}
        </span>
      </td>
      <td>
        <div class="td-actions">
          <button class="btn-icon edit" onclick="editVehicle(${v.id})" title="Editar">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-icon del" onclick="deleteVehicle(${v.id})" title="Eliminar">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

/* ─── VEHICLE MODAL ─── */
function openVehicleModal(id = null) {
  editingId = id;
  currentFotos = [];
  const v = id ? vehicles.find(x => x.id === id) : null;

  document.getElementById('modal-v-title').textContent = v ? 'Editar Vehículo' : 'Agregar Vehículo';

  const fields = ['marca','modelo','anio','precio','km','comb','trans','color','motor','ubicacion','tipo','badge','desc','activo'];
  fields.forEach(f => {
    const el = document.getElementById('v-' + f);
    if (!el) return;
    if (el.type === 'checkbox') el.checked = v ? (v[f] !== false) : true;
    else el.value = v ? (v[f] ?? '') : (f === 'ubicacion' ? 'Balnearia, Córdoba' : '');
  });

  // Fotos
  currentFotos = v?.fotos ? [...v.fotos] : [];
  renderFotosPreview();

  document.getElementById('modal-vehicle').classList.add('open');
}

function closeVehicleModal() {
  document.getElementById('modal-vehicle').classList.remove('open');
  editingId = null;
}

function editVehicle(id) {
  openVehicleModal(id);
  navigate('vehiculos');
}

function addFotoUrl() {
  const url = document.getElementById('v-foto-url').value.trim();
  if (!url) return;
  currentFotos.push(url);
  document.getElementById('v-foto-url').value = '';
  renderFotosPreview();
}

// Subir fotos desde la computadora (FileReader → base64)
function uploadFotosLocal(input) {
  const files = Array.from(input.files);
  if (!files.length) return;
  let loaded = 0;
  files.forEach(file => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
      currentFotos.push(e.target.result);
      loaded++;
      if (loaded === files.length) renderFotosPreview();
    };
    reader.readAsDataURL(file);
  });
  input.value = ''; // reset para poder volver a subir el mismo archivo
}

function removeFoto(i) {
  currentFotos.splice(i, 1);
  renderFotosPreview();
}

function renderFotosPreview() {
  const wrap = document.getElementById('fotos-preview-wrap');
  wrap.innerHTML = currentFotos.map((url, i) => `
    <div class="foto-thumb">
      <img src="${url.startsWith('data:') ? url : escHtml(url)}" onerror="this.src='https://via.placeholder.com/80x60?text=Error'">
      <div class="foto-thumb-del" onclick="removeFoto(${i})">✕</div>
    </div>
  `).join('');
}

function saveVehicleForm() {
  const get = id => { const el = document.getElementById(id); return el?.type === 'checkbox' ? el.checked : el?.value?.trim(); };

  const marca  = get('v-marca');
  const modelo = get('v-modelo');

  if (!marca || !modelo) {
    showToast('Completá al menos Marca y Modelo para guardar', 'err');
    return;
  }

  const anio   = parseInt(get('v-anio'))   || null;
  const precio = parseInt(get('v-precio')) || null;
  const km     = parseInt(get('v-km'))     || 0;

  const data = {
    marca, modelo, anio, precio, km,
    comb:       get('v-comb'),
    trans:      get('v-trans'),
    color:      get('v-color'),
    motor:      get('v-motor'),
    ubicacion:  get('v-ubicacion') || 'Balnearia, Córdoba',
    tipo:       get('v-tipo'),
    badge:      get('v-badge'),
    desc:       get('v-desc'),
    activo:     document.getElementById('v-activo')?.checked ?? true,
    fotos:      currentFotos.length ? currentFotos : ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&q=80']
  };

  if (editingId) {
    const idx = vehicles.findIndex(v => v.id === editingId);
    if (idx !== -1) vehicles[idx] = { ...vehicles[idx], ...data };
    showToast('✅ Vehículo actualizado correctamente', 'ok');
  } else {
    data.id = Date.now();
    vehicles.unshift(data);
    showToast('✅ Vehículo agregado al catálogo', 'ok');
  }

  saveVehicles();
  closeVehicleModal();
  renderVehiclesTable();
  renderDashboard();
}

function deleteVehicle(id) {
  const v = vehicles.find(x => x.id === id);
  if (!confirm(`¿Eliminar "${v?.marca} ${v?.modelo}"? Esta acción no se puede deshacer.`)) return;
  vehicles = vehicles.filter(x => x.id !== id);
  saveVehicles();
  renderVehiclesTable();
  renderDashboard();
  showToast('🗑 Vehículo eliminado', 'ok');
}

function toggleActive(id) {
  const v = vehicles.find(x => x.id === id);
  if (!v) return;
  v.activo = !v.activo;
  saveVehicles();
  renderVehiclesTable();
  renderDashboard();
  showToast(v.activo ? '✅ Vehículo publicado' : '🔒 Vehículo ocultado del sitio', 'ok');
}

/* ─── MESSAGES ─── */
function renderMessages(filter = 'todos') {
  const wrap = document.getElementById('messages-wrap');
  let list = [...messages].reverse();
  if (filter === 'nuevos') list = list.filter(m => !m.leido);

  const unread = messages.filter(m => !m.leido).length;
  const badge = document.getElementById('msg-badge');
  if (badge) badge.textContent = unread || '';

  if (!list.length) {
    wrap.innerHTML = `<div class="empty-state"><svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><p>Sin mensajes ${filter === 'nuevos' ? 'nuevos' : ''}</p></div>`;
    return;
  }

  wrap.innerHTML = list.map(m => `
    <div class="msg-card ${m.leido ? '' : 'unread'}" id="msg-${m.id}">
      <div class="msg-top">
        <span class="msg-name">${escHtml(m.nombre)}</span>
        <span class="msg-tel">📞 ${escHtml(m.tel)}</span>
        <span class="msg-date">${m.fecha}</span>
        ${!m.leido ? '<span class="td-badge blue" style="font-size:9px">NUEVO</span>' : ''}
      </div>
      <div class="msg-text">${escHtml(m.consulta)}</div>
      <div class="msg-actions">
        <a href="https://wa.me/${m.tel.replace(/\D/g,'')}" target="_blank" class="btn-sm primary">💬 Responder por WA</a>
        <a href="tel:${m.tel}" class="btn-sm ghost">📞 Llamar</a>
        ${!m.leido ? `<button class="btn-sm success" onclick="markRead(${m.id})">✓ Marcar leído</button>` : ''}
        <button class="btn-sm danger" onclick="deleteMsg(${m.id})">🗑 Eliminar</button>
      </div>
    </div>
  `).join('');
}

function markRead(id) {
  const m = messages.find(x => x.id === id);
  if (m) { m.leido = true; saveMessages(); renderMessages(); renderDashboard(); showToast('Mensaje marcado como leído', 'ok'); }
}

function markAllRead() {
  messages.forEach(m => m.leido = true);
  saveMessages(); renderMessages(); renderDashboard(); showToast('Todos los mensajes marcados como leídos ✓', 'ok');
}

function deleteMsg(id) {
  if (!confirm('¿Eliminar este mensaje?')) return;
  messages = messages.filter(x => x.id !== id);
  saveMessages(); renderMessages(); renderDashboard(); showToast('Mensaje eliminado', 'ok');
}

function clearAllMsgs() {
  if (!confirm('¿Eliminar TODOS los mensajes? Esta acción no se puede deshacer.')) return;
  messages = [];
  saveMessages(); renderMessages(); renderDashboard(); showToast('Todos los mensajes eliminados', 'ok');
}

/* ─── TEXTS EDITOR ─── */
function renderTextsForm() {
  const fields = [
    'hero-title-line1','hero-title-line2','hero-subtitle',
    'nosotros-title','nosotros-desc',
    'stat-vehiculos','stat-clientes','stat-anos','stat-satisfaccion'
  ];
  fields.forEach(key => {
    const el = document.getElementById('txt-' + key);
    if (el) el.value = siteTexts[key] || DEFAULT_TEXTS[key] || '';
  });
}

function saveTextsForm() {
  const fields = [
    'hero-title-line1','hero-title-line2','hero-subtitle',
    'nosotros-title','nosotros-desc',
    'stat-vehiculos','stat-clientes','stat-anos','stat-satisfaccion'
  ];
  fields.forEach(key => {
    const el = document.getElementById('txt-' + key);
    if (el) siteTexts[key] = el.value.trim();
  });
  saveTexts();
  showToast('✅ Textos guardados. Se verán en el sitio al recargar.', 'ok');
}

function resetTexts() {
  if (!confirm('¿Restablecer todos los textos a los valores originales?')) return;
  siteTexts = { ...DEFAULT_TEXTS };
  saveTexts();
  renderTextsForm();
  showToast('Textos restablecidos a los valores originales', 'ok');
}

/* ─── IMAGES SECTION ─── */
function addGlobalImage() {
  const url = document.getElementById('global-img-url').value.trim();
  if (!url) { showToast('Ingresá una URL de imagen válida', 'err'); return; }
  const imgs = JSON.parse(localStorage.getItem('mw_global_imgs') || '[]');
  imgs.push({ id: Date.now(), url, label: document.getElementById('global-img-label').value.trim() || 'Sin nombre' });
  localStorage.setItem('mw_global_imgs', JSON.stringify(imgs));
  document.getElementById('global-img-url').value = '';
  document.getElementById('global-img-label').value = '';
  renderImagesGallery();
  showToast('✅ Imagen guardada', 'ok');
}

function renderImagesGallery() {
  const imgs = JSON.parse(localStorage.getItem('mw_global_imgs') || '[]');
  const wrap = document.getElementById('img-gallery');
  if (!imgs.length) {
    wrap.innerHTML = `<p style="color:var(--gray);font-size:13px">No hay imágenes guardadas.</p>`;
    return;
  }
  wrap.innerHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin-top:16px">` +
    imgs.map(img => `
      <div style="position:relative;border-radius:8px;overflow:hidden;border:1px solid var(--border);background:var(--card)">
        <img src="${escHtml(img.url)}" style="width:100%;height:90px;object-fit:cover" onerror="this.src='https://via.placeholder.com/140x90?text=Error'">
        <div style="padding:7px 9px;font-size:11px;color:var(--gray)">${escHtml(img.label)}</div>
        <button onclick="deleteGlobalImg(${img.id})"
          style="position:absolute;top:5px;right:5px;width:20px;height:20px;border-radius:50%;background:rgba(239,68,68,0.85);color:white;font-size:11px;display:flex;align-items:center;justify-content:center;border:none;cursor:pointer">✕</button>
      </div>
    `).join('') + `</div>`;
}

function deleteGlobalImg(id) {
  let imgs = JSON.parse(localStorage.getItem('mw_global_imgs') || '[]');
  imgs = imgs.filter(i => i.id !== id);
  localStorage.setItem('mw_global_imgs', JSON.stringify(imgs));
  renderImagesGallery();
  showToast('Imagen eliminada', 'ok');
}

/* ─── EXPORT / IMPORT ─── */
function exportData() {
  const data = {
    vehicles, messages, siteTexts,
    exportDate: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `motorwagen-backup-${new Date().toLocaleDateString('es-AR').replace(/\//g,'-')}.json`;
  a.click();
  showToast('✅ Backup exportado', 'ok');
}

function importData(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.vehicles) { vehicles = data.vehicles; saveVehicles(); }
      if (data.messages) { messages = data.messages; saveMessages(); }
      if (data.siteTexts) { siteTexts = data.siteTexts; saveTexts(); }
      renderDashboard(); renderVehiclesTable(); renderMessages(); renderTextsForm();
      showToast('✅ Datos importados correctamente', 'ok');
    } catch {
      showToast('Error al leer el archivo. Asegurate que sea un backup válido.', 'err');
    }
  };
  reader.readAsText(file);
}

/* ─── SEARCH ─── */
function searchVehiclesAdmin() {
  const q = document.getElementById('search-vehicles')?.value || '';
  renderVehiclesTable(q);
}

/* ─── MOBILE SIDEBAR ─── */
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('mobile-open');
}

/* ─── TOAST ─── */
function showToast(msg, type = '') {
  const t = document.getElementById('admin-toast');
  t.textContent = msg;
  t.className = `admin-toast ${type} show`;
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 3500);
}

/* ─── HELPERS ─── */
function escHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function capFirst(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

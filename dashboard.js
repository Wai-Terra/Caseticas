document.addEventListener('DOMContentLoaded', () => {
  // Verificar sesión
  if (localStorage.getItem('userLoggedIn') !== 'true') {
    window.location.href = 'indexx.html';
    return;
  }

  // Cargar datos del perfil, historial y tienda desde data.json
  fetch('data.json')
    .then(res => res.json())
    .then(data => {
      const u = data.usuario;

      // Leer datos personalizados o de la base de datos
      const customName = localStorage.getItem('customUserName') || u.nombre;
      const customAvatar = localStorage.getItem('customUserAvatar') || u.avatar;

      // Actualizar perfil en el DOM
      const nameElem = document.getElementById('user-name');
      const avatarElem = document.getElementById('user-avatar');
      const pointsElem = document.getElementById('user-points');
      const kgElem = document.getElementById('user-kg');

      if (nameElem) nameElem.textContent = `¡Hola, ${customName}!`;
      if (avatarElem) avatarElem.src = customAvatar;
      if (pointsElem) pointsElem.textContent = u.puntos;
      if (kgElem) kgElem.textContent = `${u.kilosReciclados} kg`;

      // Actualizar barra de nivel y cálculo según puntos
      actualizarSistemaDeNivel(u.puntos);

      // Cargar Historial
      const historyContainer = document.getElementById('history-container');
      if (historyContainer && u.historial) {
        historyContainer.innerHTML = u.historial.map(item => `
          <div class="history-item">
            <div>
              <strong>${item.material}</strong> - ${item.casetica}
              <small>${item.fecha}</small>
            </div>
            <span class="pts-tag">${item.puntos} (${item.cantidad})</span>
          </div>
        `).join('');
      }

      // Cargar Recompensas Reclamadas
      const claimedContainer = document.getElementById('claimed-container');
      if (claimedContainer && u.recompensasReclamadas) {
        claimedContainer.innerHTML = u.recompensasReclamadas.map(item => `
          <div class="claimed-item">
            <strong>${item.titulo}</strong>
            <small>Reclamado el: ${item.fecha}</small>
            <span class="code-badge">Código: ${item.codigo}</span>
          </div>
        `).join('');
      }
    }).catch(err => console.error('Error al cargar data.json:', err));

  // Cargar Tienda y Novedades automáticamente
  cargarTienda();
  cargarNovedades();

  // Inicializar minijuego si existe
  inicializarEventosJuego();
});


// ==========================================
// 2. NAVEGACIÓN DE PESTAÑAS Y SESIÓN
// ==========================================
function switchDashboardTab(tabName) {
  document.querySelectorAll('.tab-view').forEach(view => view.classList.add('hidden'));
  document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));

  const activeView = document.getElementById(`view-${tabName}`);
  if (activeView) activeView.classList.remove('hidden');

  if (window.event && window.event.currentTarget) {
    window.event.currentTarget.classList.add('active');
  }
}

function logout() {
  localStorage.clear();
  window.location.href = 'indexx.html';
}


// ==========================================
// 3. LÓGICA DE TIENDA Y NOVEDADES
// ==========================================
const productosTienda = [
  { id: 1, nombre: "Snack Orgánico Eco", categoria: "comida", puntos: 150, desc: "Alimento saludable y sostenible." },
  { id: 2, nombre: "Kit Médico de Emergencia", categoria: "medicamento", puntos: 300, desc: "Insumos esenciales para la salud." },
  { id: 3, nombre: "Jabón Biodegradable", categoria: "personal", puntos: 100, desc: "Higiene personal libre de químicos." },
  { id: 4, nombre: "Barra Energética Natural", categoria: "comida", puntos: 120, desc: "Snack nutritivo 100% natural." }
];

const listaNovedades = [
  { titulo: "¡Nueva caseta abierta!", texto: "Ya puedes reciclar tus envases en el centro de la ciudad con beneficios dobles." },
  { titulo: "Aviso importante de la empresa", texto: "Revisa tu saldo de puntos acumulados esta semana para canjear tus productos." },
  { titulo: "Campaña de reciclaje local", texto: "Participa este fin de semana trayendo materiales de uso personal y gana medallas." }
];

function cargarTienda() {
  const contenedor = document.getElementById('store-container');
  if (!contenedor) return;
  
  contenedor.innerHTML = productosTienda.map(p => `
    <div class="product-card glass-panel" data-category="${p.categoria}">
      <span class="badge category-${p.categoria}">${p.categoria.toUpperCase()}</span>
      <h4>${p.nombre}</h4>
      <p>${p.desc}</p>
      <div class="product-footer">
        <span class="price"><strong>${p.puntos} Puntos</strong></span>
        <button class="aero-btn btn-sm" onclick="canjearProducto('${p.nombre}', ${p.puntos})">Canjear</button>
      </div>
    </div>
  `).join('');
}

function cargarNovedades() {
  const contenedor = document.getElementById('news-full-container');
  if (!contenedor) return;

  contenedor.innerHTML = listaNovedades.map(n => `
    <div class="news-card glass-panel" style="margin-bottom: 1rem; padding: 1rem;">
      <span class="badge" style="background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">Aviso</span>
      <h4 style="margin-top: 0.5rem;">${n.titulo}</h4>
      <p style="margin: 0.3rem 0 0 0; color: #475569;">${n.texto}</p>
    </div>
  `).join('');
}

function canjearProducto(nombreProducto, costoPuntos) {
  const elemPuntos = document.getElementById('user-points');
  if (!elemPuntos) return;

  // Obtener puntos actuales de la pantalla
  let puntosActuales = parseInt(elemPuntos.textContent) || 0;

  // 1. Verificar si el usuario tiene suficientes puntos
  if (puntosActuales < costoPuntos) {
    alert(`❌ No tienes suficientes puntos. Te faltan ${costoPuntos - puntosActuales} Puntos Eco.`);
    return;
  }

  // 2. Restar los puntos
  puntosActuales -= costoPuntos;
  elemPuntos.textContent = puntosActuales;

  // Actualizar barra de nivel con el nuevo saldo menor
  actualizarSistemaDeNivel(puntosActuales);

  // 3. Crear el objeto de la nueva recompensa obtenida
  const nuevaRecompensa = {
    titulo: nombreProducto,
    fecha: new Date().toLocaleDateString(),
    codigo: 'ECO-' + Math.floor(1000 + Math.random() * 9000) // Código único de ejemplo
  };

  // 4. Agregarla visualmente a la lista de "Recompensas Obtenidas"
  const claimedContainer = document.getElementById('claimed-container');
  if (claimedContainer) {
    // Si la lista estaba vacía o tenía un mensaje por defecto, podemos limpiar o agregar al inicio
    const nuevoItemHTML = `
      <div class="claimed-item glass-panel" style="margin-bottom: 0.8rem; padding: 0.8rem; animation: fadeIn 0.5s;">
        <strong>${nuevaRecompensa.titulo}</strong>
        <small style="display: block; color: #666;">Reclamado el: ${nuevaRecompensa.fecha}</small>
        <span class="code-badge" style="background: #e0f2fe; padding: 2px 6px; border-radius: 4px; font-size: 0.85rem;">Código: ${nuevaRecompensa.codigo}</span>
      </div>
    `;
    claimedContainer.innerHTML = nuevoItemHTML + claimedContainer.innerHTML;
  }

  alert(`🎉 ¡Canje exitoso! Has adquirido: ${nombreProducto}. Se han descontado ${costoPuntos} puntos.`);
}


// ==========================================
// 4. LÓGICA DE NIVELES Y MODAL DE EDICIÓN
// ==========================================
const NIVELES = [
  { nombre: 'Eco-Principiante', minPts: 0, maxPts: 499 },
  { nombre: 'Eco-Activo', minPts: 500, maxPts: 999 },
  { nombre: 'Eco-Guardián', minPts: 1000, maxPts: 1999 },
  { nombre: 'Eco-Héroe', minPts: 2000, maxPts: 4999 },
  { nombre: 'Leyenda Verde', minPts: 5000, maxPts: Infinity }
];

function actualizarSistemaDeNivel(puntos) {
  const nivelActual = NIVELES.find(n => puntos >= n.minPts && puntos <= n.maxPts) || NIVELES[0];

  const levelElem = document.getElementById('user-level');
  if (levelElem) levelElem.textContent = nivelActual.nombre;

  const textProgreso = document.getElementById('level-progress-text');
  const barFill = document.getElementById('level-bar-fill');

  if (textProgreso && barFill) {
    if (nivelActual.maxPts === Infinity) {
      textProgreso.textContent = '¡Nivel Máximo Alcanzado!';
      barFill.style.width = '100%';
    } else {
      const puntosEnNivel = puntos - nivelActual.minPts;
      const rangoNivel = nivelActual.maxPts - nivelActual.minPts + 1;
      const porcentaje = Math.min(100, Math.max(0, (puntosEnNivel / rangoNivel) * 100));

      textProgreso.textContent = `${puntos} / ${nivelActual.maxPts + 1} pts para el siguiente nivel`;
      barFill.style.width = `${porcentaje}%`;
    }
  }
}

function abrirModalEdicion() {
  const modal = document.getElementById('modal-edit-profile');
  if (!modal) {
    console.error('No se encontró el modal con id "modal-edit-profile"');
    return;
  }

  const nombreActual = localStorage.getItem('customUserName') || 'Usuario';
  const avatarElem = document.getElementById('user-avatar');
  const avatarActual = localStorage.getItem('customUserAvatar') || (avatarElem ? avatarElem.src : '');

  const inputName = document.getElementById('edit-name');
  const inputAvatar = document.getElementById('edit-avatar');

  if (inputName) inputName.value = nombreActual;
  if (inputAvatar) inputAvatar.value = avatarActual;

  modal.classList.remove('hidden');
}

function cerrarModalEdicion() {
  const modal = document.getElementById('modal-edit-profile');
  if (modal) modal.classList.add('hidden');
}

function guardarPerfil(e) {
  e.preventDefault();
  const nuevoNombre = document.getElementById('edit-name').value;
  const nuevoAvatar = document.getElementById('edit-avatar').value;

  localStorage.setItem('customUserName', nuevoNombre);
  localStorage.setItem('customUserAvatar', nuevoAvatar);

  const nameElem = document.getElementById('user-name');
  const avatarElem = document.getElementById('user-avatar');

  if (nameElem) nameElem.textContent = `¡Hola, ${nuevoNombre}!`;
  if (avatarElem) avatarElem.src = nuevoAvatar;

  cerrarModalEdicion();
}

window.addEventListener('click', (e) => {
  const modal = document.getElementById('modal-edit-profile');
  if (e.target === modal) {
    cerrarModalEdicion();
  }
});


// ==========================================
// 5. MINIJUEGO (ECO-CATCH)
// ==========================================
let canvas, ctx;
let juegoActivo = false;
let puntosPartida = 0;
let animId;

const jugador = {
  x: 260,
  y: 300,
  ancho: 80,
  alto: 35,
  velocidad: 8
};

const teclas = { izquierda: false, derecha: false };

let residuos = [];
const tiposResiduos = [
  { emoji: '🍾', pts: 10, nombre: 'Vidrio' },
  { emoji: '🥤', pts: 5,  nombre: 'Plástico' },
  { emoji: '🥫', pts: 15, nombre: 'Lata' },
  { emoji: '📦', pts: 8,  nombre: 'Cartón' }
];

function inicializarEventosJuego() {
  canvas = document.getElementById('ecoGameCanvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');

  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'a') teclas.izquierda = true;
    if (e.key === 'ArrowRight' || e.key === 'd') teclas.derecha = true;
  });

  window.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft' || e.key === 'a') teclas.izquierda = false;
    if (e.key === 'ArrowRight' || e.key === 'd') teclas.derecha = false;
  });

  canvas.addEventListener('mousemove', e => {
    if (!juegoActivo) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    jugador.x = mouseX - jugador.ancho / 2;
  });
}

function iniciarJuego() {
  if (juegoActivo) return;

  puntosPartida = 0;
  residuos = [];
  juegoActivo = true;
  document.getElementById('game-score-val').textContent = '0';
  document.getElementById('btn-start-game').textContent = 'Jugando...';

  const generador = setInterval(() => {
    if (!juegoActivo) {
      clearInterval(generador);
      return;
    }
    crearResiduo();
  }, 900);

  setTimeout(() => {
    finalizarJuego();
  }, 20000);

  bucleJuego();
}

function crearResiduo() {
  const tipo = tiposResiduos[Math.floor(Math.random() * tiposResiduos.length)];
  residuos.push({
    x: Math.random() * (canvas.width - 30),
    y: -20,
    velocidad: 2 + Math.random() * 2.5,
    emoji: tipo.emoji,
    pts: tipo.pts
  });
}

function bucleJuego() {
  if (!juegoActivo) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (teclas.izquierda && jugador.x > 0) jugador.x -= jugador.velocidad;
  if (teclas.derecha && jugador.x < canvas.width - jugador.ancho) jugador.x += jugador.velocidad;

  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.roundRect(jugador.x, jugador.y, jugador.ancho, jugador.alto, 10);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = '14px sans-serif';
  ctx.fillText('♻️ Casetica', jugador.x + 8, jugador.y + 22);

  for (let i = residuos.length - 1; i >= 0; i--) {
    let r = residuos[i];
    r.y += r.velocidad;

    ctx.font = '24px serif';
    ctx.fillText(r.emoji, r.x, r.y);

    if (
      r.y >= jugador.y - 10 &&
      r.y <= jugador.y + jugador.alto &&
      r.x >= jugador.x - 15 &&
      r.x <= jugador.x + jugador.ancho
    ) {
      puntosPartida += r.pts;
      document.getElementById('game-score-val').textContent = puntosPartida;
      residuos.splice(i, 1);
      continue;
    }

    if (r.y > canvas.height) {
      residuos.splice(i, 1);
    }
  }

  animId = requestAnimationFrame(bucleJuego);
}

function finalizarJuego() {
  juegoActivo = false;
  cancelAnimationFrame(animId);
  document.getElementById('btn-start-game').textContent = '¡Jugar de nuevo!';

  if (puntosPartida > 0) {
    const elemPuntos = document.getElementById('user-points');
    let puntosActuales = parseInt(elemPuntos.textContent) || 0;
    puntosActuales += puntosPartida;
    elemPuntos.textContent = puntosActuales;

    actualizarSistemaDeNivel(puntosActuales);

    alert(`🎉 ¡Tiempo agotado! Recolectaste residuos y ganaste +${puntosPartida} Puntos Eco.`);
  } else {
    alert('¡Tiempo agotado! No lograste recolectar residuos esta vez.');
  }
}
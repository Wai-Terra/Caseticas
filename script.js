document.addEventListener('DOMContentLoaded', () => {
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('caseticas-container');
      data.caseticas.forEach(casetica => {
        container.innerHTML += `
          <div class="casetica-card glass-panel">
            <img src="${casetica.imagen}" alt="${casetica.nombre}" class="casetica-img">
            <span class="status-badge">${casetica.estado}</span>
            <h4>${casetica.nombre}</h4>
            <p>${casetica.descripcion}</p>
          </div>
        `;
      });
    })
    .catch(err => console.error('Error al cargar data.json:', err));
});

function switchTab(type) {
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');

  if (type === 'login') {
    formLogin.classList.remove('hidden');
    formRegister.classList.add('hidden');
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
  } else {
    formLogin.classList.add('hidden');
    formRegister.classList.remove('hidden');
    tabLogin.classList.remove('active');
    tabRegister.classList.add('active');
  }
}

function loginWithGoogle() {
  localStorage.setItem('userLoggedIn', 'true');
  localStorage.setItem('customUserName', 'Usuario de Google');
  alert('Iniciando sesión con tu cuenta de Google...');
  window.location.href = 'dashboard.html';
}

// AQUÍ ESTÁ EL CAMBIO CLAVE PARA CONECTAR CON XAMPP:
async function handleAuth(e, type) {
  e.preventDefault();

  if (type === 'register') {
    // 1. Capturamos los valores de los inputs de tu HTML
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-pass').value;

    try {
      // 2. Enviamos los datos por POST a registro.php mediante fetch
      const response = await fetch('registro.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: name, email: email, password: password })
      });

      const resultado = await response.json();

      if (resultado.success) {
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('customUserName', name);
        alert(resultado.message);
        window.location.href = 'dashboard.html';
      } else {
        alert('Error: ' + resultado.message);
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert('No se pudo conectar con el servidor de XAMPP.');
    }

  } else {
    // Lógica rápida para iniciar sesión normal
    localStorage.setItem('userLoggedIn', 'true');
    window.location.href = 'dashboard.html';
  }
}
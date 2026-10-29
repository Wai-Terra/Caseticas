<?php
// Incluimos la conexión a la base de datos XAMPP (MySQL)
include('conexion.php');

// Consulta opcional para mostrar caseticas dinámicas desde la base de datos si lo deseas
$query_caseticas = "SELECT * FROM caseticas";
$resultado_caseticas = $conn->query($query_caseticas);
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Caseticas EcoReciclables</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <div class="bubble bubble-1"></div>
  <div class="bubble bubble-2"></div>
  <div class="bubble bubble-3"></div>

  <header class="glass-panel header">
    <div class="logo">
      <span class="logo-icon">🌿</span> EcoCaseticas
    </div>
    <nav>
      <a href="#inicio">Inicio</a>
      <a href="#puntos">Puntos de Reciclaje</a>
      <a href="#auth-section" class="aero-btn nav-btn">Acceder</a>
    </nav>
  </header>

  <main class="container">
    
    <section id="inicio" class="hero-section">
      <h2>El Futuro del Reciclaje Inteligente</h2>
      <p class="hero-subtext">
        Las <strong>Caseticas EcoReciclables</strong> son estaciones urbanas interactivas diseñadas para depositar tus residuos de forma automatizada. Acumula puntos por cada botella o paquete depositado y canjéalos por recompensas reales.
      </p>
    </section>

    <section id="puntos" class="glass-panel">
      <h3 class="section-title">Nuestras Caseticas en la Ciudad</h3>
      <div id="caseticas-container" class="grid-caseticas">
        <?php
        // Si tienes caseticas en tu base de datos, se muestran aquí de forma dinámica
        if ($resultado_caseticas && $resultado_caseticas->num_rows > 0) {
            while($c = $resultado_caseticas->fetch_assoc()) {
                echo '<div class="casetica-card glass-panel" style="padding: 1rem; margin-bottom: 0.5rem;">';
                echo '<h4>📍 ' . htmlspecialchars($c['nombre']) . '</h4>';
                echo '<p>' . htmlspecialchars($c['ubicacion']) . '</p>';
                echo '</div>';
            }
        } else {
            echo '<p style="padding: 1rem;">Cargando estaciones de reciclaje...</p>';
        }
        ?>
      </div>
    </section>

    <section id="auth-section" class="glass-panel auth-card">
      
      <button type="button" class="google-btn" onclick="loginWithGoogle()">
        <svg class="google-icon" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        Continuar con Google
      </button>

      <div class="divider"><span>o mediante tu cuenta</span></div>

      <div class="auth-tabs">
        <button id="tab-login" class="tab-btn active" onclick="switchTab('login')">Iniciar Sesión</button>
        <button id="tab-register" class="tab-btn" onclick="switchTab('register')">Registrarse</button>
      </div>

      <!-- Formulario de Inicio de Sesión que conecta con PHP -->
      <form id="form-login" class="auth-form" action="login_backend.php" method="POST">
        <div class="input-group">
          <label for="login-email">Correo Electrónico</label>
          <input type="email" id="login-email" name="email" placeholder="tu@correo.com" required>
        </div>
        <div class="input-group">
          <label for="login-pass">Contraseña</label>
          <input type="password" id="login-pass" name="password" placeholder="••••••••" required>
        </div>
        <button type="submit" class="aero-btn submit-btn">Ingresar a la Plataforma</button>
      </form>

      <!-- Formulario de Registro que conecta con PHP -->
      <form id="form-register" class="auth-form hidden" action="registro_backend.php" method="POST">
        <div class="input-group">
          <label for="reg-name">Nombre Completo</label>
          <input type="text" id="reg-name" name="nombre" placeholder="Nombre y Apellidos" required>
        </div>
        <div class="input-group">
          <label for="reg-email">Correo Electrónico</label>
          <input type="email" id="reg-email" name="email" placeholder="tu@correo.com" required>
        </div>
        <div class="input-group">
          <label for="reg-pass">Contraseña</label>
          <input type="password" id="reg-pass" name="password" placeholder="••••••••" required>
        </div>
        <button type="submit" class="aero-btn submit-btn">Crear Cuenta Eco</button>
      </form>

    </section>

  </main>

  <script src="script.js"></script>
</body>
</html>
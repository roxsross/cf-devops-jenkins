// Mostrar la hora actual
function actualizarHora() {
  var elemento = document.getElementById('current-time');
  if (elemento) {
    var ahora = new Date();
    elemento.textContent = ahora.toLocaleTimeString('es-AR');
  }
}

// Simular contador de deploys
function inicializarContador() {
  var elemento = document.getElementById('deploy-count');
  if (elemento) {
    var count = parseInt(localStorage.getItem('deploy-count') || '0') + 1;
    localStorage.setItem('deploy-count', count.toString());
    elemento.textContent = count;
  }
}

// ⚠️  VULN-1: XSS - innerHTML con input del usuario sin sanitizar
// Detectado por: Semgrep, CodeQL
function mostrarMensaje() {
  var nombre = document.location.hash.substring(1);
  document.getElementById('mensaje').innerHTML = 'Hola, ' + nombre;
}

// ⚠️  VULN-2: Credenciales hardcodeadas
// Detectado por: Betterleaks (secret scanning)
var API_KEY = 'sk-prod-1234567890abcdef';
var DB_PASSWORD = 'admin123';
var AWS_SECRET = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY';

// ⚠️  VULN-3: eval() con input externo
// Detectado por: Semgrep, CodeQL
function ejecutarFiltro() {
  var filtro = new URLSearchParams(window.location.search).get('filtro');
  if (filtro) {
    eval(filtro);
  }
}

// ⚠️  VULN-4: postMessage sin validación de origen
// Detectado por: Semgrep
window.addEventListener('message', function(event) {
  document.getElementById('output').innerHTML = event.data;
});

// Inicializar cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
  actualizarHora();
  inicializarContador();
  mostrarMensaje();
  setInterval(actualizarHora, 1000);
});


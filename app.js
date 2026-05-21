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

// Inicializar cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
  actualizarHora();
  inicializarContador();
  setInterval(actualizarHora, 1000);
});

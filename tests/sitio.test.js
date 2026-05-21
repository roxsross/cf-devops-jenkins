var fs = require('fs');
var path = require('path');

describe('Sitio Web', function() {

  describe('index.html', function() {
    var html;

    beforeAll(function() {
      html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
    });

    test('debería existir el archivo index.html', function() {
      expect(html).toBeDefined();
      expect(html.length).toBeGreaterThan(0);
    });

    test('debería tener el DOCTYPE', function() {
      expect(html).toMatch(/<!DOCTYPE html>/i);
    });

    test('debería tener un título', function() {
      expect(html).toMatch(/<title>.+<\/title>/);
    });

    test('debería incluir el CSS', function() {
      expect(html).toContain('styles.css');
    });

    test('debería incluir el JavaScript', function() {
      expect(html).toContain('app.js');
    });

    test('debería tener la sección de stats', function() {
      expect(html).toContain('id="stats"');
    });

    test('debería tener meta viewport para responsive', function() {
      expect(html).toContain('viewport');
    });

    test('debería tener lang="es"', function() {
      expect(html).toContain('lang="es"');
    });
  });

  describe('styles.css', function() {
    var css;

    beforeAll(function() {
      css = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
    });

    test('debería existir el archivo styles.css', function() {
      expect(css).toBeDefined();
      expect(css.length).toBeGreaterThan(0);
    });

    test('debería tener estilos para el body', function() {
      expect(css).toContain('body');
    });
  });

  describe('app.js', function() {
    var js;

    beforeAll(function() {
      js = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
    });

    test('debería existir el archivo app.js', function() {
      expect(js).toBeDefined();
      expect(js.length).toBeGreaterThan(0);
    });

    test('debería tener la función actualizarHora', function() {
      expect(js).toContain('actualizarHora');
    });

    test('debería tener un event listener para DOMContentLoaded', function() {
      expect(js).toContain('DOMContentLoaded');
    });
  });

  describe('Archivos requeridos', function() {
    var archivosRequeridos = ['index.html', 'styles.css', 'app.js'];

    archivosRequeridos.forEach(function(archivo) {
      test('debería existir ' + archivo, function() {
        var existe = fs.existsSync(path.join(__dirname, '..', archivo));
        expect(existe).toBe(true);
      });
    });
  });
});

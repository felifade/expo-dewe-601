#!/usr/bin/env node

/**
 * GENERADOR DE PREVIEWS AUTOMÁTICO
 * Captura screenshots de cada proyecto de alumno y los guarda como preview.png
 *
 * Uso:
 *   node generate-previews.js
 *
 * O para regenerar solo un alumno:
 *   node generate-previews.js "nombre-alumno"
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:8888'; // Cambiar si es necesario
const ALUMNOS_JSON = path.join(__dirname, 'data', 'alumnos.json');
const PREVIEW_WIDTH = 1200;
const PREVIEW_HEIGHT = 400;

async function generatePreviews() {
  const args = process.argv.slice(2);
  const filterNombre = args[0] ? args[0].toLowerCase() : null;

  // Leer lista de alumnos
  let alumnos = [];
  try {
    const data = fs.readFileSync(ALUMNOS_JSON, 'utf8');
    alumnos = JSON.parse(data);
  } catch (err) {
    console.error('❌ Error leyendo alumnos.json:', err.message);
    process.exit(1);
  }

  // Filtrar si se proporciona nombre
  if (filterNombre) {
    alumnos = alumnos.filter(a => a.nombre.toLowerCase().includes(filterNombre));
    if (alumnos.length === 0) {
      console.warn(`⚠️  No se encontró alumno con "${filterNombre}"`);
      process.exit(0);
    }
  }

  console.log(`📸 Generando ${alumnos.length} preview(s)...\n`);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    let successCount = 0;
    let errorCount = 0;

    for (const alumno of alumnos) {
      try {
        const projectUrl = `${BASE_URL}/${alumno.ruta}`;
        const folderPath = path.join(__dirname, alumno.ruta.substring(0, alumno.ruta.lastIndexOf('/')));
        const previewPath = path.join(folderPath, 'preview.png');

        // Crear carpeta si no existe
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
        }

        const page = await browser.newPage();
        await page.setViewport({ width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT });

        // Navegar con timeout
        await Promise.race([
          page.goto(projectUrl, { waitUntil: 'networkidle0' }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 15000)
          ),
        ]);

        // Capturar screenshot
        await page.screenshot({
          path: previewPath,
          type: 'png',
          fullPage: false,
          optimizeForSpeed: true,
        });

        await page.close();

        console.log(`✅ ${alumno.nombre}`);
        successCount++;
      } catch (err) {
        console.log(`❌ ${alumno.nombre} — ${err.message}`);
        errorCount++;
      }
    }

    await browser.close();

    console.log(`\n📊 Resultado: ${successCount} exitosos, ${errorCount} errores`);
    if (errorCount > 0) {
      console.log('💡 Consejos:');
      console.log('   • Verifica que el servidor esté corriendo en http://localhost:8888');
      console.log('   • Algunos sitios pueden necesitar más tiempo de carga');
      console.log('   • Reinicia el servidor si hay problemas de conexión');
    }
  } catch (err) {
    console.error('❌ Error fatal:', err.message);
    if (browser) await browser.close();
    process.exit(1);
  }
}

generatePreviews();

# 📸 Generador Automático de Previews

Este proyecto incluye un sistema automático para capturar screenshots de cada proyecto de alumno y mostrarlos como previsualizaciones en la galería.

## ¿Qué es un Preview?

Un **preview** es una captura de pantalla (1200×400px) del sitio web de cada alumno que se muestra en la tarjeta de la galería para dar una vista rápida del proyecto.

## 🚀 Cómo Usar

### Opción 1: Script Automático (Recomendado)

```bash
cd /ruta/a/expo-dewe-601
bash generate-all-previews.sh
```

Este script:
- ✅ Inicia un servidor local automáticamente
- ✅ Captura screenshots de todos los proyectos
- ✅ Detiene el servidor cuando termina
- ✅ Muestra un resumen de resultados

### Opción 2: Generar Preview de un Alumno Específico

```bash
bash generate-all-previews.sh "nombre-alumno"
```

Ejemplo:
```bash
bash generate-all-previews.sh "galdino"
```

### Opción 3: Manual (Si el script falla)

```bash
# Terminal 1: Inicia servidor
python3 -m http.server 8888

# Terminal 2: Ejecuta el generador
node generate-previews.js
```

## 📋 Requisitos

- **Node.js** (v14+) — Ya instalado ✅
- **Puppeteer** — Instalado automáticamente
- **Python 3** — Para el servidor local

## 🔍 Verificar Resultados

Después de ejecutar, verifica que se crearon los previews:

```bash
ls -la alumnos/*/preview.png | wc -l
```

Debería mostrar el número de previews generados (hasta 36).

## ⚙️ Solucionar Problemas

### "Error: Timeout" o "ECONNREFUSED"
- Verifica que el servidor esté corriendo en `http://localhost:8888`
- Aumenta el timeout en `generate-previews.js` (línea con `setTimeout`)

### "Algunos previews están en blanco"
- Es normal si el sitio tiene contenido dinámico (JavaScript)
- El generador espera a que cargue completamente (`networkidle0`)

### "Preview no se ve en la galería"
- Recarga la página del navegador (Cmd+Shift+R en Mac)
- Limpia la caché del navegador
- Verifica que el archivo `preview.png` exista en `alumnos/[nombre]/`

## 📊 Estadísticas

- **Dimensión**: 1200×400 píxeles (16:5 aspect ratio)
- **Formato**: PNG optimizado
- **Tiempo por sitio**: ~2-5 segundos (depende del sitio)
- **Tiempo total**: ~3-5 minutos para 36 alumnos

## 🎨 Personalización

Para cambiar las dimensiones, edita `generate-previews.js`:

```javascript
const PREVIEW_WIDTH = 1200;   // Ancho en píxeles
const PREVIEW_HEIGHT = 400;   // Alto en píxeles
```

## 🔄 Regenerar Todos los Previews

Para actualizar todos los previews (p.ej., después de que actualicen sus sitios):

```bash
bash generate-all-previews.sh
```

Solo sobrescribe los previews existentes.

## 💡 Tips

- Ejecuta el generador regularmente (p.ej., al final de cada semana)
- Los previews se cachean — los navegadores pueden mostrar versiones antiguas
- Si necesitas ver cambios inmediatamente, abre el DevTools (F12) → Network → "Disable cache"

---

¿Preguntas? Revisa `generate-previews.js` para más detalles técnicos.

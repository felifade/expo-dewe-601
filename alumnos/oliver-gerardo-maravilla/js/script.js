// Mi primer código de JavaScript - Proyecto Timbre Inteligente
// Autor: Oliver Gerardo Maravilla Zúñiga
// Fecha: 8 de junio de 2026

console.log("✅ Script ejecutado correctamente");
console.log("🔔 Proyecto Timbre Inteligente");
console.log("Autor: Oliver Gerardo Maravilla Zúñiga");
console.log("Fecha: 8 de junio de 2026");

// Mostrar mensaje de bienvenida
alert("🔔 Bienvenido al Sistema de Timbre Inteligente 🔔");

// Pedir nombre del visitante
let visitante = prompt("Ingrese su nombre:");

// Simulación de inicio del sistema
console.log("══════════════════════════════");
console.log("🔌 Encendiendo sistema...");
console.log("📡 Verificando conexión...");
console.log("✅ Sistema operativo.");
console.log("══════════════════════════════");

// Mensaje personalizado
console.log("👋 Bienvenido, " + visitante);
console.log("🔔 El sistema de timbre está listo para funcionar.");

// Simulación de detección de visitante
console.log("📷 Activando sensor de movimiento...");
console.log("🚶 Visitante detectado.");
console.log("📸 Capturando imagen...");
console.log("🔔 Timbre activado.");
console.log("✅ Notificación enviada al propietario.");

// Alerta de visitante
alert("🚪 Hay una persona en la puerta.");

// Información del sistema
console.log("══════════════════════════════");
console.log("🔔 INFORMACIÓN DEL TIMBRE");
console.log("══════════════════════════════");
console.log("🔋 Batería: 95%");
console.log("📶 Señal WiFi: Excelente");
console.log("📷 Cámara: Activa");
console.log("🔊 Bocina: Operativa");
console.log("💡 Luz LED: Encendida");
console.log("══════════════════════════════");

// Preguntar acción al usuario
let accion = prompt(
  "¿Qué deseas hacer?\n1. Abrir puerta\n2. Ver cámara\n3. Activar alarma"
);

// Mostrar selección
console.log("👉 Opción seleccionada: " + accion);

// Simulación de acciones
console.log("══════════════════════════════");
console.log("⚙️ EJECUTANDO ACCIÓN");
console.log("══════════════════════════════");

if (accion == "1") {
    console.log("🚪 Puerta desbloqueada.");
}
else if (accion == "2") {
    console.log("📷 Mostrando cámara en tiempo real.");
}
else if (accion == "3") {
    console.log("🚨 Alarma activada.");
}
else {
    console.log("❌ Opción no válida.");
}

console.log("══════════════════════════════");
console.log("📋 REGISTRO DEL SISTEMA");
console.log("══════════════════════════════");
console.log("🕒 Hora registrada.");
console.log("👤 Visitante identificado.");
console.log("🔔 Evento almacenado correctamente.");
console.log("✅ Sistema funcionando sin errores.");
console.log("══════════════════════════════");

// Cambiar el título del navegador
document.title = "🔔 Timbre Inteligente Activo";
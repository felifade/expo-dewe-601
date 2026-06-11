//══════════════════════════════════════════════════════
// PROYECTO: TIMBRE INTELIGENTE
// Autor: Oliver Gerardo Maravilla Zúñiga
// Fecha: 8 de junio de 2026
// Descripción:
// Sistema de timbre inteligente con detección de visitantes,
// cámara de seguridad, sensores y registro de eventos.
//══════════════════════════════════════════════════════

console.log("══════════════════════════════════════");
console.log("🔔 TIMBRE INTELIGENTE INICIANDO");
console.log("══════════════════════════════════════");

console.log("👨‍💻 Autor: Oliver Gerardo Maravilla Zúñiga");
console.log("📅 Fecha: 8 de junio de 2026");
console.log("🖥️ Versión del sistema: 1.0");
console.log("📡 Estado: Operativo");

alert("🔔 Bienvenido al Sistema de Timbre Inteligente 🔔");

// Solicitar nombre del visitante
let visitante = prompt("Ingrese el nombre del visitante:");

// Inicio del sistema
console.log("");
console.log("⚙️ Iniciando componentes...");
console.log("🔌 Fuente de energía conectada.");
console.log("📡 Conectando a la red WiFi...");
console.log("✅ Conexión establecida.");
console.log("📷 Cámara activada.");
console.log("🎤 Micrófono activado.");
console.log("🔊 Altavoz activado.");
console.log("💡 Luces LED encendidas.");
console.log("🔒 Sistema de seguridad habilitado.");
console.log("✅ Todos los dispositivos funcionando correctamente.");

// Información del visitante
console.log("");
console.log("══════════════════════════════════════");
console.log("👤 DATOS DEL VISITANTE");
console.log("══════════════════════════════════════");
console.log("Nombre: " + visitante);
console.log("🚶 Estado: Visitante detectado");
console.log("📸 Captura de imagen realizada");
console.log("🕒 Hora registrada correctamente");

// Simulación de llamada
console.log("");
console.log("🔔 Timbre presionado...");
console.log("📡 Enviando notificación al propietario...");
console.log("📱 Notificación enviada al teléfono móvil.");
console.log("📨 Mensaje recibido correctamente.");
console.log("✅ Comunicación establecida.");

// Estado de sensores
console.log("");
console.log("══════════════════════════════════════");
console.log("📊 ESTADO DE SENSORES");
console.log("══════════════════════════════════════");
console.log("🚶 Sensor de movimiento: ACTIVO");
console.log("📷 Cámara de vigilancia: ACTIVA");
console.log("🌡️ Sensor de temperatura: 25°C");
console.log("💡 Sensor de luz: FUNCIONANDO");
console.log("📶 Intensidad WiFi: EXCELENTE");
console.log("🔋 Batería del sistema: 98%");
console.log("⚡ Consumo energético: NORMAL");

// Menú de opciones
console.log("");
console.log("══════════════════════════════════════");
console.log("🎛️ PANEL DE CONTROL");
console.log("══════════════════════════════════════");
console.log("1️⃣ Abrir puerta");
console.log("2️⃣ Ver cámara");
console.log("3️⃣ Activar alarma");
console.log("4️⃣ Encender luz exterior");
console.log("5️⃣ Registrar visitante");

let opcion = prompt(
"Seleccione una opción:\n" +
"1. Abrir puerta\n" +
"2. Ver cámara\n" +
"3. Activar alarma\n" +
"4. Encender luz exterior\n" +
"5. Registrar visitante"
);

// Acciones del sistema
if(opcion == "1"){
    console.log("🚪 Cerradura electrónica activada.");
    console.log("🔓 Puerta abierta correctamente.");
}
else if(opcion == "2"){
    console.log("📷 Mostrando transmisión en vivo...");
    console.log("👤 Visitante visible en pantalla.");
}
else if(opcion == "3"){
    console.log("🚨 Alarma activada.");
    console.log("🔊 Sirena encendida.");
    console.log("📱 Notificación de emergencia enviada.");
}
else if(opcion == "4"){
    console.log("💡 Luz exterior encendida.");
    console.log("🌙 Área iluminada correctamente.");
}
else if(opcion == "5"){
    console.log("📝 Registrando visitante...");
    console.log("👤 Nombre guardado: " + visitante);
    console.log("💾 Registro almacenado correctamente.");
}
else{
    console.log("❌ Opción no válida.");
}

// Historial del sistema
console.log("");
console.log("══════════════════════════════════════");
console.log("📋 HISTORIAL DE EVENTOS");
console.log("══════════════════════════════════════");
console.log("✔ Sistema iniciado.");
console.log("✔ Visitante detectado.");
console.log("✔ Imagen capturada.");
console.log("✔ Timbre activado.");
console.log("✔ Notificación enviada.");
console.log("✔ Evento registrado.");
console.log("✔ Operación finalizada correctamente.");

// Resumen final
console.log("");
console.log("══════════════════════════════════════");
console.log("📈 RESUMEN DEL SISTEMA");
console.log("══════════════════════════════════════");
console.log("🔔 Estado del timbre: ACTIVO");
console.log("📷 Cámara: OPERATIVA");
console.log("📡 WiFi: CONECTADO");
console.log("🔋 Batería: 98%");
console.log("🔒 Seguridad: HABILITADA");
console.log("✅ Sistema funcionando correctamente.");

// Mensaje final
alert("✅ Operación completada correctamente.");

// Cambiar título de la página
document.title = "🔔 Timbre Inteligente Operativo";
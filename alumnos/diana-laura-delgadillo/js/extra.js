// ============================
// SECCIÓN EXTRA — ESTRELLITAS
// ============================

const mensajes = [
    "🌸 ¡Gracias por visitar mi página!",
    "💖 El esfuerzo siempre vale la pena.",
    "✨ Cada día aprendes algo nuevo.",
    "🎀 El Modelo Dual fue una experiencia increíble.",
    "🌟 ¡Tú también puedes lograrlo!",
    "📻 RTH me dejó muchos aprendizajes.",
    "💻 La informática es mi pasión.",
    "🤝 Gracias a todos los que me apoyaron.",
    "🌸 El trabajo en equipo hace la diferencia.",
    "💌 ¡Mucho éxito en tu experiencia Dual!",
    "⭐ Cada pequeño logro cuenta muchísimo.",
    "🎶 ¡Sigue adelante, tú puedes! 💪",
];

const estrellasExtra = document.querySelectorAll(".estrella-extra");
const mensajeEstrella = document.getElementById("mensajeEstrella");
let ultimoMensaje = -1;

estrellasExtra.forEach(function (estrella) {

    // Al hacer click en una estrella
    estrella.addEventListener("click", function () {

        // Animación en la estrella clickeada
        estrella.classList.add("estrella-clickeada");
        setTimeout(function () {
            estrella.classList.remove("estrella-clickeada");
        }, 600);

        // Mensaje aleatorio que no repita el anterior
        let numero;
        do {
            numero = Math.floor(Math.random() * mensajes.length);
        } while (numero === ultimoMensaje && mensajes.length > 1);
        ultimoMensaje = numero;

        // Mostrar mensaje con animación
        mensajeEstrella.classList.remove("mensaje-visible");
        mensajeEstrella.textContent = "";

        setTimeout(function () {
            mensajeEstrella.textContent = mensajes[numero];
            mensajeEstrella.classList.add("mensaje-visible");
        }, 100);

    });

    // Al pasar el cursor por encima
    estrella.addEventListener("mouseenter", function () {
        estrella.classList.add("estrella-hover");
    });

    estrella.addEventListener("mouseleave", function () {
        estrella.classList.remove("estrella-hover");
    });

});
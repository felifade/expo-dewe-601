// ============================
// DATOS CURIOSOS
// ============================

const datos = [
    "🌸 Realicé un total de 1001 horas dentro del Modelo Dual.",
    "💖 Aprendí procesos relacionados con Recursos Humanos.",
    "📂 Participé en el registro y control de documentación.",
    "✨ Conocí el funcionamiento de una institución pública.",
    "📻 Mi experiencia fue en Radio y Televisión de Hidalgo.",
    "🌟 Fortalecí habilidades de organización y responsabilidad.",
    "💻 Aprendí sobre digitalización y gestión documental.",
    "🎀 Cumplí jornadas de 8 horas diarias de lunes a jueves.",
    "🤝 Colaboré con equipos de distintas áreas de la institución.",
];

const boton = document.getElementById("btnDato");
const texto = document.getElementById("dato");
let ultimoIndex = -1;

boton.addEventListener("click", function () {

    // Que no repita el mismo dato dos veces seguidas
    let numero;
    do {
        numero = Math.floor(Math.random() * datos.length);
    } while (numero === ultimoIndex && datos.length > 1);
    ultimoIndex = numero;

    // Animación: quitar clase, esperar, poner dato y volver a animar
    texto.classList.remove("visible");
    texto.textContent = "";

    setTimeout(function () {
        texto.textContent = datos[numero];
        texto.classList.add("visible");
    }, 80);

});

// ============================
// GALERÍA INTERACTIVA
// ============================

const imagenes = document.querySelectorAll(".galeria img");

imagenes.forEach(function (imagen) {

    imagen.addEventListener("click", function () {
        window.open(imagen.src, "_blank");
    });

});
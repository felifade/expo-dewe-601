// ============================
// ESTRELLAS FLOTANTES
// ============================

const contenedor = document.getElementById("estrellas");
const totalEstrellas = 35;
const estrellas = [];

// Símbolos de estrellas variados
const simbolos = ["✦", "✧", "⋆", "★", "✩"];

// Crear estrellas
for (let i = 0; i < totalEstrellas; i++) {

    const estrella = document.createElement("span");
    estrella.classList.add("estrella");

    // Símbolo aleatorio
    estrella.textContent = simbolos[
        Math.floor(Math.random() * simbolos.length)
    ];

    // Posición aleatoria en toda la pantalla
    estrella.style.left = Math.random() * 100 + "vw";
    estrella.style.top  = Math.random() * 100 + "vh";

    // Tamaño aleatorio
    const tamaño = 0.5 + Math.random() * 0.9;
    estrella.style.fontSize = tamaño + "rem";

    // Color aleatorio entre rosa y azul de la paleta
    const colores = ["#feabc5", "#b5cdff", "#ffd4e1", "#dae8ff"];
    estrella.style.color = colores[
        Math.floor(Math.random() * colores.length)
    ];

    // Retraso de animación aleatorio
    estrella.style.animationDelay = Math.random() * 4 + "s";

    contenedor.appendChild(estrella);
    estrellas.push(estrella);

}

// Hacer que las estrellas huyan del cursor
document.addEventListener("mousemove", function (e) {

    const cursorX = e.clientX;
    const cursorY = e.clientY;
    const distanciaHuida = 130;

    estrellas.forEach(function (estrella) {

        const rect = estrella.getBoundingClientRect();
        const estrellaX = rect.left + rect.width  / 2;
        const estrellaY = rect.top  + rect.height / 2;

        const dx = estrellaX - cursorX;
        const dy = estrellaY - cursorY;
        const distancia = Math.sqrt(dx * dx + dy * dy);

        if (distancia < distanciaHuida) {

            const fuerza = (distanciaHuida - distancia) / distanciaHuida;
            const moverX = (dx / distancia) * fuerza * 90;
            const moverY = (dy / distancia) * fuerza * 90;

            estrella.style.transform =
                "translate(" + moverX + "px, " + moverY + "px)";
            estrella.classList.add("huyendo");

        } else {

            estrella.style.transform = "translate(0, 0)";
            estrella.classList.remove("huyendo");

        }

    });

});
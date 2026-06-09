// ============================
// MODO PASTEL NOCTURNO
// ============================

const botonModo = document.getElementById("modoOscuro");
let oscuro = false;

// Recuerda tu preferencia aunque recargues la página
const preferencia = localStorage.getItem("modo-oscuro");
if (preferencia === "true") {
    activarModoOscuro();
}

botonModo.addEventListener("click", function () {

    if (!oscuro) {
        activarModoOscuro();
        localStorage.setItem("modo-oscuro", "true");
    } else {
        desactivarModoOscuro();
        localStorage.setItem("modo-oscuro", "false");
    }

});

function activarModoOscuro() {
    document.body.classList.add("modo-oscuro");
    botonModo.textContent = "☀️ Modo Claro";
    oscuro = true;
}

function desactivarModoOscuro() {
    document.body.classList.remove("modo-oscuro");
    botonModo.textContent = "🌙 Modo Pastel Nocturno";
    oscuro = false;
}
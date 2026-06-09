// ============================
// VENTANA DE BIENVENIDA
// ============================

const modal = document.getElementById("modalBienvenida");
const btnEntrar = document.getElementById("btnEntrar");

// Animación suave al cerrar
btnEntrar.addEventListener("click", function () {

    modal.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    modal.style.opacity = "0";
    modal.style.transform = "scale(0.95)";

    setTimeout(function () {
        modal.style.display = "none";
    }, 400);

});
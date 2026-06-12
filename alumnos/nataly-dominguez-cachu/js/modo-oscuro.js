document.addEventListener("DOMContentLoaded", () => {
    const boton = document.getElementById("modo-btn");

    boton.addEventListener("click", () => {
        document.body.classList.toggle("modo-oscuro");

        boton.textContent =
            document.body.classList.contains("modo-oscuro")
            ? "☀️"
            : "🌙";
    });
});
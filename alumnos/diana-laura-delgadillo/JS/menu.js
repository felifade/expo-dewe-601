// ============================
// BARRA DE PROGRESO
// ============================

window.addEventListener("scroll", function () {

    let alturaPagina =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    let avance =
        (window.scrollY / alturaPagina) * 100;

    document.getElementById("barraProgreso")
        .style.width = avance + "%";

    resaltarSeccionActiva();

});

// ============================
// ENLACE ACTIVO EN MENÚ
// ============================

function resaltarSeccionActiva() {

    const secciones = document.querySelectorAll("section[id]");
    const enlaces = document.querySelectorAll("nav a");

    secciones.forEach(function (seccion) {

        const rect = seccion.getBoundingClientRect();
        const id = seccion.getAttribute("id");

        if (rect.top <= 120 && rect.bottom >= 120) {

            enlaces.forEach(function (a) {
                a.classList.remove("activo");

                if (a.getAttribute("href") === "#" + id) {
                    a.classList.add("activo");
                }
            });
        }
    });
}
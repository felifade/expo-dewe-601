function cambiarTema() {

    document.body.classList.toggle("oscuro");

    let boton = document.getElementById("tema-btn");

    if (document.body.classList.contains("oscuro")) {
        boton.innerHTML = "Modo Claro";
    } else {
        boton.innerHTML = "Modo Oscuro";
    }

}
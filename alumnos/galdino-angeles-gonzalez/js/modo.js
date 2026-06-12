const boton = document.getElementById("toggleModo");

boton.addEventListener("click", () => {

    if(document.body.classList.contains("modo-oscuro")){

        document.body.classList.remove("modo-oscuro");
        document.body.classList.add("modo-claro");

        boton.textContent = "🌙 Modo Oscuro";

    } else {

        document.body.classList.remove("modo-claro");
        document.body.classList.add("modo-oscuro");

        boton.textContent = "☀️ Modo Claro";

    }

});
// Digital Bell System
// Autor: Itzel Guadalupe Montiel Castro

console.log("Sistema iniciado correctamente");

/* MODO CLARO / OSCURO */

const boton = document.getElementById("modo-btn");

if(boton){

    boton.addEventListener("click",()=>{

        document.body.classList.toggle("claro");

        if(document.body.classList.contains("claro")){
            boton.innerHTML="☀️ Modo Claro";
        }else{
            boton.innerHTML="🌙 Modo Oscuro";
        }

    });

}

/* REGISTRO DE CONTACTO */

const formulario = document.getElementById("formulario");

if(formulario){

    formulario.addEventListener("submit",function(e){

        e.preventDefault();

        let empleado = document.getElementById("nombre").value;
        let venta = document.getElementById("venta").value;
        let cliente = document.getElementById("cliente").value;
        let informacion = document.getElementById("mensaje").value;

        document.getElementById("resultado").innerHTML =

        "<div class='tarjeta'>" +
        "<h3>✅ Registro Guardado</h3>" +
        "<p><strong>Empleado:</strong> " + empleado + "</p>" +
        "<p><strong>Venta:</strong> " + venta + "</p>" +
        "<p><strong>Cliente:</strong> " + cliente + "</p>" +
        "<p><strong>Información:</strong> " + informacion + "</p>" +
        "</div>";

        formulario.reset();

    });

}

/* SELECCIÓN DE PAQUETES */

function seleccionarPaquete(paquete){

    document.getElementById("resultado").innerHTML =

    "<div class='tarjeta'>" +
    "<h2>📦 Paquete Seleccionado</h2>" +
    "<p>Has seleccionado el paquete <strong>" +
    paquete +
    "</strong>.</p>" +
    "</div>";

}
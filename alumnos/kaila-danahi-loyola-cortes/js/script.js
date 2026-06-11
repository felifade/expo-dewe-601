const boton=document.getElementById("modo-btn");

boton.addEventListener("click",()=>{

document.body.classList.toggle("oscuro");

if(document.body.classList.contains("oscuro")){
boton.innerHTML="🌙 Modo Oscuro";
}else{
boton.innerHTML="☀️ Modo Claro";
}

});

const estado=document.getElementById("estado");

document.getElementById("activar").onclick=()=>{
estado.innerHTML="Estado: Timbre Activado";
}

document.getElementById("detener").onclick=()=>{
estado.innerHTML="Estado: Timbre Detenido";
}

function reloj(){
const fecha=new Date();

let h=fecha.getHours();
let m=fecha.getMinutes();
let s=fecha.getSeconds();

document.getElementById("reloj").innerHTML=
`${h}:${m}:${s}`;
}

setInterval(reloj,1000);

function mostrar(id){

let cajas=document.querySelectorAll(".info-box");

cajas.forEach(caja=>{
caja.classList.add("oculto");
});

document.getElementById(id).classList.remove("oculto");

}
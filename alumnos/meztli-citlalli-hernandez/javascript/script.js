
const boton=document.getElementById('modo');
boton.addEventListener('click',()=>{
document.body.classList.toggle('oscuro');
boton.textContent=document.body.classList.contains('oscuro')
?'☀️ Modo Claro':'🌙 Modo Oscuro';
});

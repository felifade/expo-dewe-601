// Sistema de Timbre Escolar Programado - DEWE Semana 13
//1. Guardar los elementos en variables
const btnAlarma = document.querySelector('#btn-alarma');
const btnCalma = document.querySelector('#btn-calma');
const estado = document.querySelector('#estado');

//2. Conectar el Boton MODO CLARO al evento click
btnAlarma.addEventListener('click', function() {
     document.body.style.backgroundColor = '#e5e7eb';
     estado.textContent = 'Estado: 🌞 Modo Claro';
     estado.style.color = '#161224';
});

//3. Conectar el boton MODO OSCURO al evento click
btnCalma.addEventListener('click', function() {
     document.body.style.background = '#161224';
     estado.textContent = 'Estado: 🌙 Modo Oscuro';
     estado.style.color = '#a78bfa';
});

console.log('Sistema de Timbre Escolar Cargado');
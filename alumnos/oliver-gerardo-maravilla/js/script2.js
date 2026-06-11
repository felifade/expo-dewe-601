// sistema de alarma - DEWE semana 13

// 1. Guardar los elementos en variables
const btnAlarma = document.querySelector('#btn-alarma');
const btnCalma = document.querySelector('#btn-calma');
const estado = document.querySelector('#estado');

// 2. Conectar el botón alarma al evento click
btnAlarma.addEventListener('click', function() {
    document.body.style.backgroundColor = 'red';
    estado.textContent = 'Estado: 🚫 PELIGRO INMINENTE';
    estado.style.color = 'white';
});

// 3. Conectar el botón calma al evento click
btnCalma.addEventListener('click', function() {
    document.body.style.backgroundColor = 'white';
    estado.textContent = 'Estado: ✅ Tranquilo';
    estado.style.color = 'black';
});

console.log('Sistema de Alarma Cargado');
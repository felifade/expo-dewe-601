// 1. Variable principal
let vida = 100;

// 2. Capturar elementos
const numVida = document.querySelector('#num-vida');
const barraFill = document.querySelector('#barra-fill');
const gameOver = document.querySelector('#game-over');
const btnCurar = document.querySelector('#btn-curar');
const btnDanio = document.querySelector('#btn-danio');
const btnReset = document.querySelector('#btn-reset');

// 3. Función que actualiza la pantalla
function actualizar() {

    // Limitar entre 0 y 100
    if (vida < 0) vida = 0;
    if (vida > 100) vida = 100;

    // Mostrar número
    numVida.textContent = vida;

    // Actualizar barra
    barraFill.style.width = vida + '%';

    // Color según vida
    if (vida > 60) {
        barraFill.style.background = '#3fb950';
    } else if (vida > 30) {
        barraFill.style.background = '#d29922';
    } else {
        barraFill.style.background = '#f85149';
    }

    // Game Over
    if (vida === 0) {
        gameOver.textContent = '💀 GAME OVER';
    } else {
        gameOver.textContent = '';
    }
}

// 4. Conectar botones
btnCurar.addEventListener('click', function () {
    vida += 10;
    actualizar();
});

btnDanio.addEventListener('click', function () {
    vida -= 15;
    actualizar();
});

btnReset.addEventListener('click', function () {
    vida = 100;
    actualizar();
});

// 5. Estado inicial
actualizar();

















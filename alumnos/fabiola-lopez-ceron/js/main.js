// main.js
// Se ejecuta cuando carga toda la página
document.addEventListener('DOMContentLoaded', () => {
    console.log('Sitio cargado correctamente');
    
    // 1. Menú hamburguesa para móvil
    const botonMenu = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if(botonMenu) {
        botonMenu.addEventListener('click', () => {
            navLinks.classList.toggle('activo');
        });
    }

    // 2. Scroll suave al dar clic en el menú
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // 3. Botón "copiar código" 
    const botonCopiar = document.querySelector('.btn-copiar');
    if(botonCopiar) {
        botonCopiar.addEventListener('click', () => {
            const codigo = document.querySelector('pre code').innerText;
            navigator.clipboard.writeText(codigo);
            botonCopiar.innerText = '¡Copiado!';
            setTimeout(() => botonCopiar.innerText = 'Copiar código', 2000);
        });
    }
});
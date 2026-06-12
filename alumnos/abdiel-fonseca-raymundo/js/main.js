document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================
    // 1. FASE 3: SCROLL REVEAL AVANZADO (Cascada)
    // =========================================
    // Seleccionamos todo lo que queremos que tenga la animación
    const elementosAAnimar = document.querySelectorAll('.bento-card, .skill-card, .section-title, .hero-text, .gallery-item-box, .profile-section');
    
    // Les agregamos la clase 'reveal' para prepararlos (ocultarlos)
    elementosAAnimar.forEach(el => {
        el.classList.add('reveal');
    });

    // Configuramos el vigilante (Observer)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Si el elemento ya entró en la pantalla del usuario
            if (entry.isIntersecting) {
                entry.target.classList.add('active'); // ¡Dispara la animación!
                observer.unobserve(entry.target); // Deja de vigilarlo para ahorrar memoria
            }
        });
    }, {
        threshold: 0.1, // Aparece cuando el 10% de la tarjeta es visible
        rootMargin: "0px 0px -50px 0px" // Le da un pequeño margen de respiro
    });

    // Ponemos a vigilar a todos los elementos seleccionados
    elementosAAnimar.forEach(el => {
        observer.observe(el);
    });

    // =========================================
    // 2. EFECTO 3D TILT (Inclinación Glassmorphic)
    // =========================================
    const cards = document.querySelectorAll('.skill-card, .bento-card'); // Se lo agregamos también a las bento-cards
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculamos los grados de inclinación
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            
            // Mantenemos la transformación base que tiene el CSS del hover, y sumamos el 3D
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) scale(1.02)`;
        });

        // Cuando el mouse sale, la tarjeta vuelve a la normalidad
        card.addEventListener('mouseleave', () => {
            card.style.transform = ''; // Al vaciarlo, el CSS de tu archivo toma el control suavemente
        });
    });

    // =========================================
    // 3. TRANSICIONES SUAVES ENTRE PÁGINAS
    // =========================================
    const links = document.querySelectorAll('.premium-nav a');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Ignorar el botón de "Descargar CV", modo claro o links con #
            if (this.target === '_blank' || this.getAttribute('href').startsWith('#') || this.classList.contains('theme-toggle')) return;
            
            e.preventDefault(); // Detenemos el salto brusco
            const targetUrl = this.href;
            
            // Añadimos el efecto de desvanecimiento
            document.body.classList.add('fade-out');
            
            // Esperamos a que termine la animación (400ms) y cambiamos de página
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 400);
        });
    });

    // =========================================
    // 4. MODO CLARO / OSCURO (Lógica LocalStorage)
    // =========================================
    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) {
        // Revisar si ya había elegido un tema antes en otra página
        if(localStorage.getItem('theme') === 'light') {
            document.body.classList.add('light-mode');
            themeBtn.textContent = 'Modo Oscuro';
        }

        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            if (document.body.classList.contains('light-mode')) {
                themeBtn.textContent = 'Modo Oscuro';
                localStorage.setItem('theme', 'light'); // Guarda la preferencia
            } else {
                themeBtn.textContent = 'Modo Claro';
                localStorage.setItem('theme', 'dark'); // Guarda la preferencia
            }
        });
    }

});
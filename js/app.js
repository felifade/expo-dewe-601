/**
 * APPLICATION CORE: GALERÍA DE PROYECTOS DEWE 601 (CONALEP Pachuca II)
 * Controls fetching, offline fallback, rendering, theme toggling, and project iframe viewport.
 */

document.addEventListener('DOMContentLoaded', () => {
    // App State
    let projectsData = [];
    let searchQuery = '';

    // DOM Elements
    const projectsContainer = document.getElementById('projects-grid');
    const searchInput = document.getElementById('search-input');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const totalProjectsEl = document.getElementById('stat-total-projects');
    const regularProjectsEl = document.getElementById('stat-regular-projects');
    const dualProjectsEl = document.getElementById('stat-dual-projects');
    
    // Modal Elements
    const modalBackdrop = document.getElementById('project-modal');
    const modalIframe = document.getElementById('modal-iframe');
    const modalTitle = document.getElementById('modal-title-text');
    const modalAuthor = document.getElementById('modal-author-text');
    const modalNewTabBtn = document.getElementById('modal-new-tab-btn');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const iframeLoader = document.getElementById('iframe-loader');

    // ==========================================================================
    // THEME MANAGEMENT (Light / Dark)
    // ==========================================================================
    
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        const theme = savedTheme || 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        updateThemeIcon(theme);
    };

    const toggleTheme = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    };

    const updateThemeIcon = (theme) => {
        if (theme === 'dark') {
            themeToggleBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.38.39-1.02 0-1.41zM7.05 18.01l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.02-.39-1.41 0z"/>
                </svg>
            `;
            themeToggleBtn.setAttribute('title', 'Cambiar a Modo Claro');
        } else {
            themeToggleBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12.3 22h-.1c-5.5 0-10-4.5-10-10 0-4.8 3.5-8.9 8.2-9.8.6-.1 1.2.3 1.3.9.1.6-.3 1.2-.9 1.3-3.7.7-6.4 4-6.4 7.8 0 4.4 3.6 8 8 8 3.8 0 7.1-2.7 7.8-6.4.1-.6.7-1 1.3-.9.6.1 1 .7.9 1.3-.9 4.7-5 8.2-9.8 8.2-.3.1-.3.1-.3.1z"/>
                </svg>
            `;
            themeToggleBtn.setAttribute('title', 'Cambiar a Modo Oscuro');
        }
    };

    themeToggleBtn.addEventListener('click', toggleTheme);
    initTheme();

    // ==========================================================================
    // DATA FETCHING, FALLBACK & INITIALIZATION
    // ==========================================================================
    
    // Fallback static database representing 36 students in alphabetical order by first surname
    const FALLBACK_PROJECTS = [
        {
                "nombre": "Galdino Angeles González",
                "ruta": "alumnos/galdino-angeles-gonzalez/index.html",
                "modalidad": "No Dual"
        },
        {
                "nombre": "Gala Sofía Barrero Landaverde",
                "ruta": "alumnos/gala-sofia-barrero-landaverde/index.html",
                "modalidad": "No Dual"
        },
        {
                "nombre": "Axel Daniel Chávez",
                "ruta": "alumnos/axel-daniel-chavez/index.html",
                "modalidad": "No Dual"
        },
        {
                "nombre": "Maira Alejandra Cruz Morales",
                "ruta": "alumnos/maira-alejandra-cruz-morales/index.html",
                "modalidad": "No Dual"
        },
        {
                "nombre": "Nataly Dominguez Cachú",
                "ruta": "alumnos/nataly-dominguez-cachu/index.html",
                "modalidad": "No Dual"
        },
        {
                "nombre": "Moises Gonzales Castillo",
                "ruta": "alumnos/moises-gonzales-castillo/index.html",
                "modalidad": "No Dual"
        },
        {
                "nombre": "Diana Sarahi Hernández Cruz",
                "ruta": "alumnos/diana-sarahi-hernandez-cruz/index.html",
                "modalidad": "No Dual"
        },
        {
                "nombre": "Jesús Alejandro Hernández",
                "ruta": "alumnos/jesus-alejandro-hernandez/index.html",
                "modalidad": "No Dual"
        },
        {
                "nombre": "Meztli Citlalli Hernández",
                "ruta": "alumnos/meztli-citlalli-hernandez/index.html",
                "modalidad": "No Dual"
        },
        {
                "nombre": "Uriel Hidalgo Cervantes",
                "ruta": "alumnos/uriel-hidalgo-cervantes/index.html",
                "modalidad": "No Dual"
        },
        {
                "nombre": "María Cristina Islas Mercado",
                "ruta": "alumnos/maria-cristina-islas-mercado/index.html",
                "modalidad": "No Dual"
        },
        {
                "nombre": "Santiago Jimenez Sombra",
                "ruta": "alumnos/santiago-jimenez-sombra/index.html",
                "modalidad": "No Dual"
        },
        {
                "nombre": "Fabiola Lopez Ceron",
                "ruta": "alumnos/fabiola-lopez-ceron/index.html",
                "modalidad": "No Dual"
        },
        {
                "nombre": "Rafael López Sánchez",
                "ruta": "alumnos/rafael-lopez-sanchez/index.html",
                "modalidad": "No Dual"
        },
        {
                "nombre": "Rubí Esmeralda Lorenzo",
                "ruta": "alumnos/rubi-esmeralda-lorenzo/index.html",
                "modalidad": "No Dual"
        },
        {
                "nombre": "Kaila Danahi Loyola Cortés",
                "ruta": "alumnos/kaila-danahi-loyola-cortes/index.html",
                "modalidad": "No Dual"
        },
        {
                "nombre": "Oliver Gerardo Maravilla",
                "ruta": "alumnos/oliver-gerardo-maravilla/index.html",
                "modalidad": "No Dual"
        },
        {
                "nombre": "Lucio Alejandro Martínez",
                "ruta": "alumnos/lucio-alejandro-martinez/index.html",
                "modalidad": "No Dual"
        },
        {
                "nombre": "Jared Martinez Santiago",
                "ruta": "alumnos/jared-martinez-santiago/index.html",
                "modalidad": "No Dual"
        },
        {
                "nombre": "Irvin Ariel Máximo Paredes",
                "ruta": "alumnos/irvin-ariel-maximo-paredes/index.html",
                "modalidad": "No Dual"
        },
        {
                "nombre": "Itzel Guadalupe Montiel",
                "ruta": "alumnos/itzel-guadalupe-montiel/index.html",
                "modalidad": "No Dual"
        },
        {
                "nombre": "Michel Guadalupe Rodríguez",
                "ruta": "alumnos/michel-guadalupe-rodriguez/index.html",
                "modalidad": "No Dual"
        },
        {
                "nombre": "Paola Abigail Trejo Pérez",
                "ruta": "alumnos/paola-abigail-trejo-perez/index.html",
                "modalidad": "No Dual"
        },
        {
                "nombre": "Víctor Manuel Arroyo Chávez",
                "ruta": "alumnos/victor-manuel-arroyo-chavez/index.html",
                "modalidad": "Dual"
        },
        {
                "nombre": "Diana Laura Delgadillo",
                "ruta": "alumnos/diana-laura-delgadillo/index.html",
                "modalidad": "Dual"
        },
        {
                "nombre": "Enrique Flores Landgrave R.",
                "ruta": "alumnos/enrique-flores-landgrave-r/index.html",
                "modalidad": "Dual"
        },
        {
                "nombre": "Abdiel Fonseca Raymundo",
                "ruta": "alumnos/abdiel-fonseca-raymundo/index.html",
                "modalidad": "Dual"
        },
        {
                "nombre": "Josué Manuel Gómez",
                "ruta": "alumnos/josue-manuel-gomez/index.html",
                "modalidad": "Dual"
        },
        {
                "nombre": "Obed Isai Hernández Morales",
                "ruta": "alumnos/obed-isai-hernandez-morales/index.html",
                "modalidad": "Dual"
        },
        {
                "nombre": "Fabian Adair Hernández Sánchez",
                "ruta": "alumnos/fabian-adair-hernandez-sanchez/index.html",
                "modalidad": "Dual"
        },
        {
                "nombre": "Alexander Lara Lugo",
                "ruta": "alumnos/alexander-lara-lugo/index.html",
                "modalidad": "Dual"
        },
        {
                "nombre": "Ronaldo Axel Lara Lugo",
                "ruta": "alumnos/ronaldo-axel-lara-lugo/index.html",
                "modalidad": "Dual"
        },
        {
                "nombre": "David Ben Emanuel Mercado",
                "ruta": "alumnos/david-ben-emanuel-mercado/index.html",
                "modalidad": "Dual"
        },
        {
                "nombre": "Alexander Reyes Martínez",
                "ruta": "alumnos/alexander-reyes-martinez/index.html",
                "modalidad": "Dual"
        },
        {
                "nombre": "Yael Adonai Uribe González",
                "ruta": "alumnos/yael-adonai-uribe-gonzalez/index.html",
                "modalidad": "Dual"
        },
        {
                "nombre": "Carlos Hugo Vargas Sumano",
                "ruta": "alumnos/carlos-hugo-vargas-sumano/index.html",
                "modalidad": "Dual"
        }
];

    const showLocalNoticeAlert = () => {
        const alertDiv = document.createElement('div');
        alertDiv.style.position = 'fixed';
        alertDiv.style.bottom = '20px';
        alertDiv.style.left = '50%';
        alertDiv.style.transform = 'translateX(-50%)';
        alertDiv.style.backgroundColor = 'rgba(217, 119, 6, 0.95)';
        alertDiv.style.color = '#ffffff';
        alertDiv.style.padding = '12px 24px';
        alertDiv.style.borderRadius = '30px';
        alertDiv.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
        alertDiv.style.fontSize = '0.85rem';
        alertDiv.style.fontWeight = '600';
        alertDiv.style.zIndex = '999';
        alertDiv.style.textAlign = 'center';
        alertDiv.style.backdropFilter = 'blur(5px)';
        alertDiv.style.border = '1px solid rgba(255,255,255,0.2)';
        alertDiv.style.transition = 'opacity 0.5s ease-out';
        alertDiv.innerHTML = `
            <span>⚠️ Modo Local: Cargando base de datos de respaldo (CORS del navegador evitado).</span>
            <button style="background:none; border:none; color:white; font-weight:bold; margin-left:12px; cursor:pointer;" onclick="this.parentElement.remove()">✕</button>
        `;
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.style.opacity = '0';
            setTimeout(() => alertDiv.remove(), 500);
        }, 8000);
    };
    
    const fetchProjects = async () => {
        try {
            const response = await fetch('data/alumnos.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            projectsData = await response.json();
            console.log("Base de datos de alumnos cargada desde data/alumnos.json");
        } catch (error) {
            console.warn(
                "Restricción de seguridad detectada o archivo ausente. Cargando datos locales integrados.",
                error
            );
            showLocalNoticeAlert();
            projectsData = FALLBACK_PROJECTS;
        }
            
        // Standardize format
        projectsData = projectsData.map(p => ({
            nombre: p.nombre || 'Estudiante Anónimo',
            ruta: p.ruta || '#',
            modalidad: p.modalidad || 'No Dual'
        }));

        initStats();
        renderProjects();
    };

    // Initialize statistics counters in the hero banner
    const initStats = () => {
        const total = projectsData.length;
        const regularCount = projectsData.filter(p => p.modalidad === 'No Dual').length;
        const dualCount = projectsData.filter(p => p.modalidad === 'Dual').length;

        animateCounter(totalProjectsEl, total);
        animateCounter(regularProjectsEl, regularCount);
        animateCounter(dualProjectsEl, dualCount);
    };

    const animateCounter = (element, targetValue) => {
        let currentValue = 0;
        const duration = 800; // ms
        const steps = 20;
        const increment = targetValue / steps;
        const stepTime = duration / steps;

        if (targetValue === 0) {
            element.textContent = '0';
            return;
        }

        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                element.textContent = targetValue;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(currentValue);
            }
        }, stepTime);
    };

    // ==========================================================================
    // RENDER LOGIC (Partitioned in No Dual and Dual sections)
    // ==========================================================================

    const renderProjects = () => {
        projectsContainer.innerHTML = '';

        // Filter projects by search query
        const filtered = projectsData.filter(project => {
            const query = searchQuery.toLowerCase().trim();
            return query === '' || project.nombre.toLowerCase().includes(query);
        });

        if (filtered.length === 0) {
            renderEmptyState();
            return;
        }

        // Split into modality groups (alphabetical sorting is preserved)
        const noDualProjects = filtered.filter(p => p.modalidad === 'No Dual');
        const dualProjects = filtered.filter(p => p.modalidad === 'Dual');

        // Render "No Dual" Section
        if (noDualProjects.length > 0) {
            const header = document.createElement('h2');
            header.className = 'modality-header';
            header.innerHTML = `Estudiantes Regulares (No Dual) <span class="modality-count">${noDualProjects.length}</span>`;
            projectsContainer.appendChild(header);

            const subgrid = document.createElement('div');
            subgrid.className = 'projects-subgrid';
            noDualProjects.forEach(project => {
                const card = createProjectCard(project);
                subgrid.appendChild(card);
            });
            projectsContainer.appendChild(subgrid);
        }

        // Render "Dual" Section
        if (dualProjects.length > 0) {
            const header = document.createElement('h2');
            header.className = 'modality-header section-dual';
            header.innerHTML = `Formación Dual <span class="modality-count count-dual">${dualProjects.length}</span>`;
            projectsContainer.appendChild(header);

            const subgrid = document.createElement('div');
            subgrid.className = 'projects-subgrid';
            dualProjects.forEach(project => {
                const card = createProjectCard(project);
                subgrid.appendChild(card);
            });
            projectsContainer.appendChild(subgrid);
        }
    };

    const createProjectCard = (project) => {
        const card = document.createElement('article');
        card.className = 'project-card';

        // Prepare modality badge classes
        const modClass = project.modalidad === 'Dual' ? 'badge-e-commerce' : 'badge-portafolio';

        card.innerHTML = `
            <div class="card-browser-header">
                <div class="browser-dots">
                    <span class="dot red"></span>
                    <span class="dot yellow"></span>
                    <span class="dot green"></span>
                </div>
                <span class="browser-category-badge ${modClass}">${project.modalidad}</span>
            </div>
            <div class="card-body">
                <!-- Name of the student as main Title -->
                <h3 class="project-title" style="margin-bottom: 12px; min-height: 48px; display: flex; align-items: center;">${project.nombre}</h3>
                <div class="student-author" style="margin-bottom: 24px;">
                    <svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    <span>Grupo 601 • CONALEP Pachuca II</span>
                </div>
                <button class="btn-view-project" aria-label="Acceder al sitio de ${project.nombre}">
                    <span>Acceder al Sitio</span>
                    <svg viewBox="0 0 24 24" width="16" height="16"><path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42L16.86 11H5v2z"/></svg>
                </button>
            </div>
        `;

        const btn = card.querySelector('.btn-view-project');
        btn.addEventListener('click', () => openProjectModal(project));

        return card;
    };

    const renderEmptyState = () => {
        projectsContainer.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <h3>No se encontraron alumnos</h3>
                <p>Intenta buscar por otro nombre o verifica que esté bien escrito.</p>
            </div>
        `;
    };

    // ==========================================================================
    // MODAL CONTROL (Integrated Iframe Viewer)
    // ==========================================================================

    const openProjectModal = (project) => {
        modalTitle.textContent = `Sitio Web de Alumno`;
        modalAuthor.textContent = `Desarrollador: ${project.nombre} | Grupo 601`;
        modalNewTabBtn.setAttribute('href', project.ruta);
        
        iframeLoader.style.opacity = '1';
        iframeLoader.style.display = 'flex';
        modalIframe.src = project.ruta;
        
        modalIframe.onload = () => {
            iframeLoader.style.opacity = '0';
            setTimeout(() => {
                iframeLoader.style.display = 'none';
            }, 300);
        };

        modalBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
        modalCloseBtn.focus();
    };

    const closeProjectModal = () => {
        modalBackdrop.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            modalIframe.src = 'about:blank';
        }, 400);
    };

    modalCloseBtn.addEventListener('click', closeProjectModal);
    
    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
            closeProjectModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
            closeProjectModal();
        }
    });

    // ==========================================================================
    // SEARCH INPUT LISTENER
    // ==========================================================================
    
    let searchDebounceTimer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchDebounceTimer);
        searchQuery = e.target.value;
        
        searchDebounceTimer = setTimeout(() => {
            renderProjects();
        }, 150);
    });

    fetchProjects();
});

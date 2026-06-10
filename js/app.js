/**
 * APPLICATION CORE: GALERÍA DE PROYECTOS DEWE 601 (CONALEP Pachuca II)
 * Controls fetching, offline fallback, rendering, theme toggling, and project iframe viewport.
 */

document.addEventListener('DOMContentLoaded', () => {
    // App State
    let projectsData = [];
    let searchQuery = '';
    let activeModalityFilter = 'all';
    let activeGradeFilter = 'all';  // 'all', 'entregados' (10), 'pendientes' (0)
    const projectGrades = new Map();  // Store grades for each project

    // DOM Elements
    const projectsContainer = document.getElementById('projects-grid');
    const searchInput = document.getElementById('search-input');
    const filterButtons = document.querySelectorAll('.filter-btn');
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

    // Search Palette Elements
    const searchPalette = document.getElementById('search-palette');
    const paletteSearchInput = document.getElementById('palette-search-input');
    const paletteResults = document.getElementById('palette-results');
    let paletteFocusIndex = -1;

    // Showcase Mode Elements
    const showcaseMode = document.getElementById('showcase-mode');
    const showcaseBtn = document.getElementById('showcase-btn');
    const showcaseExit = document.getElementById('showcase-exit');
    const showcasePrev = document.getElementById('showcase-prev');
    const showcaseNext = document.getElementById('showcase-next');
    const showcaseIframe = document.getElementById('showcase-iframe');
    const showcaseName = document.getElementById('showcase-name');
    const showcaseMeta = document.getElementById('showcase-meta');
    const showcaseCurrent = document.getElementById('showcase-current');
    const showcaseTotal = document.getElementById('showcase-total');
    let showcaseIndex = 0;
    let showcaseProjects = [];

    // ==========================================================================
    // THEME MANAGEMENT (Light / Dark)
    // ==========================================================================
    
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        const theme = savedTheme || 'light';
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
    // MODALITY FILTER CONTROL
    // ==========================================================================

    // Handle modality and grade filters
    const allFilterButtons = document.querySelectorAll('[data-filter]');
    allFilterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filterType = e.currentTarget.getAttribute('data-filter-type');
            const filter = e.currentTarget.getAttribute('data-filter');

            if (filterType === 'modality') {
                activeModalityFilter = filter;
                // Only deactivate other modality buttons
                allFilterButtons.forEach(b => {
                    if (b.getAttribute('data-filter-type') === 'modality') {
                        b.classList.remove('active');
                    }
                });
            } else if (filterType === 'grade') {
                activeGradeFilter = filter;
                // Only deactivate other grade buttons
                allFilterButtons.forEach(b => {
                    if (b.getAttribute('data-filter-type') === 'grade') {
                        b.classList.remove('active');
                    }
                });
            }

            e.currentTarget.classList.add('active');
            renderProjects();
        });
    });

    // ==========================================================================
    // SEARCH PALETTE (Ctrl+K Command Palette)
    // ==========================================================================

    const openSearchPalette = () => {
        searchPalette.setAttribute('open', '');
        paletteSearchInput.focus();
        paletteFocusIndex = -1;
        renderPaletteResults('');
    };

    const closeSearchPalette = () => {
        searchPalette.removeAttribute('open');
        paletteSearchInput.value = '';
        paletteFocusIndex = -1;
    };

    const renderPaletteResults = (query) => {
        const filtered = projectsData.filter(p =>
            query === '' || p.nombre.toLowerCase().includes(query.toLowerCase())
        );

        paletteResults.innerHTML = '';

        if (filtered.length === 0 && query !== '') {
            paletteResults.innerHTML = '<div class="palette-no-results">No se encontraron alumnos</div>';
            return;
        }

        filtered.slice(0, 10).forEach((project, idx) => {
            const item = document.createElement('div');
            item.className = 'palette-result-item';
            item.innerHTML = `
                <div class="palette-result-name">${project.nombre}</div>
                <span class="palette-result-badge">${project.modalidad}</span>
            `;
            item.addEventListener('click', () => {
                openProjectModal(project);
                closeSearchPalette();
            });
            paletteResults.appendChild(item);
        });

        paletteFocusIndex = -1;
    };

    paletteSearchInput.addEventListener('input', (e) => {
        renderPaletteResults(e.target.value);
    });

    paletteSearchInput.addEventListener('keydown', (e) => {
        const items = paletteResults.querySelectorAll('.palette-result-item');

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            paletteFocusIndex = Math.min(paletteFocusIndex + 1, items.length - 1);
            updatePaletteFocus(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            paletteFocusIndex = Math.max(paletteFocusIndex - 1, -1);
            updatePaletteFocus(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (paletteFocusIndex >= 0 && items[paletteFocusIndex]) {
                items[paletteFocusIndex].click();
            }
        } else if (e.key === 'Escape') {
            closeSearchPalette();
        }
    });

    const updatePaletteFocus = (items) => {
        items.forEach((item, idx) => {
            item.classList.toggle('selected', idx === paletteFocusIndex);
        });
        if (paletteFocusIndex >= 0 && items[paletteFocusIndex]) {
            items[paletteFocusIndex].scrollIntoView({ block: 'nearest' });
        }
    };

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (searchPalette.hasAttribute('open')) {
                closeSearchPalette();
            } else {
                openSearchPalette();
            }
        }
    });

    searchPalette.addEventListener('click', (e) => {
        if (e.target === searchPalette) {
            closeSearchPalette();
        }
    });

    // ==========================================================================
    // SHOWCASE MODE (Full-screen presentation)
    // ==========================================================================

    const enterShowcase = () => {
        showcaseProjects = projectsData;
        showcaseIndex = 0;
        showcaseTotal.textContent = showcaseProjects.length;
        showShowcaseProject(0);
        showcaseMode.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const exitShowcase = () => {
        showcaseMode.classList.remove('active');
        document.body.style.overflow = '';
        showcaseIframe.src = 'about:blank';
    };

    const showShowcaseProject = (index) => {
        if (index < 0 || index >= showcaseProjects.length) return;

        showcaseIndex = index;
        const project = showcaseProjects[index];

        showcaseName.textContent = project.nombre;
        showcaseMeta.textContent = `Grupo 601 • ${project.modalidad}`;
        showcaseCurrent.textContent = index + 1;
        showcaseIframe.src = project.ruta;
    };

    showcaseBtn.addEventListener('click', enterShowcase);
    showcaseExit.addEventListener('click', exitShowcase);

    showcasePrev.addEventListener('click', () => {
        if (showcaseIndex > 0) {
            showShowcaseProject(showcaseIndex - 1);
        }
    });

    showcaseNext.addEventListener('click', () => {
        if (showcaseIndex < showcaseProjects.length - 1) {
            showShowcaseProject(showcaseIndex + 1);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (showcaseMode.classList.contains('active')) {
            if (e.key === 'Escape') {
                exitShowcase();
            } else if (e.key === 'ArrowLeft') {
                showcasePrev.click();
            } else if (e.key === 'ArrowRight') {
                showcaseNext.click();
            }
        } else if (e.key === 's' || e.key === 'S') {
            enterShowcase();
        }
    });

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

        // Filter projects by search query, modality, and grade
        const filtered = projectsData.filter(project => {
            const query = searchQuery.toLowerCase().trim();
            const matchesSearch = query === '' || project.nombre.toLowerCase().includes(query);
            const matchesModality = activeModalityFilter === 'all' || project.modalidad === activeModalityFilter;

            // Filter by grade if needed
            let matchesGrade = true;
            if (activeGradeFilter === 'entregados') {
                matchesGrade = projectGrades.get(project.nombre) === 10;
            } else if (activeGradeFilter === 'pendientes') {
                matchesGrade = projectGrades.get(project.nombre) === 0;
            }

            return matchesSearch && matchesModality && matchesGrade;
        });

        if (filtered.length === 0) {
            renderEmptyState();
            return;
        }

        // Split into modality groups (alphabetical sorting is preserved)
        const noDualProjects = filtered.filter(p => p.modalidad === 'No Dual');
        const dualProjects = filtered.filter(p => p.modalidad === 'Dual');

        let cardIndex = 0;

        // Render "No Dual" Section
        if (noDualProjects.length > 0) {
            const header = document.createElement('h2');
            header.className = 'modality-header';
            header.innerHTML = `Estudiantes Regulares (No Dual) <span class="modality-count">${noDualProjects.length}</span>`;
            projectsContainer.appendChild(header);

            const subgrid = document.createElement('div');
            subgrid.className = 'projects-subgrid';
            noDualProjects.forEach(project => {
                const card = createProjectCard(project, cardIndex++);
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
                const card = createProjectCard(project, cardIndex++);
                subgrid.appendChild(card);
            });
            projectsContainer.appendChild(subgrid);
        }
    };

    // Read grade from pre-calculated field in alumnos.json
    // (GitHub Pages does not support directory listing, so runtime folder-checking via fetch always returns 404)
    const getProjectGrade = (project) => {
        return project.calificacion !== undefined ? project.calificacion : 0;
    };

    const createProjectCard = (project, index) => {
        const card = document.createElement('article');
        card.className = 'project-card';

        // Prepare modality badge classes
        const modClass = project.modalidad === 'Dual' ? 'badge-e-commerce' : 'badge-portafolio';

        // Extract folder path for preview image
        const folderPath = project.ruta.substring(0, project.ruta.lastIndexOf('/'));
        const previewImagePath = `${folderPath}/preview.png`;

        // Use index as unique ID (safer than name with spaces)
        const cardId = `card-${index}`;

        const grade = getProjectGrade(project);
        projectGrades.set(project.nombre, grade);
        const pillClass = grade === 10 ? 'complete' : 'incomplete';
        const pillText = grade === 10 ? 'Entregado' : 'Pendiente';

        card.innerHTML = `
            <div class="card-browser-header">
                <div class="browser-dots">
                    <span class="dot red"></span>
                    <span class="dot yellow"></span>
                    <span class="dot green"></span>
                </div>
                <span class="browser-category-badge ${modClass}">${project.modalidad}</span>
            </div>
            <img class="card-preview-image" src="${previewImagePath}" alt="Vista previa del sitio de ${project.nombre}" onerror="this.style.display='none'">
            <div class="card-body">
                <h3 class="project-title" style="margin-bottom: 8px; min-height: 48px; display: flex; align-items: center;">${project.nombre}</h3>
                <span class="card-status-pill ${pillClass}">${pillText}</span>
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

        // Lazy load: only load iframe when modal is opened
        if (!modalIframe.src || modalIframe.src === 'about:blank') {
            modalIframe.src = project.ruta;
        }

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

    // ==========================================================================
    // TABS MANAGEMENT
    // ==========================================================================

    const tabBtns = document.querySelectorAll('.tab-btn');
    const galleryView = document.getElementById('gallery-view');
    const gradesView = document.getElementById('grades-view');
    const galleryControls = document.getElementById('gallery-controls');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');

            // Update active tab
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show/hide views
            if (tab === 'gallery') {
                galleryView.style.display = 'block';
                gradesView.style.display = 'none';
                galleryControls.style.display = 'block';
            } else if (tab === 'grades') {
                galleryView.style.display = 'none';
                gradesView.style.display = 'block';
                galleryControls.style.display = 'none';
                renderGradesTable();
            }
        });
    });

    // Render grades table
    const renderGradesTable = () => {
        const tbody = document.getElementById('grades-tbody');
        tbody.innerHTML = '';

        // Create array of students with grades
        const studentsWithGrades = projectsData.map(project => ({
            nombre: project.nombre,
            modalidad: project.modalidad,
            grade: project.calificacion !== undefined ? project.calificacion : 0
        }));

        // Sort alphabetically by default
        studentsWithGrades.sort((a, b) => a.nombre.localeCompare(b.nombre));

        // Render rows
        studentsWithGrades.forEach(student => {
            const row = document.createElement('tr');
            const gradeClass = student.grade === 10 ? 'complete' : 'incomplete';

            row.innerHTML = `
                <td><strong>${student.nombre}</strong></td>
                <td>${student.modalidad}</td>
                <td class="grade-cell ${gradeClass}">
                    <span class="grade-badge-small ${gradeClass}">${student.grade}</span>
                    <span>${student.grade}/10</span>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Add sorting functionality
        const sortHeaders = document.querySelectorAll('.grades-table th.sortable');
        sortHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const sortBy = header.getAttribute('data-sort');
                sortGradesTable(sortBy);
            });
        });
    };

    const sortGradesTable = (sortBy) => {
        const tbody = document.getElementById('grades-tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));

        rows.sort((a, b) => {
            if (sortBy === 'nombre') {
                return a.cells[0].textContent.localeCompare(b.cells[0].textContent);
            } else if (sortBy === 'grade') {
                const gradeA = parseInt(a.cells[2].textContent);
                const gradeB = parseInt(b.cells[2].textContent);
                return gradeB - gradeA; // Descendente (10 primero)
            }
        });

        rows.forEach(row => tbody.appendChild(row));
    };

    fetchProjects();
});

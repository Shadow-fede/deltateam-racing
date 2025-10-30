document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    // Rilevamento tipo dispositivo e orientamento
    function detectDeviceAndOrientation() {
        const isDesktop = window.innerWidth >= 1025;
        const isVerticalMonitor = isDesktop && window.innerHeight < window.innerWidth;
        const isPortrait = window.innerHeight > window.innerWidth;

        // Aggiungi classi al body per targeting CSS
        document.body.classList.toggle('desktop', isDesktop);
        document.body.classList.toggle('vertical-monitor', isVerticalMonitor);
        document.body.classList.toggle('portrait-mode', isPortrait);
        document.body.classList.toggle('landscape-mode', !isPortrait);

        console.log('Device Detection:', {
            width: window.innerWidth,
            height: window.innerHeight,
            isDesktop,
            isVerticalMonitor,
            isPortrait
        });
    }

    // Gestione layout per monitor verticali PC
    function handleVerticalMonitorLayout() {
        const isVerticalPC = window.innerWidth >= 1025 && window.innerHeight <= 800;

        if (isVerticalPC) {
            // Ottimizzazioni specifiche per monitor verticali PC
            const header = document.querySelector('header');
            const main = document.querySelector('main');
            const footer = document.querySelector('footer');
            const image = document.querySelector('main img');

            // Header più compatto
            if (header) {
                header.style.padding = '0.8rem 1.5rem';
            }

            // Main ottimizzato per altezza ridotta
            if (main) {
                main.style.minHeight = 'calc(100vh - 120px)';
                main.style.display = 'flex';
                main.style.alignItems = 'center';
                main.style.justifyContent = 'center';
            }

            // Immagine ottimizzata
            if (image) {
                image.style.maxHeight = '65vh';
                image.style.objectFit = 'contain';
            }

            // Footer compatto
            if (footer) {
                footer.style.padding = '0.8rem 1.5rem';
            }
        }
    }

    // Gestione desktop layout
    function handleDesktopLayout() {
        if (window.innerWidth >= 1025) {
            mobileMenu.style.display = 'none';
            navLinks.style.display = 'flex';

            // Aggiungi effetti desktop solo se non è un monitor verticale
            if (window.innerHeight > 800) {
                // Smooth hover effects per desktop
                const navLinks = document.querySelectorAll('.nav-links a');
                navLinks.forEach(link => {
                    link.addEventListener('mouseenter', function() {
                        this.style.transition = 'all 0.3s ease';
                    });
                });
            }
        } else {
            mobileMenu.style.display = 'flex';
            navLinks.style.display = window.innerWidth <= 768 ? 'none' : 'flex';
        }
    }

    // Toggle mobile menu
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navLinks.classList.toggle('active');
                mobileMenu.classList.toggle('active');

                if (navLinks.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            }
        });
    }

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768) {
            const isClickInsideNav = navLinks.contains(event.target) || mobileMenu.contains(event.target);
            if (!isClickInsideNav && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // Back to top functionality
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Gestione ottimizzazione immagini
    function optimizeImageForDevice() {
        const mainImage = document.querySelector('main img');
        if (!mainImage) return;

        const isVerticalPC = window.innerWidth >= 1025 && window.innerHeight <= 800;
        const isMobile = window.innerWidth <= 480;

        if (isVerticalPC) {
            mainImage.style.maxWidth = '60%';
            mainImage.style.maxHeight = '65vh';
            mainImage.style.objectFit = 'contain';
        } else if (isMobile) {
            mainImage.style.maxHeight = '60vh';
            mainImage.style.objectFit = 'contain';
        } else {
            mainImage.style.maxHeight = '';
            mainImage.style.objectFit = '';

            // Dimensioni desktop normali
            if (window.innerWidth >= 1920) {
                mainImage.style.maxWidth = '50%';
            } else if (window.innerWidth >= 1400) {
                mainImage.style.maxWidth = '60%';
            } else if (window.innerWidth >= 1025) {
                mainImage.style.maxWidth = '70%';
            } else {
                mainImage.style.maxWidth = '';
            }
        }
    }

    // Event listeners per resize e orientation change
    function setupEventListeners() {
        window.addEventListener('resize', function() {
            detectDeviceAndOrientation();
            handleDesktopLayout();
            handleVerticalMonitorLayout();
            optimizeImageForDevice();

            // Close mobile menu when resizing to desktop
            if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        window.addEventListener('orientationchange', function() {
            setTimeout(() => {
                detectDeviceAndOrientation();
                handleVerticalMonitorLayout();
                optimizeImageForDevice();
            }, 100);
        });
    }

    // Inizializzazione
    function initialize() {
        detectDeviceAndOrientation();
        handleDesktopLayout();
        handleVerticalMonitorLayout();
        optimizeImageForDevice();
        setupEventListeners();

        // Inizializza l'immagine
        const mainImage = document.querySelector('main img');
        if (mainImage) {
            mainImage.style.opacity = '0';
            mainImage.style.transition = 'opacity 0.3s ease';
            mainImage.addEventListener('load', function() {
                this.style.opacity = '1';
            });
        }
    }

    // Scroll effect per header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (header && window.scrollY > 100) {
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.2)';
        } else if (header) {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    });

    // Avvia tutto
    setTimeout(initialize, 100);
    window.addEventListener('load', initialize);
});
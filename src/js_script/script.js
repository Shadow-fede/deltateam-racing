const ResponsiveHandler = (function() {
    // === CACHE ELEMENTI DOM ===
    const elements = {
        mobileMenu: null,
        navLinks: null,
        header: null,
        main: null,
        footer: null,
        mainImage: null,
        backToTop: null
    };

    // === UTILITÀ ===
    const utils = {
        isDesktop: () => window.innerWidth >= 1025,
        isVerticalPC: () => window.innerWidth >= 1025 && window.innerHeight <= 800,
        isMobile: () => window.innerWidth <= 768,
        isPortrait: () => window.innerHeight > window.innerWidth,

        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        }
    };

    // === INIZIALIZZAZIONE ELEMENTI ===
    function cacheElements() {
        elements.mobileMenu = document.getElementById('mobile-menu');
        elements.navLinks = document.querySelector('.nav-links');
        elements.header = document.querySelector('header');
        elements.main = document.querySelector('main');
        elements.footer = document.querySelector('footer');
        elements.mainImage = document.querySelector('main img');
        elements.backToTop = document.getElementById('back-to-top');
    }

    // === DEVICE DETECTION ===
    function updateBodyClasses() {
        const { isDesktop, isVerticalPC, isPortrait } = utils;

        document.body.classList.toggle('desktop', isDesktop());
        document.body.classList.toggle('vertical-monitor', isVerticalPC());
        document.body.classList.toggle('portrait-mode', isPortrait());
        document.body.classList.toggle('landscape-mode', !isPortrait());
    }

    // === LAYOUT HANDLERS ===
    function handleDesktopLayout() {
        if (!utils.isDesktop() || !elements.mobileMenu) return;

        elements.mobileMenu.style.display = 'none';
        if (elements.navLinks) {
            elements.navLinks.style.display = 'flex';
        }
    }

    function handleMobileLayout() {
        if (utils.isDesktop() || !elements.mobileMenu) return;

        elements.mobileMenu.style.display = 'flex';
        if (elements.navLinks) {
            elements.navLinks.style.display = utils.isMobile() ? 'none' : 'flex';
        }
    }

    function optimizeImage() {
        if (!elements.mainImage) return;

        const { isVerticalPC, isMobile, isDesktop } = utils;
        const img = elements.mainImage;

        // Reset stili
        img.style.maxWidth = '';
        img.style.maxHeight = '';
        img.style.objectFit = '';

        if (isVerticalPC()) {
            img.style.maxWidth = '60%';
            img.style.maxHeight = '65vh';
            img.style.objectFit = 'contain';
        } else if (isMobile()) {
            img.style.maxHeight = '60vh';
            img.style.objectFit = 'contain';
        } else if (isDesktop()) {
            const width = window.innerWidth;
            if (width >= 1920) img.style.maxWidth = '50%';
            else if (width >= 1400) img.style.maxWidth = '60%';
            else img.style.maxWidth = '70%';
        }
    }

    // === MOBILE MENU ===
    function toggleMobileMenu() {
        if (!utils.isMobile() || !elements.navLinks) return;

        elements.navLinks.classList.toggle('active');
        elements.mobileMenu.classList.toggle('active');

        document.body.style.overflow = elements.navLinks.classList.contains('active')
            ? 'hidden'
            : '';
    }

    function closeMobileMenu() {
        if (!elements.navLinks || !elements.mobileMenu) return;

        elements.navLinks.classList.remove('active');
        elements.mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    // === EVENT HANDLERS ===
    function setupMobileMenu() {
        if (!elements.mobileMenu) return;

        elements.mobileMenu.addEventListener('click', toggleMobileMenu);

        // Chiudi menu al click su link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (utils.isMobile()) closeMobileMenu();
            });
        });

        // Chiudi menu al click esterno
        document.addEventListener('click', (e) => {
            if (!utils.isMobile() || !elements.navLinks) return;

            const clickedInside = elements.navLinks.contains(e.target) ||
                elements.mobileMenu.contains(e.target);

            if (!clickedInside && elements.navLinks.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    function setupImageLoading() {
        if (!elements.mainImage) return;

        elements.mainImage.style.opacity = '0';
        elements.mainImage.style.transition = 'opacity 0.3s ease';

        const showImage = () => elements.mainImage.style.opacity = '1';

        if (elements.mainImage.complete) {
            showImage();
        } else {
            elements.mainImage.addEventListener('load', showImage);
        }
    }

    function setupScrollEffects() {
        if (!elements.header) return;

        window.addEventListener('scroll', () => {
            const shadow = window.scrollY > 100
                ? '0 5px 20px rgba(0,0,0,0.2)'
                : '0 2px 10px rgba(0,0,0,0.1)';

            elements.header.style.boxShadow = shadow;
        });
    }

    function setupBackToTop() {
        if (!elements.backToTop) return;

        elements.backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    function setupResizeHandler() {
        const handleResize = utils.debounce(() => {
            updateBodyClasses();
            handleDesktopLayout();
            handleMobileLayout();
            optimizeImage();

            // Chiudi menu mobile su resize a desktop
            if (!utils.isMobile() && elements.navLinks?.classList.contains('active')) {
                closeMobileMenu();
            }
        }, 150);

        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                updateBodyClasses();
                optimizeImage();
            }, 100);
        });
    }

    // === INIZIALIZZAZIONE ===
    function init() {
        cacheElements();
        updateBodyClasses();
        handleDesktopLayout();
        handleMobileLayout();
        optimizeImage();

        setupMobileMenu();
        setupImageLoading();
        setupScrollEffects();
        setupBackToTop();
        setupResizeHandler();
    }

    // === PUBLIC API ===
    return {
        init: init
    };
})();

// === AVVIO APPLICAZIONE ===
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ResponsiveHandler.init);
} else {
    ResponsiveHandler.init();
}

// Backup per window.onload
window.addEventListener('load', ResponsiveHandler.init);
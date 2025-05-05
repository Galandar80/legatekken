document.addEventListener('DOMContentLoaded', function() {
    // Animazione elementi hero all'avvio
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.classList.add('animate');
    }
    
    // Gestione menu mobile
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.getElementById('mainNav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
    }
    
    // Toggle tema chiaro/scuro
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        // Controlla se esiste una preferenza salvata
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.body.classList.remove('dark-theme');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
        
        themeToggle.addEventListener('click', function() {
            if (document.body.classList.contains('dark-theme')) {
                document.body.classList.remove('dark-theme');
                this.innerHTML = '<i class="fas fa-moon"></i>';
                localStorage.setItem('theme', 'light');
            } else {
                document.body.classList.add('dark-theme');
                this.innerHTML = '<i class="fas fa-sun"></i>';
                localStorage.setItem('theme', 'dark');
            }
        });
    }
    
    // Animazione per contatori statistiche
    const animateCounters = () => {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 1500; // Durata dell'animazione in millisecondi
            const frameRate = 30; // Numero di aggiornamenti al secondo
            const increment = target / (duration / 1000 * frameRate);
            
            let current = 0;
            const animate = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.ceil(current) + '+';
                    setTimeout(animate, 1000 / frameRate);
                } else {
                    counter.textContent = target + '+';
                }
            };
            
            // Verifica se l'elemento è visibile nel viewport
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    animate();
                    observer.disconnect();
                }
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        });
    };
    
    // Animazione elementi durante lo scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, .event-card, .ranking-column');
        
        elements.forEach(element => {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    element.classList.add('fade-in');
                    observer.disconnect();
                }
            }, { threshold: 0.1 });
            
            observer.observe(element);
        });
    };
    
    // Inizializza le animazioni
    animateCounters();
    animateOnScroll();
    
    // Effetto parallasse per hero section
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        const hero = document.querySelector('.hero');
        
        if (hero && scrollPosition < 800) {
            hero.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
        }
    });
}); 
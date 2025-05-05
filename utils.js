// Funzione per caricare il footer
document.addEventListener('DOMContentLoaded', function() {
    // Seleziona tutti gli elementi con classe include-footer
    const footerElements = document.querySelectorAll('.include-footer');
    
    // Per ogni elemento trovato, inserisci il contenuto del footer direttamente
    if (footerElements.length > 0) {
        const footerHTML = `
        <div class="container">
            <div class="footer-content">
                <div class="footer-logo">
                    <img src="tekken8-logo.png" alt="Logo Tekken 8" class="footer-logo-img">
                    <p>Lega Tekken 8 Messina - Il punto di riferimento per i giocatori dello Stretto</p>
                </div>
                <div class="footer-links">
                    <h4>Links Utili</h4>
                    <ul>
                        <li><a href="index.html">Home</a></li>
                        <li><a href="tornei.html">Tornei</a></li>
                        <li><a href="classifica.html">Classifiche</a></li>
                        <li><a href="eventi.html">Eventi</a></li>
                        <li><a href="regolamento.html">Regolamento</a></li>
                        <li><a href="contatti.html">Contatti</a></li>
                    </ul>
                </div>
                <div class="footer-links">
                    <h4>Social</h4>
                    <ul>
                        <li><a href="https://www.instagram.com/redshift_gaming/" target="_blank">Instagram</a></li>
                        <li><a href="https://www.facebook.com/RedShiftGaming" target="_blank">Facebook</a></li>
                    </ul>
                </div>
                <div class="footer-newsletter">
                    <h4>Resta Aggiornato</h4>
                    <p>Iscriviti alla nostra newsletter per ricevere aggiornamenti sui prossimi tornei e le ultime novità.</p>
                    <form class="newsletter-form">
                        <input type="email" placeholder="La tua email" required>
                        <button type="submit" class="btn btn-primary">Iscriviti</button>
                    </form>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2023 Lega Tekken 8 Messina. Tutti i diritti riservati.</p>
            </div>
        </div>`;
        
        footerElements.forEach(function(element) {
            element.innerHTML = footerHTML;
        });
    }
});

// Funzione per alternare tra tema chiaro e scuro
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    
    // Salva la preferenza dell'utente
    const isDarkTheme = document.body.classList.contains('dark-theme');
    localStorage.setItem('darkTheme', isDarkTheme);
}

// Applica il tema salvato all'avvio
document.addEventListener('DOMContentLoaded', function() {
    const isDarkTheme = localStorage.getItem('darkTheme') === 'true';
    if (isDarkTheme) {
        document.body.classList.add('dark-theme');
    }
    
    // Aggiungi event listener al pulsante del tema
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}); 
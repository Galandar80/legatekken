// Script per aggiungere i dati delle statistiche al database Firebase
// Eseguire questo script per inizializzare o aggiornare le statistiche

// Configurazione Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBoiVZiPqbwtKmDC5Pw0Nw4bpLqzynCA5c",
    authDomain: "tekkenredshift.firebaseapp.com",
    databaseURL: "https://tekkenredshift-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "tekkenredshift",
    storageBucket: "tekkenredshift.firebasestorage.app",
    messagingSenderId: "88169810750",
    appId: "1:88169810750:web:060972498a69c259ab7a6f",
    measurementId: "G-FLNMLFD0JC"
};

// Inizializzazione Firebase (esempio con Node.js)
// Richiede: npm install firebase
const firebase = require('firebase/app');
require('firebase/database');

// Inizializza Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();

// Dati statistiche reali
const statistiche = {
    giocatori: 120,  // Numero di giocatori registrati
    tornei: 25,      // Numero di tornei organizzati
    citta: 3,        // Numero di città coinvolte
};

// Aggiorna o crea le statistiche nel database
database.ref('statistiche').set(statistiche)
    .then(() => {
        console.log('Statistiche aggiornate con successo nel database!');
        // Chiudi la connessione al database
        setTimeout(() => {
            process.exit(0);
        }, 1000);
    })
    .catch((error) => {
        console.error('Errore durante l\'aggiornamento delle statistiche:', error);
        process.exit(1);
    }); 
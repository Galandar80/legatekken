// Funzioni specifiche per il backend

// Carica i tornei esistenti nella lista
function caricaTornei() {
    const container = document.getElementById('torneiList');
    const ordinamento = document.getElementById('ordinaTornei')?.value || 'data';
    
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner"></i> Caricamento tornei in corso...</div>';
    
    database.ref('tornei').once('value')
        .then(snapshot => {
            const torneiData = snapshot.val() || {};
            const tornei = Object.entries(torneiData);
            
            container.innerHTML = '';
            
            // Aggiungi controlli di ordinamento
            const controlsDiv = document.createElement('div');
            controlsDiv.className = 'flex-group controls';
            controlsDiv.innerHTML = `
                <div>
                    <label for="ordinaTornei">Ordina per:</label>
                    <select id="ordinaTornei">
                        <option value="data" ${ordinamento === 'data' ? 'selected' : ''}>Data (più recenti)</option>
                        <option value="nome" ${ordinamento === 'nome' ? 'selected' : ''}>Nome</option>
                    </select>
                </div>
            `;
            container.appendChild(controlsDiv);
            
            // Ordina i tornei
            if(ordinamento === 'nome') {
                tornei.sort((a, b) => a[1].nome.localeCompare(b[1].nome));
            } else if(ordinamento === 'data') {
                tornei.sort((a, b) => new Date(b[1].creatoIl) - new Date(a[1].creatoIl));
            }
            
            if(tornei.length === 0) {
                container.innerHTML += '<div>Nessun torneo trovato</div>';
                return;
            }
            
            tornei.forEach(([torneoId, torneo]) => {
                const div = document.createElement('div');
                div.className = 'torneo-item';
                div.innerHTML = `
                    <div>
                        <strong>${torneo.nome}</strong><br>
                        <small>${new Date(torneo.creatoIl).toLocaleDateString()}</small>
                        ${torneo.tipo ? `<br><small>Tipo: ${torneo.tipo}</small>` : ''}
                        ${torneo.dataInizio ? `<br><small>Data: ${torneo.dataInizio}</small>` : ''}
                    </div>
                    <div class="flex-group">
                        <button onclick="gestisciTorneo('${torneoId}')">Gestisci</button>
                        <button onclick="eliminaTorneo('${torneoId}')" 
                                style="background: #dc3545">Elimina</button>
                    </div>
                `;
                container.appendChild(div);
            });
            
            // Aggiungi event listener per l'ordinamento
            document.getElementById('ordinaTornei').addEventListener('change', () => {
                caricaTornei();
            });
        })
        .catch(error => {
            console.error("Errore nel caricamento dei tornei:", error);
            container.innerHTML = `<div class="error">Errore nel caricamento dei tornei: ${error.message}</div>`;
        });
}

// Gestisci un torneo specifico
function gestisciTorneo(torneoId) {
    torneoSelezionatoId = torneoId;
    const torneo = torneiData[torneoId];
    
    if (!torneo) {
        showAlert('Torneo non trovato!', 'error');
        return;
    }
    
    document.getElementById('nomeTorneoSelezionato').textContent = torneo.nome;
    document.getElementById('gestioneTorneo').style.display = 'block';
    
    caricaGiocatoriTorneo(torneoId);
}

// Carica i giocatori di un torneo specifico
function caricaGiocatoriTorneo(torneoId) {
    const container = document.getElementById('elencoGiocatori');
    const searchTerm = document.getElementById('cercaGiocatore')?.value?.toLowerCase() || '';
    const ordinamento = document.getElementById('ordinaGiocatori')?.value || 'punti';
    
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner"></i> Caricamento giocatori...</div>';
    
    database.ref(`tornei/${torneoId}`).once('value')
        .then(snapshot => {
            const torneo = snapshot.val() || {};
            const giocatori = torneo.giocatori || {};
            let giocatoriArray = Object.entries(giocatori);
            
            container.innerHTML = '';
            
            // Aggiungi controlli di ricerca e ordinamento
            const controlsDiv = document.createElement('div');
            controlsDiv.className = 'flex-group controls';
            controlsDiv.innerHTML = `
                <div>
                    <input type="text" id="cercaGiocatore" placeholder="Cerca giocatore..." 
                           value="${searchTerm}">
                </div>
                <div>
                    <label for="ordinaGiocatori">Ordina per:</label>
                    <select id="ordinaGiocatori">
                        <option value="punti" ${ordinamento === 'punti' ? 'selected' : ''}>Punti</option>
                        <option value="nome" ${ordinamento === 'nome' ? 'selected' : ''}>Nome</option>
                    </select>
                </div>
            `;
            container.appendChild(controlsDiv);
            
            // Filtra i giocatori
            if (searchTerm) {
                giocatoriArray = giocatoriArray.filter(([_, giocatore]) => 
                    giocatore.nome.toLowerCase().includes(searchTerm));
            }
            
            // Ordina i giocatori
            if (ordinamento === 'nome') {
                giocatoriArray.sort((a, b) => a[1].nome.localeCompare(b[1].nome));
            } else if (ordinamento === 'punti') {
                giocatoriArray.sort((a, b) => (b[1].punti || 0) - (a[1].punti || 0));
            }
            
            if (giocatoriArray.length === 0) {
                container.innerHTML += '<div>Nessun giocatore trovato</div>';
                return;
            }
            
            giocatoriArray.forEach(([giocatoreId, giocatore]) => {
                const div = document.createElement('div');
                div.className = 'giocatore-item';
                div.innerHTML = `
                    <div>
                        <strong>${giocatore.nome}</strong>
                    </div>
                    <div class="flex-group">
                        <div class="punti-control">
                            <button onclick="modificaPunti('${giocatoreId}', -1)">-</button>
                            <span>${giocatore.punti || 0}</span>
                            <button onclick="modificaPunti('${giocatoreId}', 1)">+</button>
                        </div>
                        <button onclick="rimuoviGiocatore('${giocatoreId}')" 
                                style="background: #dc3545">Rimuovi</button>
                    </div>
                `;
                container.appendChild(div);
            });
            
            // Aggiungi event listeners
            document.getElementById('cercaGiocatore').addEventListener('input', () => {
                caricaGiocatoriTorneo(torneoId);
            });
            
            document.getElementById('ordinaGiocatori').addEventListener('change', () => {
                caricaGiocatoriTorneo(torneoId);
            });
        })
        .catch(error => {
            console.error("Errore nel caricamento dei giocatori:", error);
            container.innerHTML = `<div class="error">Errore nel caricamento dei giocatori: ${error.message}</div>`;
        });
}

// Aggiungi un giocatore al torneo selezionato
function aggiungiGiocatore() {
    if (!torneoSelezionatoId) {
        showAlert('Nessun torneo selezionato!', 'error');
        return;
    }
    
    const nomeInput = document.getElementById('nuovoGiocatore');
    const nome = nomeInput.value.trim();
    
    if (!nome) {
        showAlert('Inserisci un nome per il giocatore!', 'error');
        return;
    }
    
    const nuovoGiocatore = {
        nome: nome,
        punti: 0
    };
    
    database.ref(`tornei/${torneoSelezionatoId}/giocatori`).push(nuovoGiocatore)
        .then(() => {
            nomeInput.value = '';
            showAlert('Giocatore aggiunto con successo!');
            caricaGiocatoriTorneo(torneoSelezionatoId);
        })
        .catch(error => {
            console.error("Errore nell'aggiunta del giocatore:", error);
            showAlert(`Errore nell'aggiunta del giocatore: ${error.message}`, 'error');
        });
}

// Modifica i punti di un giocatore
function modificaPunti(giocatoreId, delta) {
    if (!torneoSelezionatoId) {
        showAlert('Nessun torneo selezionato!', 'error');
        return;
    }
    
    const giocatoreRef = database.ref(`tornei/${torneoSelezionatoId}/giocatori/${giocatoreId}`);
    
    giocatoreRef.once('value')
        .then(snapshot => {
            const giocatore = snapshot.val() || {};
            const puntiAttuali = giocatore.punti || 0;
            const nuoviPunti = Math.max(0, puntiAttuali + delta); // Impedisce punti negativi
            
            return giocatoreRef.update({ punti: nuoviPunti });
        })
        .then(() => {
            caricaGiocatoriTorneo(torneoSelezionatoId);
        })
        .catch(error => {
            console.error("Errore nell'aggiornamento dei punti:", error);
            showAlert(`Errore nell'aggiornamento dei punti: ${error.message}`, 'error');
        });
}

// Rimuovi un giocatore dal torneo
function rimuoviGiocatore(giocatoreId) {
    if (!torneoSelezionatoId) {
        showAlert('Nessun torneo selezionato!', 'error');
        return;
    }
    
    if (!confirm('Sei sicuro di voler rimuovere questo giocatore?')) {
        return;
    }
    
    database.ref(`tornei/${torneoSelezionatoId}/giocatori/${giocatoreId}`).remove()
        .then(() => {
            showAlert('Giocatore rimosso con successo!');
            caricaGiocatoriTorneo(torneoSelezionatoId);
        })
        .catch(error => {
            console.error("Errore nella rimozione del giocatore:", error);
            showAlert(`Errore nella rimozione del giocatore: ${error.message}`, 'error');
        });
}

// Elimina un torneo
function eliminaTorneo(torneoId) {
    if (!confirm('Sei sicuro di voler eliminare questo torneo? Questa azione non può essere annullata.')) {
        return;
    }
    
    database.ref(`tornei/${torneoId}`).remove()
        .then(() => {
            showAlert('Torneo eliminato con successo!');
            caricaTornei();
            
            if (torneoSelezionatoId === torneoId) {
                chiudiGestione();
            }
        })
        .catch(error => {
            console.error("Errore nell'eliminazione del torneo:", error);
            showAlert(`Errore nell'eliminazione del torneo: ${error.message}`, 'error');
        });
}

// Chiudi la gestione del torneo
function chiudiGestione() {
    document.getElementById('gestioneTorneo').style.display = 'none';
    torneoSelezionatoId = null;
}

// Inizializza il backend
document.addEventListener('DOMContentLoaded', function() {
    // Carica i tornei esistenti
    caricaTornei();
    
    // Aggiungi event listener per la creazione di un nuovo torneo
    document.querySelector('button[onclick="creaTorneo()"]').addEventListener('click', creaTorneo);
});
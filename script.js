// URL del endpoint de la API Advice Slip (devuelve un consejo aleatorio en formato JSON)
const API_URL = 'https://api.adviceslip.com/advice';

// Referencias a los elementos del DOM
const adviceId = document.getElementById('advice-id');
const adviceText = document.getElementById('advice-text');
const diceBtn = document.getElementById('dice-btn');

// Función asíncrona que consulta la API y actualiza la interfaz
async function getAdvice() {
    diceBtn.disabled = true; // evita varias peticiones simultáneas

    try {
        // cache: 'no-store' evita que el navegador reutilice la respuesta anterior
        const response = await fetch(API_URL, { cache: 'no-store' });

        // Condicional: verificar que la respuesta HTTP sea exitosa (200-299)
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();   // convierte el JSON en objeto
        const { id, advice } = data.slip;     // desestructuración del objeto

        adviceId.textContent = id;
        adviceText.textContent = advice;
    } catch (error) {
        console.error('No se pudo obtener el consejo:', error);
        adviceId.textContent = '--';
        adviceText.textContent = 'No se pudo cargar el consejo. Intenta de nuevo.';
    } finally {
        diceBtn.disabled = false;
    }
}

// Evento: cada clic en el dado pide un nuevo consejo
diceBtn.addEventListener('click', getAdvice);

// Al cargar la página se muestra un primer consejo
getAdvice();

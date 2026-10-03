// API 1: Advice Slip (devuelve un consejo aleatorio en inglés, formato JSON)
const ADVICE_URL = 'https://api.adviceslip.com/advice';
// API 2: MyMemory (traduce un texto de inglés a español)
const TRANSLATE_URL = 'https://api.mymemory.translated.net/get';

// Referencias a los elementos del DOM
const adviceId = document.getElementById('advice-id');
const adviceText = document.getElementById('advice-text');
const diceBtn = document.getElementById('dice-btn');

// Traduce un texto al español. Si algo falla, devuelve el texto original en inglés.
async function translateToSpanish(text) {
    try {
        const url = `${TRANSLATE_URL}?q=${encodeURIComponent(text)}&langpair=en|es`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        const translated = data.responseData.translatedText;

        // Condicional: la API responde 200 con un aviso si se agotó la cuota gratuita
        if (data.responseStatus !== 200 || translated.startsWith('MYMEMORY WARNING')) {
            throw new Error('Traducción no disponible');
        }
        return translated;
    } catch (error) {
        console.error('No se pudo traducir, se muestra el original:', error);
        return text;
    }
}

// Función asíncrona que consulta el consejo, lo traduce y actualiza la interfaz
async function getAdvice() {
    diceBtn.disabled = true; // evita varias peticiones simultáneas

    try {
        // cache: 'no-store' evita que el navegador reutilice la respuesta anterior
        const response = await fetch(ADVICE_URL, { cache: 'no-store' });

        // Condicional: verificar que la respuesta HTTP sea exitosa (200-299)
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();   // convierte el JSON en objeto
        const { id, advice } = data.slip;     // desestructuración del objeto

        adviceText.textContent = 'Traduciendo consejo...';
        const adviceEs = await translateToSpanish(advice);

        adviceId.textContent = id;
        adviceText.textContent = adviceEs;
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

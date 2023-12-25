document.getElementById('fetchButton').addEventListener('click', function () {
    const monthInput = document.getElementById('monthInput').value;
    const dayInput = document.getElementById('dayInput').value;

    // Verificar si algún campo está vacío
    if (!monthInput || !dayInput) {
        displayMessage('Por favor, completa ambos campos.');
        return;
    }

    const month = parseInt(monthInput);
    const day = parseInt(dayInput);

    // Verificar si los valores son números y están en los rangos válidos
    if (isNaN(month) || month < 1 || month > 12) {
        displayMessage('Mes inválido. Por favor, introduce un número del 1 al 12.');
        return;
    }

    if (isNaN(day) || day < 1 || day > 31) {
        displayMessage('Día inválido. Por favor, introduce un número del 1 al 31.');
        return;
    }

    // Verificación específica para febrero
    if (month === 2 && day > 29) {
        displayMessage('Febrero solo tiene hasta 29 días. Por favor, introduce un día válido.');
        return;
    }

    fetchNumberFact(month, day);
});

async function translateText(text) {
    var target_language = "es";
    var source_language = "en";

    var url = "https://text-translator2.p.rapidapi.com/translate";
    var data = {
        text: text,
        target_language: target_language,
        source_language: source_language
    };


    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "X-RapidAPI-Key": "a71e103d4bmsh2d23398c391c2ddp1690cajsn1bc2aaf2288a",
                "X-RapidAPI-Host": "text-translator2.p.rapidapi.com"
            },
            body: new URLSearchParams(data)
        });

        const jsonData = await response.json();
        if (jsonData.status === "success" && jsonData.data.translatedText) {
            return jsonData.data.translatedText;
        } else {
            return 'Traducción no disponible';
        }
    } catch (error) {
        console.error('Error:', error);
        return 'Error al traducir';
    }
}

function displayFacts(facts) {
    const resultsContainer = document.getElementById('resultsContainer'); // Asegúrate de que este es el ID correcto
    if (!resultsContainer) {
        console.error('El contenedor de resultados no se encontró.');
        return;
    }

    resultsContainer.innerHTML = ''; // Limpiar resultados anteriores

    facts.forEach(fact => {
        const factElement = document.createElement('div');
        factElement.innerText = fact;
        factElement.classList.add('fact'); // Asegúrate de definir esta clase en tu CSS
        resultsContainer.appendChild(factElement);
    });
}

function displayMessage(message, isError) {
    const messageElement = document.getElementById('resultsContainer');
    if (!messageElement) {
        console.error('El contenedor de resultados no se encontró.');
        return;
    }

    messageElement.innerHTML = ''; // Limpiar cualquier contenido anterior
    messageElement.innerText = message;

    if (isError) {
        messageElement.classList.add('error-message');
        messageElement.classList.remove('loading-message');
    } else if (message === 'Cargando...') {
        messageElement.classList.add('loading-message');
        messageElement.classList.remove('error-message');
    } else {
        messageElement.classList.remove('error-message', 'loading-message');
    }
}





async function fetchNumberFact(month, day) {
    displayMessage('Cargando...', false);
    const facts = []; // Array para almacenar los hechos

    for (let i = 0; i < 10; i++) {
        const options = {
            method: 'GET',
            url: `https://numbersapi.p.rapidapi.com/${month}/${day}/date`,
            params: { fragment: 'true', json: 'true' },
            headers: {
                'X-RapidAPI-Key': 'a71e103d4bmsh2d23398c391c2ddp1690cajsn1bc2aaf2288a',
                'X-RapidAPI-Host': 'numbersapi.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);
            const fact = response.data.text;
            const year = response.data.year;
            const fullText = `${fact} (Año: ${year}).`; // Definir fullText aquí

            const translatedFact = await translateText(fullText);
            facts.push(translatedFact);
        } catch (error) {
            console.error(error);
            displayMessage('Error al obtener datos de la API.', true);
            return;
        }
    }

    displayFacts(facts); // Mostrar todos los hechos traducidos
}
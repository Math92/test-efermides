document.addEventListener('DOMContentLoaded', function() {
    const monthSelect = document.getElementById('monthInput');
    const daySelect = document.getElementById('dayInput');

    for (let i = 1; i <= 31; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        daySelect.appendChild(option);
    }
});

document.getElementById('fetchButton').addEventListener('click', function () {
    const month = parseInt(document.getElementById('monthInput').value);
    const day = parseInt(document.getElementById('dayInput').value);

    fetchNumberFact(month, day);
});


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
    const factsSet = new Set(); 

    while (factsSet.size < 10) {
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
            const fullText = `${fact} (Año: ${year}).`; // Texto completo del hecho

            if (!factsSet.has(fullText)) { // Comprobar si el hecho ya está en el Set
                factsSet.add(fullText); // Añadir hecho al Set
            }
        } catch (error) {
            console.error(error);
            displayMessage('Error al obtener datos de la API.', true);
            return;
        }
    }

    displayFacts(Array.from(factsSet));
}
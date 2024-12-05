// Function to translate text using Google Translate API
function translateText(text, targetLang) {
    const apiKey = 'YOUR_GOOGLE_API_KEY'; // Replace with your API key
    const apiUrl = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

    const data = {
        q: text,
        target: targetLang
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.data && data.data.translations) {
            const translatedText = data.data.translations[0].translatedText;
            console.log('Translated text:', translatedText);
            // Update the page with the translated text
            document.getElementById('welcome').textContent = translatedText;
        }
    })
    .catch(error => console.error('Error:', error));
}

// Example usage: Translate text to Spanish
translateText("Welcome", "es");

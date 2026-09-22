const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// DeepL API Anahtarını buraya ekleyeceksin
const DEEPL_API_KEY = process.env.DEEPL_API_KEY || 'SENIN_DEEPL_API_ANAHTARIN'; 

app.post('/api/translate', async (req, res) => {
    const { text, target_lang, is_outgoing } = req.body;

    try {
        const response = await axios.post(
            'https://api-free.deepl.com/v2/translate',
            new URLSearchParams({
                auth_key: DEEPL_API_KEY,
                text: text,
                target_lang: target_lang || 'TR' // Gelenler için Türkçe, gidenler için EN
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const translatedText = response.data.translations[0].text;
        
        // Yanıtı SL'e JSON olarak geri dönüyoruz
        res.status(200).json({
            original: text,
            translated: translatedText,
            is_outgoing: is_outgoing
        });
    } catch (error) {
        console.error("API Error:", error.message);
        res.status(500).send("Çeviri Hatası");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ICE Translate Backend ${PORT} portunda çalışıyor.`));

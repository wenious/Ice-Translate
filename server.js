const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// DeepL API Anahtarını Render ortam değişkenlerine (Environment Variables) eklemelisin
const DEEPL_API_KEY = process.env.DEEPL_API_KEY || 'SENIN_DEEPL_API_ANAHTARIN'; 

app.post('/api/translate', async (req, res) => {
    const { text, target_lang, is_outgoing } = req.body;

    try {
        const response = await axios.post(
            'https://api-free.deepl.com/v2/translate',
            new URLSearchParams({
                auth_key: DEEPL_API_KEY,
                text: text,
                target_lang: target_lang || 'EN-US' // Evrensel sürüm varsayılanı
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        // Yanıtı LSL'in kolay okuyabilmesi için JSON formatında dönüyoruz
        res.status(200).json({
            original: text,
            translated: response.data.translations[0].text,
            is_outgoing: String(is_outgoing) 
        });
    } catch (error) {
        console.error("API Hatası:", error.message);
        res.status(500).json({ error: "Translation failed" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ICE Translate Backend ${PORT} portunda çalışıyor.`));

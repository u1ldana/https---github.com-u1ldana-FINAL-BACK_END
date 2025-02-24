const express = require('express');
const router = express.Router();
const axios = require('axios');
const path = require('path');

const YANDEX_API_KEY = '5fb6e897-c97a-4361-9a01-e7c06890ecad';
const WEATHER_API = '3e219b666d565cf9fbd9209491206746';
const EXCHANGE_RATE_API = 'cb1a6fbd808511c53018ac6b';
const JOKE_API = 'https://official-joke-api.appspot.com/random_joke';

// Маршрут для отображения страницы
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/weather/index.html'));
});

// Получение данных о погоде и координатах города
router.get('/data', async (req, res) => {
    try {
        const city = req.query.city;
        if (!city) {
            return res.status(400).json({ error: 'City is required' });
        }

        // Получаем данные о погоде
        const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API}&units=metric`
        );

        // Получаем координаты города через API Яндекса
        const yandexGeoResponse = await axios.get(
            `https://geocode-maps.yandex.ru/1.x/?geocode=${city}&apikey=${YANDEX_API_KEY}&format=json`
        );

        const geoData = yandexGeoResponse.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;
        const [lon, lat] = geoData.split(' ');

        // Получаем курсы валют
        const ratesResponse = await axios.get(
            `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API}/latest/USD`
        );

        // Получаем случайную шутку
        const jokeResponse = await axios.get(JOKE_API);

        const weather = weatherResponse.data;
        const rates = ratesResponse.data.conversion_rates;
        const joke = jokeResponse.data;

        res.json({
            temperature: weather.main.temp,
            feels_like: weather.main.feels_like,
            description: weather.weather[0].description,
            coordinates: [parseFloat(lat), parseFloat(lon)], // Добавляем координаты, полученные от Яндекса
            country: weather.sys.country,
            icon: weather.weather[0].icon,
            rates: {
                EUR: rates.EUR,
                KZT: rates.KZT,
                RUB: rates.RUB
            },
            joke: `${joke.setup} - ${joke.punchline}`
        });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ 
            error: 'Failed to get data',
            details: error.message 
        });
    }
});

module.exports = router;

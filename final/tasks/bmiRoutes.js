const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/bmi/index.html'));
});

router.post('/calculate', (req, res) => {
    const { weight, height, age, gender } = req.body;
    
    const parsedWeight = parseFloat(weight);
    const parsedHeight = parseFloat(height) / 100;
    const parsedAge = parseInt(age);

    if (isNaN(parsedWeight) || isNaN(parsedHeight) || isNaN(parsedAge)) {
        return res.status(400).json({ error: 'Invalid input values' });
    }

    const bmiValue = (parsedWeight / (parsedHeight * parsedHeight)).toFixed(2);
    let classification = '';
    let advice = '';

    switch (true) {
        case bmiValue < 18.5:
            classification = 'Underweight';
            advice = 'Try increasing your caloric intake.';
            break;
        case bmiValue >= 18.5 && bmiValue < 24.9:
            classification = 'Healthy weight';
            advice = 'Maintain your healthy lifestyle!';
            break;
        case bmiValue >= 25 && bmiValue < 29.9:
            classification = 'Overweight';
            advice = 'Increase exercise and monitor diet.';
            break;
        default:
            classification = 'Obese';
            advice = 'Consult a healthcare provider for guidance.';
            break;
    }

    res.json({
        bmi: bmiValue,
        classification,
        advice,
        userInfo: {
            weight: parsedWeight,
            height: parsedHeight,
            age: parsedAge,
            gender
        }
    });
});

module.exports = router;

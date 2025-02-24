const express = require('express');
const router = express.Router();
const qr = require('qr-image');
const path = require('path');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/qrcode/index.html'));
});

// Handle QR code generation via POST request
router.post('/generate', async (req, res) => {
    try {
        const { url } = req.body;

        // Check if URL is provided
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        // Generate QR code as PNG
        const qrCode = qr.imageSync(url, { type: 'png' });

        // Set response headers and send the QR code image
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': qrCode.length
        });
        res.end(qrCode);

    } catch (error) {
        console.error('QR Code generation error:', error);
        res.status(500).json({ error: 'Failed to generate QR code' });
    }
});

module.exports = router;

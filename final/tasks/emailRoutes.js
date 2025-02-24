const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const path = require('path');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'zhusupbekova.uldana06@gmail.com',
        pass: 'ybij rgye ehlh oceb'
    },
    tls: {
        rejectUnauthorized: false
    },
    debug: true 
});

transporter.verify(function(error, success) {
    if (error) {
        console.log('Error with email server:', error);
    } else {
        console.log('Email server is ready');
    }
});

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/email/index.html'));
});

router.post('/send', async (req, res) => {
    try {
        console.log('Attempting to send email to:', req.body.to);

        const mailOptions = {
            from: {
                name: 'your message',
                address: 'zhusupbekova.uldana06@gmail.com'
            },
            to: req.body.to,
            subject: req.body.subject,
            text: req.body.message,
            html: `<p>${req.body.message}</p>`
        };

        console.log('Mail options:', mailOptions);

        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.json({ 
            success: true,
            messageId: info.messageId
        });
    } catch (error) {
        console.error('Detailed error:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

module.exports = router; 
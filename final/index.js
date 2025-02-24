const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const nodemailer = require('nodemailer');
const path = require('path');
const { router: authRoutes, isAuthenticated } = require('./tasks/authRoutes');
const qrcodeRoutes = require('./tasks/qrcodeRoutes');

const app = express();

// Middleware
//.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('task'));
app.use(express.static('views'));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

// MongoDB connection with error handling
//d
mongoose.connect("mongodb://127.0.0.1:27017/final", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Successfully connected to MongoDB.');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// Handle MongoDB connection errors
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// Routes
app.get('/', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'task', 'index.html'));
});

// Import routes
const bmiRoutes = require('./tasks/bmiRoutes');
const weatherRoutes = require('./tasks/weatherRoutes');
const blogRoutes = require('./tasks/blogRoutes');
const emailRoutes = require('./tasks/emailRoutes');

// Use routes
app.use('/auth', authRoutes);
app.use('/bmi', isAuthenticated, bmiRoutes);
app.use('/weather', isAuthenticated, weatherRoutes);
app.use('/blog', isAuthenticated, blogRoutes);
app.use('/email', isAuthenticated, emailRoutes);
app.use('/qrcode', isAuthenticated, qrcodeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 
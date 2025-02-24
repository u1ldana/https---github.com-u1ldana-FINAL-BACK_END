const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../mongo/User');
const path = require('path');

const router = express.Router();

// Проверка, авторизован ли пользователь
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/auth/login');
    }
};

// Страница логина
router.get('/login', (req, res) => {
    if (req.session.user) {
        res.redirect('/');
    } else {
        res.sendFile(path.join(__dirname, '../views/auth/login.html'));
    }
});

// Страница регистрации
router.get('/register', (req, res) => {
    if (req.session.user) {
        res.redirect('/');
    } else {
        res.sendFile(path.join(__dirname, '../views/auth/register.html'));
    }
});

// Регистрация нового пользователя
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Проверка, существует ли пользователь с таким именем
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send("Username already exists");
        }

        // Хешируем пароль и сохраняем нового пользователя
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        // Создание сессии для нового пользователя
        req.session.user = newUser;
        res.redirect('/');
    } catch (error) {
        res.status(500).send("Error registering user");
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = user;
            res.redirect('/');
        } else {
            res.status(401).send("Invalid credentials");
        }
    } catch (error) {
        res.status(500).send("Error logging in");
    }
});


router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
});

// Статус авторизации
router.get('/status', (req, res) => {
    res.json({
        isAuthenticated: !!req.session.user,
        user: req.session.user ? {
            username: req.session.user.username
        } : null
    });
});

module.exports = { router, isAuthenticated };

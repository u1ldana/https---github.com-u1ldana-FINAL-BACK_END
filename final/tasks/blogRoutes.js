const express = require('express');
const router = express.Router();
const blogController = require('../blogController/blogController');
const path = require('path');

// Маршрут для отображения страницы блога
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/blog/index.html'));
});

// Маршрут для получения всех блогов
router.get('/posts', async (req, res) => {
    try {
        const blogs = await blogController.getBlogs();
        res.json(blogs);
    } catch (error) {
        console.error('Route error:', error);
        res.status(500).json({ error: 'Failed to fetch blogs' });
    }
});

// Получить конкретный блог по ID
router.get('/:id', blogController.getBlogByID);

// Создать новый блог
router.post('/posts', async (req, res) => {
    try {
        const blog = await blogController.createBlog(req);
        res.status(201).json(blog);
    } catch (error) {
        console.error('Route error:', error);
        res.status(500).json({ error: 'Failed to create blog' });
    }
});

// Обновить блог
router.put('/:id', blogController.updateBlog);

// Удалить блог
router.delete('/posts/:id', async (req, res) => {
    try {
        await blogController.deleteBlog(req, res);
    } catch (error) {
        console.error('Route error:', error);
        res.status(500).json({ error: 'Failed to delete blog' });
    }
});

module.exports = router; 
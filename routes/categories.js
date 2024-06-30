const express = require('express');
const Category = require('../database/models/category');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/category_img');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.get('/all', async (req, res) => {
    try {
        const allCategories = await Category.findAll();
        res.json(allCategories);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findOne({ where: { id } });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const products = await Product.findAll({ where: { categoryId: id } });
        res.json({ category, products });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/', upload.single('image'), async (req, res) => {
    const { title } = req.body;
    const image = req.file ? `/public/category_img/${req.file.filename}` : null;

    try {
        const newCategory = await Category.create({ title, image, createdAt: new Date(), updatedAt: new Date() });
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const image = req.file ? `/public/category_img/${req.file.filename}` : null;

    try {
        const category = await Category.findOne({ where: { id } });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        category.title = title || category.title;
        if (image) {
            category.image = image;
        }
        category.updatedAt = new Date();

        await category.save();
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findOne({ where: { id } });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        await category.destroy();
        res.json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;

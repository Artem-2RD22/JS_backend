const express = require('express');
const Product = require('../database/models/product');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/product_img');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.get('/all', async (req, res) => {
    try {
        const allProducts = await Product.findAll();
        res.json(allProducts);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:id', async (req, res) =>{
    const {id} = req.params;

    if (isNaN(id)){
        res.json({status: 'ERR', message: 'wrong id'}); 
        return  
    }
    const all = await Product.findAll({where: {id: +id}});

    if(all.length === 0){
        res.json({status: 'ERR', message: 'product not found'});
        return
    }
    
    res.json(all);
})

router.post('/', upload.single('image'), async (req, res) => {
    const { title, price, discont_price, description, categoryId } = req.body;
    const image = req.file ? `/public/product_img/${req.file.filename}` : null;

    try {
        const newProduct = await Product.create({ title, price, discont_price, description, categoryId, image, createdAt: new Date(), updatedAt: new Date() });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { title, price, discont_price, description, categoryId } = req.body;
    const image = req.file ? `/public/product_img/${req.file.filename}` : null;

    try {
        const product = await Product.findOne({ where: { id } });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.title = title || product.title;
        product.price = price || product.price;
        product.discont_price = discont_price || product.discont_price;
        product.description = description || product.description;
        product.categoryId = categoryId || product.categoryId;
        if (image) {
            product.image = image;
        }
        product.updatedAt = new Date();

        await product.save();
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findOne({ where: { id } });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.destroy();
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;

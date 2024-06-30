const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../database/models/user');
const Role = require('../database/models/role');

const router = express.Router();
const JWT_SECRET = 'secret_key';  // секретный ключ

// Регистрация пользователя
router.post('/register', async (req, res) => {
    const { username, password, first_name, phone, role_id } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ 
        username, 
        password: hashedPassword, 
        first_name, 
        phone, 
        role_id,
        created_date: new Date() 
    });

    res.status(201).json({ message: 'User created successfully' });
});

// Логин пользователя
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role_id: user.role_id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user });
});

module.exports = router;

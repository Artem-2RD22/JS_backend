const express = require('express');
const { Order, OrderItem, Product, User } = require('../database/models');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Получение всех заказов
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const roleId = req.user.role_id;

        let orders;
        if (roleId === 1) { // Админ
            orders = await Order.findAll({
                include: [
                    {
                        model: OrderItem,
                        include: [Product],
                    },
                    {
                        model: User,
                        attributes: ['id', 'username', 'first_name', 'phone'],
                    },
                ],
            });
        } else { // Обычный пользователь
            orders = await Order.findAll({
                where: { user_id: userId },
                include: [
                    {
                        model: OrderItem,
                        include: [Product],
                    },
                ],
            });
        }

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;

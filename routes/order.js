const express = require('express');
const { Order, OrderItem, Product } = require('../database/models');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Создание заказа
router.post('/create', authenticateToken, async (req, res) => {
    const { userId, items } = req.body;

    if (!userId || !items || !items.length) {
        return res.status(400).json({ message: 'Invalid order data' });
    }

    try {
        let totalAmount = 0;
        const order = await Order.create({ user_id: userId, total_amount: totalAmount });

        const orderItems = await Promise.all(items.map(async (item) => {
            const product = await Product.findByPk(item.productId);
            if (product) {
                const itemTotal = product.price * item.quantity;
                totalAmount += itemTotal;

                return OrderItem.create({
                    order_id: order.id,
                    product_id: item.productId,
                    quantity: item.quantity,
                    price: product.price
                });
            }
        }));

        order.total_amount = totalAmount;
        await order.save();

        res.status(201).json({ order, orderItems });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Получение заказа по ID
router.get('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findByPk(id, {
            include: [
                {
                    model: OrderItem,
                    include: [Product]
                }
            ]
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;

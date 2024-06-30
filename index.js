const express = require('express');
const cors = require('cors');
const sequelize = require('./database/database');
const { Category, Product, User, Role, Order, OrderItem } = require('./database/models');
const categories = require('./routes/categories');
const sale = require('./routes/sale');
const orderRoutes = require('./routes/order');
const ordersRoutes = require('./routes/orders'); // Импорт маршрута для заказов
const productRoutes = require('./routes/products');
const auth = require('./routes/auth');
const authenticateToken = require('./middleware/auth');
const PORT = 3333;

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static('public')); // Serve static files from the 'public' directory

app.use('/auth', auth);

// Публичные маршруты
app.use('/categories', categories);
app.use('/products', productRoutes);
app.use('/sale', sale);

// Защищенные маршруты
app.use('/order', authenticateToken, orderRoutes);
app.use('/orders', authenticateToken, ordersRoutes); // Защищенный маршрут для заказов

const start = async () => {
    try {
        await sequelize.sync().then(
            result => { /* console.log(result) */ },
            err => console.log(err)
        );

        app.listen(PORT, () => {
            console.log(`\n\nServer started on http://localhost:${PORT} port...`);
        });
    } catch (err) {
        console.log(err);
    }
};

start();

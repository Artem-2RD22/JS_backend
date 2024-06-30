const Category = require('./category');
const Product = require('./product');
const User = require('./user');
const Role = require('./role');
const Order = require('./order');
const OrderItem = require('./orderItem');

// Определение ассоциаций между моделями
Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

Product.hasMany(OrderItem, { foreignKey: 'product_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = {
    Category,
    Product,
    User,
    Role,
    Order,
    OrderItem
};

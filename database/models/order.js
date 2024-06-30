const sequelize = require('../database');
const { DataTypes } = require('sequelize');
const User = require('./user');

// Определение модели Order
const Order = sequelize.define('order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    total_amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false // Отключение автоматических временных меток
});

// Определение связи между Order и User
Order.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Order;

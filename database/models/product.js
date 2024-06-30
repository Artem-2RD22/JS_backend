const sequelize = require('../database');
const { DataTypes } = require('sequelize');
const Category = require('./category');

const Product = sequelize.define('product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: DataTypes.TEXT,
    price: DataTypes.INTEGER,
    discont_price: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    image: DataTypes.TEXT,
    categoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'categories',
            key: 'id'
        }
    }
});

Product.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = Product;

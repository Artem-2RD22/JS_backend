const sequelize = require('../database');
const { DataTypes } = require('sequelize');

// Определение модели Role
const Role = sequelize.define('role', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    role_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    timestamps: false // Отключение автоматических временных меток
});

module.exports = Role;

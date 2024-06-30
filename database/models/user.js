const sequelize = require('../database');
const { DataTypes } = require('sequelize');
const Role = require('./role'); // Импорт модели Role

// Определение модели User
const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    created_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    role_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Role,
            key: 'id'
        }
    }
}, {
    timestamps: false // Отключение автоматических временных меток
});

// Определение связи между User и Role
User.belongsTo(Role, { foreignKey: 'role_id' });

module.exports = User;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Product = sequelize.define('Product',{
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    unit: {
        type: DataTypes.ENUM('l','ml','mg','kg','pc.'),
        defaultValue: 'pc.'
    },
    calories: {
        type: DataTypes.FLOAT,
        allowNull: true
    }
});
module.exports = Product;
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const RecipeIngredient = sequelize.define("RecipeIngredient",{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    quantity: {
        type: DataTypes.DOUBLE,
        allowNull: false
    }
});
module.exports = RecipeIngredient;
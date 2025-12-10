const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Recipe = sequelize.define("Recipe",{
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    instruction: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('draft','published','archived'),
        allowNull: false,
        defaultValue: 'draft'
    },
    public: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }

});
module.exports = Recipe;
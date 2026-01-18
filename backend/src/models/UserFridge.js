const { DataTypes, INTEGER } = require("sequelize");
const sequelize = require("../config/db");

const UserFridge = sequelize.define("UserFridge",{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    quantity:{
        type: DataTypes.DOUBLE,
        allowNull: false
    }
});
module.exports = UserFridge;
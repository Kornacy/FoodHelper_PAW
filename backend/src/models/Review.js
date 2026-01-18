const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Review = sequelize.define('Review',{
    rating:{
        type: DataTypes.FLOAT,
        allowNull: false
    },
    comment:{
        type: DataTypes.STRING,
        allowNull: true
    }
});
module.exports = Review;
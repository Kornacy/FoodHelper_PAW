const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const bcrypt = require("bcrypt");
const { use } = require("react");

const User = sequelize.define('User',{
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user' 
    }
},{
    hooks:{
        beforeCreate: async (user) => {
            if(user.password_hash){
                const salt = await bcrypt.genSalt(10);
                user.password_hash = await bcrypt.hash(user.password_hash,salt);
            }
        },
        beforeUpdate: async (user) =>{
            if (user.changed('password_hash')){
                const salt = await bcrypt.genSalt(10);
                user.password_hash = await bcrypt.hash(user.password_hash,salt)
            }
        }
    }
}
);
User.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password_hash);
}
module.exports = User;
const { Model } = require("sequelize");
const { User } = require("../models");
const passport = require('passport');
const jwt = require('jsonwebtoken');

const register = async (req,res) => {
    try {
        const {username, email, password} = req.body;

        const isUser = await User.findOne({where: {email}});
        if(isUser){
            return res.status(400).json({error: "Użytkownik o tym emailu juz istnieje"});
        }
        const newUser = await User.create({
            username,
            email,
            password_hash: password
        });
        res.status(201).json({message: "Rejestracja udana", userId: newUser.id});
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
}
const login = async (req,res,next) => {
    passport.authenticate('local',{session: false},(err, user, info) =>{
        if(err){
            return next(err);
        }
        if(!user){
            return res.status(401).json({error: info.message});
        }
        const token = jwt.sign(
            {id:user.id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: '24h'}
        );
        return res.json({
            message: "Zalogowano",
            token: token,
            user: {id: user.id, username: user.username, email: user.email, role: user.role}
        });
    })
    (req, res, next);
}
const getMe = (req, res) => {
    res.json({ user: req.user });
};
module.exports = {register, login, getMe};
const { Model } = require("sequelize");
const { User } = require("../models");
const passport = require('passport');

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
    passport.authenticate('local',(err, user, info) =>{
        if(err){
            return next(err);
        }
        if(!user){
            return res.status(401).json({error: info.message});
        }
        req.logIn(user,(err) => {
            if(err) {
                return next(err);
            }
            return res.json({
                message: "Zalogowano",
                user: {id: user.id, email: user.email, role: user.role}
            });
        });
    })
    (req, res, next);
}
const logout = (req,res) => {
    req.logout((err) => {
        if(err) return res.status(500).json({ error: "Bąąd wylogowania"});
        req.session.destroy();
        res.clearCookie('connect-sid');
        res.json({message: "Wylogowano"});
    });
};
module.exports = {register, login, logout};
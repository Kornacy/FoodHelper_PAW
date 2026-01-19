const passport = require('passport');
const LocalStrat = require('passport-local').Strategy;
const { User } = require('../models');

passport.use(new LocalStrat(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email,password,done) => {
        try {
            const user = await User.findOne({where: {email}});
            if(!user){
                return done(null,false, {message: "Nieprawidłowy email lub hasło."})
            }
            const isValid = await user.validPassword(password);
            if(!isValid){
                return done(null,false, {message: "Nieprawidłowy email lub hasło."})
            }
            return done(null,user);
        }
        catch(err) {return done(err);}
    }
));
module.exports = passport;

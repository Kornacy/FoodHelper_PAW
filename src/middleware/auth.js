const isAuth = (req,res, next) => {
    if (req.isAuthenticated()){
        return next();
    }
    res.status(401).json({error: "Nie zalogowano, brak dostępu!"});
};
module.exports = isAuth;
// src/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Brak tokena. Zaloguj się.' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
        if (err) {
            return res.status(403).json({ message: 'Token nieprawidłowy lub wygasł.' });
        }
        req.user = decodedUser;
        next();
    });
};
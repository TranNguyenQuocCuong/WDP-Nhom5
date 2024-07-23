require('dotenv').config();

const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

// Middleware JWT Authen
function authenticateToken(req, res, next) {
    // console.log('>>> SECRET_KEY: ', SECRET_KEY);
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // if (token == null) return res.sendStatus(401);
    if (token == null) {
        // Chuyển hướng đến trang login nếu không có token
        return res.redirect('/login');
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

module.exports = {
    authenticateToken
};

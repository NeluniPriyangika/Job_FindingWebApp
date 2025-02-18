const jwt = require("jsonwebtoken");

function JWTGenerator(payload) {
    const token = jwt.sign(payload,{ ID: user._id, role: user.role },  process.env.JWT_SECRET, {
        expiresIn: '1h'
    });
    return token;
}

module.exports = JWTGenerator;

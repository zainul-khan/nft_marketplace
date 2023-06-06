const jwt = require("jsonwebtoken");

async function issueToken(payload) {
    const token = await jwt.sign(payload, process.env.Jwt_Secret, { expiresIn: '7d' });
    return token;
}

module.exports = {issueToken}
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config")

/** returns signed JWT from user data */

function createToken(user) {
    console.assert(user.isAdmin!== undefined, "creatToken passed user without isAdmin property");

    let payload = {
        username: user.username,
        isAdmin: user.isAdmin || false,
    };

    return jwt.sign(payload, SECRET_KEY)
}

module.exports = { createToken }
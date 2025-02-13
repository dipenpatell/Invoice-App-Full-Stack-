const jwt = require("jsonwebtoken");

module.exports = (user) => {
    return jwt.sign({userid: user.userid, role: user.role, id: user._id}, process.env.JWT_KEY);
}
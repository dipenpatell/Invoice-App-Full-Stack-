const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization;
    if (token === undefined) {
    req.flash("error", "you need to login first");
    return res.send({success: false, message: "Unauthorized access"});
  }

  try {
    let decoded = jwt.verify(token, process.env.JWT_KEY);

    let user = await userModel
      .findOne({ userid: decoded.userid })
      .select("-password");
    if (user) {
      req.user = user;
      next();
    } else {
      res.send({success: false, message: "Something went wrong."});
    }
  } catch (err) {
    console.log(err);
    res.send({success: false, token, message: "Something went wrong."});
  }
};

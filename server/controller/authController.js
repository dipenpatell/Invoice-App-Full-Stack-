const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");
const userModel = require("../models/user-model");

module.exports.registerUser = async (req, res) => {
  try {
    let { userid, password, fullname, role } = req.body;
    console.log(req.body);

    let user = await userModel.findOne({ userid: userid });
    if (user) {
      return res.send({success: false, message: "You already have an account, Please login."});
    }

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) return res.send({success: false, message: "Something went wrong."});
        else {
          let user = await userModel.create({
            role,
            fullname,
            userid,
            password: hash,
          });

          let token = generateToken(user);
          res.cookie("token", token);
          return res.send({success: true, token, message: "Login successful.", user: { fullname: user.fullname, userid: user.userid, role: user.role }});
        }
      });
    });
  } catch (err) {
    console.log(err);
    req.flash("error", "Internal server error");
    res.send({success: false, message: "Internal server error"});
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    let { userid, password, role } = req.body;
    console.log(req.body);
    let user = await userModel.findOne({ userid: userid });
    if (!user)
      return res.send({success: false, message: "Userid or password incorrect."});
    if(user.role !== "admin" && role !== user.role) {
      return res.send({success: false, message: "You are not " + role});
    }
    console.log(user);


    bcrypt.compare(password, user.password, async (err, result) => {
      if (err) return res.send(err.message);
      else {
        if (result === true) {

          let token = generateToken(user);
          res.cookie("token", token);
          
          return res.send({success: true, token, message: "Login successful.", user: { fullname: user.fullname, userid: user.userid, role: user.role }});
        } else {
          return res.send({success: false, message: "Userid or password incorrect."});
        }
      }
    });
  } catch (err) {
    console.log(err);
    res.send({success: false, message: "Internal Servel Error"});
  }
};

module.exports.logout = async (req, res) => {
  try {
    res.cookie("token", "");
    res.status(200);
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Servel Error");
  }
};
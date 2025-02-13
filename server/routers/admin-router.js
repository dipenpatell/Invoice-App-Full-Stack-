const express = require("express");
const router = express.Router();
const stockModel = require("../models/stock-model");
const isAuth = require("../middleware/isAuth");
const { registerUser, loginUser } = require("../controller/authController");

router.post(
  "/register",
  (req, res, next) => {
    req.body.role = "admin";
    next();
  },
  registerUser
);
router.post(
  "/login",
  (req, res, next) => {
    req.body.role = "admin";
    next();
  },
  loginUser
);
router.post("/stock-add", isAuth, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      let stock = req.body;
      stock.forEach(async (e) => {
        const stock = new stockModel(e);
        await stock.save();
      });
      res.send({ success: true, message: "Stock added successfully" });
    } else {
      return res.send({ success: false, message: "Unauthorized access" });
    }
  } catch (error) {
    res
      .status(500)
      .send({
        success: false,
        message: "An error occurred",
        error: error.message,
      });
  }
});

module.exports = router;

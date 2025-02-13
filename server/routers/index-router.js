const express = require("express");
const stockModel = require("../models/stock-model");
const isAuth = require("../middleware/isAuth");
const router = express.Router();

router.get("/stock", isAuth, async (req, res) => {
  try {
    const stock = await stockModel.find();
    res.send({
      success: true,
      message: "Stock Fetched successfully",
      stock: stock,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const stockModel = require("../models/stock-model");
const ownerModel = require("../models/owner-model");
const invoiceModel = require("../models/invoice-model");
const { registerUser, loginUser } = require("../controller/authController");
const isAuth = require("../middleware/isAuth");

router.post(
  "/register",
  (req, res, next) => {
    req.body.role = "user";
    next();
  },
  registerUser
);
router.post(
  "/login",
  (req, res, next) => {
    req.body.role = "user";
    next();
  },
  loginUser
);
router.get("/invoices", isAuth, async (req, res) => {
  try {
    let user = req.user;
    let invoices = await invoiceModel.find({ user: user._id });
    res.send({
      success: true,
      message: "invoice Fetched successfully",
      invoice: invoices,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
});
router.post("/add-invoice", isAuth, async (req, res) => {
  try {
    let user = req.user;

    let invoice = await new invoiceModel({
      products: req.body.products,
      user: user._id,
      TotalPrice: req.body.TotalPrice,
    });
    await invoice.save();

    res.send({
      success: true,
      message: "Invoice Added Successfully.",
      invoice,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
});
router.put("/edit-invoice", isAuth, async (req, res) => {
  try {
    let user = req.user;
    let invoice = await invoiceModel.findById(req.body.invoiceid);

    if (!invoice) {
      return res.send({ success: false, message: "Invoice not found" });
    }
    invoice.products = req.body.products;
    invoice.TotalPrice = req.body.TotalPrice;

    await invoice.save();

    res.send({
      success: true,
      message: "Invoice Added Successfully.",
      invoice,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
});
router.post("/remove-invoice", isAuth, async (req, res) => {
  try {
    let user = req.user;
    console.log(user._id);
    console.log(req.body.user);

    if (user._id.toString() === req.body.user) {
      let invoice = await invoiceModel.findOneAndDelete({
        _id: req.body._id,
      });

      let invoices = await invoiceModel.find({ user: user._id });
      res.send({
        success: true,
        message: "Invoice Deleted Successfully.",
        invoices,
      });
    } else {
      res.send({
        success: false,
        message: "Invoice Deleted Unsuccessfully.",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
});

module.exports = router;

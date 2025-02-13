const mongoose = require("mongoose");

const invoiceSchema = mongoose.Schema({
  products: [{
    PartType: {
      type: String,
    },
    PartDescription: {
      type: String,
    },
    ProductInfo: {
      type: String,
    },
    Color: {
      type: String,
    },
    Quantity: {
      type: Number,
    },
    PartNumber: {
      type: String,
    },
    ProductPrice: {
      type: Number,
    },
    SingleP: {
      type: Number,
    },
    BulkP: {
      type: Number,
    },
  }],
  TotalPrice: {
    type: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

module.exports = mongoose.model("invoice", invoiceSchema);

const mongoose = require("mongoose");

const stockSchema = mongoose.Schema({
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
  SingleP: {
    type: Number,
  },
  BulkP: {
    type: Number,
  },
});

module.exports = mongoose.model("stock", stockSchema);

const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const orderSchema = new Schema({
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  address: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  price: { type: Number },
});

const Order = model("Order", orderSchema);
module.exports = Order;

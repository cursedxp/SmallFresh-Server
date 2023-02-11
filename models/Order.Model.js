const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const orderSchema = new Schema({
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number },
    },
  ],
  addressId: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  totalPrice: { type: Number },
});

const Order = model("Order", orderSchema);
module.exports = Order;

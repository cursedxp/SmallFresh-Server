const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  name: { type: String, required: true },
  img: { type: String },
  category: { type: String, required: true },
  brand: { type: String },
  description: { type: String },
  bio: { type: Boolean, default: false },
  stock: {
    piece: { type: Number, required: true },
    amount: { type: Number },
    unit: {
      type: String,
      enum: ["gram", "kilogram", "piece"],
      default: "gram",
    },
    price: { type: Number, required: true },
  },
});

const Product = model("Product", productSchema);
module.exports = Product;

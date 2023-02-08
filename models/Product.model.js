const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  name: { type: String, required: true },
  img: { type: String },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  description: { type: String },
  stock: {
    piece: { type: Number },
    amount: { type: Number },
    unit: {
      enum: ["gram", "kilogram", "piece"],
      default: "gram",
    },
    price: { type: Number },
  },
});

const Product = model("Product", productSchema);
module.exports = Product;

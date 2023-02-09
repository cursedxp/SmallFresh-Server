const express = require("express");
const router = express.Router();
const productSeed = require("../seed/products.json");
const Product = require("../models/Product.model");

router.get("/seed", (req, res) => {
  res.json("Hello");
  Product.create(productSeed)
    .then((result) => {
      console.log("Collection has been seeded");
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

module.exports = router;

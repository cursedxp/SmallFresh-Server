const express = require("express");
const router = express.Router();
const productSeed = require("../seed/products.json");

//Models
const Product = require("../models/Product.model");

// router.get("/seed", (req, res) => {
//   res.json("Hello");
//   Product.create(productSeed)
//     .then((result) => {
//       console.log("Collection has been seeded");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

//Products
router.get("/products", (req, res, next) => {
  Product.find()
    .then((products) => {
      res.json(products);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/products", (req, res, next) => {
  const {
    name,
    img,
    category,
    description,
    bio,
    piece,
    unit,
    brand,
    amount,
    price,
  } = req.body;

  Product.create({
    name: name,
    img: img,
    category: category,
    description: category,
    bio: bio,
    stock: {
      piece: piece,
      unit: unit,
      brand: brand,
      amount: amount,
      price: price,
    },
  })
    .then((result) => {
      res.json(result);
      console.log("New product has been added");
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

module.exports = router;

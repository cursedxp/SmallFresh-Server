const express = require("express");
const router = express.Router();
const productSeed = require("../seed/products.json");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

//Models
const Product = require("../models/Product.model");
const Address = require("../models/Address.model");
const User = require("../models/User.model");
const Order = require("../models/Order.Model");
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
      return res.json(products);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/products", isAuthenticated, (req, res, next) => {
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
      return res.json(result);
      console.log("New product has been added");
    })
    .catch((err) => {
      console.log(err);
    });
});

//Single Product
router.get("/products/:productId", (req, res, next) => {
  const { productId } = req.params;

  Product.findById(productId)
    .then((product) => {
      console.log(product);
      return res.json(product);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/products/:productId", isAuthenticated, (req, res, next) => {
  const { productId } = req.params;

  Product.findByIdAndDelete(productId)
    .then((product) => {
      console.log(product);
      return res.json(product);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/products/:productId", (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).json({ message: "Missing productId parameter" });
  }

  const requiredFields = [
    "name",
    "category",
    "amount",
    "unit",
    "brand",
    "price",
  ];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res
        .status(400)
        .json({ message: `Missing required field: ${field}` });
    }
  }

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

  return Product.findByIdAndUpdate(
    productId,
    {
      name: name,
      img: img,
      category: category,
      description: description,
      bio: bio,
      stock: {
        piece: piece,
        amount: amount,
        unit: unit,
        price: price,
      },
      brand: brand,
    },
    { new: true }
  )
    .then((updatedProduct) => {
      console.log("Updated product", updatedProduct);
      res.status(200).json(updatedProduct);
    })
    .catch((error) => {
      console.log("Error updating product", error);
      res.status(500).json({ message: "Error updating product", error });
    });
});

//Addresses
router.post("/myaddresses", isAuthenticated, (req, res, next) => {
  const {
    addressType,
    street,
    city,
    state,
    zip,
    description,
    latitude,
    longitude,
    userId,
    isDefault,
  } = req.body;

  Address.create({
    addressType: addressType,
    street: street,
    city: city,
    state: state,
    zip: zip,
    description: description,
    coordinates: {
      latitude,
      longitude,
    },
    isDefault: isDefault,
  })
    .then((address) => {
      return User.findByIdAndUpdate(
        { _id: userId },
        { $push: { addresses: address._id } },
        { new: true }
      );
    })
    .then((data) => {
      return res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/myaddresses", (req, res) => {
  const { userId } = req.query;
  User.findById(userId)
    .populate("addresses")
    .then((user) => {
      return res.json(user.addresses);
    })
    .catch((err) => {
      console.log(err);
    });
});

//My products
router.post(
  "/myproducts/:userId/products/:productId",
  isAuthenticated,
  (req, res) => {
    const { userId, productId } = req.params;

    User.findByIdAndUpdate(
      { _id: userId },
      { $addToSet: { favProducts: productId } },
      { new: true }
    )
      .then((data) => {
        return res.json(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
);

router.delete(
  "/myproducts/:userId/products/:productId",
  isAuthenticated,
  (req, res) => {
    const { userId, productId } = req.params;

    User.findByIdAndUpdate(
      { _id: userId },
      { $pull: { favProducts: productId } },
      { new: true }
    )
      .then((data) => {
        return res.json(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
);

router.get("/myproducts/:userId", (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .populate("favProducts")
    .then((user) => {
      return res.json(user.favProducts);
    })
    .catch((err) => {
      console.log(err);
    });
});

//My Orders
router.post("/myorders", isAuthenticated, (req, res) => {
  const { userId, products, addressId, totalPrice } = req.body;

  Order.create({ userId, products, addressId, totalPrice })
    .then((order) => {
      return User.findByIdAndUpdate(
        { _id: userId },
        { $push: { orders: order._id } },
        { new: true }
      );
    })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

//User details
router.get("/users/:userId", (req, res) => {
  const { userId } = req.params;
  console.log(req);
  User.findById(userId)
    .then((foundUser) => {
      if (foundUser) {
        const { firstName, lastName, email } = foundUser;
        const user = { firstName, lastName, email };
        console.log(user);
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Error finding user", error });
    });
});

//Update user details
router.put("/users/:userId", (req, res) => {
  const { userId } = req.params;
  const { firstName, lastName, email } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId parameter" });
  }

  User.findByIdAndUpdate(
    userId,
    { userId, firstName, lastName, email },
    { new: true }
  )
    .then((updatedUser) => {
      const { firstName, lastName, email } = updatedUser;
      const user = { firstName, lastName, email };
      console.log(user);
      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error updating user", error });
    });
});

router.get("/myorders", isAuthenticated, (req, res) => {
  const { userId } = req.body;
  User.findById(userId)
    .populate("orders")
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.log(err);
    });
});

//Admin orders
router.get("/admin/myorders", (req, res) => {
  const { userId } = req.body;
  Order.find()
    .then((orders) => {
      res.json(orders);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

module.exports = router;

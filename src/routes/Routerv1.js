const express = require("express");
const router = express.Router();

// middleware
const { middleware, middlewareWithLevel } = require("../middlewares/AuthMiddleware");
// end middleware

// appmiddle
const { upload } = require("../middlewares/AppMiddleware");
// end appmiddle

// user
const { getUser } = require("../controller/UserController");
router.get("/user", getUser);
router.get("/user-middle", middleware, getUser);
router.get("/user-withlevel", middleware, middlewareWithLevel(["owner", "admin", "customer"]), getUser);
// end user

// product
const { addProduct, getProducts, getProductById, updateProduct, deleteProduct } = require("../controller/ProductController");
router.post("/add-product", upload.single("img"), addProduct);
router.get("/data-products", getProducts);
router.get("/data-productbyid/:idparam", getProductById);
router.patch("/update-product/:idparam", updateProduct);
router.delete("/delete-product/:idparam", deleteProduct);
router.post("/upload", upload.single("thumbnail"), (req, res) => {
  return res.send({
    status: "success",
    message: "upload success",
  });
});
// end product

// cart
const { getCart, addDataCart, reduceQtyProduct, deleteDataCart } = require("../controller/CartController");
router.get("/data-cart", middleware, getCart);
router.post("/adddatacart", middleware, addDataCart);
router.post("/reduceqtyproduct", middleware, reduceQtyProduct);
// router.patch("/reduceqtycart/:idparam", middleware, reduceQtyDataCart);
router.delete("/deletecart/:idparam", middleware, deleteDataCart);
// end cart

// auth
const { register, login, checkToken } = require("../controller/AuthController");
router.post("/register", register);
router.post("/login", login);
router.get("/check-token", middleware, checkToken);
// end auth

module.exports = router;

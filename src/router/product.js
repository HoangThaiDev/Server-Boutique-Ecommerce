// Import Modules
const router = require("express").Router();
const { isAuth } = require("../middleware/is-auth");
const productController = require("../controllers/product");

router.get("/products", productController.getProducts);

router.get("/product/:productId", productController.getProduct);

router.get("/products/query", productController.getProductsByQuery);

router.post("/products/add-to-cart", isAuth, productController.postAddToCart);

module.exports = router;

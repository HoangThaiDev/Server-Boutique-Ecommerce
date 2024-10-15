// Import Modules
const router = require("express").Router();

const productController = require("../controllers/product");

router.get("/products", productController.getProducts);

router.get("/product/:productId", productController.getProduct);

router.get("/products/query", productController.getProductsByQuery);

module.exports = router;

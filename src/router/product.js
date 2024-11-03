// Import Modules
const router = require("express").Router();
const { isAuthentication, isAuthorization } = require("../middleware/is-auth");
const productController = require("../controllers/product");

router.get("/products", productController.getProducts);

router.get("/product/:productId", productController.getProduct);

router.get("/products/query", productController.getProductsByQuery);

router.get("/products/page", productController.getProductsByPage);

router.post(
  "/products/add-to-cart",
  isAuthentication,
  productController.postAddToCart
);

router.post(
  "/product/add",
  isAuthentication,
  isAuthorization,
  productController.postAddProduct
);

router.post(
  "/product/update",
  isAuthentication,
  isAuthorization,
  productController.postUpdateProduct
);

router.delete(
  "/product/:productId",
  isAuthentication,
  isAuthorization,
  productController.deleteProduct
);
module.exports = router;

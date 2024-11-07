// Import Modules
const router = require("express").Router();
const {
  isAuthenticationForAdmin,
  isAuthenticationForClient,
  isAuthorization,
} = require("../middleware/is-auth");
const productController = require("../controllers/product");

router.get("/products", productController.getProducts);

router.get("/product/:productId", productController.getProduct);

router.get("/products/query", productController.getProductsByQuery);

router.get("/products/page", productController.getProductsByPage);

router.post(
  "/products/add-to-cart",
  isAuthenticationForClient,
  productController.postAddToCart
);

router.post(
  "/product/add",
  isAuthenticationForAdmin,
  isAuthorization,
  productController.postAddProduct
);

router.post(
  "/product/update",
  isAuthenticationForAdmin,
  isAuthorization,
  productController.postUpdateProduct
);

router.delete(
  "/product/:productId",
  isAuthenticationForAdmin,
  isAuthorization,
  productController.deleteProduct
);
module.exports = router;

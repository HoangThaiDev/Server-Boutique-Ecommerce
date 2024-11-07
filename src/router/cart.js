// Import Modules
const router = require("express").Router();
const { isAuthenticationForClient } = require("../middleware/is-auth");
const cartController = require("../controllers/cart");

router.post(
  "/update",
  isAuthenticationForClient,
  cartController.postUpdateCart
);

router.post(
  "/delete-item",
  isAuthenticationForClient,
  cartController.postDeleteItem
);

router.get("/", isAuthenticationForClient, cartController.getCart);

module.exports = router;

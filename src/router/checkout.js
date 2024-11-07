// Import Modules
const router = require("express").Router();
const { isAuthenticationForClient } = require("../middleware/is-auth");
const checkoutController = require("../controllers/checkout");

router.post(
  "/create",
  isAuthenticationForClient,
  checkoutController.postCreateCheckout
);

router.get("/checkouts", checkoutController.getCheckouts);

router.get("/checkouts/page", checkoutController.getCheckoutsByPage);

router.get("/", isAuthenticationForClient, checkoutController.getCheckout);

module.exports = router;

// Import Modules
const router = require("express").Router();
const { isAuthentication } = require("../middleware/is-auth");
const checkoutController = require("../controllers/checkout");

router.post("/create", isAuthentication, checkoutController.postCreateCheckout);

router.get("/checkouts", checkoutController.getCheckouts);

router.get("/checkouts/page", checkoutController.getCheckoutsByPage);

router.get("/", isAuthentication, checkoutController.getCheckout);

module.exports = router;

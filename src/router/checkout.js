// Import Modules
const router = require("express").Router();
const { isAuth } = require("../middleware/is-auth");
const checkoutController = require("../controllers/checkout");

router.post("/create", isAuth, checkoutController.postCreateCheckout);

router.get("/", isAuth, checkoutController.getCheckout);

module.exports = router;

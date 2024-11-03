// Import Modules
const router = require("express").Router();
const { isAuthentication } = require("../middleware/is-auth");
const cartController = require("../controllers/cart");

router.post("/update", isAuthentication, cartController.postUpdateCart);

router.post("/delete-item", isAuthentication, cartController.postDeleteItem);

router.get("/", isAuthentication, cartController.getCart);

module.exports = router;

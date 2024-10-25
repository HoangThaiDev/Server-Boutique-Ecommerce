// Import Modules
const router = require("express").Router();
const { isAuth } = require("../middleware/is-auth");
const cartController = require("../controllers/cart");

router.post("/update", isAuth, cartController.postUpdateCart);

router.post("/delete-item", isAuth, cartController.postDeleteItem);

router.get("/", isAuth, cartController.getCart);

module.exports = router;

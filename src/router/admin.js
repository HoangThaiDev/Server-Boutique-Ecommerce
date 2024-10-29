//  Import Modules
const router = require("express").Router();
const adminController = require("../controllers/admin");
const { isAuth } = require("../middleware/is-auth");

router.post("/sign-up", adminController.postSignUpAdmin);

router.post("/login", adminController.postLoginAdmin);

router.get("/logout", isAuth, adminController.getLogout);

router.get("/", adminController.getAdmin);

module.exports = router;

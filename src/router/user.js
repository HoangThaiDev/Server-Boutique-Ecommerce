// Import Modules
const router = require("express").Router();
const { isAuthenticationForClient } = require("../middleware/is-auth");
const userController = require("../controllers/user");

router.post("/sign-up", userController.postSignUpUser);

router.post("/login", userController.postLoginUser);

router.get("/logout", isAuthenticationForClient, userController.getLogout);

router.get("/", userController.getUser);

module.exports = router;

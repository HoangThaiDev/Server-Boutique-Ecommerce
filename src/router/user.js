// Import Modules
const router = require("express").Router();

const userController = require("../controllers/user");

router.post("/sign-up", userController.postSignUpUser);

router.post("/login", userController.postLoginUser);

router.get("/", userController.getUser);

module.exports = router;

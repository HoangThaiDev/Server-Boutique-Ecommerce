//  Import Modules
const router = require("express").Router();
const adminController = require("../controllers/admin");
const { isAuthentication, isAuthorization } = require("../middleware/is-auth");

router.post("/sign-up", adminController.postSignUpAdmin);

router.post("/login", adminController.postLoginAdmin);

router.get("/logout", isAuthentication, adminController.getLogout);

router.get("/", adminController.getAdmin);

router.get("/admins", adminController.getAdmins);

router.get("/admins/page", adminController.getAdminsByPage);

router.post(
  "/update",
  isAuthentication,
  isAuthorization,
  adminController.postUpdateAdmin
);

router.delete(
  "/delete/:adminId",
  isAuthentication,
  isAuthorization,
  adminController.deleteAdmin
);

module.exports = router;

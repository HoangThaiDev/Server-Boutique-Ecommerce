const router = require("express").Router();

const sessionController = require("../controllers/session");

router.get("/room/:roomId", sessionController.getChatRoom);

module.exports = router;

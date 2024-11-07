const router = require("express").Router();

const messageController = require("../controllers/message");

router.get("/get/:roomId", messageController.getMessageByRoomId);

router.post("/send/:roomId", messageController.postSendMessageByRoomId);

module.exports = router;

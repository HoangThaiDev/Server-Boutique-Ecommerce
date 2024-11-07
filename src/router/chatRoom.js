const router = require("express").Router();

const chatRoomController = require("../controllers/chatRoom");

router.post("/create", chatRoomController.postCreateChatRoom);

router.get("/rooms", chatRoomController.getRooms);

router.post("/join/:roomID", chatRoomController.getJoinRoom);

module.exports = router;

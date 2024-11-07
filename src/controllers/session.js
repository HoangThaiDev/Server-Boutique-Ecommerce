// Import Models
const Session = require("../model/session");

exports.getChatRoom = async (req, res) => {
  const { roomId } = req.params;
  console.log(roomId);
};

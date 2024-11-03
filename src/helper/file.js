// Import Modules
const fs = require("fs");

exports.deleteFileImage = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      throw new Error(err);
    }
  });
};

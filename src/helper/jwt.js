// Import Modules
const jwt = require("jsonwebtoken");

exports.generateAccessToken = async (userId, ENV_ACCESSTOKEN) => {
  const accessToken = jwt.sign({ userId: userId }, ENV_ACCESSTOKEN, {
    expiresIn: "1m",
  });

  return accessToken;
};

exports.generateRefreshToken = async (userId, ENV_REFRESHTOKEN) => {
  const refreshToken = jwt.sign({ userId: userId }, ENV_REFRESHTOKEN, {
    expiresIn: "2m",
  });

  return refreshToken;
};

exports.verifyRefreshToken = async (refreshToken, ENV_REFRESHTOKEN) => {
  return jwt.verify(refreshToken, ENV_REFRESHTOKEN, (err, user) => {
    if (err) return err;

    return user;
  });
};

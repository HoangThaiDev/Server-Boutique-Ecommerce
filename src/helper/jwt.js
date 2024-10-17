// Import Modules
const jwt = require("jsonwebtoken");

exports.generateAccessToken = async (userId, ENV_ACCESSTOKEN) => {
  const accessToken = jwt.sign({ userId: userId }, ENV_ACCESSTOKEN, {
    expiresIn: "1h",
  });

  return accessToken;
};

exports.generateRefreshToken = async (userId, ENV_REFRESHTOKEN) => {
  const refreshToken = jwt.sign({ userId: userId }, ENV_REFRESHTOKEN, {
    expiresIn: "1d",
  });

  return refreshToken;
};

exports.verifyAccessToken = async (accessToken, ENV_ACCESSTOKEN) => {
  return jwt.verify(accessToken, ENV_ACCESSTOKEN, (err, user) => {
    if (err) return "AccessToken Expired";

    return user;
  });
};

exports.verifyRefreshToken = async (refreshToken, ENV_REFRESHTOKEN) => {
  return jwt.verify(refreshToken, ENV_REFRESHTOKEN, (err, user) => {
    if (err) return "RefreshToken Expired";

    return user;
  });
};

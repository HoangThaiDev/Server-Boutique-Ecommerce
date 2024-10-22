// Import Modules
const jwt = require("../helper/jwt");
const env = require("../config/enviroment");

exports.isAuth = async (req, res, next) => {
  const accessToken = req.headers["authorization"].split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({ message: "Session is expired!" });
  }

  //   Decoded accessToken && refreshToken
  const { refreshToken } = req.cookies;
  const accessTokenDecoded = await jwt.verifyAccessToken(
    accessToken,
    env.ACCESSTOKEN
  );
  const refreshTokenDecoded = await jwt.verifyRefreshToken(
    refreshToken,
    env.REFRESHTOKEN
  );

  //   Check refreshToke was expired
  if (refreshTokenDecoded === "RefreshToken Expired") {
    return res.status(403).json({ message: "Session is expired!" });
  }

  //   Check accessToken  was expired
  if (accessTokenDecoded === "AccessToken Expired") {
    const { userId } = refreshTokenDecoded;

    // Generate new access token
    const newAccessToken = await jwt.generateAccessToken(
      userId,
      env.ACCESSTOKEN
    );

    // Send new accessToken in the response headers
    res.setHeader("x-access-token", newAccessToken);

    req.user = userId;

    return next();
  }

  req.user = accessTokenDecoded.userId;

  next();
};

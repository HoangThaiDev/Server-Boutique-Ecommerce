// Import Models
const Admin = require("../model/admin");
const User = require("../model/user");

// Import Modules
const jwt = require("../helper/jwt");
const env = require("../config/enviroment");
const { deleteFileImage } = require("../helper/file");

exports.isAuthenticationForClient = async (req, res, next) => {
  const accessToken = req.headers["authorization"].split(" ")[1];

  if (!accessToken) {
    return res.status(400).json({ message: "AccesToken wrong!" });
  }

  //   Decoded accessToken && refreshToken
  const { refreshToken_client } = req.cookies;
  const accessTokenDecoded = await jwt.verifyAccessToken(
    accessToken,
    env.ACCESSTOKEN
  );

  const refreshTokenDecoded = await jwt.verifyRefreshToken(
    refreshToken_client,
    env.REFRESHTOKEN
  );

  //   Check refreshToke was expired
  if (refreshTokenDecoded === "RefreshToken Expired") {
    // If admin loggin => reset state of admin
    const accountAdmin = await Admin.findOne({
      "state.refreshToken": refreshToken,
    });

    if (accountAdmin) {
      accountAdmin.state = {
        refreshToken: "",
        isLoggedIn: false,
      };

      return await accountAdmin.save();
    }

    // If client loggin => reset state of admin
    const accountClient = await User.findOne({
      "state.refreshToken": refreshToken,
    });

    if (accountClient) {
      accountClient.state = {
        refreshToken: "",
        isLoggedIn: false,
      };
      return await accountClient.save();
    }

    return res.status(401).json({ message: "Session is expired!" });
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

exports.isAuthenticationForAdmin = async (req, res, next) => {
  const accessToken = req.headers["authorization"].split(" ")[1];

  if (!accessToken) {
    return res.status(400).json({ message: "AccesToken wrong!" });
  }

  //   Decoded accessToken && refreshToken
  const { refreshToken_admin } = req.cookies;
  const accessTokenDecoded = await jwt.verifyAccessToken(
    accessToken,
    env.ACCESSTOKEN
  );

  const refreshTokenDecoded = await jwt.verifyRefreshToken(
    refreshToken_admin,
    env.REFRESHTOKEN
  );

  //   Check refreshToke was expired
  if (refreshTokenDecoded === "RefreshToken Expired") {
    // If admin loggin => reset state of admin
    const accountAdmin = await Admin.findOne({
      "state.refreshToken": refreshToken,
    });

    if (accountAdmin) {
      accountAdmin.state = {
        refreshToken: "",
        isLoggedIn: false,
      };

      return await accountAdmin.save();
    }

    // If client loggin => reset state of admin
    const accountClient = await User.findOne({
      "state.refreshToken": refreshToken,
    });

    if (accountClient) {
      accountClient.state = {
        refreshToken: "",
        isLoggedIn: false,
      };
      return await accountClient.save();
    }

    return res.status(401).json({ message: "Session is expired!" });
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

exports.isAuthorization = async (req, res, next) => {
  const userId = req.user;
  const imageFiles = req.files || null;

  try {
    const user = await Admin.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "super-admin") {
      return next();
    }

    // Delete Images if dont have permission to use function
    if (imageFiles) {
      for (let image of imageFiles) {
        deleteFileImage(image.path);
      }
    }

    // If user role is not super-admin, deny access
    res.status(403).json({ message: "You need permission to use function!" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Interval Server Error!" });
  }
};

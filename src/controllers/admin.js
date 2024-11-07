// Import Modules
const bcrypt = require("bcrypt");
const env = require("../config/enviroment");

// Import Helps
const validate = require("../helper/validate");
const jwt = require("../helper/jwt");

// Import Models
const Admin = require("../model/admin");

exports.postSignUpAdmin = async (req, res) => {
  try {
    const formValues = req.body;

    // Check validate values of Form
    const errorValues = validate.admin.checkFormSignupAdmin(formValues);

    if (errorValues.length > 0) {
      return res.status(400).json({
        message: "Validation failed. Please check the form fields.",
        errors: errorValues,
      });
    }

    // // Check email existed in database
    const findedUser = await Admin.findOne({ email: formValues.email });

    if (findedUser) {
      return res
        .status(400)
        .json({ message: "Email was used. Please choose another email!" });
    }

    // // Create new user
    const hashedPassword = await bcrypt.hash(formValues.password, 12);
    const user = new Admin({
      email: formValues.email,
      password: hashedPassword,
      phone: formValues.phone,
    });

    // // Save user to the database
    const savedUser = await user.save(); // If this fails, it will throw an error and be caught in catch block.

    if (!savedUser) {
      return res
        .status(500)
        .json({ message: "Failed to create user. Please try again." });
    }

    res.status(201).json({ message: "Sign up account successfully!" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Internal Server Error!" });
  }
};

exports.postLoginAdmin = async (req, res) => {
  try {
    const formValues = req.body;

    // Check validate values of Form
    const errorValues = validate.admin.checkFormLogin(formValues);

    if (errorValues.length > 0) {
      return res.status(400).json({
        message: "Validation failed. Please check the form fields.",
        errors: errorValues,
      });
    }

    // Find admin in database (Admin)
    const admin = await Admin.findOne({ email: formValues.email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid Email or Password!" });
    }

    // Check user was loggedIn
    if (admin.state.isLoggedIn) {
      return res.status(400).json({ message: "Your account was using!" });
    }

    // Check password is correct
    const doMatch = await bcrypt.compare(formValues.password, admin.password);
    if (!doMatch) {
      return res.status(401).json({ message: "Invalid Email or Password!" });
    }

    // Create accessToken + refreshToken
    const accessToken = await jwt.generateAccessToken(
      admin._id,
      env.ACCESSTOKEN
    );
    const refreshToken = await jwt.generateRefreshToken(
      admin._id,
      env.REFRESHTOKEN
    );

    if (!accessToken || !refreshToken) {
      throw new Error("JWT is not working!");
    }

    // Save refreshToken + create new cart in database
    admin.state.refreshToken = refreshToken;
    admin.state.isLoggedIn = true;

    const resultUser = await admin.save();

    if (!resultUser) {
      return res.status(500).json({ message: "Internal Server Error!" });
    }

    // ----------------------------------------------------
    res.cookie("refreshToken_admin", refreshToken, {
      secure: env.BUILD_MODE === "dev" ? false : true,
      httpOnly: true,
      sameSite: env.BUILD_MODE === "dev" ? "lax" : "none",
    });
    res.status(200).json({
      message: "Login Account Successfully!",
      accessToken,
      isLoggedIn: true,
      role: admin.role,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

exports.getAdmin = async (req, res) => {
  const refreshToken = req.cookies.refreshToken_admin;

  // Check refreshToken is In valid or tampered in database (Collection: Admin)
  try {
    // Check if the user is logged in
    if (!refreshToken) {
      return res.status(200).json({ isLoggin: false });
    }

    const admin = await Admin.findOne({
      "state.refreshToken": refreshToken,
    });

    if (!admin) {
      res.clearCookie("refreshToken_admin", {
        httpOnly: true,
        sameSite: "lax",
      });

      return res.status(401).json({
        message: "Session is expired!",
        isLoggedIn: false,
      });
    }

    // Check refreshtoken is expired
    const resultDecoded = await jwt.verifyRefreshToken(
      refreshToken,
      env.REFRESHTOKEN
    );

    if (resultDecoded === "RefreshToken Expired") {
      // Update cookie + database
      res.clearCookie("refreshToken", {
        secure: env.BUILD_MODE === "dev" ? false : true,
        httpOnly: true,
        sameSite: env.BUILD_MODE === "dev" ? "lax" : "none",
      });
      admin.state = {
        isLoggedIn: false,
        refreshToken: "",
      };
      admin.save();

      return res
        .status(401)
        .json({ message: "Session is expired!", isLoggedIn: false });
    }

    // Create new accessToken
    const newAccessToken = await jwt.generateAccessToken(
      admin._id,
      env.ACCESSTOKEN
    );

    res.status(201).json({
      message: "Create new accessToken!",
      accessToken: newAccessToken,
      isLoggedIn: true,
      role: admin.role,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error!",
    });
  }
};

exports.getLogout = async (req, res) => {
  try {
    const adminId = req.user;

    const admin = await Admin.findByIdAndUpdate(adminId, { state: {} });

    if (!admin) {
      return res.status(400).json({ message: "No found user!" });
    }

    res.clearCookie("refreshToken", {
      secure: env.BUILD_MODE === "dev" ? false : true,
      httpOnly: true,
      sameSite: env.BUILD_MODE === "dev" ? "lax" : "none",
    });

    res.status(200).json({ message: "Logout Success!" });
  } catch (error) {
    res.status(500).json({ message: "Interval Server Error!" });
  }
};

exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select({
      "state.refreshToken": 0,
      password: 0,
    });

    if (!admins) {
      return res.status(400).json({ message: "No found admins!" });
    }

    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: "Interval Server Error!" });
  }
};

exports.getAdminsByPage = async (req, res) => {
  const { page } = req.query;
  const pageSize = 8;

  try {
    const totalAdmins = await Admin.find().countDocuments();
    const admins = await Admin.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json({ admins, totalAdmins });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Interval Server Error!" });
  }
};

exports.postUpdateAdmin = async (req, res) => {
  const { adminId, roleSelect } = req.body;

  try {
    const admin = await Admin.findByIdAndUpdate(adminId, { role: roleSelect });

    if (!admin) {
      return res.status(400).json({ message: "Update Role Failled!" });
    }

    res.status(200).json({ message: "Update Role Success!" });
  } catch (error) {
    res.status(500).json({ message: "Interval Server Error!" });
  }
};

exports.deleteAdmin = async (req, res) => {
  const { adminId } = req.params;
  console.log(adminId);

  try {
    const admin = await Admin.findByIdAndDelete(adminId);

    if (!admin) {
      return res.status(400).json({ message: "Delete Admin Failled!" });
    }

    res.status(200).json({ message: "Delete Admin Success!" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Interval Server Error!" });
  }
};

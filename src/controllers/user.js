// Import Modules
const bcrypt = require("bcrypt");
const env = require("../config/enviroment");

// Import Helpers
const validate = require("../helper/validate");
const jwt = require("../helper/jwt");

// Import Models
const User = require("../model/user");
const Cart = require("../model/cart");

exports.postSignUpUser = async (req, res) => {
  try {
    const formValues = req.body;

    // Check validate values of Form
    const errorValues = validate.user.checkFormSignupClient(formValues);

    if (errorValues.length > 0) {
      return res.status(400).json({
        message: "Validation failed. Please check the form fields.",
        errors: errorValues,
      });
    }

    // Check email existed in database
    const findedUser = await User.findOne({ email: formValues.email });

    if (findedUser) {
      return res
        .status(400)
        .json({ message: "Email was used. Please choose another email!" });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(formValues.password, 12);
    const user = new User({
      fullname: formValues.fullname,
      email: formValues.email,
      password: hashedPassword,
      phone: formValues.phone,
    });

    // Save user to the database
    const savedUser = await user.save(); // If this fails, it will throw an error and be caught in catch block.

    if (!savedUser) {
      return res
        .status(500)
        .json({ message: "Failed to create user. Please try again." });
    }

    // Respond with success if user is successfully created
    res.status(201).json({ message: "Sign up account successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

exports.postLoginUser = async (req, res) => {
  try {
    const formValues = req.body;

    // Check validate values of Form
    const errorValues = validate.user.checkFormLogin(formValues);

    if (errorValues.length > 0) {
      return res.status(400).json({
        message: "Validation failed. Please check the form fields.",
        errors: errorValues,
      });
    }

    // Find user in database (User)
    const user = await User.findOne({ email: formValues.email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Email or Password!" });
    }

    // Check password is correct
    const doMatch = await bcrypt.compare(formValues.password, user.password);
    if (!doMatch) {
      return res.status(400).json({ message: "Invalid Email or Password!" });
    }

    // Check user was loggedIn
    if (user.state.isLoggedIn) {
      return res.status(400).json({ message: "Your account was using!" });
    }

    // Create accessToken + refreshToken
    const accessToken = await jwt.generateAccessToken(
      user._id,
      env.ACCESSTOKEN
    );
    const refreshToken = await jwt.generateRefreshToken(
      user._id,
      env.REFRESHTOKEN
    );

    if (!accessToken || !refreshToken) {
      throw new Error("JWT is not working!");
    }

    // update state, create new cart in database
    user.state.refreshToken = refreshToken;
    user.state.isLoggedIn = true;

    const resultUser = await user.save();

    if (!resultUser) {
      return res.status(500).json({ message: "Internal Server Error!" });
    }

    // Check if the user has a shopping cart or not
    const existingCart = await Cart.findOne({ user: user._id }).select(
      "items totalPrice"
    );

    if (!existingCart) {
      const cart = await new Cart({
        user: user._id,
        items: [],
        totalPrice: "0",
      });

      // Save database
      const resultCart = await cart.save();
      if (!resultCart) {
        return res.status(500).json({ message: "Failed to create cart!" });
      }
    }

    // ----------------------------------------------------
    res.cookie("refreshToken", refreshToken, {
      secure: env.BUILD_MODE === "dev" ? false : true,
      httpOnly: true,
      sameSite: env.BUILD_MODE === "dev" ? "lax" : "none",
    });
    res.status(200).json({
      message: "Login Account Successfully!",
      accessToken,
      isLoggedIn: true,
      cart: existingCart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

exports.getUser = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  // Check if the user is logged in
  if (!refreshToken) {
    return res.status(200).json({ isLoggin: false });
  }

  // Check refreshToken is Invalid or tampered in database (Collection: User)
  try {
    const user = await User.findOne({
      "state.refreshToken": refreshToken,
    });

    if (!user) {
      res.clearCookie("refreshToken", { httpOnly: true, sameSite: "lax" });
      return res.status(400).json({
        message: "Something wrong. Please login again!",
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
      res.clearCookie("refreshToken", { httpOnly: true, sameSite: "lax" });
      user.state = {};
      user.save();

      return res
        .status(401)
        .json({ message: "Session is expired!", isLoggedIn: false });
    }

    // Create new accessToken
    const newAccessToken = await jwt.generateAccessToken(
      user._id,
      env.ACCESSTOKEN
    );

    // Get cart of user from database
    const cart = await Cart.findOne({ user: user._id }).select(
      "items totalPrice"
    );

    if (!cart) {
      return res.status(400).json({ message: "No found cart of user!" });
    }

    res.status(201).json({
      message: "Create new accessToken!",
      accessToken: newAccessToken,
      isLoggedIn: true,
      cart: cart,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error!",
    });
  }
};

exports.getLogout = async (req, res) => {
  try {
    const userId = req.user;

    const user = await User.findByIdAndUpdate(userId, {
      state: {
        isLoggedIn: false,
        refreshToken: "",
      },
    });

    if (!user) {
      return res.status(400).json({ message: "No found user!" });
    }

    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
    res.status(200).json({ message: "Logout Success!" });
  } catch (error) {
    res.status(500).json({ message: "Interval Server Error!" });
  }
};

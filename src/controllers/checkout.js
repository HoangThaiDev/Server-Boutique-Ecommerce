// Import Models
const Checkout = require("../model/checkout");
const Cart = require("../model/cart");
const Product = require("../model/product");

// Import Helpers
const validate = require("../helper/validate");
const { convertMoney } = require("../helper/convertMoney");
const { sendOrderToGmail } = require("../helper/gmail");

exports.postCreateCheckout = async (req, res) => {
  const formValues = req.body;
  const userId = req.user;

  // Check validate values of Form
  const errorValues = validate.checkValidateFormCheckout(formValues);

  if (errorValues.length > 0) {
    return res.status(400).json({
      message: "Validation failed. Please check the form fields.",
      errors: errorValues,
    });
  }

  try {
    // Get cart current of user in database
    const cart = await Cart.findOne({ user: userId })
      .select({
        items: 1,
        totalPrice: 1,
      })
      .lean();

    // Create new checkout for user
    const checkout = new Checkout({
      user: userId,
      info_client: formValues,
      cart: cart,
    });

    const isCheckoutValid = checkout.save();

    if (!isCheckoutValid) {
      return res.status(400).json({ message: "Create new checkout failled!" });
    }

    // Clear cart when create checkout success
    const result = await Cart.findOneAndUpdate(
      { user: userId },
      { items: [], totalPrice: "0" }
    );

    if (!result) {
      return res.status(500).json({ message: "Interval Server Error!" });
    }

    // Update value quantity of products in database
    for (const item of cart.items) {
      const product = await Product.findOne({ _id: item.itemId });

      if (product) {
        // Decrease product quantity by the amount in the cart
        const newQuantity = product.quantity - item.quantity;

        // Update the product quantity in the database
        await Product.updateOne(
          { _id: item.itemId },
          { $set: { quantity: newQuantity } }
        );
      }
    }

    await sendOrderToGmail(formValues, cart);
    res.status(200).json({ message: "Create new checkout success!" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Interval Server Error!" });
  }
};

exports.getCheckout = async (req, res) => {
  const userId = req.user;

  try {
    const products = await Product.find();

    const checkouts = await Checkout.find({
      user: userId,
    }).lean();

    if (!checkouts) {
      return res.status(400).json({ message: "No found checkout!" });
    }

    const modifiedCheckouts = checkouts.map((checkout) => {
      checkout.cart.totalPrice = convertMoney(checkout.cart.totalPrice);

      // Continue modified Items of cart
      let { items } = checkout.cart;

      items = items.map((item) => {
        item.totalPriceItem = convertMoney(item.totalPriceItem);
        products.forEach((product) => {
          if (item.itemId.toString() === product._id.toString()) {
            item.itemId = product;
          }
        });
        return item;
      });

      return checkout;
    });

    res.status(200).json(modifiedCheckouts);
  } catch (error) {
    res.status(500).json({ message: "Interval Server Error!" });
  }
};

// Import Models
const Cart = require("../model/cart");

// Import Helpers
const { convertMoney } = require("../helper/convertMoney");

exports.getCart = async (req, res) => {
  const userId = req.user;

  try {
    const cart = await Cart.findOne({ user: userId })
      .populate("items.itemId", "images name price -_id")
      .select({
        items: 1,
        totalPrice: 1,
        _id: 0,
      });

    if (!cart) {
      return res.status(400).json({ message: "No found your cart!" });
    }

    // Modify value
    cart.items = cart.items.map((item) => {
      item.itemId.price = convertMoney(item.itemId.price);

      return { ...item, totalPriceItem: convertMoney(item.totalPriceItem) };
    });

    cart.totalPrice = convertMoney(cart.totalPrice);

    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

exports.postDeleteItem = async (req, res) => {
  const { itemId } = req.body;
  const userId = req.user;

  try {
    const cart = await Cart.findOne({ user: userId })
      .populate("items.itemId", "images name price -_id")
      .select({
        items: 1,
        totalPrice: 1,
        _id: 0,
      });

    // Delete item from cart
    const filteredCartItems = cart.items.filter(
      (item) => item._id.toString() !== itemId.toString()
    );

    // // Calculator total price cart
    const totalPrice = filteredCartItems
      .reduce((acc, cur) => acc + parseInt(cur.totalPriceItem), 0)
      .toString();
    // console.log(filteredCartItems);

    const result = await Cart.findOneAndUpdate(
      { user: userId },
      { items: filteredCartItems, totalPrice: totalPrice }
    );

    if (!result) {
      return res.status(400).json({ message: "Delete Item Failled!!" });
    }

    // Modify items (convert price => money)
    const modifiedCartItems = filteredCartItems.map((item) => {
      item.itemId.price = convertMoney(item.itemId.price);
      item.totalPriceItem = convertMoney(item.totalPriceItem);
      return item;
    });

    res
      .status(200)
      .json({ cart: modifiedCartItems, totalPrice: convertMoney(totalPrice) });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Interval Server Error!" });
  }
};

exports.postUpdateCart = async (req, res) => {
  const { cart } = req.body.data;
  const userId = req.user;

  try {
    const findCart = await Cart.findOne({ user: userId });

    // Update value of cart in databasae
    findCart.items.forEach((e, i) => {
      e.quantity = cart.items[i].quantity;
      e.totalPriceItem = cart.items[i].totalPriceItem.replace(/\./g, "");
    });

    findCart.totalPrice = cart.totalPrice.replace(/\./g, "");

    const result = await Cart.findOneAndUpdate(
      { user: userId },
      { items: findCart.items, totalPrice: findCart.totalPrice }
    );

    if (!result) {
      return res.status(400).json({ message: "Update Cart Failled!!" });
    }

    res.status(200).json({ message: "Update Cart Sucess!!" });
  } catch (error) {
    res.status(500).json({ message: "Interval Server Error!" });
  }
};

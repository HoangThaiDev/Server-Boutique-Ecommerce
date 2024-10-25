// Import Modules
const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");
const path = require("path");
const ejs = require("ejs");
const juice = require("juice");
const env = require("../config/enviroment");

// Import Models
const Product = require("../model/product");

// Import Helpers
const { convertMoney } = require("./convertMoney");

// Create + use options
const optionsSendgrid = {
  auth: {
    api_key: env.API_KEY_SENDGRID,
  },
};

const mailer = nodemailer.createTransport(sgTransport(optionsSendgrid));

exports.sendOrderToGmail = async (formValues, cart) => {
  let result = false;

  const pathViews = path.join(__dirname, "..", "views", "order.ejs");

  // Update cart items: convert price => money
  for (const item of cart.items) {
    const product = await Product.findOne({ _id: item.itemId }).lean();

    if (product) {
      product.price = convertMoney(product.price);
      item.itemId = product;
      item.totalPriceItem = convertMoney(item.totalPriceItem);
    }
  }

  const orderHtml = await ejs.renderFile(pathViews, {
    title: "Order",
    formValues,
    totalPrice: convertMoney(cart.totalPrice),
    items: cart.items,
  });

  var email = {
    to: formValues.email,
    from: "thaindev2000@gmail.com",
    subject: `Hi ${formValues.fullname}`,
    text: "This is your order, please check order and feedback if you see wrong order!",
    html: juice(orderHtml),
  };

  await mailer.sendMail(email, function (err, message) {
    if (err) {
      throw new Error(err);
    }
    console.log(message);

    result = true;
  });

  return result;
};

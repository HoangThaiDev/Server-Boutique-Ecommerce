const { Schema, default: mongoose } = require("mongoose");

const cartSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "user",
    },
    items: [
      {
        itemId: {
          type: mongoose.Types.ObjectId,
          required: true,
          ref: "product",
        },
        quantity: {
          type: Number,
          required: true,
        },
        totalPriceItem: {
          type: String,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create methods of model
cartSchema.methods.checkCart = function (valueProduct) {
  if (this.items.length === 0) {
    return true;
  }

  // Check if the product was existed in cart or not
  const findIndexProduct = this.items.findIndex(
    (item) => item.itemId.toString() === valueProduct.productId.toString()
  );

  const isProductOverLimit = this.items[findIndexProduct].quantity < 20;
  return isProductOverLimit;
};

cartSchema.methods.addToCart = function (product) {
  const updateCart = { items: this.items, totalPrice: 0 };

  // Check if the product was existed in cart or not
  const findIndexProduct = updateCart.items.findIndex(
    (item) => item.itemId.toString() === product.productId.toString()
  );

  if (findIndexProduct === -1) {
    const newItem = {
      itemId: product.productId,
      quantity: product.quantity,
      totalPriceItem: product.price * product.quantity,
    };

    updateCart.items.push(newItem);
  }

  if (findIndexProduct !== -1) {
    const cloneFindProduct = this.items[findIndexProduct];

    cloneFindProduct.quantity += product.quantity;
    cloneFindProduct.totalPriceItem =
      parseInt(cloneFindProduct.totalPriceItem) +
      product.price * product.quantity;

    updateCart.items[findIndexProduct] = cloneFindProduct;
  }

  // Calculator sum items
  const newTotalPriceCart = updateCart.items
    .reduce(
      (accumulator, currentValue) =>
        accumulator + parseInt(currentValue.totalPriceItem),
      0
    )
    .toString();

  this.items = updateCart.items;
  this.totalPrice = newTotalPriceCart;

  return this.save();
};

module.exports = mongoose.model("cart", cartSchema);

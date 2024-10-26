// Import Models
const Product = require("../model/product");
const Cart = require("../model/cart");

// Import Helpers
const { filterProducts } = require("../helper/filterProducts");
const { convertMoney } = require("../helper/convertMoney");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().lean();

    if (products.length === 0) {
      return res.status(200).json({ message: "Products not found!" });
    }

    // Update Product: Convert Price => Money
    const modifiedProducts = products.map((product) => {
      return { ...product, price: convertMoney(product.price) };
    });

    res.status(200).json(modifiedProducts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

exports.getProductsByQuery = async (req, res) => {
  const queryPath = req.query;
  const pageSize = 8;
  const page = parseInt(queryPath.page) || 1;

  try {
    const products = await Product.find().lean();

    if (products.length === 0) {
      return res.status(200).json({ message: "Products not found!" });
    }

    // Filter Product By Query or not
    const filteredProducts = filterProducts(queryPath, products);

    // Pagination logic
    const startIndex = (page - 1) * pageSize;
    const paginatedProducts = filteredProducts.slice(
      startIndex,
      startIndex + pageSize
    );

    // Update Product: Convert Price => Money
    const modifiedProducts = paginatedProducts.map((product) => {
      return { ...product, price: convertMoney(product.price) };
    });

    res.status(200).json({
      products: modifiedProducts,
      totalProducts: filteredProducts.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

exports.getProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Modify Product: Property Price
    product.price = convertMoney(product.price);

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Interval Server Error!" });
  }
};

exports.postAddToCart = async (req, res) => {
  const product = req.body.valueProduct;
  const userId = req.user;
  console.log("product", product);

  try {
    // Check if the user has a shopping cart or not
    const user = await Cart.findOne({ user: userId });

    if (!user) {
      return res.status(400).json({ message: "No found cart of user!" });
    }

    const isResultCheckCart = user.checkCart(product);

    if (!isResultCheckCart) {
      return res
        .status(400)
        .json({ message: "You have reached the limit for this product!" });
    }

    const result = user.addToCart(product);

    if (!result) {
      return res.status(400).json({ message: "Add to cart failled!" });
    }

    res.status(200).json({ message: "Add to cart success!" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Interval Server Error!" });
  }
};

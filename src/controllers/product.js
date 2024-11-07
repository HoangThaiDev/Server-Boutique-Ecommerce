// Import Modules
const env = require("../config/enviroment");

// Import Models
const Product = require("../model/product");
const Cart = require("../model/cart");

// Import Helpers
const { filterProducts } = require("../helper/filterProducts");
const { convertMoney } = require("../helper/convertMoney");
const { deleteFileImage } = require("../helper/file");

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

exports.getProductsByPage = async (req, res) => {
  const { page } = req.query;
  const pageSize = 8;

  try {
    const totalProducts = await Product.find().countDocuments();
    const products = await Product.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json({ products, totalProducts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Interval Server Error!" });
  }
};

exports.postAddProduct = async (req, res) => {
  const productValues = req.body;
  const images = req.files;
  let modifiedImages;
  const BUILD_MODE = env.BUILD_MODE === "dev";

  // Check build mode is dev or production (http or https)
  if (BUILD_MODE) {
    modifiedImages = images.map(
      (img) => `http://localhost:5000/${img.filename}`
    );
  } else {
    modifiedImages = images.map(
      (img) => `https://localhost:5000/${img.filename}`
    );
  }

  try {
    const newProduct = new Product({
      name: productValues.name,
      category: productValues.category,
      quantity: parseInt(productValues.quantity),
      images: modifiedImages,
      long_desc: productValues.long_desc,
      short_desc: productValues.short_desc,
      price: productValues.price,
    });

    const result = newProduct.save();
    if (!result) {
      return res.status(400).json({ message: "Create new product failled!" });
    }

    res.status(201).json({ message: "Create new product success!" });
  } catch (error) {
    res.status(500).json({ message: "Interval Server Error!" });
  }
};

exports.deleteProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(400).json({ message: "Delete product failled!" });
    }

    res.status(200).json({ message: "Delete product success!" });

    // Delete img of product in folder images
    for (let image of product.images) {
      let convertImage;
      if (env.BUILD_MODE === "dev") {
        convertImage = image.replace("http://localhost:5000", "");
      } else {
        convertImage = image.replace("https://localhost:5000", "");
      }

      deleteFileImage("src\\images\\" + convertImage);
    }
  } catch (error) {
    res.status(500).json({ message: "Interval Server Error!" });
  }
};

exports.postUpdateProduct = async (req, res) => {
  const productValues = req.body;
  const imageFiles = req.files;

  let modifiedImages;
  const BUILD_MODE = env.BUILD_MODE === "dev";

  // Check build mode is dev or production (http or https)
  if (BUILD_MODE) {
    modifiedImages = images.map(
      (img) => `http://localhost:5000/${img.filename}`
    );
  } else {
    modifiedImages = images.map(
      (img) => `https://localhost:5000/${img.filename}`
    );
  }

  try {
    const product = await Product.findById(productValues.id);

    if (!product) {
      for (let image of imageFiles) {
        deleteFileImage(image.path);
      }
      return res.status(400).json({ message: "Error with action: Delete!" });
    }

    // Delete img of product in folder images
    for (let image of product.images) {
      let convertImage;
      if (env.BUILD_MODE === "dev") {
        convertImage = image.replace("http://localhost:5000", "");
      } else {
        convertImage = image.replace("https://localhost:5000", "");
      }

      deleteFileImage("src\\images\\" + convertImage);
    }

    // Update product
    product.name = productValues.name;
    product.category = productValues.category;
    product.quantity = parseInt(productValues.quantity);
    product.images = modifiedImages;
    product.long_desc = productValues.long_desc;
    product.short_desc = productValues.short_desc;
    product.price = productValues.price;

    const result = await product.save();

    if (!result) {
      for (let image of imageFiles) {
        deleteFileImage(image.path);
      }
      res.status(400).json({ message: "Update Product Failled!" });
      return false;
    }

    res.status(200).json({ message: "Update Product Success!" });
  } catch (error) {
    res.status(500).json({ message: "Interval Server Error!" });
  }
};

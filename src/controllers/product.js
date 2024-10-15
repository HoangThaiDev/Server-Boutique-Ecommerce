// Import Models
const Product = require("../model/product");
const { filterProducts } = require("../helper/filterProducts");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().lean();

    if (products.length === 0) {
      return res.status(200).json({ message: "Products not found!" });
    }

    // Update Product: Convert Price => Money
    const modifiedProducts = products.map((product) => {
      let VNMoney = new Intl.NumberFormat("vn-VN", {
        style: "currency",
        currency: "VND",
      });

      let formattedPrice = VNMoney.format(product.price)
        .replace(/,/g, ".")
        .replace("₫", "");

      return { ...product, price: formattedPrice };
    });

    res.status(200).json(modifiedProducts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

exports.getProductsByQuery = async (req, res) => {
  const queryPath = req.query;
  const pageSize = 2;
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
      let VNMoney = new Intl.NumberFormat("vn-VN", {
        style: "currency",
        currency: "VND",
      });

      let formattedPrice = VNMoney.format(product.price)
        .replace(/,/g, ".")
        .replace("₫", "");

      return { ...product, price: formattedPrice };
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
    let VNMoney = new Intl.NumberFormat("vn-VN", {
      style: "currency",
      currency: "VND",
    });

    let formattedPrice = VNMoney.format(product.price)
      .replace(/,/g, ".")
      .replace("₫", "");

    product.price = formattedPrice;

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Interval Server Error!" });
  }
};

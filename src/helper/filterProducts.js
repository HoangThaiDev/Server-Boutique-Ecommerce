exports.filterProducts = (query, products) => {
  // Create new Array
  let newProducts = [];

  //   Check query
  if (query.category === "all" || query.category === "other") {
    newProducts = sortProducts(products, query.option);
  }

  if (query.category !== "all" && query.category !== "other") {
    const filteredProducts = products.filter(
      (p) => p.category === query.category
    );
    newProducts = sortProducts(filteredProducts, query.option);
  }

  return newProducts;
};

const sortProducts = (products, option) => {
  let cloneProducts = [];
  switch (option) {
    case "increase":
      cloneProducts = products.sort((a, b) => a.price - b.price);
      break;
    case "decrease":
      cloneProducts = products.sort((a, b) => b.price - a.price);
      break;
    case "A - Z":
      cloneProducts = products.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        return 0;
      });
      break;
    case "Z - a":
      cloneProducts = products.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return 1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return -1;
        return 0;
      });
      break;
    default:
      cloneProducts = products;
      break;
  }
  return cloneProducts;
};

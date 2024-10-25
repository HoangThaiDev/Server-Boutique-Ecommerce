exports.convertMoney = (value) => {
  let VNMoney = new Intl.NumberFormat("vn-VN", {
    style: "currency",
    currency: "VND",
  });
  const formattedPrice = VNMoney.format(value)
    .replace(/,/g, ".")
    .replace("₫", "");
  return formattedPrice;
};

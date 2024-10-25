/** Những domain được phép truy cập tới tài nguyên của server ở môi trường production*/
exports.WHITELIST_DOMAINS_PRODUCTION = [
  "https://boutique-ecommerce-gamma.vercel.app",
  "https://admin-boutique-six.vercel.app",
];

/** Những domain được phép truy cập tới tài nguyên của server ở môi trường dev*/
exports.WHITELIST_DOMAINS_DEV = [
  "http://localhost:3000",
  "http://localhost:3001",
];

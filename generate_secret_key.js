const crypto = require("crypto");

const generateJwtSecret = () => {
  const secretLength = 64; // Panjang secret yang diinginkan (dalam bytes)
  return crypto.randomBytes(secretLength).toString("hex");
};

const jwtSecret = generateJwtSecret();
console.log("JWT_SECRET:", jwtSecret);

const jwt = require("jsonwebtoken");

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const userAuthorization = (authorization) => {
  const token = authorization.split(" ")[1];
  const tokenVerify = jwt.verify(token, process.env.SECRET_KEY);
  return tokenVerify;
};

module.exports = {
  generateOtp,
  userAuthorization,
};

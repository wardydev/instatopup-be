const express = require("express");
const {
  loginUser,
  registerUser,
  validateOtp,
} = require("../controller/user.js");

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/verify-otp", validateOtp);

module.exports = router;

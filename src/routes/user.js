const express = require("express");
const {
  loginUser,
  registerUser,
  validateOtp,
  getUserInfo,
  changePassword,
} = require("../controller/user.js");
const authenticateToken = require("../middleware/authenticateToken.js");

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/verify-otp", validateOtp);
router.get("/info", authenticateToken, getUserInfo);
router.put("/change-password", authenticateToken, changePassword);

module.exports = router;

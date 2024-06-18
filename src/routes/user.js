const express = require("express");
const { login } = require("../controller/user.js");

const router = express.Router();

router.get("/login", login);

module.exports = router;

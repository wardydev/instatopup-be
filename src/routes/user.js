const express = require("express");
const { getUsers } = require("../controller/user.js");

const router = express.Router();

router.get("/", getUsers);

module.exports = router;

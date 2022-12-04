const express = require("express");
const { logIn, signUp } = require("../Controllers/user.Controller");
const router = express.Router();

router.post("/login", logIn);
router.post("/signup", signUp);

module.exports = router;

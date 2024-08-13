const {getType, logOut} = require("../controllers/adminController");
const express = require('express')
const protect = require("./authMiddleware");
const router = express.Router();

router.get("/auth", protect, getType)
router.get("/logout", logOut)

module.exports = router;
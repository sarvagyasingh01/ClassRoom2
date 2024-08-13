const express = require("express");
const { loginstudent, getStudents } = require("../controllers/studentController");
const protect = require("../middlewares/authMiddleware");
const router = express.Router();



router.post("/login", loginstudent)
router.get("/fetch/students", protect, getStudents)

module.exports = router;
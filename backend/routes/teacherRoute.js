const express = require("express");
const { loginTeacher, registerStudent, deleteStudent, updateStudent, getStudents, getClassrooms } = require("../controllers/teacherController");
const protect = require("../middlewares/authMiddleware");
const router = express.Router();



router.post("/login", loginTeacher)
router.post("/register/student", protect, registerStudent)
router.get("/fetch/students", protect, getStudents)
router.get("/fetch/classrooms", protect, getClassrooms)
router.delete("/delete/student/:id", protect, deleteStudent)
router.put("/update/student/:id", protect, updateStudent)



module.exports = router;    
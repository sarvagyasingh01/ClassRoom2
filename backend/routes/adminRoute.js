const express = require("express");
const {
  registerTeacher,
  registerPrincipal,
  loginPrincipal,
  registerStudent,
  deleteTeacher,
  deleteStudent,
  updateTeacher,
  updateStudent,
  logout,
  createClassroom,
  assignStudentToClass,
  getTeachers,
  getStudents,
  getClassrooms,
  deleteClass,
  getType,
} = require("../controllers/adminController");
const protect = require("../middlewares/authMiddleware");
const router = express.Router();

// router.post("/register/principal", registerPrincipal);
router.post("/login", loginPrincipal);
router.get("/logout", logout);
router.post("/register/teacher", protect, registerTeacher);
router.post("/register/student", protect, registerStudent);
router.delete("/delete/teacher/:id", protect, deleteTeacher);
router.delete("/delete/student/:id", protect, deleteStudent);
router.delete("/delete/classroom/:id", protect, deleteClass);
router.put("/update/teacher/:id", protect,  updateTeacher);
router.put("/update/student/:id", protect, updateStudent);
router.post("/create/classroom", protect, createClassroom);
router.post("/assign/student/:id", protect, assignStudentToClass)
router.get("/fetch/teachers", protect, getTeachers)
router.get("/fetch/students", protect, getStudents)
router.get("/fetch/classrooms", protect, getClassrooms)
router.get("/auth", protect, getType)

module.exports = router;

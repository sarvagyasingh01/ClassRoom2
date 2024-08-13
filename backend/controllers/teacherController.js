const asyncHandler = require("express-async-handler");
const Teacher = require("../models/teacherModel");
const Student = require('../models/studentModel')
const Classroom = require('../models/classroomModel')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Generate Json Web Token
const generateToken = (id, type) => {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

//Login Teacher
const loginTeacher = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  //Check if user exists
  const teacher = await Teacher.findOne({ email });
  if (!teacher) {
    res.status(400);
    throw new Error("User not found, please sign up");
  }

  //User exisits, check if password is correct
  const passwordIsCorrect = await bcrypt.compare(password, teacher.password);

  if (teacher && passwordIsCorrect) {
    const { name, email } = teacher;

    //Generate token
    const token = generateToken(teacher._id, teacher.type);

    // Send http only cookie
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
      secure: true,
      sameSite: "None",
      path: "/",
    });

    res.status(200).json({
      name,
      email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

//Register Student
const registerStudent = asyncHandler(async (req, res) => {
  if (req.user.type != "teacher") {
    res.status(400);
    throw new Error("Not Authorized!");
  }

  const { name, email, password, classroom } = req.body;

  // Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must contain at least 6 letters");
  }

  // Check if email already exists
  const studentExists = await Student.findOne({ email });

  if (studentExists) {
    res.status(400);
    throw new Error("Email already used");
  }

  if (!classroom) {
    // Create new student without assigning a classroom
    const student = await Student.create({ name, email, password });

    if (student) {
      const { _id, name, email } = student;
      res.status(201).json({
        _id,
        name,
        email,
      });
    } else {
      res.status(400);
      throw new Error("Invalid User Data");
    }
  } else {
    // Check if the classroom exists
    const classExists = await Classroom.findOne({ name: classroom });

    // Create a new student and assign the classroom
    const student = await Student.create({
      name,
      email,
      password,
      className: classExists.name,
      classroom: classExists._id,
    });

    if (student) {
      const { _id, name, email, className } = student;
      res.status(201).json({
        _id,
        name,
        email,
        className,
      });
    } else {
      res.status(400);
      throw new Error("Invalid User Data");
    }
  }
});

//Delete Student
const deleteStudent = asyncHandler(async (req, res) => {
  if (req.user.type != "teacher") {
    res.status(400);
    throw new Error("Not Authorized!");
  }
  const { id } = req.params;

  const student = await Student.findById(id);
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  try {
    await Student.findByIdAndDelete(id);
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500);
    throw new Error("Internal Server Error");
  }
});

//Update Student
const updateStudent = asyncHandler(async (req, res) => {
  if (req.user.type !== "teacher") {
    res.status(400);
    throw new Error("Not Authorized!");
  }

  const { id } = req.params;
  const { name, email, classroom } = req.body;
  const student = await Student.findById(id);

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  if (!classroom) {
    try {
      await Student.findByIdAndUpdate(
        id,
        { name, email },
        { new: true, runValidators: true }
      );
      res.status(200).json({ message: "Student Updated Successfully" });
    } catch (error) {
      res.status(400);
      throw new Error("Internal Server Error");
    }
  } else {
    const classExists = await Classroom.findOne({ name: classroom });
    try {
      await Student.findByIdAndUpdate(
        id,
        {
          name,
          email,
          className: classExists.name,
          classroom: classExists._id,
        },
        { new: true, runValidators: true }
      );
      res.status(200).json({ message: "Student Updated Successfully" });
    } catch (error) {
      res.status(400);
      throw new Error("Internal Server Error");
    }
  }
});

//Get all students
const getStudents = asyncHandler(async (req, res) => {
  if (req.user.type != "teacher") {
    res.status(400);
    throw new Error("Not Authorized!");
  }
  const teacher = await Teacher.findById(req.user._id)
  
  try {
    const students = await Student.find({ classroom: teacher.classroom }).populate("classroom").select('-password');;
    res.status(200).json(students);
  } catch (error) {
    res.status(400);
    throw new Error("Internal Server Error");
  }
});

const getClassrooms = asyncHandler(async (req, res) => {
  if (req.user.type != "teacher") {
    res.status(400);
    throw new Error("Not Authorized!");
  }
  try {
    const classrooms = await Classroom.find();
    res.status(200).json(classrooms);
  } catch (error) {
    res.status(400);
    throw new Error("Internal Server Error");
  }
});

module.exports = {
  loginTeacher,
  registerStudent,
  deleteStudent,
  updateStudent,
  getStudents,
  getClassrooms
};

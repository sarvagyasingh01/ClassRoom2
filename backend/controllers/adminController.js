const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const Teacher = require("../models/teacherModel");
const Principal = require("../models/principalModel");
const Student = require("../models/studentModel");
const bcrypt = require("bcryptjs");
const Classroom = require("../models/classroomModel");

//Generate Json Web Token
const generateToken = (id, type) => {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const registerPrincipal = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  const principal = await Principal.create({
    email,
    password,
  });

  if (principal) {
    const { email } = principal;
    res.status(201).json({
      email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//Login Principal
const loginPrincipal = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  //Check if user exists
  const principal = await Principal.findOne({ email });
  if (!principal) {
    res.status(400);
    throw new Error("User not found, please sign up");
  }

  //User exisits, check if password is correct
  const passwordIsCorrect = await bcrypt.compare(password, principal.password);

  if (principal && passwordIsCorrect) {
    const { name, email } = principal;

    //Generate token
    const token = generateToken(principal._id, principal.type);

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

//Logout Principal
const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

//Register Teacher
const registerTeacher = asyncHandler(async (req, res) => {
  if (req.user.type != "principal") {
    res.status(400);
    throw new Error("Not Authorized!");
  }
  const { name, email, password, classroom } = req.body;
  //validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must contain at least 6 letters");
  }

  //Check if email already exists
  const TeacherExists = await Teacher.findOne({ email });

  if (TeacherExists) {
    res.status(400);
    throw new Error("Email already used");
  }

  if (!classroom) {
    //Create new teacher
    const teacher = await Teacher.create({ name, email, password });

    if (teacher) {
      const { _id, name, email, className } = teacher;
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
  } else {
    const assignedTeacher = await Teacher.findOne({ className: classroom });
    if (assignedTeacher) {
      res.status(400);
      throw new Error("Classroom already assigned to a teacher");
    }
    const classExists = await Classroom.findOne({ name: classroom });
    const teacher = await Teacher.create({
      name,
      email,
      password,
      className: classExists.name,
      classroom: classExists._id,
    });
    classExists.teacher = teacher._id;
    classExists.teachername = teacher.name;
    if (teacher) {
      const { _id, name, email, className } = teacher;
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

//Register Student
const registerStudent = asyncHandler(async (req, res) => {
  if (req.user.type != "principal") {
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

//Delete Teacher
const deleteTeacher = asyncHandler(async (req, res) => {
  if (req.user.type != "principal") {
    res.status(400);
    throw new Error("Not Authorized!");
  }
  const { id } = req.params;

  const teacher = await Teacher.findById(id);
  if (!teacher) {
    res.status(404);
    throw new Error("Teacher not found");
  }

  try {
    if (!teacher.classroom) {
      await Teacher.findByIdAndDelete(id);
      res.status(200).json({ message: "Teacher deleted successfully" });
    } else {
      const classExists = await Classroom.findById(teacher.classroom);
      await Teacher.findByIdAndDelete(id);
      classExists.teacherName = undefined;
      classExists.teacher = undefined;
      classExists.save();
      res.status(200).json({ message: "Teacher deleted successfully" });
    }
  } catch (error) {
    res.status(500);
    throw new Error("Internal Server Error");
  }
});

//Delete Student
const deleteStudent = asyncHandler(async (req, res) => {
  if (req.user.type != "principal") {
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

const deleteClass = asyncHandler(async (req, res) => {
  // Check if the user is a principal
  if (req.user.type !== "principal") {
    res.status(400);
    throw new Error("Not Authorized!");
  }

  // Extract class ID from the request parameters
  const { id } = req.params;

  // Find the class by ID
  const classroom = await Classroom.findById(id);
  if (!classroom) {
    res.status(404);
    throw new Error("Classroom not found");
  }

  try {
    // Check if the class has a teacher assigned
    if (!classroom.teacher) {
      // If no teacher is assigned, delete the class directly
      await Classroom.findByIdAndDelete(id);
      res.status(200).json({ message: "Classroom deleted successfully" });
    } else {
      // If a teacher is assigned, remove the teacher assignment before deleting
      const teacher = await Teacher.findById(classroom.teacher);
      if (teacher) {
        teacher.classroom = undefined;
        teacher.className = undefined;
        teacher.save();
      }
      await Classroom.findByIdAndDelete(id);
      res.status(200).json({ message: "Classroom deleted successfully" });
    }
  } catch (error) {
    res.status(500);
    throw new Error("Internal Server Error");
  }
});

//Update Teacher
const updateTeacher = asyncHandler(async (req, res) => {
  if (req.user.type != "principal") {
    res.status(400);
    throw new Error("Not Authorized!");
  }
  const { id } = req.params;
  const { name, email, classroom } = req.body;
  const teacher = await Teacher.findById(id);
  if (!teacher) {
    res.status(404);
    throw new Error("Teacher not found");
  }
  if (!classroom) {
    try {
      await Teacher.findByIdAndUpdate(
        id,
        { name, email },
        { new: true, runValidators: true }
      );
      res.status(200).json({ message: "Teacher Updated Successfully" });
    } catch (error) {
      res.status(400);
      throw new Error("Internal Server Error");
    }
  } else {
    const classExists = await Classroom.findOne({ name: classroom });

    try {
      await Teacher.findByIdAndUpdate(
        id,
        {
          name,
          email,
          className: classExists.name,
          classroom: classExists._id,
        },
        { new: true, runValidators: true }
      );
      res.status(200).json({ message: "Teacher Updated Successfully" });
      classExists.teacherName = name;
      classExists.teacher = id;
      classExists.save();
    } catch (error) {
      res.status(400);
      throw new Error("Internal Server Error");
    }
  }
});

//Update Student
const updateStudent = asyncHandler(async (req, res) => {
  if (req.user.type !== "principal" && req.user.type !== "teacher") {
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

//Create Classroom
const createClassroom = asyncHandler(async (req, res) => {
  if (req.user.type != "principal") {
    res.status(400);
    throw new Error("Not Authorized!");
  }

  const { name, startTime, endTime } = req.body;
  if (!name || !startTime || !endTime) {
    res.status(400);
    throw new Error("Fill all the fields!");
  }

  const classExists = await Classroom.findOne({ name });
  if (classExists) {
    res.status(400);
    throw new Error("Classroom already exists");
  }

  try {
    const classroom = await Classroom.create({
      name,
      startTime,
      endTime,
    });
    res.status(201).json({ classroom });
  } catch (error) {
    res.status(400);
    throw new Error("Internal Server Error");
  }
});

//Assign student to classroom
const assignStudentToClass = asyncHandler(async (req, res) => {
  if (req.user.type != "principal") {
    res.status(400);
    throw new Error("Not Authorized!");
  }
  const { id } = req.params;
  const { name } = req.body;
  const student = await Student.findById(id);
  if (!student) {
    res.status(400);
    throw new Error("Student not found");
  }
  if (!name) {
    res.status(400);
    throw new Error("Please enter the name of the class");
  }
  const classroom = await Classroom.findOne({ name });
  if (!classroom) {
    res.status(400);
    throw new Error("Classroom not found");
  }

  try {
    student.classroom = classroom._id;
    student.save();
    res.status(201).json({ message: "Student assigned to class successfully" });
  } catch (error) {
    res.status(400);
    throw new Error("Internal Server Error");
  }
});

//Get all teachers
const getTeachers = asyncHandler(async (req, res) => {
  if (req.user.type != "principal") {
    res.status(400);
    throw new Error("Not Authorized!");
  }
  try {
    const teachers = await Teacher.find().select('-password');
    res.status(200).json(teachers);
  } catch (error) {
    res.status(400);
    throw new Error("Internal Server Error");
  }
});

//Get all students
const getStudents = asyncHandler(async (req, res) => {
  if (req.user.type != "principal") {
    res.status(400);
    throw new Error("Not Authorized!");
  }
  try {
    const students = await Student.find().select('-password');
    res.status(200).json(students);
  } catch (error) {
    res.status(400);
    throw new Error("Internal Server Error");
  }
});

//Get all classrooms
const getClassrooms = asyncHandler(async (req, res) => {
  if (req.user.type != "principal") {
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

const getType = asyncHandler(async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401);
      throw new Error("User not authorized, please login");
    }

    //Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const type = verified.type
    res.status(200).json({type})
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, please login");
  }
});

const logOut = async (req, res) => {
  res.clearCookie("token")
  res.status(200).json({message: "Logged out successfully!"})
}

module.exports = {
  registerPrincipal,
  loginPrincipal,
  logout,
  registerTeacher,
  registerStudent,
  createClassroom,
  deleteTeacher,
  deleteStudent,
  deleteClass,
  updateTeacher,
  updateStudent,
  assignStudentToClass,
  getTeachers,
  getStudents,
  getClassrooms,
  getType,
  logOut
};

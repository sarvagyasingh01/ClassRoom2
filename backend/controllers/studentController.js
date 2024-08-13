const asyncHandler = require("express-async-handler");
const Student = require("../models/studentModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Generate Json Web Token
const generateToken = (id, type) => {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const loginstudent = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const student = await Student.findOne({ email });
  if (!student) {
    res.status(401);
    throw new Error("student not found");
  }

  const passwordIsCorrect = await bcrypt.compare(password, student.password);

  if (student && passwordIsCorrect) {
    const { name, email } = student;

    const token = generateToken(student._id, student.type);

    // Send http only cookie
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
      secure: true,
      sameSite: "None",
      path: "/",
    });

    res.json({
      id: student._id,
      name,
      email,
    });
  }
  else{
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const getStudents = asyncHandler(async (req, res) => {
  if (req.user.type != "student") {
    res.status(400);
    throw new Error("Not Authorized!");
  }
  const student = await Student.findById(req.user._id)
  
  try {
    const students = await Student.find({ classroom: student.classroom }).populate("classroom").select('-password');;
    res.status(200).json(students);
  } catch (error) {
    res.status(400);
    throw new Error("Internal Server Error");
  }
});

module.exports = {
    loginstudent,
    getStudents
}

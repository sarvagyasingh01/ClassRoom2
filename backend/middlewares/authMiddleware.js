const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const Principal = require("../models/principalModel");
const Teacher = require("../models/teacherModel");
const Student = require("../models/studentModel");

const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401);
      throw new Error("User not authorized, please login");
    }

    //Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (verified.type == "principal") {
      const user = await Principal.findById(verified.id).select("-password");
      if (!user) {
        res.status(401);
        throw new Error("User not found");
      }
      req.user = user;
      next();
    } else if (verified.type == "teacher") {
      const user = await Teacher.findById(verified.id).select("-password");
      if (!user) {
        res.status(401);
        throw new Error("User not found");
      }
      req.user = user;
      next();
    } else {
      const user = await Student.findById(verified.id).select("-password");
      if (!user) {
        res.status(401);
        throw new Error("User not found");
      }
      req.user = user;
      next();
    }
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, please login");
  }
});

module.exports = protect;

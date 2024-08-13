const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors')
const adminRoute = require('./routes/adminRoute')
const teacherRoute = require('./routes/teacherRoute')
const studentRoute = require('./routes/studentRoute')
const authRoute = require('./middlewares/clientAuth')

const cookieParser = require("cookie-parser")
const errorHandler = require('./middlewares/errorMiddleware')


const app = express();

//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  //"https://class-room-frontend.vercel.app"
  
  cors({
    origin: ["http://localhost:5173"],
    credentials:true,
  })
);

//Routes Middleware
app.use("/api/admin/", adminRoute);
app.use("/api/teacher/", teacherRoute);
app.use("/api/student/", studentRoute);
app.use("/api/", authRoute )


//Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

//Connect to DB ans start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));




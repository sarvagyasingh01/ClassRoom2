const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const teacherSchema = mongoose.Schema({
    type: {
        type: String,
        default: "teacher"
    },
    className: {
        type: String,
        
    },
    classroom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classroom'
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
        trim: true,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,"Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minLength: [6, "Password should contain minimum 6 letters"],
    }

}, {
    timestamps: true
})

//Encrypt password before saving to db
teacherSchema.pre("save", async function(next) {
    if(!this.isModified("password")){
        return next();
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword
})

const Teacher = mongoose.model("Teacher", teacherSchema)
module.exports = Teacher
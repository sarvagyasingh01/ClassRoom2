const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const principalSchema = mongoose.Schema({
    type: {
        type: String,
        default: "principal"
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
    }

}, {
    timestamps: true
})

//Encrypt password before saving to db
principalSchema.pre("save", async function(next) {
    if(!this.isModified("password")){
        return next();
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword
})

const Principal = mongoose.model("Principal", principalSchema)
module.exports = Principal
const mongoose = require("mongoose")

const classroomSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    teacherName: {
        type: String,

    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
    },
    startTime: {
        type: "String",
        required: true
    },
    endTime: {
        type: "String",
        required: true
    }
})

const Classroom = mongoose.model("Classroom", classroomSchema)
module.exports = Classroom
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const quizSchema = new Schema({
    test: {
        type: Array,

    },
    name: {
        type: String
    }

});



const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;
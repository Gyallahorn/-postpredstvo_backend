const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Long, Double, Decimal128 } = require("mongodb");
const Schema = mongoose.Schema;

const difficultSchema = new Schema({
    difficult: {
        type: String,

    },
    difficult_name: {
        type: String,
    },

    type: {
        type: String,

    },
    rating: {
        type: Number,
    },
    img: {
        type: String,
    },

    number_of_people: {
        type: Number
    },
    long: {
        type: String,
    }

});

// routeSchema.pre("save", async function (next) {
//     try {
//         const salt = await bcrypt.genSalt(10);
//         const passwordHash = await bcrypt.hash(this.password, salt);
//         this.password = passwordHash;
//         next();
//     } catch (err) {
//         next(err);
//     }
// });



const Difficult = mongoose.model('Difficult', difficultSchema);
module.exports = Difficult;
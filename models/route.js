const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Long, Double, Decimal128 } = require("mongodb");
const Schema = mongoose.Schema;

const routeSchema = new Schema({
    lng: {
        type: Number,

    },
    ltd: {
        type: Number,

    },
    name: {
        type: String,
    },
    street: {
        type: String
    },
    img: {
        type: String
    },
    desc: {
        type: String
    },
});

routeSchema.pre("save", async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(this.password, salt);
        this.password = passwordHash;
        next();
    } catch (err) {
        next(err);
    }
});



const Route = mongoose.model('Route', routeSchema);
module.exports = Route;
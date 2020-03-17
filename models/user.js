const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true, unique: true
    },
    password: {
        type: String, required: true

    },
    isVerified: {
        type: Boolean,
        required: false,
        default: false
    }
});

userSchema.pre("save", async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(this.password, salt);
        this.password = passwordHash;
        next();
    } catch (err) {
        next(err);
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
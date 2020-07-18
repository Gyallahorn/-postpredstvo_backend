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
    },
    test:{
        type:Number,
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

userSchema.methods.isValidPassword = async function(newPassword) {
    try {
      return await bcrypt.compare(newPassword, this.password);
    } catch (error) {
      throw new Error(error);
    }
  };

const User = mongoose.model('User', userSchema);
module.exports = User;
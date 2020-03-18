
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const VerificationToken = require('../models/VerificationModel');
const passport = require('passport');
const crypto = require('crypto');
const { JWT_SECRET } = require("../configuration/index");
const passportSignIn = passport.authenticate("local", { session: false });
const User = require('../models/user');
const jwt_token = require('jwt-decode');

signToken = user => {
    return JWT.sign(
        {
            iss: "MedHub",
            sub: user._id,
            iat: new Date().getTime(), // current time
            exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day
        },
        JWT_SECRET
    );
};
module.exports = {
    signUp: async (req, res, next) => {
        const email = req.value.body.email; const password = req.value.body.password;
        console.log(
            email
        );
        const foundUser = await User.findOne({ email });
        if (foundUser) {

            return res.status(400).json({ msg: "email is already used" });

        }
        const newUser = new User({ email, password });
        await newUser.save();

        var verificationToken = new VerificationToken({
            userId: newUser.id,
            verToken: crypto.randomBytes(16).toString("hex")
        });
        await verificationToken.save(err => {
            console.log(verificationToken.verToken);
        });

        return res.status(200).json({ msg: "success" });
    },
    signIn: async (req, res, next) => {
        const email = req.value.body.email; const password = req.value.body.password;
        User.findOne({ email }, (err, user) => {
            const token = signToken(req.user);
            res.status(200).json({ token });
        })
    }

}


// module.exports = {
//     authenticate,
//     getAll,
//     getById,
//     create,
//     update,
//     delete: _delete
// };

// async function authenticate({ username, password }) {
//     const user = await User.findOne({ username });
//     if (user && bcrypt.compareSync(password, user.hash)) {
//         const { hash, ...userWithoutHash } = user.toObject();
//         const token = jwt.sign({ sub: user.id }, config.secret);
//         return {
//             ...userWithoutHash,
//             token
//         };
//     }
// }

// async function getAll() {
//     return await User.find().select('-hash');
// }

// async function getById(id) {
//     return await User.findById(id).select('-hash');
// }

// async function create(userParam) {
//     // validate

//     const email = userParam.email;
//     const password = userParam.password;
//     console.log(userParam.email + userParam.password)
//     const newUser = new User({ email, password });
//     await newUser.save

// }
// async function update(id, userParam) {
//     const user = await User.findById(id);

//     // validate
//     if (!user) throw 'User not found';
//     if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
//         throw 'Username "' + userParam.username + '" is already taken';
//     }

//     // hash password if it was entered
//     if (userParam.password) {
//         userParam.hash = bcrypt.hashSync(userParam.password, 10);
//     }

//     // copy userParam properties to user
//     Object.assign(user, userParam);

//     await user.save();
// }

// async function _delete(id) {
//     await User.findByIdAndRemove(id);
// }
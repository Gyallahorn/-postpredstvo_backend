
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const VerificationToken = require('../models/VerificationModel');
const passport = require('passport');
const crypto = require('crypto');
const { JWT_SECRET } = require("../configuration/index");
const passportSignIn = passport.authenticate("local", { session: false });
const User = require('../models/user');
const jwt_token = require('jwt-decode');
const argon = require('argon2');
const { db } = require('../models/VerificationModel');
const nodemailer = require('nodemailer');

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
    greetings: async (req, res, next) => {
        return res.send('Hello there')
    },

    signUp: async (req, res, next) => {
        const email = req.value.body.email; const password = req.value.body.password;
        console.log(email);
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

        try {


            if (!foundUser) {
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    host: 'smtp.gmail.com',
                    auth: {
                        user: 'postpredstvoykt@gmail.com',
                        pass: 'Supereasypassword'
                    }

                });

                const info = {
                    from: "postpredstvoykt@gmail.com",
                    to: email,
                    subject: "Код потверждения",
                    text: `localhost:4000/api/user/confirm/${verificationToken.verToken}`,

                }

                transporter.sendMail(info, function (error, info) {
                    if (error) {
                        console.log(error);
                    }
                    else {

                        console.log('Email sent' + info.response.toString);
                    }
                });

            }
        }
        catch (err) {
            console.log(err);
        }


        return res.status(200).json({ msg: "success" });
    },



    signIn: async (req, res, next) => {
        const email = req.body.email; const password = req.body.password;
        var passwordCorrect = false;
        foundUser = await User.findOne({ email });
        const token = jwt.sign({ email }, 'my_secret_key');

        if (foundUser) {
            passwordCorrect = await foundUser.isValidPassword(password);
            if (!foundUser.confirmed) {
                if (passwordCorrect) {
                    res.json({ msg: "success", token: token });
                }
                else {
                    res.json({ msg: "wrong password or email" });
                }
            }
            else {
                res.json({ msg: "confirm your email" });
            }

        }
        else {
            return res.json({ msg: "user not found" });
        }

        console.log("user exist and password correct");

        // jwt.verify(req.token, 'my_secret_key', (err, data) => {
        //     if (err) {
        //         console.log(err);
        //         res.sendStatus(403);
        //     } else {
        //         if (foundUser) {
        //             console.log("user exist");

        //         }

        //     }
        // });

    },
    ensureToken: async (req, res, next) => {
        const bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(" ");
            const bearerToken = bearer[1];
            req.token = bearerToken;
            console.log("token ok");
            next();
        } else {
            console.log("token bad");

            res.sendStatus(403);
        }
    },

    updateTest: async (req, res, next) => {
        const email = req.body.email
        foundUser = await User.findOne({ email });

        jwt.verify(req.token, 'my_secret_key', (err, data) => {
            if (err) {
                console.log(err);
                return res.json({ msg: "invalid token" });
            } else {
                if (foundUser) {
                    console.log("user exist");

                    db.collection('users').updateOne({ 'email': email }, { $set: { test: req.body.test } }, (err, result) => {

                        if (err) {
                            return res.json({ msg: "error" + err });
                        }
                        else {
                            return res.json({ msg: "success" });
                        }
                    })
                }
                else {
                    return res.json({ msg: "error" });
                }

            }
        });



    },
    confirmation: async (req, res, next) => {
        let vertoken = req.params.token;
        VerificationToken.findOne({ verToken: vertoken }, (err, response) => {
            if (response.verToken != vertoken) {
                console.log(vertoken);
                console.log(response.verToken);
                return res.send('token not found!');
            }
            User.findOne({ _id: response.userId }, (err, user) => {
                console.log(user);
                db.collection('users').updateOne({ 'email': user.email }, { $set: { confirmation: true } }, (err, result) => {

                    if (err) {
                        return res.json({ msg: "error" + err });
                    }
                    else {
                        return res.json({ msg: "user verified!" });
                    }
                })
            });
        })
    },


    updateLocations: async (req, res, next) => {
        const email = req.body.email
        foundUser = await User.findOne({ email });

        jwt.verify(req.token, 'my_secret_key', (err, data) => {
            if (err) {
                console.log(err);
                return res.json({ msg: "invalid token" });
            } else {
                if (foundUser) {
                    console.log("user exist");

                    db.collection('users').updateOne({ 'email': email }, { $set: { locations: req.body.locations } }, (err, result) => {

                        if (err) {
                            return res.json({ msg: "error" + err });
                        }
                        else {
                            return res.json({ msg: "success" });
                        }
                    })
                }
                else {
                    return res.json({ msg: "error" });
                }

            }
        });



    },
    getProfile: async (req, res, next) => {
        const email = req.body.email
        foundUser = await User.findOne({ email });

        jwt.verify(req.token, 'my_secret_key', (err, data) => {
            if (err) {
                console.log(err);
                return res.json({ msg: "invalid token" });
            } else {
                if (foundUser) {
                    console.log("user exist");

                    db.collection('users').find({ 'email': email, }, (err, result) => {

                        if (err) {
                            return res.json({ msg: "error " + err });
                        }
                        else {
                            return res.json(foundUser);
                        }
                    })
                }
                else {
                    return res.json({ msg: "error" });
                }

            }
        });

    },

    getVerification: async (req, res, next) => {


    },

}

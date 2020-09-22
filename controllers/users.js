
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const VerificationToken = require('../models/VerificationModel');
const passport = require('passport');
const crypto = require('crypto');
const { JWT_SECRET } = require("../configuration/index");
const passportSignIn = passport.authenticate("local", { session: false });
const User = require('../models/user');
const Route = require('../models/route');
const Difficult = require('../models/difficulties');
const jwt_token = require('jwt-decode');
const argon = require('argon2');
const { db } = require('../models/VerificationModel');
const nodemailer = require('nodemailer');
const { Console } = require('console');
const { format } = require('path');
const { use } = require('passport');
const e = require('express');

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
                        pass: 'fnrhxfhfomlbrjnk'
                    }

                });

                const info = {
                    from: "postpredstvoykt@gmail.com",
                    to: email,
                    subject: "Код потверждения",
                    text: `https://postpredstvo-back.herokuapp.com/api/user/confirm/${verificationToken.verToken}`,

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
        try {
            if (foundUser) {
                passwordCorrect = await foundUser.isValidPassword(password);
                if (foundUser.confirmed) {
                    if (passwordCorrect) {
                        console.log("success");
                        return res.json({ msg: "success", token: token, status: 200 });
                    }
                    else {
                        console.log("wrong password ");
                        return res.json({ msg: "wrong password or email" });
                    }
                }
                else {
                    console.log("confirm ur email ");
                    return res.json({ msg: "confirm your email" }).status(401);
                }
            }
            else {
                console.log("user not found"); return res.json({ msg: "user not found" });
            }
        } catch (error) {
            console.log(error);
        }


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
        let token = req.token;
        var userTest = req.body.test;


        console.log("Users token:" + token);
        var userEmail;
        jwt.verify(req.token, 'my_secret_key', async (err, data) => {
            if (err) {
                console.log(err);
                return res.json({ msg: "invalid token", error: err });
            }
            userEmail = data.email;
        });
        db.collection('users').updateOne({ email: userEmail }, { $set: { test: userTest } }, (err, result) => {
            if (err) {
                return res.json({ msg: err });
            }



        })
        return res.json({ msg: "success", });


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
                db.collection('users').updateOne({ 'email': user.email }, { $set: { confirmed: true } }, (err, result) => {

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


    updateEasyLocations: async (req, res, next) => {
        let token = req.token;
        let lng = req.body.lng;
        let ltd = req.body.ltd;

        console.log("Users token:" + token);
        var userEmail;
        let users = db.collection('users');
        jwt.verify(req.token, 'my_secret_key', async (err, data) => {
            if (err) {
                console.log(err);
                return res.json({ msg: "invalid token", error: err });
            }
            userEmail = data.email;
        });

        users.findOne({ email: userEmail }, (err, result) => {
            if (err) {
                return console.log(err)
            }

            arr_lng = result.lng;
            arr_ltd = result.ltd;
            visited = arr_lng.length;
            console.log(visited);
            arr_lng[visited] = lng;
            arr_ltd[visited] = ltd;
            console.log(arr_ltd);

            users.updateOne({ email: userEmail }, { $set: { lng: arr_lng, ltd: arr_ltd } }, (err, result) => {
                if (err) {
                    return res.json({ msg: err });
                }
                return res.json({ message: "succes", status: result.visited });
            })

        });

    },


    getProfile: async (req, res, next) => {
        let token = req.token;
        console.log("Users token:" + token);
        var userEmail;
        jwt.verify(req.token, 'my_secret_key', async (err, data) => {
            if (err) {
                console.log(err);
                return res.json({ msg: "invalid token", error: err });
            }
            userEmail = data.email;
        });
        foundUser = await User.findOne({ email: userEmail });
        if (foundUser.name != null) {
            return res.json({ msg: "success", user: foundUser });
        }
        return res.json({ msg: "success not edited", user: foundUser });

    },
    getLocations: async (req, res, next) => {
        let token = req.token;
        let e_count = 0;
        let n_count = 0;
        let h_count = 0;
        console.log("Users token:" + token);
        var userEmail;
        jwt.verify(req.token, 'my_secret_key', async (err, data) => {
            if (err) {
                console.log(err);
                return res.json({ msg: "invalid token", error: err });
            }
            userEmail = data.email;
        });
        foundUser = await User.findOne({ email: userEmail });
        if (foundUser) {
            console.log(foundUser.n_places[0].length);
            if (foundUser.e_places[0] != null) {
                for (i = 0; i < foundUser.e_places[0].length; i++) {
                    if (foundUser.e_places[0][i] == '1') {
                        e_count++;
                    }
                }
            }
            if (foundUser.n_places[0] != null) {
                for (i = 0; i < foundUser.n_places[0].length; i++) {
                    if (foundUser.n_places[0][i] == '1') {
                        n_count++;
                    }
                }
            } if (foundUser.h_places[0] != null) {
                for (i = 0; i < foundUser.h_places[0].length; i++) {
                    if (foundUser.h_places[0][i] == '1') {
                        h_places++;
                    }
                }
            }
            return res.json({ msg: "success", easy: e_count, norm: n_count, hard: h_count });
        }
        return res.json({ msg: "success not edited", easy: foundUser.e_places, norm: foundUser.n_places, hard: foundUser.h_places });

    },
    postProfile: async (req, res, next) => {
        let token = req.token;
        var userName = req.body.name;
        var userCity = req.body.city;

        console.log("Users token:" + token);
        var userEmail;
        jwt.verify(req.token, 'my_secret_key', async (err, data) => {
            if (err) {
                console.log(err);
                return res.json({ msg: "invalid token", error: err });
            }
            userEmail = data.email;
        });
        db.collection('users').updateOne({ email: userEmail }, { $set: { name: userName, city: userCity } }, (err, result) => {
            if (err) {
                return res.json({ msg: err });
            }



        })
        return res.json({ msg: "success", });

    },

    getVerification: async (req, res, next) => {


    },

    getDiff: async (req, res, next) => {
        Difficult.find({}, function (err, result) {
            if (err) { return res.json(err) }
            else {
                return res.json(result).status(200);
            }
        })

    },

    getRoutes: async (req, res, next) => {
        let diff = req.params.diff;
        jwt.verify(req.token, 'my_secret_key', async (err, data) => {
            if (err) {
                console.log(err);
                return res.json({ msg: "invalid token", error: err });
            }
            userEmail = data.email;
        });


        if (diff == "easy") {
            Route.find({ difficult: "easy" }, function (err, result) {
                if (err) {
                    console.log("error!")
                    console.log(err);
                    return res.json({ msg: err });
                }
                else {

                    console.log(result.body);
                    return res.json(result);
                }
            });
        }
        if (diff == "normal") {
            Route.find({ difficult: "normal" }, function (err, result) {
                if (err) {
                    console.log("error!")
                    console.log(err);
                    return res.json({ msg: err });
                }
                else {
                    User.findOne({ email: userEmail }, (err, ress) => {
                        if (err) {
                            return console.log(err)
                        }
                        else {
                            var notVisited = [];
                            console.log("size of routes " + result.length)
                            console.log("size of visited by user routes " + ress.lng.length)

                            for (i = 0; i < ress.lng.length; i++) {
                                for (j = 0; j < result.length; j++) {
                                    if (ress.lng[i] == result[j].lng) {
                                        console.log("SYKE!!!" + ress.lng[i]);
                                        result = result.slice(j, 1);
                                    }
                                }
                            }
                            console.log("size of new routes " + result.length);

                        }
                        return res.json(result);

                    });
                }
            });
        }
        if (diff == "hard") {
            Route.find({ difficult: "hard" }, function (err, result) {
                if (err) {
                    console.log("error!")
                    console.log(err);
                    return res.json({ msg: err });
                }
                else {

                    console.log(result.body);
                    return res.json(result);
                }
            });
        }
    },

}

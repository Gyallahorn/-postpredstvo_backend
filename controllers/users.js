
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
const { format, parse } = require('path');
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


    confirmation: async (req, res, next) => {
        let vertoken = req.params.token;
        VerificationToken.findOne({ verToken: vertoken }, (err, response) => {
            if (response.verToken != vertoken) {
    
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
  
        if (foundUser!= null) {
            return res.json({ msg: "success", user: foundUser });
        }
        return res.json({ msg: "success not edited", user: foundUser });

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

 
   
    

}

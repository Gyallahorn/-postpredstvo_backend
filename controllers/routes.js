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
const { db, update } = require('../models/VerificationModel');
const nodemailer = require('nodemailer');
const { Console } = require('console');
const { format, parse } = require('path');
const { use } = require('passport');
const e = require('express');
const { query } = require('express');
const { options } = require('../routes/api/quiz');
const { func } = require('joi');

module.exports = {
    updateEasyLocations: async (req, res, next) => {
        let token = req.token;
        let lng = parseFloat(req.body.lng);
        let ltd = parseFloat(req.body.ltd);

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
    getLocations: async (req, res, next) => {
        let diff = req.params.diff;
        jwt.verify(req.token, 'my_secret_key', async (err, data) => {
            if (err) {
                console.log(err);
                return res.json({ msg: "invalid token", error: err });
            }
            userEmail = data.email;
        });
        Route.find(function (err, result) {
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

                    console.log(result.body);
                    return res.json(result);
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
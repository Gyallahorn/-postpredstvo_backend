const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const VerificationToken = require('../models/VerificationModel');
const passport = require('passport');
const crypto = require('crypto');
const { JWT_SECRET } = require("../configuration/index");
const passportSignIn = passport.authenticate("local", { session: false });
const User = require('../models/user');
const Quiz = require('../models/test');
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
    greetings: async (req, res, next) => {
        const quiz = await Quiz.find({ name: "postpred" })

        if (quiz) {
            var tests = quiz.tests;
            return res.json(quiz);
        }


        return res.sendStatud(404);

    },
    getTests:async(req,res,next)=>{
    
        Quiz.find( function (err, result) {
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

    updateTest:async(req,res,next)=>{
        console.log(req.token);
        jwt.verify(req.token, 'my_secret_key', async (err, data) => {
            if (err) {
                console.log(err);
                return res.json({ msg: "invalid token", error: err });
            }
            userEmail = data.email;
            console.log(userEmail);
        });

    try {
        
        User.bulkWrite([{
            updateOne:{
                "filter":{ "email":userEmail,
                    "test.name": req.body.name },
                "update":{$set:{"test.$.score":req.body.score}}
            }
        },
        {  
            updateOne:{
            "filter":{"email":userEmail,"test.name":{$ne:req.body.name} },
            "update":{$push:{test:{
                name : req.body.name,
                score: req.body.score
                    }
                }
            }
        }
    }])
    return res.status(200).send({"message":"done!"});
        
    } catch (error) {
        console.log(error)
    return res.status(500).send({"message":error});
        
    }

     
    },
}
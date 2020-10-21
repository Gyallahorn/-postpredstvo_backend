const express = require('express');
const router = express.Router();


const QuizController = require("../../controllers/quiz");
const UserController = require("../../controllers/users");


router.route('/quiz')
    .get(QuizController.greetings)

router.route('/getTests').get(QuizController.getTests)

router.route('/updatetest').post(UserController.ensureToken , QuizController.updateTest)

module.exports = router;


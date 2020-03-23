const express = require('express');
const router = express.Router();


const QuizController = require("../../controllers/quiz");



router.route('/quiz')
    .get(QuizController.greetings)

module.exports = router;


const Quiz = require('../models/test');

module.exports = {
    greetings: async (req, res, next) => {
        const quiz = await Quiz.find({ name: "postpred" })

        if (quiz) {
            var tests = quiz.tests;
            return res.json(quiz);
        }


        return res.sendStatud(404);

    }
}
const express = require('express');
const router = express.Router();

const passport = require('passport');
const { validateBody, schemas } = require("../../helpers/routeHelpers");
const UserController = require("../../controllers/users");
const passportSignIn = passport.authenticate('local', { failureFlash: true });
const passportJWT = passport.authenticate("jwt", { session: false });
router.route('/')
    .post(UserController.greetings);

router.route("/signup")
    .post(validateBody(schemas.authSchema), UserController.signUp);

router.route("/signin")
    .post(UserController.ensureToken, UserController.signIn);

router.route("/updateTest")
    .patch(UserController.ensureToken,UserController.updateTest);

router.route("/updateLocations").patch(UserController.ensureToken,UserController.updateLocations);

router.route("/getTestResults").get(UserController.ensureToken, UserController.getResults);

module.exports = router;


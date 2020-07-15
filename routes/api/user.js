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

module.exports = router;


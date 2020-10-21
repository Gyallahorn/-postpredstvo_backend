const express = require('express');
const router = express.Router();

const passport = require('passport');
const { validateBody, schemas } = require("../../helpers/routeHelpers");
const UserController = require("../../controllers/users");
const User = require('../../models/user');
const passportSignIn = passport.authenticate('local', { failureFlash: true });
const passportJWT = passport.authenticate("jwt", { session: false });
router.route('/')
    .post(UserController.greetings);

router.route("/signup")
    .post(validateBody(schemas.authSchema), UserController.signUp);

router.route("/signin")
    .post(UserController.signIn);


router.route("/getProfile").get(UserController.ensureToken, UserController.getProfile);

router.route("/editProfile").post(UserController.ensureToken, UserController.postProfile);

router.route("/confirm/:token").get(UserController.confirmation);



module.exports = router;


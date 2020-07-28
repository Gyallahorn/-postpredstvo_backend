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
    .post(UserController.signIn);

router.route("/updateTest")
    .patch(UserController.ensureToken, UserController.updateTest);


router.route("/getTestResults").get(UserController.ensureToken, UserController.getProfile);

router.route("/editProfile").post(UserController.ensureToken, UserController.postProfile);

router.route("/confirm/:token").get(UserController.confirmation);

router.route("/updateEasyLocations").post(UserController.ensureToken, UserController.updateEasyLocations);
router.route("/updateNormLocations").post(UserController.ensureToken, UserController.updateNormalLocations);
router.route("/updateHardLocations").post(UserController.ensureToken, UserController.updateHardLocations);


router.route("/getLocations").get(UserController.ensureToken, UserController.getLocations);

module.exports = router;


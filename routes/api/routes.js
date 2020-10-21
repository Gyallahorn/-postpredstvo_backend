const express = require('express');
const router = express.Router();


const RoutesController = require("../../controllers/routes");
const UserController = require("../../controllers/users");

router.route("/updateLocations").post(UserController.ensureToken, RoutesController.updateEasyLocations);

router.route("/getRoutes/:diff").get(UserController.ensureToken, RoutesController.getRoutes);

router.route("/getDifficulties").get(UserController.ensureToken, RoutesController.getDiff);

router.route("/getLocations").get(UserController.ensureToken, RoutesController.getLocations);

module.exports = router;
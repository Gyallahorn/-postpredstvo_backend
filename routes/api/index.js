const express = require('express');
const router = express.Router();

router.use('/user', require('./user'));
router.use('/quiz', require('./quiz'));

module.exports = router;
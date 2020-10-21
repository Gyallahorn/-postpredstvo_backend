const express = require('express');
const router = express.Router();

router.use('/user', require('./user'));
router.use('/quiz', require('./quiz'));
router.use('/routes',require('./routes'));
module.exports = router;
const express = require('express');
const router = express.Router();

router.use('/api', require('./api'));

router.use('/').post((res, req, next) => {
    res.send('hello world');
})

module.exports = router;

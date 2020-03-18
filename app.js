
const express = require('express');
const mangoose = require('mongoose');
const app = express();
const cors = require('cors');
const LocalStrategy = require('passport-local');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const passport = require('passport');

// Middlewares
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));
app.use('/uploads', express.static('uploads'));

// mangoose
mangoose.Promise = global.Promise;
mangoose.connect('mongodb+srv://gyallahorn:veryhardpassword@cluster0-vkpkm.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true });
mangoose.set('debug', true);
const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Server running on port ' + port));






app.get('/login', ensureToken, (req, res, next) => {

    res.json({ msg: "success" })

});
function ensureToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

// api routes
require('./models/user');
app.use(require('./routes'));

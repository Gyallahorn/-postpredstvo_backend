
const express = require('express');
const mangoose = require('mongoose');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

// Middlewares
app.use(cors());
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
// api routes
require('./models/user');
app.use(require('./routes'));

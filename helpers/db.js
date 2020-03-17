const config = require('config.json');
const mangoose = require('mongoose');

mangoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true });
mangoose.Promise = global.Promise;

module.exports = {
    User: require('../models/user')
}
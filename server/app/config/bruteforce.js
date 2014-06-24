'use strict';

var ExpressBrute = require('express-brute');
var MongoStore = require('express-brute-mongo');
var MongoClient = require('mongodb').MongoClient;
var config = require('./config');

var store = new MongoStore(function (ready) {
    MongoClient.connect(config.db, function (err, db) {
        if (err) {
            throw err;
        }
        ready(db.collection('bruteforce-store'));
    });
});

module.exports = new ExpressBrute(store, config.brute);

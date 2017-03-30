const ExpressBrute = require('express-brute');
const MongoStore = require('express-brute-mongo');
const { MongoClient } = require('mongodb');
const config = require('./config');

const store = new MongoStore(ready => {
  MongoClient.connect(config.db, (err, db) => {
    if (err) {
      throw err;
    }
    ready(db.collection('bruteforce-store'));
  });
});

module.exports = new ExpressBrute(store, config.brute);

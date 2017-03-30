const express = require('express');
const path = require('path');
const config = require('../config');

const router = express.Router();
const root = path.resolve(__dirname + '/../../../');

router.get('*', (req, res) => {
  res.sendFile(`./${config.public}/index.html`, { root: root });
});

module.exports = router;

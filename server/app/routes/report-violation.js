const express = require('express');

const router = express.Router();

router.post('/', (req, res) => {
  console.warn(req.headers, req.body);
  res.status(204).end();
});

module.exports = router;

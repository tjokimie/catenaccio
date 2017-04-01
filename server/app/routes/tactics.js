const express = require('express');
const Tactics = require('../models/Tactics');
const NotFoundError = require('../errors/NotFoundError');

const router = express.Router();

router.post('/', (req, res, next) => {
  const tactics = new Tactics(req.body);
  tactics.save((err, data) => {
    if (err) {
      return next(err);
    }
    res.location('/api/tactics/' + data._id);
    res.status(201).send(data.getPublicFields());
  });
});

router.get('/:id', (req, res, next) => {
  const { id } = req.params
  Tactics.findOne({ _id: id }, (err, data) => {
    if (err) {
      return next(err);
    }
    if (!data) {
      return next(new NotFoundError());
    }
    res.status(200).send(data.getPublicFields());
  });
});

module.exports = router;

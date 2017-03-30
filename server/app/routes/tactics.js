const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const Tactics = mongoose.model('Tactics');

router.post('/', (req, res) => {
  const tactics = new Tactics(req.body);
  tactics.save((err, data) => {
    if (err) {
      console.log(req.headers, req.body, err);
      res.status(400).end();
    } else {
      res.location('/api/tactics/' + data._id);
      res.status(201).send(data.getPublicFields());
    }
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params
  Tactics.findOne({ _id: id }, (err, data) => {
    if (err || !data) {
      if (err) {
        console.log(req.headers, req.body, err);
      }
      res.status(404).end();
    } else {
      res.status(200).send(data.getPublicFields());
    }
  });
});

module.exports = router;

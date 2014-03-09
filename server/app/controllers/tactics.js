'use strict';

var mongoose = require('mongoose');
var Tactics = mongoose.model('Tactics');

exports.create = function (req, res) {
    var tactics = new Tactics(req.body);
    tactics.save(function (err, data) {
        if (err) {
            res.send(400);
        } else {
            res.location('/api/tactics/' + data.id);
            res.send(201, data.getPublicFields());
        }
    });
};

exports.findOne = function (req, res) {
    Tactics.findOne({ id: req.params.id }, function (err, data) {
        if (err || !data) {
            res.send(404);
        } else {
            res.send(200, data.getPublicFields());
        }
    });
};

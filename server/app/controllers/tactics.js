'use strict';

var mongoose = require('mongoose');
var Tactics = mongoose.model('Tactics');

exports.create = function (req, res) {
    var tactics = new Tactics(req.body);
    tactics.save(function (err, data) {
        if (err) {
            console.log(req.headers, req.body, err);
            res.status(400).end();
        } else {
            res.location('/api/tactics/' + data._id);
            res.status(201).send(data.getPublicFields());
        }
    });
};

exports.findOne = function (req, res) {
    Tactics.findOne({ _id: req.params.id }, function (err, data) {
        if (err || !data) {
            if (err) {
                console.log(req.headers, req.body, err);
            }
            res.status(404).end();
        } else {
            res.status(200).send(data.getPublicFields());
        }
    });
};

'use strict';

exports.log = function (req, res) {
    console.log(req.body);
    res.send(204);
};

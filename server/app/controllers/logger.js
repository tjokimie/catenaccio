'use strict';

exports.log = function (req, res) {
    console.log(req.headers, req.body);
    res.send(204);
};

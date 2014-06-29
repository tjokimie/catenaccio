'use strict';

exports.warn = function (req, res) {
    console.warn(req.headers, req.body);
    res.send(204);
};

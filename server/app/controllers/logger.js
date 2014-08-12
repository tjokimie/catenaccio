'use strict';

exports.warn = function (req, res) {
    console.warn(req.headers, req.body);
    res.status(204).end();
};

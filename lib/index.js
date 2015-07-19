'use strict';

var debug = require('debug')('connect-lastmile'),
    http = require('http'),
    HttpError = require('./httperror.js'),
    HttpSuccess = require('./httpsuccess.js');

exports = module.exports = lastMile;
exports.HttpError = HttpError;
exports.HttpSuccess = HttpSuccess;

function lastMile(options) {
    return function (err, req, res, next) {
        if (err instanceof HttpSuccess) {
            var success = err;
            if (success.body) {
                res.setHeader('Content-Type', 'application/json');
                res.status(success.status).send(success.body);
            } else {
                res.status(success.status).end();
            }

            return;
        }

        if (err instanceof HttpError) {
            var status = err.status || 500; // connect/express or our app

            // if the request took too long, assume it's a problem on the client
            if (err.timeout && status === 503) status = 408; // timeout() middleware

            if (status >= 400 && status <= 499) {
                res.status(status).send({ status: http.STATUS_CODES[status], message: err.message });
                debug('%s : %s', http.STATUS_CODES[status], err.message);
            } else {
                res.status(status).send({ status: http.STATUS_CODES[status], message: err.message });
                console.error(err.stack || err);
            }

            return;
        }

        if (err.code === 'EBADCSRFTOKEN') { // csurf middleware
            var msg = 'session has expired or form tampered with';
            res.status(403).send({ status: http.STATUS_CODE[403], message: msg });
            debug('%s : %s', http.STATUS_CODE[403], msg);

            return;
        }

        // some uncaught exception (or assert)
        res.status(500).send({ status: http.STATUS_CODES[status], message: err.message });
        console.error(err.stack || err);

        next(err); // allow app to handle uncaught exceptions
    }
}


'use strict';

var debug = require('debug')('connect-lastmile'),
    http = require('http'),
    HttpError = require('./httperror.js'),
    HttpSuccess = require('./httpsuccess.js');

exports = module.exports = {
    HttpError: HttpError,
    HttpSuccess: HttpSuccess,

    lastMileHandler: [ successHandler, clientErrorHandler, serverErrorHandler ],

    successHandler: successHandler,
    clientErrorHandler: clientErrorHandler,
    serverErrorHandler: serverErrorHandler
};

// Success handler
function successHandler(success, req, res, next) {
    if (!(success instanceof HttpSuccess)) return next(success);

    if (success.body) {
        res.setHeader('Content-Type', 'application/json');
        res.status(success.status).send(success.body);
    } else {
        res.status(success.status).end();
    }
};

// Error handlers. These are called until one of them sends headers
function clientErrorHandler(err, req, res, next) {
    var status = err.status; // connect/express or our app

    // if the request took too long, assume it's a problem on the client
    if (err.timeout && err.status == 503) { // timeout() middleware
        status = 408;
    }

    if (status >= 400 && status <= 499) {
        res.send(status, { status: http.STATUS_CODES[status], message: err.message });
        debug(http.STATUS_CODES[status] + ' : ' + err.message);
    } else {
        next(err);
    }
};

function serverErrorHandler(err, req, res, next) {
    var status = err.status || 500;
    res.status(status).send({ status: http.STATUS_CODES[status], message: err.message || 'Internal Server Error' });
    console.error(status, err, err.internalError);
};


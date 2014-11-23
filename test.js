/* jslint node:true */
/* global it:false */
/* global describe:false */
/* global before:false */
/* global after:false */

'use strict';

var connectLastMile = require('./lib/index.js'),
    expect = require('expect.js');

describe('Exports', function () {
    it('has exported individual handlers', function () {
        expect(connectLastMile.successHandler).to.be.a(Function);
        expect(connectLastMile.clientErrorHandler).to.be.a(Function);
        expect(connectLastMile.serverErrorHandler).to.be.a(Function);
    });

    it('has exported composited handler', function () {
        expect(connectLastMile.lastMileHandler).to.be.an(Array);
    });

    it('has exported success class', function () {
        expect(connectLastMile.HttpSuccess).to.be.a(Function);
    });

    it('has exported error class', function () {
        expect(connectLastMile.HttpError).to.be.a(Function);
    });
});


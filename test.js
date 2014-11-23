/* jslint node:true */
/* global it:false */
/* global describe:false */
/* global before:false */
/* global after:false */

'use strict';

var connectLastMile = require('./lib/index.js'),
    expect = require('expect.js'),
    HttpError = connectLastMile.HttpError,
    HttpSuccess = connectLastMile.HttpSuccess;

describe('Exports', function () {
    it('has exported composited handler', function () {
        expect(connectLastMile()).to.be.an(Array);
    });

    it('has exported success class', function () {
        expect(connectLastMile.HttpSuccess).to.be.a(Function);
    });

    it('has exported error class', function () {
        expect(connectLastMile.HttpError).to.be.a(Function);
    });
});

describe('HttpSuccess', function () {
    it('throws for non-numeric status code', function () {
        expect(function () { new HttpSuccess('200', { }); }).to.throwError();
    });
    it('throws for non-object body', function () {
        expect(function () { new HttpSuccess(200, 'what'); }).to.throwError();
    });
    it('throws for array body', function () {
        expect(function () { new HttpSuccess(200, [1, 2]); }).to.throwError();
    });
    it('succeeds for object body', function () {
        expect(function () { new HttpSuccess(200, { }); }).to.not.throwError();
    });
    it('succeeds for no body', function () {
        expect(function () { new HttpSuccess(200); }).to.not.throwError();
    });
});

describe('HttpError', function () {
    it('throws for non-numeric status code', function () {
        expect(function () { new HttpError('200', { }); }).to.throwError();
    });
    it('throws for no body', function () {
        expect(function () { new HttpError(400); }).to.throwError();
    });
    it('throws for object body', function () {
        expect(function () { new HttpError(400, { }); }).to.throwError();
    });
    it('throws for array body', function () {
        expect(function () { new HttpError(400, [1, 2]); }).to.throwError();
    });
    it('succeeds for string body', function () {
        var e;
        expect(function () { e = new HttpError(200, 'bad things'); }).to.not.throwError();
        expect(e.message).to.eql('bad things');
        expect(e.internalError).to.eql(null);
    });
    it('succeeds for error body', function () {
        var e;
        expect(function () { e = new HttpError(200, new Error('bad things')); }).to.not.throwError();
        expect(e.message).to.eql('Internal error');
        expect(e.internalError).to.be.an(Error);
        expect(e.internalError.message).to.eql('bad things');
    });
});


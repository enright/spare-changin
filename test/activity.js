/*global describe:false, it:false, before:false, after:false, afterEach:false*/

'use strict';


var app = require('../index'),
    kraken = require('kraken-js'),
    request = require('supertest'),
    assert = require('assert');


describe('activity', function () {

    var mock;


    beforeEach(function (done) {
        kraken.create(app).listen(function (err, server) {
            mock = server;
            done(err);
        });
    });


    afterEach(function (done) {
        mock.close(done);
    });


    it('should get json back if requesting json', function (done) {
        request(mock)
            .get('/paypal/activity')
        	.set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res){
                done(err);
            });
    });

    it('should get html back if not requesting json', function (done) {
        request(mock)
            .get('/paypal/activity')
        	.set('Accept', 'text/html')
            .expect(200)
            .expect('Content-Type', /html/)
            .end(function(err, res){
                done(err);
            });
    });

	it('should get a single transaction by id', function (done) {
		request(mock)
			.get('/paypal/activity/id2')
        	.set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(function (res) {
            	if (res.body.id !== 'id2') return 'id was not id2';
            	if (res.body.transaction.amount !== 150.15) return 'amount was not 150.15';
            })
            .end(function(err, res){
                done(err);
            });
	});
	
	it('should return 404 on get when requested id does not exist', function (done) {
		request(mock)
			.get('/paypal/activity/id0')
        	.set('Accept', 'application/json')
            .expect(404)
            .end(function(err, res){
                done(err);
            });
	});
	
	it('should delete existing transaction by id', function (done) {
		request(mock)
			.del('/paypal/activity/id2')
        	.set('Accept', 'application/json')
            .expect(200)
            // after deletion, we should not be able to get it
            .end(function(err, res) {
            	if (err) return done(err);
            	request(mock)
					.get('/paypal/activity/id2')
					.set('Accept', 'application/json')
					.expect(404)
					.end(function(err, res){
						done(err);
					});
            });
	});
	
	it('should create a transaction', function (done) {
		var trxid;
		request(mock)
			.post('/paypal/activity')
			.send({ date: new Date(2014, 3, 21),
				type: 'Purchase',
				place: 'Mr. Mopps',
				currencyCode: 'USD',
				amount: 44.55 })
        	.set('Accept', 'application/json')
        	.set('Content-type', 'application/json')
			.expect(200)
            .expect(function (res) {
            	var date;
            	if (res.body.transaction.amount !== 44.55) return 'amount was not 44.55';
            	if (res.body.transaction.type !== 'Purchase') return 'amount was not Purchase';
            	if (res.body.transaction.place !== 'Mr. Mopps') return 'amount was not Mr. Mopps';
            	if (res.body.transaction.currencyCode !== 'USD') return 'amount was not USD';
            	
            	date = new Date(res.body.transaction.date);
            	if (date.getDate() !== 21) return 'wrong day of month';
            	if (date.getMonth() !== 3) return 'wrong month';
            	if (date.getFullYear() !== 2014) return 'wrong year';
            	
            	if (!res.body.id) return 'no trx id';
            	trxid = res.body.id;
            })
            // after we added it, we'd better be able to get it
            .end(function(err, res) {
            	if (err) return done(err);
            	request(mock)
					.get('/paypal/activity/' + trxid)
					.set('Accept', 'application/json')
					.expect(200)
					.end(function(err, res){
						done(err);
					});
            });
	});
	
	it('should convert a transaction', function (done) {
		var trxid;
		request(mock)
			.put('/paypal/activity/id2')
			.send({ currencyCode: 'EUR' })
        	.set('Accept', 'application/json')
        	.set('Content-type', 'application/json')
			.expect(200)
            .expect(function (res) {
            	if (res.body.transaction.convertedAmount.currencyCode !== 'EUR') return 'converted currency was not EUR';
            	if (res.body.transaction.convertedAmount.symbol !== '€') return 'converted symbol was not €';
            })
            // after we added it, we'd better be able to get it
            .end(function(err, res) {
            	if (err) return done(err);
            	request(mock)
					.get('/paypal/activity/id2')
					.set('Accept', 'application/json')
					.expect(200)
					.expect(function (res) {
						if (res.body.transaction.convertedAmount.currencyCode !== 'EUR') return 'converted currency was not EUR';
						if (res.body.transaction.convertedAmount.symbol !== '€') return 'converted symbol was not €';
					})
					.end(function(err, res){
						done(err);
					});
            });
	});

	it('should fail to convert a transaction with non-existing code', function (done) {
		var trxid;
		request(mock)
			.put('/paypal/activity/id2')
			.send({ currencyCode: 'XXX' })
        	.set('Accept', 'application/json')
        	.set('Content-type', 'application/json')
			.expect(400)
			.end(function(err, res){
				done(err);
            });
	});

});
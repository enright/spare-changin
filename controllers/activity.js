'use strict';

var converter = require('currencyConverter')(false, './test/xchange.data', 'http://openexchangerates.org/api/latest.json?app_id=58ae7feb73e64cf3b631fb5f1a6e463c');
var uuid = require('uuid');
var ActivityModel = require('../models/activity');

module.exports = function(server) {
	var activityModel = new ActivityModel();

	// get a single transaction
	server.get('/paypal/activity/:id', function (req, res) {
		var transactions = activityModel.transactions,
			id = req.params.id;
		if (transactions.hasOwnProperty(id)) {
			res.json(200, { id: id, transaction: transactions[id] });
		} else {
			res.json(404, { error: 'no transaction with this id', id: id });
		}
	});

	// delete a single transaction
	server.delete('/paypal/activity/:id', function (req, res) {
		console.log('in server delete');
		var transactions = activityModel.transactions,
			id = req.params.id;
		if (transactions.hasOwnProperty(id)) {
			delete transactions[id];
			res.json(200, { id: id });
		} else {
			res.json(404, { error: 'no transaction with this id', id: id });
		}
	});
	
	// put conversion of a transaction
	server.put('/paypal/activity/:id', function (req, res) {
		var transactions = activityModel.transactions,
			id = req.params.id,
			toCurrencyCode = req.body && req.body.currencyCode;
		
		if (transactions.hasOwnProperty(id)) {
			if (toCurrencyCode) {
				converter(transactions[id].currencyCode,
					toCurrencyCode,
					transactions[id].amount,
					function (err, converted) {
						if (!err && converted) {
							transactions[id].convertedAmount = { currencyCode: toCurrencyCode,
								amount: converted.amount,
								symbol: converted.symbol };
							res.json(200, { id: id, transaction: transactions[id] });
						} else {
							res.json(400, { error: err });
						}
					});
			} else {
				res.json(400, { error: 'specify a currency code in json request body' });
			}
		} else {
			res.json(400, { error: 'no transaction with this id', id: id });
		}
	});
	
	// create a transaction
	server.post('/paypal/activity', function (req, res) {
		var transactions = activityModel.transactions,
			trx = req.body || req.body.transaction;
		if (trx) {
			var id = uuid.v4();
			transactions[id] = { date: trx.date,
				type: trx.type,
				place: trx.place,
				currencyCode: trx.currencyCode,
				amount: trx.amount
			};
			res.json(200, { id: id, transaction: transactions[id] });
		} else {
			res.json(400, { error: 'specify a transaction in json request body' });
		}
	});
	
	// dust only likes arrays
	function createTransactionArray(transactions) {
		var trx = [],
			trxid;
		for (trxid in transactions) {
			if (transactions.hasOwnProperty(trxid)) {
				trx.push({ id: trxid, transaction: transactions[trxid] });
			}
		}
		return trx;
	}
	
	// return all transactions or page if req is not for json
	server.get('/paypal/activity', function (req, res) {
		var accept = req.header('Accept'),
			isJsonRequest = accept && accept.match(/json/);
		if (isJsonRequest) {
			res.json(200, activityModel.transactions);
		} else {
			
			res.render('activity', { title: activityModel.title, transactions: createTransactionArray(activityModel.transactions) });
		}
	});
};
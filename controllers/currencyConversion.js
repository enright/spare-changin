'use strict';

var converter = require('currencyConverter')(false, './test/xchange.data', 'http://openexchangerates.org/api/latest.json?app_id=58ae7feb73e64cf3b631fb5f1a6e463c');

module.exports = function(server) {
	server.get('/paypal/currencyConversion/:fromCurrencyCode/:toCurrencyCode/:amount', function (req, res) {
		var fromCurrencyCode = req.params.fromCurrencyCode.toUpperCase(),
			toCurrencyCode = req.params.toCurrencyCode.toUpperCase(),
			amount = req.params.amount; // check this for [0-9\.]?

		if (converter) {
			if (fromCurrencyCode && toCurrencyCode && amount) {
				converter(fromCurrencyCode, toCurrencyCode, amount, function (err, converted) {
					if (!err) {
						res.json(200, { currencyCode: toCurrencyCode, amount: converted.amount, symbol: converted.symbol });
					} else {
						res.json(400, { error: err });
					}
				});
			} else {
				res.json(400, { error: 'something bad' });
			}
		} else {
			res.json(500, { error: 'converter service inactive' });
		}
	});
};
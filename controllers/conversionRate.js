'use strict';

var converter = require('currencyConverter')(false, './test/xchange.data', 'http://openexchangerates.org/api/latest.json?app_id=58ae7feb73e64cf3b631fb5f1a6e463c');

module.exports = function(server) {
	server.get('/paypal/conversionRate/:fromCurrencyCode/:toCurrencyCode', function (req, res) {
		var fromCurrencyCode = req.params.fromCurrencyCode.toUpperCase(),
			toCurrencyCode = req.params.toCurrencyCode.toUpperCase();

		if (converter) {
			converter(fromCurrencyCode, toCurrencyCode, 1.0, function (err, converted) {
				if (!err) {
					res.json(200, { conversionRate: converted.amount });
				} else {
					res.json(400, { error: err });
				}
			});
		} else {
			res.json(500, { error: 'converter service inactive' });
		}
	});
};
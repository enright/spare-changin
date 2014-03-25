//We require that dustjs, and the dustjs-helpers have been loaded. The way we invoke this function will ensure that.
(function (dust) {

    //Create a helper called 'formatDate'
    dust.helpers.formatCurrencyAmount = function (chunk, context, bodies, params) {

        //Retrieve the number value from the template parameters.
        var amount = dust.helpers.tap(params.amount, chunk, context);

        //Retrieve the number value from the template parameters.
        var symbol = dust.helpers.tap(params.symbol, chunk, context);
		console.log('amount ', amount);
		var output = symbol + Number(amount).toFixed(2);
		
        //Write the final value out to the template
        return chunk.write(output);
    };

}(require('dustjs-helpers')));

'use strict';


module.exports = function ActivityModel() {
	return {
		title:"Transaction History",
		transactions: {
			id1: {date: new Date(2014, 1, 10),
			type: 'Purchase',
			place: 'Macys',
			currencyCode: 'USD',
			amount: 99.99
			},
			id2: {date: new Date(2014, 1, 2),
			type: 'Purchase',
			place: 'Home Depot',
			currencyCode: 'USD',
			amount: 150.15
			},
			id3: {date: new Date(2013, 12, 31),
			type: 'Transfer',
			place: 'Wells Fargo',
			currencyCode: 'USD',
			amount: 350.00
			}
		}
	};
};
'use strict';


module.exports = function ActivityModel() {
	return {
		title:"Transaction History",
		transactions: {
			id1: {date: new Date(2014, 1, 10),
			type: 'Purchase',
			place: 'Macys',
			currencyCode: 'USD',
			symbol: '$',
			amount: 99.99
			},
			id2: {date: new Date(2014, 1, 2),
			type: 'Purchase',
			place: 'Home Depot',
			currencyCode: 'USD',
			symbol: '$',
			amount: 150.15
			},
			id3: {date: new Date(2013, 12, 31),
			type: 'Transfer',
			place: 'Wells Fargo',
			currencyCode: 'USD',
			symbol: '$',
			amount: 350.00
			},
			id4: {date: new Date(2013, 12, 15),
			type: 'Purchase',
			place: 'Jamba Juice',
			currencyCode: 'USD',
			symbol: '$',
			amount: 2.30
			},
			id5: {date: new Date(2013, 11, 1),
			type: 'Refund',
			place: 'DSW Shoes',
			currencyCode: 'USD',
			symbol: '$',
			amount: 75.45
			},
			id6: {date: new Date(2013, 10, 20),
			type: 'Purchase',
			place: 'DSW Shoes',
			currencyCode: 'USD',
			symbol: '$',
			amount: 75.45
			},
			id7: {date: new Date(2013, 12, 31),
			type: 'Purchase',
			place: 'Jamba Juice',
			currencyCode: 'USD',
			symbol: '$',
			amount: 3.00
			},
			id8: {date: new Date(2013, 12, 31),
			type: 'Transfer',
			place: 'Wells Fargo',
			currencyCode: 'USD',
			symbol: '$',
			amount: 2.75
			}
		}
	};
};
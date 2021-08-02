import {CurrencyEnum} from 'src/enums/currency.enum';
import {Part} from 'src/models/part';
import {Transaction} from 'src/models/transaction';

describe('Transaction toQueryString', () => {
	it('Should work with a single part', () => {
		let transaction: Transaction = new Transaction({
			campaignId: 475,
			transactionId: 123
		})
			.addPart(new Part({amount: 1}));
		expect(transaction.toQueryString()).toBe('ci=475&np=1&ti=123&p[]=%7Ba%3A1%7D');
	});

	it('Should work without parts', () => {
		let transaction: Transaction = new Transaction({
			campaignId: 475,
			transactionId: 123
		});
		expect(transaction.toQueryString()).toBe('ci=475&np=0&ti=123');
	});

	it('Should work with multiple parts', () => {
		let transaction: Transaction = new Transaction({
			campaignId: 475,
			transactionId: 123
		})
			.addPart(new Part({amount: 1}))
			.addPart(new Part({amount: 9.95, currency: <CurrencyEnum>'EUR'}))
			.addPart(new Part({amount: 9.95, currency: <CurrencyEnum>'DKK'}));
		expect(transaction.toQueryString()).toBe('ci=475&np=3&ti=123&p[]=%7Ba%3A1%7D&p[]=%7Ba%3A9.95%7D%7Bcur%3AEUR%7D&p[]=%7Ba%3A9.95%7D%7Bcur%3ADKK%7D');
	});
});

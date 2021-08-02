import {CurrencyEnum} from 'src/enums/currency.enum';
import {Part} from 'src/models/part';


describe('Part toQueryString', () => {
	it('Should work with only an amount', () => {
		let part: Part = new Part({
			amount: 1
		});
		expect(part.toQueryString()).toBe('p[]=%7Ba%3A1%7D');
	});

	it('Should work with all values and strange characters', () => {
		let part: Part = new Part({
			amount: 1.01,
			revenue: 2.51,
			currency: <CurrencyEnum>'EUR',
			compensationCode: 'compensationCode',
			quantity: 4,
			sku: 'someSku',
			externalDescription: 'External Description',
			internalDescription: '$#&C@HC^',
			extra1: 'Extra $1',
			extra2: 'Extra $2',
			extra3: 'Extra $3',
			extra4: 'Extra $4',
			extra5: 'Extra $5',
		})
		expect(part.toQueryString())
			.toBe('p[]=%7Ba%3A1.01%7D%7Br%3A2.51%7D%7Bcur%3AEUR%7D%7Bcc%3AcompensationCode%7D%7Bqty%3A4%7D%7Bsku%3AsomeSku%7D%7Bpn%3AExternal%20Description%7D%7Biv%3A%24%23%26C%40HC%5E%7D%7Be1%3AExtra%20%241%7D%7Be2%3AExtra%20%242%7D%7Be3%3AExtra%20%243%7D%7Be4%3AExtra%20%244%7D%7Be5%3AExtra%20%245%7D');
	});
})

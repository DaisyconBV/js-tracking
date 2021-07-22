# Daisycon JS Tracking

Every page general on load usage

```typescript
import {TrackingService} from '@daisycon/tracking';

new TrackingService('dt51.net')
	.storeData();
```

Pixel usage await:

```typescript
import {ConfigInterface, CurrencyEnum, Part, SuccessInterface, TrackingService, Transaction} from '@daisycon/tracking';

const transaction: Transaction = new Transaction({
	campaignId: 475,
	transactionId: 'AB374782388282',
}).addPart(new Part({
	amount: 125,
	revenue: 250,
	currency: CurrencyEnum.EUR,
	externalDescription: 'Transaction for Campaign',
}))

try {
	const successResponse: SuccessInterface = await new TrackingService('dt51.net')
		.registerTransaction(transaction);

	console.log('successResponse', successResponse)

} catch (errorResponse: any) {
	console.log('errorResponse', errorResponse)
}
```

Pixel usage promise:

```typescript
import {ConfigInterface, CurrencyEnum, Part, SuccessInterface, TrackingService, Transaction} from '@daisycon/tracking';

const transaction: Transaction = new Transaction({
	campaignId: 475,
	transactionId: 'AB374782388282',
}).addPart(new Part({
	amount: 125,
	revenue: 250,
	currency: CurrencyEnum.EUR,
	externalDescription: 'Transaction for Campaign',
}))

new TrackingService('dt51.net')
	.registerTransaction(transaction)
	.then((successResponse: SuccessInterface) => console.log('successResponse', successResponse))
	.catch((errorResponse: any) => console.log('errorResponse', errorResponse))
```

Alternate definitions:

```typescript
const myData = {
	currencyCode: 'EUR',
	transactionId: '1234Acef',
	products: [
		{name: 'test', price: 25.01},
		{name: 'test 2', price: 2.95},
	]
};

const transaction: Transaction = new Transaction({
	campaignId: 475,
	transactionId: myData.transactionId,
	parts: products.map((product) => {
		return new Part({
			amount: product.price,
			revenue: product.price,
			currency: <CurrencyEnum>myData.currencyCode,
			externalDescription: product.name,
		});
	})
});
```
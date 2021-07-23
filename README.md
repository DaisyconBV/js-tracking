# Daisycon JS Tracking

## Installation

### Using yarn
```text
yarn add @daisycon/tracking
```

### Using npm
```text
npm install @daisycon/tracking
```

## Usage

### Storing incoming requests
Add the following piece of code to the root of your app so that it loads on every page and stores any received dci.

```typescript
import {TrackingService} from '@daisycon/tracking';

new TrackingService()
	.storeData();
```


### Registering sale/lead
To register a lead or sale, you can use any of the examples below. 
* Replace the demo campaign ID (475) with your actual campaign ID provided to you by Daisycon
* Replace the segment (lt45.net) with the segment provided to you by Daisycon.
* Add your transaction ID and any other transaction data. (Check out the [transaction](blob/main/src/models/transaction.ts) model for what data you can provide)
* Add the transaction part. (Check out the [part](blob/main/src/models/transaction.ts) model for what data you can provide)

#### async await method

```typescript
import {CurrencyEnum, Part, SuccessInterface, TrackingService, Transaction} from '@daisycon/tracking';
const campaignId: number = 475;
const segment: string = 'lt45.net';

const transaction: Transaction = new Transaction({
	campaignId: campaignId,
	transactionId: 'AB374782388282',
}).addPart(new Part({
	amount: 125,
	revenue: 250,
	currency: CurrencyEnum.EUR,
	externalDescription: 'Transaction for Campaign',
}));

try {
	const successResponse: SuccessInterface = await new TrackingService(segment)
		.registerTransaction(transaction);

	console.log('successResponse', successResponse);

} catch (errorResponse: any) {
	console.log('errorResponse', errorResponse);
}
```

#### Regular promise method

```typescript
import {CurrencyEnum, Part, SuccessInterface, TrackingService, Transaction} from '@daisycon/tracking';
const campaignId: number = 475;
const segment: string = 'lt45.net';

const transaction: Transaction = new Transaction({
	campaignId: campaignId,
	transactionId: 'AB374782388282',
}).addPart(new Part({
	amount: 125,
	revenue: 250,
	currency: CurrencyEnum.EUR,
	externalDescription: 'Transaction for Campaign',
}));

new TrackingService(segment)
	.registerTransaction(transaction)
	.then((successResponse: SuccessInterface) => console.log('successResponse', successResponse))
	.catch((errorResponse: any) => console.log('errorResponse', errorResponse));
```

#### Alternate transaction definition

```typescript
import {CurrencyEnum, Part, SuccessInterface, TrackingService, Transaction} from '@daisycon/tracking';
const campaignId: number = 475;
const segment: string = 'lt45.net';

const myData: any = {
	currencyCode: 'EUR',
	transactionId: '1234Acef',
	products: [
		{name: 'test', price: 25.01},
		{name: 'test 2', price: 2.95},
	]
};

const transaction: Transaction = new Transaction({
	campaignId: campaignId,
	transactionId: myData.transactionId,
	parts: myData.products.map((product: any) => {
		return new Part({
			amount: product.price,
			revenue: product.price,
			currency: <CurrencyEnum>myData.currencyCode,
			externalDescription: product.name,
		});
	})
});

new TrackingService(segment)
	.registerTransaction(transaction)
	.then((successResponse: SuccessInterface) => console.log('successResponse', successResponse))
	.catch((errorResponse: any) => console.log('errorResponse', errorResponse));
```

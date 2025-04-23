import {JSDOM} from 'jsdom';
import {config} from 'src/config';
import {CurrencyEnum} from 'src/enums/currency.enum';
import {Part} from 'src/models/part';
import {Transaction} from 'src/models/transaction';
import {PartStatusEnum} from 'src/response/part-status.enum';
import {PartInterface} from 'src/response/part.interface';
import {SuccessInterface} from 'src/response/success.interface';
import {TrackingStatusEnum} from 'src/response/tracking-status.enum';
import {CookieService} from 'src/storage/cookie.service';
import {TrackingService} from 'src/tracking.service';
import {StorageMock} from 'tests/mocks/storage.mock';

describe('TrackingService: RegisterTransaction', () => {
	config.version = 'js_unittest'
	global['__dc_response'] = <SuccessInterface>{
		affiliatemarketing_id: 'ABCDEF',
		status: TrackingStatusEnum.PIXEL_SUCCESS,
		program_tag: '1234',
		parts: [
			<PartInterface>{
				slab_id: 'abcd',
				ad_id: 1,
				media_id: 22848,
				program_description: 'Test',
				publisher_commission: 1.25,
				sku: 'adc',
				status: PartStatusEnum.OPEN
			},
		],
	};

	beforeEach(() => {
		Object.defineProperty(window.document, 'cookie', {
			writable: true,
			value: '',
		});
		Object.defineProperty(window, 'localStorage', {
			writable: true,
			value: new StorageMock(),
		});
		Object.defineProperty(window, 'sessionStorage', {
			writable: true,
			value: new StorageMock(),
		});
	});

	afterEach(() => {
		document.getElementsByTagName('html')[0].innerHTML = '';
	});

	it('Should register transaction successful', () => {
		const scriptTags: HTMLCollectionOf<HTMLScriptElement> = document.head.getElementsByTagName('script');
		expect(scriptTags.length).toBe(0);

		const expectedTransactionUrl: string = 'ci=475&np=3&ti=123&p[]=%7Ba%3A1%7D&p[]=%7Ba%3A9.95%7D%7Bcur%3AEUR%7D&p[]=%7Ba%3A9.95%7D%7Bcur%3ADKK%7D';
		const transaction: Transaction = new Transaction({
			campaignId: 475,
			transactionId: 123
		})
			.addPart(new Part({amount: 1}))
			.addPart(new Part({amount: 9.95, currency: <CurrencyEnum>'EUR'}))
			.addPart(new Part({amount: 9.95, currency: <CurrencyEnum>'DKK'}));
		expect(transaction.toQueryString()).toBe(expectedTransactionUrl);

		const promise: Promise<any> = new TrackingService('my-tracking-domain.com')
			.registerTransaction(transaction);

		expect(promise).resolves.toBe(global['__dc_response']);

		expect(scriptTags.length).toBe(1);

		expect(scriptTags[0].src).toBe(`https://my-tracking-domain.com/js/t/?src=js_unittest&${expectedTransactionUrl}`);

		expect.assertions(5);

		scriptTags[0].onload(new Event('success'));
		return promise;
	});

	it('Should register transaction with DCI from session', () => {
		const storageParamName: string = config.storageParams.find((entry) => entry.names.includes('dci')).storageName;
		sessionStorage.setItem(storageParamName, 'SessionDCI');
		localStorage.setItem(storageParamName, 'LocalStorageDCI');
		new CookieService().set(storageParamName, 'CookieDCI');

		const scriptTags: HTMLCollectionOf<HTMLScriptElement> = document.head.getElementsByTagName('script');
		expect(scriptTags.length).toBe(0);

		const expectedTransactionUrl: string = 'ci=475&np=3&ti=123&p[]=%7Ba%3A1%7D&p[]=%7Ba%3A9.95%7D%7Bcur%3AEUR%7D&p[]=%7Ba%3A9.95%7D%7Bcur%3ADKK%7D';
		const transaction: Transaction = new Transaction({
			campaignId: 475,
			transactionId: 123
		})
			.addPart(new Part({amount: 1}))
			.addPart(new Part({amount: 9.95, currency: <CurrencyEnum>'EUR'}))
			.addPart(new Part({amount: 9.95, currency: <CurrencyEnum>'DKK'}));
		expect(transaction.toQueryString()).toBe(expectedTransactionUrl);

		const promise: Promise<any> = new TrackingService('my-tracking-domain.com')
			.registerTransaction(transaction);

		expect(promise).resolves.toBe(global['__dc_response']);

		expect(scriptTags.length).toBe(1);

		expect(scriptTags[0].src).toBe(`https://my-tracking-domain.com/js/t/?src=js_unittest&cdci=CookieDCI&lsdci=SessionDCI&${expectedTransactionUrl}`);

		expect.assertions(5);

		scriptTags[0].onload(new Event('success'));
		return promise;
	});

	it('Should register transaction with gclid from session', () => {
		const storageParamName: string = config.storageParams.find((entry) => entry.names.includes('gclid')).storageName;
		sessionStorage.setItem(storageParamName, 'SessionGclid');
		localStorage.setItem(storageParamName, 'LocalStorageGclid');
		new CookieService().set(storageParamName, 'CookieGclid');

		const scriptTags: HTMLCollectionOf<HTMLScriptElement> = document.head.getElementsByTagName('script');
		expect(scriptTags.length).toBe(0);

		const expectedTransactionUrl: string = 'ci=475&np=3&ti=123&p[]=%7Ba%3A1%7D&p[]=%7Ba%3A9.95%7D%7Bcur%3AEUR%7D&p[]=%7Ba%3A9.95%7D%7Bcur%3ADKK%7D';
		const transaction: Transaction = new Transaction({
			campaignId: 475,
			transactionId: 123
		})
			.addPart(new Part({amount: 1}))
			.addPart(new Part({amount: 9.95, currency: <CurrencyEnum>'EUR'}))
			.addPart(new Part({amount: 9.95, currency: <CurrencyEnum>'DKK'}));
		expect(transaction.toQueryString()).toBe(expectedTransactionUrl);

		const promise: Promise<any> = new TrackingService('my-tracking-domain.com')
			.registerTransaction(transaction);

		expect(promise).resolves.toBe(global['__dc_response']);

		expect(scriptTags.length).toBe(1);

		expect(scriptTags[0].src).toBe(`https://my-tracking-domain.com/js/t/?src=js_unittest&gclid=SessionGclid&${expectedTransactionUrl}`);

		expect.assertions(5);

		scriptTags[0].onload(new Event('success'));
		return promise;
	});

	it('Should register transaction with gclid and DCI from session', () => {
		const dciStorageParamName: string = config.storageParams.find((entry) => entry.names.includes('dci')).storageName;
		sessionStorage.setItem(dciStorageParamName, 'SessionDCI');
		localStorage.setItem(dciStorageParamName, 'LocalStorageDCI');
		new CookieService().set(dciStorageParamName, 'CookieDCI');

		const cookie: string = document.cookie;

		const gclidStorageParamName: string = config.storageParams.find((entry) => entry.names.includes('gclid')).storageName;
		sessionStorage.setItem(gclidStorageParamName, 'SessionGclid');
		localStorage.setItem(gclidStorageParamName, 'LocalStorageGclid');
		new CookieService().set(gclidStorageParamName, 'CookieGclid');

		document.cookie = cookie + document.cookie

		const scriptTags: HTMLCollectionOf<HTMLScriptElement> = document.head.getElementsByTagName('script');
		expect(scriptTags.length).toBe(0);

		const expectedTransactionUrl: string = 'ci=475&np=3&ti=123&p[]=%7Ba%3A1%7D&p[]=%7Ba%3A9.95%7D%7Bcur%3AEUR%7D&p[]=%7Ba%3A9.95%7D%7Bcur%3ADKK%7D';
		const transaction: Transaction = new Transaction({
			campaignId: 475,
			transactionId: 123
		})
			.addPart(new Part({amount: 1}))
			.addPart(new Part({amount: 9.95, currency: <CurrencyEnum>'EUR'}))
			.addPart(new Part({amount: 9.95, currency: <CurrencyEnum>'DKK'}));
		expect(transaction.toQueryString()).toBe(expectedTransactionUrl);

		const promise: Promise<any> = new TrackingService('my-tracking-domain.com')
			.registerTransaction(transaction);

		expect(promise).resolves.toBe(global['__dc_response']);

		expect(scriptTags.length).toBe(1);

		expect(scriptTags[0].src).toBe(`https://my-tracking-domain.com/js/t/?src=js_unittest&cdci=CookieDCI&lsdci=SessionDCI&gclid=SessionGclid&${expectedTransactionUrl}`);

		expect.assertions(5);

		scriptTags[0].onload(new Event('success'));
		return promise;
	});

	it('Should register transaction with DCI from localStorage', () => {
		const storageParamName: string = config.storageParams.find((entry) => entry.names.includes('dci')).storageName;
		localStorage.setItem(storageParamName, 'LocalStorageDCI');
		new CookieService().set(storageParamName, 'CookieDCI');

		const scriptTags: HTMLCollectionOf<HTMLScriptElement> = document.head.getElementsByTagName('script');
		expect(scriptTags.length).toBe(0);

		const expectedTransactionUrl: string = 'ci=475&np=3&ti=123&p[]=%7Ba%3A1%7D&p[]=%7Ba%3A9.95%7D%7Bcur%3AEUR%7D&p[]=%7Ba%3A9.95%7D%7Bcur%3ADKK%7D';
		const transaction: Transaction = new Transaction({
			campaignId: 475,
			transactionId: 123
		})
			.addPart(new Part({amount: 1}))
			.addPart(new Part({amount: 9.95, currency: <CurrencyEnum>'EUR'}))
			.addPart(new Part({amount: 9.95, currency: <CurrencyEnum>'DKK'}));
		expect(transaction.toQueryString()).toBe(expectedTransactionUrl);

		const promise: Promise<any> = new TrackingService('my-tracking-domain.com')
			.registerTransaction(transaction);

		expect(promise).resolves.toBe(global['__dc_response']);

		expect(scriptTags.length).toBe(1);

		expect(scriptTags[0].src).toBe(`https://my-tracking-domain.com/js/t/?src=js_unittest&cdci=CookieDCI&lsdci=LocalStorageDCI&${expectedTransactionUrl}`);

		expect.assertions(5);

		scriptTags[0].onload(new Event('success'));
		return promise;
	});

	it('Should register transaction with gclid from localStorage', () => {
		const storageParamName: string = config.storageParams.find((entry) => entry.names.includes('gclid')).storageName;
		localStorage.setItem(storageParamName, 'LocalStorageGclId');
		new CookieService().set(storageParamName, 'CookieGclid');

		const scriptTags: HTMLCollectionOf<HTMLScriptElement> = document.head.getElementsByTagName('script');
		expect(scriptTags.length).toBe(0);

		const expectedTransactionUrl: string = 'ci=475&np=3&ti=123&p[]=%7Ba%3A1%7D&p[]=%7Ba%3A9.95%7D%7Bcur%3AEUR%7D&p[]=%7Ba%3A9.95%7D%7Bcur%3ADKK%7D';
		const transaction: Transaction = new Transaction({
			campaignId: 475,
			transactionId: 123
		})
			.addPart(new Part({amount: 1}))
			.addPart(new Part({amount: 9.95, currency: <CurrencyEnum>'EUR'}))
			.addPart(new Part({amount: 9.95, currency: <CurrencyEnum>'DKK'}));
		expect(transaction.toQueryString()).toBe(expectedTransactionUrl);

		const promise: Promise<any> = new TrackingService('my-tracking-domain.com')
			.registerTransaction(transaction);

		expect(promise).resolves.toBe(global['__dc_response']);

		expect(scriptTags.length).toBe(1);

		expect(scriptTags[0].src).toBe(`https://my-tracking-domain.com/js/t/?src=js_unittest&gclid=LocalStorageGclId&${expectedTransactionUrl}`);

		expect.assertions(5);

		scriptTags[0].onload(new Event('success'));
		return promise;
	});

	it('Should register transaction with DCI from cookie', () => {
		const storageParamName: string = config.storageParams.find((entry) => entry.names.includes('dci')).storageName;
		new CookieService().set(storageParamName, 'CookieDCI');

		const scriptTags: HTMLCollectionOf<HTMLScriptElement> = document.head.getElementsByTagName('script');
		expect(scriptTags.length).toBe(0);

		const expectedTransactionUrl: string = 'ci=475&np=3&ti=123&p[]=%7Ba%3A1%7D&p[]=%7Ba%3A9.95%7D%7Bcur%3AEUR%7D&p[]=%7Ba%3A9.95%7D%7Bcur%3ADKK%7D';
		const transaction: Transaction = new Transaction({
			campaignId: 475,
			transactionId: 123
		})
			.addPart(new Part({amount: 1}))
			.addPart(new Part({amount: 9.95, currency: <CurrencyEnum>'EUR'}))
			.addPart(new Part({amount: 9.95, currency: <CurrencyEnum>'DKK'}));
		expect(transaction.toQueryString()).toBe(expectedTransactionUrl);

		const promise: Promise<any> = new TrackingService('my-tracking-domain.com')
			.registerTransaction(transaction);

		expect(promise).resolves.toBe(global['__dc_response']);

		expect(scriptTags.length).toBe(1);

		expect(scriptTags[0].src).toBe(`https://my-tracking-domain.com/js/t/?src=js_unittest&cdci=CookieDCI&${expectedTransactionUrl}`);

		expect.assertions(5);

		scriptTags[0].onload(new Event('success'));
		return promise;
	});

	it('Should register transaction with gclid from cookie', () => {
		const storageParamName: string = config.storageParams.find((entry) => entry.names.includes('gclid')).storageName;
		new CookieService().set(storageParamName, 'CookieGclid');

		const scriptTags: HTMLCollectionOf<HTMLScriptElement> = document.head.getElementsByTagName('script');
		expect(scriptTags.length).toBe(0);

		const expectedTransactionUrl: string = 'ci=475&np=3&ti=123&p[]=%7Ba%3A1%7D&p[]=%7Ba%3A9.95%7D%7Bcur%3AEUR%7D&p[]=%7Ba%3A9.95%7D%7Bcur%3ADKK%7D';
		const transaction: Transaction = new Transaction({
			campaignId: 475,
			transactionId: 123
		})
			.addPart(new Part({amount: 1}))
			.addPart(new Part({amount: 9.95, currency: <CurrencyEnum>'EUR'}))
			.addPart(new Part({amount: 9.95, currency: <CurrencyEnum>'DKK'}));
		expect(transaction.toQueryString()).toBe(expectedTransactionUrl);

		const promise: Promise<any> = new TrackingService('my-tracking-domain.com')
			.registerTransaction(transaction);

		expect(promise).resolves.toBe(global['__dc_response']);

		expect(scriptTags.length).toBe(1);

		expect(scriptTags[0].src).toBe(`https://my-tracking-domain.com/js/t/?src=js_unittest&gclid=CookieGclid&${expectedTransactionUrl}`);

		expect.assertions(5);

		scriptTags[0].onload(new Event('success'));
		return promise;
	});

	it('Should call a second URL on error of the first', () => {
		const scriptTags: HTMLCollectionOf<HTMLScriptElement> = document.head.getElementsByTagName('script');
		expect(scriptTags.length).toBe(0);

		const expectedTransactionUrl: string = 'ci=475&np=3&ti=123&p[]=%7Ba%3A1%7D&p[]=%7Ba%3A9.95%7D%7Bcur%3AEUR%7D&p[]=%7Ba%3A9.95%7D%7Bcur%3ADKK%7D';
		const transaction: Transaction = new Transaction({
			campaignId: 475,
			transactionId: 123
		})
			.addPart(new Part({amount: 1}))
			.addPart(new Part({amount: 9.95, currency: <CurrencyEnum>'EUR'}))
			.addPart(new Part({amount: 9.95, currency: <CurrencyEnum>'DKK'}));
		expect(transaction.toQueryString()).toBe(expectedTransactionUrl);

		const promise: Promise<any> = new TrackingService('my-tracking-domain.com')
			.registerTransaction(transaction);

		expect(promise).resolves.toBe(global['__dc_response']);

		expect(scriptTags.length).toBe(1);

		scriptTags[0].onerror('Failed to load');

		expect(scriptTags.length).toBe(2);

		expect(scriptTags[1].src).toMatch(
			new RegExp(`https\\://[0-9]{8}.newstat.net/js/t/\\?src=js_unittest&ci=475&np=3&ti=123&p\\[\\]=%7Ba%3A1%7D&p\\[\\]=%7Ba%3A9.95%7D%7Bcur%3AEUR%7D&p\\[\\]=%7Ba%3A9.95%7D%7Bcur%3ADKK%7D`)
		);

		expect.assertions(6);

		scriptTags[1].onload(new Event('success'));
	});

	it('Should call an image tag on error of the second URL', () => {
		const scriptTags: HTMLCollectionOf<HTMLScriptElement> = document.head.getElementsByTagName('script');
		expect(scriptTags.length).toBe(0);

		const imageTags: HTMLCollectionOf<HTMLImageElement> = document.body.getElementsByTagName('img');
		expect(imageTags.length).toBe(0);


		const expectedTransactionUrl: string = 'ci=475&np=3&ti=123&p[]=%7Ba%3A1%7D&p[]=%7Ba%3A9.95%7D%7Bcur%3AEUR%7D&p[]=%7Ba%3A9.95%7D%7Bcur%3ADKK%7D';
		const transaction: Transaction = new Transaction({
			campaignId: 475,
			transactionId: 123
		})
			.addPart(new Part({amount: 1}))
			.addPart(new Part({amount: 9.95, currency: <CurrencyEnum>'EUR'}))
			.addPart(new Part({amount: 9.95, currency: <CurrencyEnum>'DKK'}));
		expect(transaction.toQueryString()).toBe(expectedTransactionUrl);

		const promise: Promise<any> = new TrackingService('my-tracking-domain.com')
			.registerTransaction(transaction);

		expect(promise).resolves.toMatchObject(<Partial<SuccessInterface>>{status: TrackingStatusEnum.PIXEL_AB});

		expect(scriptTags.length).toBe(1);

		scriptTags[0].onerror('Failed to load');

		expect(scriptTags.length).toBe(2);

		scriptTags[1].onerror('Failed to load');

		expect(scriptTags.length).toBe(2);
		expect(imageTags.length).toBe(1);

		expect(imageTags[0].src).toMatch(
			new RegExp(`https\\://[0-9]{8}.newstat.net/js/ab/\\?src=js_unittest&ci=475&np=3&ti=123&p\\[\\]=%7Ba%3A1%7D&p\\[\\]=%7Ba%3A9.95%7D%7Bcur%3AEUR%7D&p\\[\\]=%7Ba%3A9.95%7D%7Bcur%3ADKK%7D`)
		);

		expect.assertions(9);

		imageTags[0].onload(new Event('success'));
	});
});

describe('TrackingService: Store data', () => {
	function fullTime(time: number): string {
		return (time < 10 ? '0' : '') + time.toString();
	}

	const dom: JSDOM = new JSDOM();
	const measureDate: Date = new Date()
	measureDate.setTime(new Date().getTime() + config.ttl);
	const dateString: string = measureDate.toUTCString()
		.replace(
			`${fullTime(measureDate.getHours())}:${fullTime(measureDate.getMinutes())}:${fullTime(measureDate.getSeconds())}`, `[0-9]{2}\\:[0-9]{2}\\:[0-9]{2}`
		);

	beforeEach(() => {
		Object.defineProperty(window, 'document', {
			writable: true,
			value: dom.window.document,
		});
		Object.defineProperty(window.document, 'cookie', {
			writable: true,
			value: '',
		});
		Object.defineProperty(window, 'localStorage', {
			writable: true,
			value: new StorageMock(),
		});
		Object.defineProperty(window, 'sessionStorage', {
			writable: true,
			value: new StorageMock(),
		});
	});

	it('Should not do anything if no dci exists', () => {
		const storageParamName: string = config.storageParams.find((entry) => entry.names.includes('dci')).storageName;

		expect(document.cookie).toBe('');
		expect(sessionStorage.getItem(storageParamName)).toBe(null);
		expect(localStorage.getItem(storageParamName)).toBe(null);

		dom.reconfigure({url: 'https://www.example.com/?dci='})

		new TrackingService()
			.storeData();

		expect(document.cookie).toBe('');
		expect(sessionStorage.getItem(storageParamName)).toBe(null);
		expect(localStorage.getItem(storageParamName)).toBe(null);
	})

	it('Should retrieve the dci from the URL and store it', () => {
		const storageParamName: string = config.storageParams.find((entry) => entry.names.includes('dci')).storageName;

		expect(document.cookie).toBe('');
		expect(sessionStorage.getItem(storageParamName)).toBe(null);
		expect(localStorage.getItem(storageParamName)).toBe(null);

		dom.reconfigure({url: 'https://www.example.com/?dci=ABCDEFGHIJKLM'})

		new TrackingService()
			.storeData();

		expect(document.cookie).toMatch(
			new RegExp(`dci=ABCDEFGHIJKLM; expires=${dateString}; path=/; domain=example.com; SameSite=Strict; Secure;`)
		);
		expect(sessionStorage.getItem(storageParamName)).toBe('ABCDEFGHIJKLM');
		expect(localStorage.getItem(storageParamName)).toBe('ABCDEFGHIJKLM');

	});

	it('Should remain previous value if not set or empty', () => {
		const storageParamName: string = config.storageParams.find((entry) => entry.names.includes('dci')).storageName;

		expect(document.cookie).toBe('');
		expect(sessionStorage.getItem(storageParamName)).toBe(null);
		expect(localStorage.getItem(storageParamName)).toBe(null);

		dom.reconfigure({url: 'https://www.example.com/?dci=ABCDEFGHIJKLM'})

		new TrackingService()
			.storeData();

		expect(document.cookie).toMatch(
			new RegExp(`dci=ABCDEFGHIJKLM; expires=${dateString}; path=/; domain=example.com; SameSite=Strict; Secure;`)
		);
		expect(sessionStorage.getItem(storageParamName)).toBe('ABCDEFGHIJKLM');
		expect(localStorage.getItem(storageParamName)).toBe('ABCDEFGHIJKLM');

		dom.reconfigure({url: 'https://www.example.com/'})

		new TrackingService()
			.storeData();

		expect(document.cookie).toMatch(
			new RegExp(`dci=ABCDEFGHIJKLM; expires=${dateString}; path=/; domain=example.com; SameSite=Strict; Secure;`)
		);
		expect(sessionStorage.getItem(storageParamName)).toBe('ABCDEFGHIJKLM');
		expect(localStorage.getItem(storageParamName)).toBe('ABCDEFGHIJKLM');

		dom.reconfigure({url: 'https://www.example.com/?dci='})

		new TrackingService()
			.storeData();

		expect(document.cookie).toMatch(
			new RegExp(`dci=ABCDEFGHIJKLM; expires=${dateString}; path=/; domain=example.com; SameSite=Strict; Secure;`)
		);
		expect(sessionStorage.getItem(storageParamName)).toBe('ABCDEFGHIJKLM');
		expect(localStorage.getItem(storageParamName)).toBe('ABCDEFGHIJKLM');
	});

	it('Should remain be overwritten if changed', () => {
		const storageParamName: string = config.storageParams.find((entry) => entry.names.includes('dci')).storageName;

		expect(document.cookie).toBe('');
		expect(sessionStorage.getItem(storageParamName)).toBe(null);
		expect(localStorage.getItem(storageParamName)).toBe(null);

		dom.reconfigure({url: 'https://www.example.com/?dci=ABCDEFGHIJKLM'})

		new TrackingService()
			.storeData();

		expect(document.cookie).toMatch(
			new RegExp(`dci=ABCDEFGHIJKLM; expires=${dateString}; path=/; domain=example.com; SameSite=Strict; Secure;`)
		);
		expect(sessionStorage.getItem(storageParamName)).toBe('ABCDEFGHIJKLM');
		expect(localStorage.getItem(storageParamName)).toBe('ABCDEFGHIJKLM');

		dom.reconfigure({url: 'https://www.example.com/?dci=QRYZ'})

		new TrackingService()
			.storeData();

		expect(document.cookie).toMatch(
			new RegExp(`dci=QRYZ; expires=${dateString}; path=/; domain=example.com; SameSite=Strict; Secure;`)
		);
		expect(sessionStorage.getItem(storageParamName)).toBe('QRYZ');
		expect(localStorage.getItem(storageParamName)).toBe('QRYZ');
	});

	it('Should store data from the config if utm_source = daisycon case insensitive', () => {
		expect(document.cookie).toBe('');
		config.storageParams.forEach((param) => {
			expect(sessionStorage.getItem(param.storageName)).toBe(null);
			expect(localStorage.getItem(param.storageName)).toBe(null);
		});

		dom.reconfigure({url: 'https://www.example.com/?uTm_SoUrCe=DaIsYcOn&gclid=somethingsomething'})

		new TrackingService()
			.storeData();

		expect(document.cookie).toMatch(
			new RegExp(`gclid=somethingsomething; expires=${dateString}; path=/; domain=example.com; SameSite=Strict; Secure;`)
		);
		expect(sessionStorage.getItem('gclid')).toBe('somethingsomething');
		expect(localStorage.getItem('gclid')).toBe('somethingsomething');
	});

	it('Should store data from the config if dci is set regardless of value', () => {
		expect(document.cookie).toBe('');
		config.storageParams.forEach((param) => {
			expect(sessionStorage.getItem(param.storageName)).toBe(null);
			expect(localStorage.getItem(param.storageName)).toBe(null);
		});

		dom.reconfigure({url: 'https://www.example.com/?dCI=SomeRandomDci&gclid=somethingElse'})

		new TrackingService()
			.storeData();

		expect(document.cookie).toMatch(
			new RegExp(`gclid=somethingElse; expires=${dateString}; path=/; domain=example.com; SameSite=Strict; Secure;`)
		);
		expect(sessionStorage.getItem('gclid')).toBe('somethingElse');
		expect(localStorage.getItem('gclid')).toBe('somethingElse');
	});

	it('Should not store data if utm_source != daisycon and DCI is not present', () => {
		expect(document.cookie).toBe('');
		config.storageParams.forEach((param) => {
			expect(sessionStorage.getItem(param.storageName)).toBe(null);
			expect(localStorage.getItem(param.storageName)).toBe(null);
		});

		dom.reconfigure({url: 'https://www.example.com/?gclid=somethingElse'})

		new TrackingService()
			.storeData();

		expect(document.cookie).toBe('');
		config.storageParams.forEach((param) => {
			expect(sessionStorage.getItem(param.storageName)).toBe(null);
			expect(localStorage.getItem(param.storageName)).toBe(null);
		});
	});
});

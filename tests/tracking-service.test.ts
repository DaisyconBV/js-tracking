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

		expect(scriptTags[0].src).toBe(`https://my-tracking-domain.com/js/t/?cdci=&lsdci=&${expectedTransactionUrl}&src=js_unittest`);

		expect.assertions(5);

		scriptTags[0].onload(new Event('success'));
		return promise;
	});

	it('Should register transaction with DCI from session', () => {
		sessionStorage.setItem(config.storageName, 'SessionDCI');
		localStorage.setItem(config.storageName, 'LocalStorageDCI');
		new CookieService().set('CookieDCI');

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

		expect(scriptTags[0].src).toBe(`https://my-tracking-domain.com/js/t/?cdci=CookieDCI&lsdci=SessionDCI&${expectedTransactionUrl}&src=js_unittest`);

		expect.assertions(5);

		scriptTags[0].onload(new Event('success'));
		return promise;
	});

	it('Should register transaction with DCI from localStorage', () => {
		localStorage.setItem(config.storageName, 'LocalStorageDCI');
		new CookieService().set('CookieDCI');

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

		expect(scriptTags[0].src).toBe(`https://my-tracking-domain.com/js/t/?cdci=CookieDCI&lsdci=LocalStorageDCI&${expectedTransactionUrl}&src=js_unittest`);

		expect.assertions(5);

		scriptTags[0].onload(new Event('success'));
		return promise;
	});

	it('Should register transaction with DCI from cookie', () => {
		new CookieService().set('CookieDCI');

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

		expect(scriptTags[0].src).toBe(`https://my-tracking-domain.com/js/t/?cdci=CookieDCI&lsdci=&${expectedTransactionUrl}&src=js_unittest`);

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
			new RegExp(`https\\://[0-9]{8}.newstat.net/js/t/\\?cdci=&lsdci=&ci=475&np=3&ti=123&p\\[\\]=%7Ba%3A1%7D&p\\[\\]=%7Ba%3A9.95%7D%7Bcur%3AEUR%7D&p\\[\\]=%7Ba%3A9.95%7D%7Bcur%3ADKK%7D&src=js_unittest`)
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
			new RegExp(`https\\://[0-9]{8}.newstat.net/js/ab/\\?cdci=&lsdci=&ci=475&np=3&ti=123&p\\[\\]=%7Ba%3A1%7D&p\\[\\]=%7Ba%3A9.95%7D%7Bcur%3AEUR%7D&p\\[\\]=%7Ba%3A9.95%7D%7Bcur%3ADKK%7D&src=js_unittest`)
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
		expect(document.cookie).toBe('');
		expect(sessionStorage.getItem(config.storageName)).toBe(null);
		expect(localStorage.getItem(config.storageName)).toBe(null);

		dom.reconfigure({url: 'https://www.example.com/?dci='})

		new TrackingService()
			.storeData();

		expect(document.cookie).toBe('');
		expect(sessionStorage.getItem(config.storageName)).toBe(null);
		expect(localStorage.getItem(config.storageName)).toBe(null);
	})

	it('Should retrieve the dci from the URL and store it', () => {

		expect(document.cookie).toBe('');
		expect(sessionStorage.getItem(config.storageName)).toBe(null);
		expect(localStorage.getItem(config.storageName)).toBe(null);

		dom.reconfigure({url: 'https://www.example.com/?dci=ABCDEFGHIJKLM'})

		new TrackingService()
			.storeData();

		expect(document.cookie).toMatch(
			new RegExp(`dci=ABCDEFGHIJKLM; expires=${dateString}; path=/; domain=example.com; SameSite=Strict; Secure;`)
		);
		expect(sessionStorage.getItem(config.storageName)).toBe('ABCDEFGHIJKLM');
		expect(localStorage.getItem(config.storageName)).toBe('ABCDEFGHIJKLM');

	});

	it('Should remain previous value if not set or empty', () => {
		expect(document.cookie).toBe('');
		expect(sessionStorage.getItem(config.storageName)).toBe(null);
		expect(localStorage.getItem(config.storageName)).toBe(null);

		dom.reconfigure({url: 'https://www.example.com/?dci=ABCDEFGHIJKLM'})

		new TrackingService()
			.storeData();

		expect(document.cookie).toMatch(
			new RegExp(`dci=ABCDEFGHIJKLM; expires=${dateString}; path=/; domain=example.com; SameSite=Strict; Secure;`)
		);
		expect(sessionStorage.getItem(config.storageName)).toBe('ABCDEFGHIJKLM');
		expect(localStorage.getItem(config.storageName)).toBe('ABCDEFGHIJKLM');

		dom.reconfigure({url: 'https://www.example.com/'})

		new TrackingService()
			.storeData();

		expect(document.cookie).toMatch(
			new RegExp(`dci=ABCDEFGHIJKLM; expires=${dateString}; path=/; domain=example.com; SameSite=Strict; Secure;`)
		);
		expect(sessionStorage.getItem(config.storageName)).toBe('ABCDEFGHIJKLM');
		expect(localStorage.getItem(config.storageName)).toBe('ABCDEFGHIJKLM');

		dom.reconfigure({url: 'https://www.example.com/?dci='})

		new TrackingService()
			.storeData();

		expect(document.cookie).toMatch(
			new RegExp(`dci=ABCDEFGHIJKLM; expires=${dateString}; path=/; domain=example.com; SameSite=Strict; Secure;`)
		);
		expect(sessionStorage.getItem(config.storageName)).toBe('ABCDEFGHIJKLM');
		expect(localStorage.getItem(config.storageName)).toBe('ABCDEFGHIJKLM');
	});

	it('Should remain be overwritten if changed', () => {
		expect(document.cookie).toBe('');
		expect(sessionStorage.getItem(config.storageName)).toBe(null);
		expect(localStorage.getItem(config.storageName)).toBe(null);

		dom.reconfigure({url: 'https://www.example.com/?dci=ABCDEFGHIJKLM'})

		new TrackingService()
			.storeData();

		expect(document.cookie).toMatch(
			new RegExp(`dci=ABCDEFGHIJKLM; expires=${dateString}; path=/; domain=example.com; SameSite=Strict; Secure;`)
		);
		expect(sessionStorage.getItem(config.storageName)).toBe('ABCDEFGHIJKLM');
		expect(localStorage.getItem(config.storageName)).toBe('ABCDEFGHIJKLM');

		dom.reconfigure({url: 'https://www.example.com/?dci=QRYZ'})

		new TrackingService()
			.storeData();

		expect(document.cookie).toMatch(
			new RegExp(`dci=QRYZ; expires=${dateString}; path=/; domain=example.com; SameSite=Strict; Secure;`)
		);
		expect(sessionStorage.getItem(config.storageName)).toBe('QRYZ');
		expect(localStorage.getItem(config.storageName)).toBe('QRYZ');
	});
});

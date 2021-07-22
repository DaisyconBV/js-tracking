import {CookieService} from 'src/storage/cookie.service';

describe('Storage: CookieService', () => {
	beforeAll(() => {
		Object.defineProperty(window.document, 'cookie', {
			writable: true,
			value: '',
		});
	});

	it('Should set and read the cookie', () => {
		const cookieService: CookieService = new CookieService();
		expect(cookieService.get()).toBe(null);

		const hash: string = 'jhsdfksd6f6734j8';
		cookieService.set(hash)
		expect(cookieService.get()).toBe(hash);
	});
});

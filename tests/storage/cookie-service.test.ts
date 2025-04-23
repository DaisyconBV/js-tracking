import {CookieService} from 'src/storage/cookie.service';

describe('Storage: CookieService', () => {
	beforeAll(() => {
		Object.defineProperty(window.document, 'cookie', {
			writable: true,
			value: '',
		});
	});

	it('Should set and read the cookie', () => {
		const uniqueName: string = 'some-test-name-95235';
		const cookieService: CookieService = new CookieService();
		expect(cookieService.get(uniqueName)).toBe(null);

		const hash: string = 'jhsdfksd6f6734j8';
		cookieService.set(uniqueName, hash)
		expect(cookieService.get(uniqueName)).toBe(hash);
	});
});

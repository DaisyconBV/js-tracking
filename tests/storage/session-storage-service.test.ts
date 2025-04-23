import {SessionStorageService} from 'src/storage/session-storage.service';
import {StorageMock} from 'tests/mocks/storage.mock';

describe('Storage: SessionStorage', () => {
	beforeAll(() => {
		Object.defineProperty(window, 'sessionStorage', {
			writable: true,
			value: new StorageMock(),
		});
	});

	it('Should set and read the sessionStorage', () => {
		const uniqueName: string = 'some-test-name-124784';
		const storageService: SessionStorageService = new SessionStorageService();
		expect(storageService.get(uniqueName)).toBe(null);

		const hash: string = 'jhsdfksd6f6734j8';
		storageService.set(uniqueName, hash)
		expect(storageService.get(uniqueName)).toBe(hash);
	});
});

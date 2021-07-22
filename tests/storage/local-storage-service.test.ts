import {LocalStorageService} from 'src/storage/local-storage.service';
import {StorageMock} from 'tests/mocks/storage.mock';

describe('Storage: LocalStorage', () => {
	beforeAll(() => {
		Object.defineProperty(window, 'localStorage', {
			writable: true,
			value: new StorageMock(),
		});
	});

	it('Should set and read the localStorage', () => {
		const storageService: LocalStorageService = new LocalStorageService();
		expect(storageService.get()).toBe(null);

		const hash: string = 'jhsdfksd6f6734j8';
		storageService.set(hash)
		expect(storageService.get()).toBe(hash);
	});
});

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
		const uniqueName: string = 'some-test-name-34738';
		const storageService: LocalStorageService = new LocalStorageService();
		expect(storageService.get(uniqueName)).toBe(null);

		const hash: string = 'jhsdfksd6f6734j8';
		storageService.set(uniqueName, hash)
		expect(storageService.get(uniqueName)).toBe(hash);
	});
});

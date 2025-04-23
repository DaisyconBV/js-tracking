import {StorageServiceInterface} from 'src/storage/storage-service.interface';

export class LocalStorageService implements StorageServiceInterface {
	public get(name: string): string {
		if (typeof Storage === 'undefined') {
			return null;
		}
		return window.localStorage.getItem(name);
	}

	public set(name: string, value: string): void {
		window.localStorage.setItem(name, value);
	}
}

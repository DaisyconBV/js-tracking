import {StorageServiceInterface} from 'src/storage/storage-service.interface';

export class SessionStorageService implements StorageServiceInterface {
	public get(name: string): string {
		if (typeof Storage === 'undefined') {
			return null;
		}
		return window.sessionStorage.getItem(name);
	}

	public set(name: string, value: string): void {
		window.sessionStorage.setItem(name, value);
	}
}

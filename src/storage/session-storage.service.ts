import {config} from 'src/config';
import {StorageServiceInterface} from 'src/storage/storage-service.interface';

export class SessionStorageService implements StorageServiceInterface {
	public get(): string {
		if (typeof Storage === 'undefined') {
			return null;
		}
		return window.sessionStorage.getItem(config.storageName);
	}

	public set(dci: string): void {
		window.sessionStorage.setItem(config.storageName, dci);
	}
}

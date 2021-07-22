import {config} from 'src/config';
import {StorageServiceInterface} from 'src/storage/storage-service.interface';

export class LocalStorageService implements StorageServiceInterface {
	public get(): string {
		if (typeof Storage === 'undefined') {
			return null;
		}
		return window.localStorage.getItem(config.storageName);
	}

	public set(dci: string): void {
		window.localStorage.setItem(config.storageName, dci);
	}
}

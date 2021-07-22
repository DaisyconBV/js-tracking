import {config} from 'src/config';
import {StorageServiceInterface} from 'src/storage/storage-service.interface';

export class CookieService implements StorageServiceInterface {
	public get(): string {
		const cookieValue: string = document.cookie.split('; ')
			.find((cookie: string) => cookie.startsWith(config.storageName + '='))
			?.split('=')[1];

		return cookieValue || null;
	}

	public set(dci: string): void {
		let expireDate: Date = new Date();
		expireDate.setTime(expireDate.getTime() + config.ttl);

		document.cookie = config.storageName + '=' + dci
			+ '; expires=' + expireDate.toUTCString()
			+ '; path=/; domain=' + document.location.hostname.replace(/^www\./i, '')
			+ '; SameSite=Strict; Secure;';
	}
}

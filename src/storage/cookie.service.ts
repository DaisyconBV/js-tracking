import {config} from 'src/config';
import {StorageServiceInterface} from 'src/storage/storage-service.interface';

export class CookieService implements StorageServiceInterface {
	public get(name: string): string {
		const cookieValue: string = document.cookie.split(';')
			.find((cookie: string) => cookie.trim().startsWith(name + '='))
			?.split('=')[1].trim();

		return cookieValue || null;
	}

	public set(name: string, value: string): void {
		const expireDate: Date = new Date(Date.now() + config.ttl);

		const cookieParts: string[] = [
			`${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
			`expires=${expireDate.toUTCString()}`,
			'path=/',
			`domain=${document.location.hostname.replace(/^www\./i, '')}`,
			'SameSite=Strict',
			'Secure',
		];

		document.cookie = cookieParts.join('; ') + ';';
	}
}

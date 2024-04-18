import {config} from 'src/config';
import {Transaction} from 'src/models/transaction';
import {SuccessInterface} from 'src/response/success.interface';
import {TrackingStatusEnum} from 'src/response/tracking-status.enum';
import {CookieService} from 'src/storage/cookie.service';
import {LocalStorageService} from 'src/storage/local-storage.service';
import {SessionStorageService} from 'src/storage/session-storage.service';

declare const __dc_response: SuccessInterface;

export class TrackingService {
	public src: string = '';

	constructor(
		private trackingSegment: string = 'lt45.net'
	) {}

	public async registerTransaction(transaction: Transaction, useDomElement: boolean = true): Promise<SuccessInterface> {
		return new Promise<SuccessInterface>(async (resolve: (response: SuccessInterface) => void, reject: (error: any) => void) => {
			if (!transaction.campaignId) {
				throw new Error('Invalid campaign ID');
			}

			// Cast to object for compiled minified version where people can't create object themselves.
			transaction = new Transaction(transaction);

			const cookieValue: string = new CookieService().get() || '';
			const storageValue: string = new SessionStorageService().get() || new LocalStorageService().get() || '';
			const queryString: string = `cdci=${encodeURIComponent(cookieValue)}`
				+ `&lsdci=${encodeURIComponent(storageValue)}`
				+ `&${transaction.toQueryString()}`
				+ `&src=${encodeURIComponent(this.src ? this.src : config.version)}`;
			const url: string = `https://${this.trackingSegment}/js/t/?${queryString}`;

			let id: string = 'news';
			let className: string = 'net';
			const host: string = '//' + Math.round(+new Date() / 83000) + '.' + id + 'tat.' + className ;
			const fallbackUrl: string = `${host}/js/t/?${queryString}`;

			if (useDomElement) {
				await this.createScriptTag(url, fallbackUrl)
					.then((response: SuccessInterface) => resolve(response))
					.catch((error: any) => reject(error));
				return;
			}

			await this.performAjaxCall(url, fallbackUrl)
				.then((response: SuccessInterface) => resolve(response))
				.catch((error: any) => reject(error));
		});
	}

	private async createScriptTag(url: string, fallbackUrl: string): Promise<SuccessInterface> {
		return new Promise<SuccessInterface>((resolve: (response: SuccessInterface) => void, reject: (error: any) => void) => {
			const primaryScriptElement: HTMLScriptElement = document.createElement('script');
			primaryScriptElement.src = url;
			primaryScriptElement.onerror = primaryScriptElement.oncancel = primaryScriptElement.oninvalid = primaryScriptElement.onabort = () => {
				const abScriptElement: HTMLScriptElement = document.createElement('script');
				abScriptElement.src = fallbackUrl;

				abScriptElement.onload = () => resolve(__dc_response || null);
				abScriptElement.onerror = abScriptElement.oncancel = abScriptElement.oninvalid = abScriptElement.onabort = () => {
					const imageElement: HTMLImageElement = document.createElement('img');
					imageElement.height = 1;
					imageElement.width = 1;
					imageElement.style.border = '0px';
					imageElement.src = fallbackUrl.replace('/js/t/', '/ab/');
					imageElement.onerror = imageElement.oncancel = imageElement.oninvalid = imageElement.onabort = (event: UIEvent) => reject(event);
					imageElement.onload = () => resolve(<SuccessInterface>{status: TrackingStatusEnum.PIXEL_AB});
					document.body.appendChild(imageElement);
				};
				document.head.appendChild(abScriptElement);
			};

			primaryScriptElement.onload = () => resolve(__dc_response || null);
			document.head.appendChild(primaryScriptElement);
		});
	}

	private async performAjaxCall(url: string, fallbackUrl: string): Promise<SuccessInterface> {
		try {
			const result: Response = await fetch(
				url,
				{
					headers: {
						'Content-Type': 'application/json',
						'X-Requested-With': 'XMLHttpRequest'
					}
				}
			);
			return result.json();
		}
		catch (e) {
			try {
				const response: Response = await fetch(
					fallbackUrl,
					{
						headers: {
							'Content-Type': 'application/json',
							'X-Requested-With': 'XMLHttpRequest'
						}
					}
				);
				return response.json();
			} catch {
				await fetch(fallbackUrl.replace('/js/t/', '/ab/'));
				return <SuccessInterface>{status: TrackingStatusEnum.PIXEL_AB};
			}
		}
	}

	public storeData(): void {
		let location: URL = new URL(document.location.toString());
		let dci: string = location.searchParams.get(config.param)
			|| new SessionStorageService().get()
			|| new LocalStorageService().get()
			|| new CookieService().get();

		if (!dci) {
			return;
		}

		new CookieService().set(dci);
		new LocalStorageService().set(dci);
		new SessionStorageService().set(dci);
	}
}

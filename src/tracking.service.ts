import {config} from 'src/config';
import {Transaction} from 'src/models/transaction';
import {SuccessInterface} from 'src/response/success.interface';
import {TrackingStatusEnum} from 'src/response/tracking-status.enum';
import {CookieService} from 'src/storage/cookie.service';
import {LocalStorageService} from 'src/storage/local-storage.service';
import {SessionStorageService} from 'src/storage/session-storage.service';

declare const __dc_response: SuccessInterface;

export class TrackingService {
	constructor(
		private trackingSegment: string = 'ds1.nl'
	) {}


	public registerTransaction(transaction: Transaction): Promise<SuccessInterface> {
		return new Promise<SuccessInterface>((resolve: (response: SuccessInterface) => void, reject: (error: any) => void) => {
			if (!transaction.campaignId) {
				throw new Error('Invalid campaign ID');
			}

			const cookieValue: string = new CookieService().get();
			const storageValue: string = new SessionStorageService().get() || new LocalStorageService().get();
			const queryString: string = `cdci=${encodeURIComponent(cookieValue)}`
				+ `&lsdci=${encodeURIComponent(storageValue)}`
				+ `&${transaction.toQueryString()}`
				+ `&src=${encodeURIComponent(config.version)}`;

			const primaryScriptElement: HTMLScriptElement = document.createElement('script');
			primaryScriptElement.src = `https://${this.trackingSegment}/js/t/?${queryString}`;
			primaryScriptElement.onerror = primaryScriptElement.oncancel = primaryScriptElement.oninvalid = primaryScriptElement.onabort = () => {
				let id: string = 'news';
				let className: string = 'net';
				const host: string = '//' + Math.round(+new Date() / 83000) + '.' + id + 'tat.' + className ;

				const abScriptElement: HTMLScriptElement = document.createElement('script');
				abScriptElement.src = host + '/js/?' + queryString;

				abScriptElement.onload = () => resolve(__dc_response || null);
				abScriptElement.onerror = abScriptElement.oncancel = abScriptElement.oninvalid = abScriptElement.onabort = () => {
					const imageElement: HTMLImageElement = document.createElement('img');
					imageElement.height = 1;
					imageElement.width = 1;
					imageElement.style.border = '0px';
					imageElement.src = host + '/ab/?' + queryString;
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

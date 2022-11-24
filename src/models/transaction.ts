import {Part} from 'src/models/part';

export class Transaction {
	public account: string;
	public campaignId: number;
	public extraHash: string|number;
	public marketingChannel: string|number;
	public maxDate: Date|string;
	public parts: Part[] = [];
	public promotionCode: string|number;
	public transactionId: string|number;

	constructor(transactionData?: Partial<Transaction>) {
		Object.assign(
			this,
			{
				...transactionData,
				parts: transactionData?.parts?.map((part: Part) => new Part(part)) || []
			}
		);
	}

	public addPart(part: Partial<Part>): Transaction {
		this.parts = [
			...this.parts,
			new Part(part)
		];
		return this;
	}

	public toQueryString(): string {
		const params: URLSearchParams = new URLSearchParams({
			at: (this.account                      || ''),
			ci: (this.campaignId?.toString()       || ''),
			eh: (this.extraHash?.toString()        || ''),
			mc: (this.marketingChannel?.toString() || ''),
			md: (this.parseDate(this.maxDate)      || ''),
			np: (this.parts.length.toString()      || ''),
			pr: (this.promotionCode?.toString()    || ''),
			ti: (this.transactionId?.toString()    || ''),
		});

		let keysToDelete: string[] = [];
		params.forEach((paramValue: string, paramName: string) => {
			if (!paramValue) {
				keysToDelete.push(paramName);
			}
		});
		keysToDelete.forEach((paramName: string) => params.delete(paramName));

		const partQueryString: string = this.parts?.length
			? '&' + this.parts.map((part: Part) => part.toQueryString()).join('&')
			: '';
		return params.toString() + partQueryString;
	}

	private parseDate(date: Date|string): string {
		if (date instanceof Date) {
			return date.toISOString().slice(0, 10);
		}
		return date;
	}
}

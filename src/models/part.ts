import {CurrencyEnum} from 'src/enums/currency.enum';

export class Part {
	public amount: number;
	public revenue: number;
	public currency: CurrencyEnum;
	public compensationCode: string|number;
	public quantity: number;
	public sku: string|number;
	public externalDescription: string;
	public internalDescription: string;
	public extra1: string;
	public extra2: string;
	public extra3: string;
	public extra4: string;
	public extra5: string;

	constructor(partData?: Partial<Part>) {
		Object.assign(this, partData || {});
	}

	public toQueryString(): string {
		return 'p[]='
			+ encodeURIComponent(
				''
				+ (this.amount              ? `{a:${this.amount}}`               : '')
				+ (this.revenue             ? `{r:${this.revenue}}`              : '')
				+ (this.currency            ? `{curr:${this.currency}}`          : '')
				+ (this.compensationCode    ? `{cc:${this.compensationCode}}`    : '')
				+ (this.quantity            ? `{qty:${this.quantity}}`           : '')
				+ (this.sku                 ? `{sku:${this.sku}}`                : '')
				+ (this.externalDescription ? `{pn:${this.externalDescription}}` : '')
				+ (this.internalDescription ? `{iv:${this.internalDescription}}` : '')
				+ (this.extra1              ? `{e1:${this.extra1}}`              : '')
				+ (this.extra2              ? `{e2:${this.extra2}}`              : '')
				+ (this.extra3              ? `{e3:${this.extra3}}`              : '')
				+ (this.extra4              ? `{e4:${this.extra4}}`              : '')
				+ (this.extra5              ? `{e5:${this.extra5}}`              : '')
		);
	}
}

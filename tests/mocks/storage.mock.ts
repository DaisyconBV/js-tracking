export class StorageMock {
	private store: {[key: string]: any} = {};

	public clear(): void {
		this.store = {};
	}

	public getItem(key: string): any {
		return this.store[key] || null;
	}

	public setItem(key: string, value: any): void {
		this.store[key] = String(value);
	}

	public removeItem(key: string): void {
		delete this.store[key];
	}
}

export interface StorageServiceInterface {
	get(name: string): string;
	set(name: string, value: string): void;
}

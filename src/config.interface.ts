import {AllowanceParamInterface} from 'src/allowance-param.interface';
import {StorageParamInterface} from 'src/storage-param.interface';

export interface ConfigInterface {
	baseUri: string;
	storageAllowanceParams: AllowanceParamInterface[];
	storageParams: StorageParamInterface[];
	ttl: number;
	version: string;
}

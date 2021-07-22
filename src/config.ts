import {ConfigInterface} from 'src/config.interface';
import {LIB_VERSION} from 'src/version';

export const config: ConfigInterface = {
	baseUri: '',
	param: 'dci',
	storageName: 'dci',
	ttl: 31622400000,
	version: 'js_' + LIB_VERSION
};

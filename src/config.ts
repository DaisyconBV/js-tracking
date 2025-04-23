import {ConfigInterface} from 'src/config.interface';
import {LIB_VERSION} from 'src/version';

export const config: ConfigInterface = {
	baseUri: '',
	storageAllowanceParams: [{name: 'utm_source', value: 'daisycon'}, {name: 'dci', value: null}],
	storageParams: [
		{names: ['dci'], storageName: 'dci', dcCookieName: 'cdci', dcStorageName: 'lsdci'},
		{names: ['gclid'], storageName: 'gclid', dcCookieName: 'gclid', dcStorageName: 'gclid'},
	],
	ttl: 31622400000,
	version: 'js_' + LIB_VERSION
};

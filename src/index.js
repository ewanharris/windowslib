/* istanbul ignore if */
if (!Error.prepareStackTrace) {
	require('source-map-support/register');
}

export { default as options } from './options';

import SDK, * as sdk from './sdk';
import SDKExtension from './sdk-extension';
import SDKRevision from './sdk-revision';
import VSWhere, * as vswhere from './vswhere';

export {
	SDK,
	sdk,
	SDKExtension,
	SDKRevision,
	VSWhere,
	vswhere,
};

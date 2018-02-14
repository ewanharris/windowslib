/* istanbul ignore if */
if (!Error.prepareStackTrace) {
	require('source-map-support/register');
}

export { default as options } from './options';

import SDK, * as sdk from './sdk';
import SDKExtension from './sdk-extension';
import SDKRevision from './sdk-revision';
import VisualStudio, * as visualstudio from './visualstudio';
import VSWhere, * as vswhere from './vswhere';
import * as device from './device';

export {
	device,
	SDK,
	sdk,
	SDKExtension,
	SDKRevision,
	VisualStudio,
	visualstudio,
	VSWhere,
	vswhere,
};

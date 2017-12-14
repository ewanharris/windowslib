/* istanbul ignore if */
if (!Error.prepareStackTrace) {
	require('source-map-support/register');
}

export { default as options } from './options';

import * as sdk from './sdk';

export {
	sdk
};

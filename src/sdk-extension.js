import fs from 'fs';
import path from 'path';

import { DOMParser } from 'xmldom';
import { expandPath } from 'appcd-path';
import { isDir, isFile } from 'appcd-fs';

const targetFWInfoRegex = /(\S+), version=(v\d.+)/;

export class SDKExtension {

	/**
	 * Checks if the specified revisionNumber is valid for an SDK.
	 * @param {String} dir - The directory of the Windows SDK extensions
	 * @access public
	 */
	constructor(dir) {
		if (typeof dir !== 'string' || !dir) {
			throw new TypeError('Expected directory to be a valid string');
		}

		dir = expandPath(dir);

		if (!isDir(dir)) {
			throw new Error('Directory does not exist');
		}

		const sdkManifestFile = path.join(dir, 'SDKManifest.xml');
		if (!isFile(sdkManifestFile)) {
			throw new Error('Directory does not contain an "SDKManifest.xml" file');
		}
		const extensionManifestFile = path.join(dir, 'SDKManifest.xml');
		if (isFile(extensionManifestFile)) {
			const extensionManifest = new DOMParser({
				errorHandler: {
					warning() {},
					error() {}
				}
			}).parseFromString(fs.readFileSync(extensionManifestFile, 'utf8'), 'text/xml');

			if (!extensionManifest) {
				throw new Error('Unable to read "SDKManifest.xml" file');
			}
			const props = {};
			const elems = extensionManifest.getElementsByTagName('FileList');
			for (let i = 0; i < elems.length; i++) {
				const el = elems[i];
				for (let j = 0; j < el.attributes.length; j++) {
					const attr = el.attributes.item(j);
					props[attr.name] = attr.value.trim();
				}
			}
			this.displayName = props.DisplayName;
			this.minVSVersion = props.MinVSVersion;
			this.targetPlatform = props.TargetPlatform;
			this.targetPlatformVersion = props.TargetPlatformVersion;
			this.minTargetPlatformVersion = props.TargetPlatformMinVersion;
			this.productFamilyName = props.ProductFamilyName;
			this.sdkType = props.SDKType;
		}
	}
}

export default SDKExtension;

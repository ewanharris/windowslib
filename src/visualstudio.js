import fs from 'fs';
import path from 'path';

export const defaultVSWhereLocation = '%ProgramFiles(x86)%\\Microsoft Visual Studio\\Installer\\vswhere.exe';

export class VisualStudio {

	/**
	 * [constructor description]
	 * @param  {[type]} info [description]
	 */
	constructor(info) {
		if (typeof info !== 'object') {
			throw new TypeError('Expected info to be an object');
		}

		const properties = [
			'instanceId',
			'installationPath',
			'installationVersion',
			'productId',
			'productPath',
			'isPrerelease',
			'displayName'
		];

		const subProperties = {
			properties: [
				'nickname'
			]
		};

		for (const property of properties) {
			if (!info.hasOwnProperty(property)) {
				throw new Error(`Expected info object to have property ${property}`);
			}
			this[property] = info[property];
		}

		for (const key of Object.keys(subProperties)) {
			const data = info[key];
			for (const property of subProperties[key]) {
				if (!data.hasOwnProperty(property)) {
					throw new Error(`Expected info object to have property ${key}.${property}`);
				}
				this[property] = data[property];
			}
		}

		const vsDevCmd = path.join(this.installationPath, 'Common7', 'Tools', 'VsDevCmd.bat');
		if (fs.existsSync(vsDevCmd)) {
			this.vsDevCmd = vsDevCmd;
		}

		const vcvarsall = path.join(this.installationPath, 'VC', 'Auxiliary', 'Build', 'vcvarsall.bat');
		if (fs.existsSync(vcvarsall)) {
			this.vcvarsall = vcvarsall;
		}
	}
}

export default VisualStudio;

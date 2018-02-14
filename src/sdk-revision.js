import fs from 'fs';
import path from 'path';

import { DOMParser } from 'xmldom';
import { findExecutables } from './utilities';
import { isDir, isFile } from 'appcd-fs';
import { WinAppDeployCmd } from './device';

export class SDKRevision {

	/**
	 * Checks if the specified revisionNumber is valid for an SDK.
	 * @param {String} mainDir - The directory of the Windows SDK
	 * @param {String} revisionNumber - The revision number of an SDK to check
	 * @access public
	 */
	constructor(mainDir, revisionNumber) {

		if (typeof mainDir !== 'string' || !mainDir) {
			throw new TypeError('Expected mainDir to be a valid string');
		}

		if (typeof revisionNumber !== 'string' || !revisionNumber) {
			throw new TypeError('Expected revisionNumber to be a valid string');
		}

		this.includeDir = path.join(mainDir, 'include', revisionNumber);

		if (!isFile(path.join(this.includeDir, 'um', 'Windows.h'))) {
			throw new Error('SDK revision does not contain "windows.h"');
		}

		this.version = revisionNumber;
		this.binDir = path.join(mainDir, 'bin', revisionNumber);
		this.platformsDir = path.join(mainDir, 'platforms', 'UAP', revisionNumber);

		if (!isDir(this.platformsDir)) {
			throw new Error('Platforms dir does not exist');
		}

		if (!fs.existsSync(path.join(this.platformsDir, 'Platform.xml'))) {
			throw new Error('SDK Revision does not contain a "Platform.xml" file');
		}

		const platformXML = new DOMParser({
			errorHandler: {
				warning() {},
				error() {}
			}
		}).parseFromString(fs.readFileSync(path.join(this.platformsDir, 'Platform.xml'), 'utf8'), 'text/xml');
		if (!platformXML) {
			throw new Error('Unable to read "Platform.xml" file');
		}
		const props = {};
		const elems = platformXML.getElementsByTagName('ApplicationPlatform');
		for (let i = 0; i < elems.length; i++) {
			const el = elems[i];
			for (let j = 0; j < el.attributes.length; j++) {
				const attr = el.attributes.item(j);
				props[attr.name] = attr.value.trim();
			}
		}
		this.friendlyName = props.friendlyName;
		if (this.version !== props.version) {
			throw new Error('Version in "Platform.xml" does not match directory name');
		}
		const minVS = platformXML.getElementsByTagName('MinimumVisualStudioVersion');
		if (minVS && minVS[0] && minVS[0].firstChild) {
			this.minVisualStudio = minVS[0].firstChild.data;
		}
		const executables = [
			'signTool',
			'makeCert',
			'pvk2pfx',
			'WinAppDeployCmd'
		];
		this.executables = findExecutables(this.binDir, mainDir, executables);

		if (this.executables.WinAppDeployCmd) {
			for (const exe in this.executables.WinAppDeployCmd) {
				try {
					this.executables.WinAppDeployCmd[exe] = new WinAppDeployCmd(this.executables.WinAppDeployCmd[exe]);
				} catch (e) {
					// Shrug
				}
			}
		}
	}
}

export default SDKRevision;

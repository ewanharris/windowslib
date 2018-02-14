import fs from 'fs';
import path from 'path';
import SDKExtension from './sdk-extension';
import SDKRevision from './sdk-revision';
import version from './version';

import { DOMParser } from 'xmldom';
import { findExecutables } from './utilities';
import { expandPath } from 'appcd-path';
import { isDir, isFile } from 'appcd-fs';

export default class SDK {

	/**
	 * Checks if the specified directory is a Windows SDK.
	 *
	 * @param {String} dir = The directory to check for a Windows SDK.
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
		const sdkManifest = new DOMParser({
			errorHandler: {
				warning() {},
				error() {}
			}
		}).parseFromString(fs.readFileSync(sdkManifestFile, 'utf8'), 'text/xml');

		if (!sdkManifest) {
			throw new Error('Unable to read "SDKManifest.xml" file');
		}

		const props = {};
		const elems = sdkManifest.getElementsByTagName('FileList');
		for (let i = 0; i < elems.length; i++) {
			const el = elems[i];
			for (let j = 0; j < el.attributes.length; j++) {
				const attr = el.attributes.item(j);
				props[attr.name] = attr.value.trim();
			}
		}
		// TODO: Reg key for top level sdk?
		this.path = dir;
		this.version = path.basename(this.path);
		this.minVSVersion = props.MinVSVersion;
		this.displayName = props.DisplayName;

		if (version.gte(this.version, '10')) {
			this.revisions = [];
			this.extensions = [];
			this.images = {};

			const includePath = path.join(this.path, 'Include');
			if (fs.existsSync(includePath)) {
				// Reverse the array, so the newest SDK is in the first index of the array
				const revisionDirs = fs.readdirSync(includePath).reverse();

				for (const revision of revisionDirs) {
					try {
						this.revisions.push(new SDKRevision(dir, revision));
						// break;
					} catch (err) {
						// Do nothing
						console.log(err);
					}
				}
			}

			const emulationDir =  path.join(this.path, 'Emulation');
			if (isDir(emulationDir)) {
				this.emulationDir = emulationDir;
				for (const type of fs.readdirSync(this.emulationDir)) {
					const typeInfo = {
						path: path.join(this.emulationDir, type),
						versions: []
					};

					for (const version of fs.readdirSync(typeInfo.path)) {
						typeInfo.versions.push(version);
					}
					this.images[type] = typeInfo;
				}
			}

			// FIXME: Is this the right place? Difficult to decide
			const extensionDir = path.join(this.path, 'Extension SDKs');
			if (isDir(extensionDir)) {
				/* eslint-disable max-depth */
				this.extensionsDir = extensionDir;
				for (const type of fs.readdirSync(this.extensionsDir)) {
					const typeDir = path.join(this.extensionsDir, type);
					for (const version of fs.readdirSync(typeDir)) {
						const extension = path.join(this.extensionsDir, type, version);
						if (isDir(extension)) {
							try {
								this.extensions.push(new SDKExtension(extension));
							} catch (e) {
								// Do nothing
							}
						}
					}
				}
				/* eslint-enable max-depth */
			}

		} else {
			this.binDir = path.join(this.path, 'bin');
			const executables = [
				'signTool',
				'makeCert',
				'pvk2pfx'
			];
			this.executables = findExecutables(this.binDir, this.path, executables);
		}

	}
}

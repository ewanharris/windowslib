import path from 'path';

import { isDir, isFile } from 'appcd-fs';

/**
 * Scan a Windows SDK for the directories, preferring revision specific
 * if they exist, and defaulting to the 'global' if nothing
 * @param  {String} revDir - Revision directory to scan
 * @param  {String} mainDir - Main directory to fall back to
 * @param  {Array} exes - Array of executable names to find
 * @return {Object}       Map of executables
 */
export function findExecutables(revDir, mainDir, exes) {
	mainDir = path.join(mainDir, 'bin');
	const executables = {};
	const architectures = [ 'arm', 'arm64', 'x86', 'x64' ];
	for (const exe of exes) {
		const exeObj = {};
		for (const arch of architectures) {
			let file = path.join(revDir, arch, `${exe}.exe`);
			if (isFile(file)) {
				exeObj[arch] = file;
			} else {
				file = path.join(mainDir, arch, `${exe}.exe`);
				if (isFile(file)) {
					exeObj[arch] = file;
				}
			}
		}
		executables[exe] = exeObj;
	}
	return executables;
}

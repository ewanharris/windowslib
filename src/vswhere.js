import options from './options';
import path from 'path';

import { arrayify, cache, get } from 'appcd-util';
import { expandPath } from 'appcd-path';
import { isFile, isDir } from 'appcd-fs';
import { run } from 'appcd-subprocess';

export const defaultPath = '%ProgramFiles(x86)%\\Microsoft Visual Studio\\Installer\\vswhere.exe';

export class VSWhere {

	/**
	 * Sets the vswhere executable path.
	 *
	 * @param {String} exe - Path to the 'vswhere' executable
	 */
	constructor(exe) {
		if (typeof exe !== 'string' || !exe) {
			throw new TypeError('Expected executable to be a valid string');
		}

		exe = expandPath(exe);

		if (!isFile(exe)) {
			throw Error('Executable does not exist');
		}
		this.exe = exe;
	}

	/**
	 * Run the vswhere excutable.
	 *
	 * @param {Object} [opts] - Various options.
	 * @param {Array|String} [opts.args=[]] - Arguments to be passed to the vswhere executable.
	 * @param {String} [opts.format='json'] - Format to recieve output from vswhere in, one of json, text, value or xml.
	 * @param {Boolean} [opts.noLogo=true] - Whether to show the vswhere logo.
	 * @return {Object}
	 * @async
	 */
	async run({ args = [], format = 'json', noLogo = true } = {}) {
		args = arrayify(args);
		args.push('-format', format);
		if (noLogo) {
			args.push('-nologo');
		}
		try {
			return await run(this.exe, args);
		} catch (e) {
			throw e;
		}
	}

	/**
	 * Detect installations of VisualStudio.
	 * @param  {Object}  [opts] - Various options.
	 * @param {Array|String} [opts.products='*'] - Product IDs to search by..
	 * @param {Array|String} [opts.components=[]] - Workload or Component IDs that are required.
	 * @return {Object}
	 * @async
	 */
	async detect({ products = '*', components = [] } = {}) {
		const args = [];
		if (components.length) {
			components = arrayify(components);
			args.push('-requires');
			args.push(...components);
		}

		args.unshift('-products', products);
		return await this.run({ args });
	}
}

export default VSWhere;

/**
 * Detects installed VSWhere executable, caching and returning the result
 *
 * @param {Boolean} [force=false] - When `true`, bypasses cache and forces redetection.
 * @returns {Promise<Array.<SDK>>}
 */
export function getVSWhere(force) {
	return cache('vswhere:get', force, () => {
		const searchPaths = arrayify(get(options, 'vswhere.searchPaths') || defaultPath);

		for (let item of searchPaths) {
			try {
				return new VSWhere(expandPath(item));
			} catch (e) {
				if (isDir(item = expandPath(item))) {
					item = path.join(item, 'vswhere.exe');
					return new VSWhere(item);
				}
			}
		}
	});
}

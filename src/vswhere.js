import { arrayify } from 'appcd-util';
import { expandPath } from 'appcd-path';
import { isFile } from 'appcd-fs';
import { run } from 'appcd-subprocess';

export const defaultLocation = '%ProgramFiles(x86)%\\Microsoft Visual Studio\\Installer\\vswhere.exe';

export class VSWhere {

	/**
	 * Sets the vswhere executable path.
	 *
	 * @param {String} exe - Path to the 'vswhere' executable
	 */
	constructor(exe = defaultLocation) {

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
}

export default VSWhere;

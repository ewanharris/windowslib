import { tailgate } from 'appcd-util';
import { expandPath } from 'appcd-path';
import { isFile } from 'appcd-fs';
import { run } from 'appcd-subprocess';

export class Device {

	constructor(info) {

		this.info = info;
	}
}

export default Device;

export class WinAppDeployCmd {

	constructor(exePath) {
		if (typeof exePath !== 'string') {
			throw new TypeError('Expected executable to be a valid string');
		}

		exePath = expandPath(exePath);

		if (!isFile(exePath)) {
			throw new Error('Executable does not exist');
		}

		this.exe = exePath;
	}

	async run(args) {
		try {
			return await run(this.exe, args);
		} catch (e) {
			throw e;
		}
	}

	async listDevices(timeout = 5) {
		const { code, stdout, stderr } = await this.devices(timeout);
		const devices = [];

		if (!code) {
			const deviceListingRE = /^((\d{1,3}\.){3}\d{1,3})\s+([0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12})\s+(.+?)$/igm;
			for (const line of stdout.split(/\r?\n/)) {
				const match = deviceListingRE.exec(line);
				if (match) {
					devices.push({ name: match[5], udid: match[3], ip: match[1], type: 'device' });
				}
			}
		}
		return devices;
	}

	async devices(timeout = 5) {
		if (typeof timeout !== 'number') {
			throw new TypeError('Expected timeout to be a number');
		}
		return await this.run([ 'devices', timeout ]);
	}
}

export async function getDevices({ sdk }) {
	return tailgate(`windowslib:device:${sdk && sdk.version}`, () => {
		if (sdk.executables.WinAppDeployCmd) {
			const deployCmd = sdk.executables.WinAppDeployCmd.x86;
			return deployCmd.listDevices();
		}
		return [];
	});
}

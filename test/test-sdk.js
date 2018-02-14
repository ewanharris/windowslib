import path from 'path';

import * as windowslib from '../dist/index';

const mockDir = path.join(__dirname, 'mocks');
const sdkMockDir = path.join(__dirname, 'mocks', 'sdk');

describe('SDK', () => {
	it('should error if directory is invalid', () => {
		expect(() => {
			new windowslib.SDK();
		}).to.throw(TypeError, 'Expected directory to be a valid string');

		expect(() => {
			new windowslib.SDK(123);
		}).to.throw(TypeError, 'Expected directory to be a valid string');

		expect(() => {
			new windowslib.SDK('');
		}).to.throw(TypeError, 'Expected directory to be a valid string');
	});

	it('should error if directory does not exist', () => {
		expect(() => {
			new windowslib.SDK(path.join(__dirname, 'doesnotexist'));
		}).to.throw(Error, 'Directory does not exist');
	});

	it('should error if "SDKManifest.xml" file is missing', () => {
		expect(() => {
			new windowslib.SDK(path.join(mockDir, 'empty'));
		}).to.throw(Error, 'Directory does not contain an "SDKManifest.xml" file');
	});

	it('should error if "SDKManifest.xml" file is bad', () => {
		expect(() => {
			new windowslib.SDK(path.join(sdkMockDir, 'bad-manifest'));
		}).to.throw(Error, 'Unable to read "SDKManifest.xml" file');
	});

	it('should detect a normal 8.1 SDK', () => {
		const dir = path.join(sdkMockDir, '8.1');
		const results = new windowslib.SDK(dir);

		expect(results).to.deep.equal({
			path: dir,
			version: '8.1',
			minVSVersion: '12.0',
			displayName: 'Windows 8.1',
			binDir: path.join(dir, 'bin'),
			executables: {
				signTool: {
					arm: path.join(dir, 'bin', 'arm', 'signTool.exe'),
					x86: path.join(dir, 'bin', 'x86', 'signTool.exe'),
					x64: path.join(dir, 'bin', 'x64', 'signTool.exe')
				},
				makeCert: {
					x86: path.join(dir, 'bin', 'x86', 'makeCert.exe'),
					x64: path.join(dir, 'bin', 'x64', 'makeCert.exe')
				},
				pvk2pfx: {
					x86: path.join(dir, 'bin', 'x86', 'pvk2pfx.exe'),
					x64: path.join(dir, 'bin', 'x64', 'pvk2pfx.exe')
				}
			}
		});
	});

	it.skip('should detect a 10.0 SDK with revision before 10.0.X.0', () => {

	});

	it('should detect a 10.0 SDK with revision after 10.0.X.0', () => {
		const dir = path.join(sdkMockDir, 'after', '10');
		const results = new windowslib.SDK(dir);

		expect(results).to.deep.equal({
			path: dir,
			version: '10',
			minVSVersion: '14.0',
			displayName: 'Universal Windows',
			emulationDir:  path.join(dir, 'Emulation'),
			extensionsDir: path.join(dir, 'Extension SDKs'),
			images: {
				Mobile: {
					path:  path.join(dir, 'Emulation', 'Mobile'),
					versions: [ '10.0.16299.0' ]
				}
			},
			revisions: [
				{
					binDir: path.join(dir, 'bin', '10.0.16299.0'),
					includeDir:  path.join(dir, 'include', '10.0.16299.0'),
					platformsDir:  path.join(dir, 'platforms', 'UAP', '10.0.16299.0'),
					friendlyName: 'Windows 10 Fall Creators Update',
					minVisualStudio: '15.0.25909.02',
					version: '10.0.16299.0',
					executables: {
						signTool: {
							arm: path.join(dir, 'bin', '10.0.16299.0', 'arm', 'signTool.exe'),
							arm64: path.join(dir, 'bin', '10.0.16299.0', 'arm64', 'signTool.exe'),
							x86: path.join(dir, 'bin', '10.0.16299.0', 'x86', 'signTool.exe'),
							x64: path.join(dir, 'bin', '10.0.16299.0', 'x64', 'signTool.exe')
						},
						makeCert: {
							arm64: path.join(dir, 'bin', '10.0.16299.0', 'arm64', 'makeCert.exe'),
							x86: path.join(dir, 'bin', '10.0.16299.0', 'x86', 'makeCert.exe'),
							x64: path.join(dir, 'bin', '10.0.16299.0', 'x64', 'makeCert.exe')
						},
						pvk2pfx: {
							arm64: path.join(dir, 'bin', '10.0.16299.0', 'arm64', 'pvk2pfx.exe'),
							x86: path.join(dir, 'bin', '10.0.16299.0', 'x86', 'pvk2pfx.exe'),
							x64: path.join(dir, 'bin', '10.0.16299.0', 'x64', 'pvk2pfx.exe')
						},
						WinAppDeployCmd: {
							x86: {
								exe: path.join(dir, 'bin', '10.0.16299.0', 'x86', 'WinAppDeployCmd.exe')
							}
						}
					}
				}
			],
			extensions: [
				{
					displayName: 'Windows Desktop Extensions for the UWP',
					minVSVersion: '14.0',
					targetPlatform: 'UAP',
					targetPlatformVersion: '10.0.16299.0',
					minTargetPlatformVersion: '10.0.16299.0',
					productFamilyName: 'Windows.Desktop',
					sdkType: 'Platform'
				},
				{
					displayName: 'Windows IoT Extensions for the UWP',
					minVSVersion: '14.0',
					targetPlatform: 'UAP',
					targetPlatformVersion: '10.0.16299.0',
					minTargetPlatformVersion: '10.0.16299.0',
					productFamilyName: 'Windows.IoT',
					sdkType: 'Platform'
				},
				{
					displayName: 'Windows Mobile Extensions for the UWP',
					minVSVersion: '14.0',
					targetPlatform: 'UAP',
					targetPlatformVersion: '10.0.16299.0',
					minTargetPlatformVersion: '10.0.10563.0',
					productFamilyName: 'Windows.Mobile',
					sdkType: 'Platform'
				},
				{
					displayName: 'Windows Team Extensions for the UWP',
					minVSVersion: '14.0',
					targetPlatform: 'UAP',
					targetPlatformVersion: '10.0.16299.0',
					minTargetPlatformVersion: '10.0.16299.0',
					productFamilyName: 'Windows.Team',
					sdkType: 'Platform'
				}
			]
		});
	});
});

describe('SDKExtension', () => {
	it('should error if directory is invalid', () => {
		expect(() => {
			new windowslib.SDKExtension();
		}).to.throw(TypeError, 'Expected directory to be a valid string');

		expect(() => {
			new windowslib.SDKExtension(123);
		}).to.throw(TypeError, 'Expected directory to be a valid string');

		expect(() => {
			new windowslib.SDKExtension('');
		}).to.throw(TypeError, 'Expected directory to be a valid string');
	});

	it('should error if directory does not exist', () => {
		expect(() => {
			new windowslib.SDKExtension(path.join(__dirname, 'doesnotexist'));
		}).to.throw(Error, 'Directory does not exist');
	});

	it('should error if "SDKManifest.xml" file is missing', () => {
		expect(() => {
			new windowslib.SDKExtension(path.join(mockDir, 'empty'));
		}).to.throw(Error, 'Directory does not contain an "SDKManifest.xml" file');
	});

	it('should error if "SDKManifest.xml" file is bad', () => {
		expect(() => {
			new windowslib.SDKExtension(path.join(sdkMockDir, 'bad-manifest'));
		}).to.throw(Error, 'Unable to read "SDKManifest.xml" file');
	});
});

describe('SDKRevision', () => {
	it('should error if directory or revision is invalid', () => {
		expect(() => {
			new windowslib.SDKRevision();
		}).to.throw(TypeError, 'Expected mainDir to be a valid string');

		expect(() => {
			new windowslib.SDKRevision(123);
		}).to.throw(TypeError, 'Expected mainDir to be a valid string');

		expect(() => {
			new windowslib.SDKRevision('');
		}).to.throw(TypeError, 'Expected mainDir to be a valid string');

		expect(() => {
			new windowslib.SDKRevision('C:\\ADir');
		}).to.throw(TypeError, 'Expected revisionNumber to be a valid string');

		expect(() => {
			new windowslib.SDKRevision('C:\\ADir', 123);
		}).to.throw(TypeError, 'Expected revisionNumber to be a valid string');

		expect(() => {
			new windowslib.SDKRevision('C:\\ADir', '');
		}).to.throw(TypeError, 'Expected revisionNumber to be a valid string');
	});

	it('should error if windows.h does not exist', () => {
		expect(() => {
			new windowslib.SDKRevision(path.join(sdkMockDir, 'revision'), '10.0.16299.0');
		}).to.throw(Error, 'SDK revision does not contain "windows.h"');
	});

	it('should error if "Platform.xml" file is missing', () => {
		expect(() => {
			new windowslib.SDKRevision(path.join(sdkMockDir, 'revision'), '10.0.10150.0');
		}).to.throw(Error, 'SDK Revision does not contain a "Platform.xml" file');
	});

	it('should error if "Platform.xml" file is bad', () => {
		expect(() => {
			new windowslib.SDKRevision(path.join(sdkMockDir, 'revision'), '10.0.10240.0');
		}).to.throw(Error, 'Unable to read "Platform.xml" file');
	});

	it('should error if Platform.xml version does not match directory name', () => {
		expect(() => {
			new windowslib.SDKRevision(path.join(sdkMockDir, 'revision'), '10.0.10586.0');
		}).to.throw(Error, 'Version in "Platform.xml" does not match directory name');
	});
});

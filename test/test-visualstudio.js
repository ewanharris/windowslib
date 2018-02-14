import path from 'path';

import * as windowslib from '../dist/index';

const mockDir = path.join(__dirname, 'mocks');
const vsMockDir = path.join(__dirname, 'mocks', 'visualstudio');

const data = {
	installDate: '2017-12-06T10:46:49Z',
	instanceId: 'fefd6735',
	installationName: 'VisualStudio/15.5.0+27130.0',
	installationPath: 'C:\\Program Files (x86)\\Microsoft Visual Studio\\2017\\Community',
	installationVersion: '15.5.27130.0',
	productId: 'Microsoft.VisualStudio.Product.Community',
	productPath: 'C:\\Program Files (x86)\\Microsoft Visual Studio\\2017\\Community\\Common7\\IDE\\devenv.exe',
	isPrerelease: false,
	displayName: 'Visual Studio Community 2017',
	description: 'Free, fully-featured IDE for students, open-source and individual developers',
	channelId: 'VisualStudio.15.Release',
	channelPath: 'C:\\Users\\ewan\\AppData\\Local\\Microsoft\\VisualStudio\\Packages\\_Channels\\4CB340F5\\catalog.json',
	channelUri: 'https://aka.ms/vs/15/release/channel',
	enginePath: 'C:\\Program Files (x86)\\Microsoft Visual Studio\\Installer\\resources\\app\\ServiceHub\\Services\\Microsoft.V\r\nisualStudio.Setup.Service',
	releaseNotes: 'https://go.microsoft.com/fwlink/?LinkId=660692#15.5.0',
	thirdPartyNotices: 'https://go.microsoft.com/fwlink/?LinkId=660708',
	catalog: {
		buildBranch: 'd15rel',
		buildVersion: '15.5.27130.0',
		id: 'VisualStudio/15.5.0+27130.0',
		localBuild: 'build-lab',
		manifestName: 'VisualStudio',
		manifestType: 'installer',
		productDisplayVersion: '15.5.0',
		productLine: 'Dev15',
		productLineVersion: '2017',
		productMilestone: 'RTW',
		productMilestoneIsPreRelease: 'False',
		productName: 'Visual Studio',
		productPatchVersion: '0',
		productPreReleaseMilestoneSuffix: '6.0',
		productRelease: 'RTW',
		productSemanticVersion: '15.5.0+27130.0'
	},
	properties: {
		campaignId: '',
		channelManifestId: 'VisualStudio.15.Release/15.5.0+27130.0',
		nickname: '',
		setupEngineFilePath: 'C:\\Program Files (x86)\\Microsoft Visual Studio\\Installer\\vs_installershell.exe'
	}
};

describe('VisualStudio', () => {
	it('should error if info is invalid', () => {
		expect(() => {
			new windowslib.VisualStudio();
		}).to.throw(TypeError, 'Expected info to be an object');

		expect(() => {
			new windowslib.VisualStudio(123);
		}).to.throw(TypeError, 'Expected info to be an object');

		expect(() => {
			new windowslib.VisualStudio('');
		}).to.throw(TypeError, 'Expected info to be an object');
	});

	it('should error if missing required properties', () => {
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
			const info = JSON.parse(JSON.stringify(data));
			delete info[property];
			expect(() => {
				new windowslib.VisualStudio(info);
			}).to.throw(Error, `Expected info object to have property ${property}`);
		}

		for (const key of Object.keys(subProperties)) {
			for (const property of subProperties[key]) {
				const info = JSON.parse(JSON.stringify(data));
				delete info[key][property];
				expect(() => {
					new windowslib.VisualStudio(info);
				}).to.throw(Error, `Expected info object to have property ${key}.${property}`);
			}
		}
	});

	// TODO: Need to mock the fs for this out
	it.skip('should error if missing required files', () => {

	});
});

import path from 'path';

import * as windowslib from '../dist/index';

const mockDir = path.join(__dirname, 'mocks');
const vswhereMockDir = path.join(__dirname, 'mocks', 'vswhere');
const vswhereExe = path.join(vswhereMockDir, 'vswhere.exe');

describe('VSWhere', () => {
	it('should error if directory is invalid', () => {
		expect(() => {
			new windowslib.VSWhere(123);
		}).to.throw(TypeError, 'Expected executable to be a valid string');

		expect(() => {
			new windowslib.VSWhere('');
		}).to.throw(TypeError, 'Expected executable to be a valid string');
	});

	it('should error if directory does not exist', () => {
		expect(() => {
			new windowslib.VSWhere(path.join(__dirname, 'doesnotexist'));
		}).to.throw(Error, 'Executable does not exist');
	});

	it('should error if directory is not a file', () => {
		expect(() => {
			new windowslib.VSWhere(path.join(mockDir, 'empty'));
		}).to.throw(Error, 'Executable does not exist');
	});

	it('should default to json format', async () => {
		const vswhere = new windowslib.VSWhere(vswhereExe);
		const info = await vswhere.run();
		expect(info).to.deep.equal(
			{
				code: 0,
				stdout: '[{"installDate":"2017-12-06T10:46:49Z","instanceId":"fefd6735","installationName":"VisualStudio/15.5.0+27130.0","installationPath":"C:\\Program Files (x86)\\Microsoft Visual Studio\\2017\\Community","installationVersion":"15.5.27130.0","productId":"Microsoft.VisualStudio.Product.Community","productPath":"C:\\Program Files (x86)\\Microsoft Visual Studio\\2017\\Community\\Common7\\IDE\\devenv.exe","isPrerelease":false,"displayName":"Visual Studio Community 2017","description":"Free, fully-featured IDE for students, open-source and individual developers","channelId":"VisualStudio.15.Release","channelPath":"C:\\Users\\ewan\\AppData\\Local\\Microsoft\\VisualStudio\\Packages\\_Channels\\4CB340F5\\catalog.json","channelUri":"https://aka.ms/vs/15/release/channel","enginePath":"C:\\Program Files (x86)\\Microsoft Visual Studio\\Installer\\resources\\app\\ServiceHub\\Services\\Microsoft.V\r\nisualStudio.Setup.Service","releaseNotes":"https://go.microsoft.com/fwlink/?LinkId=660692#15.5.0","thirdPartyNotices":"https://go.microsoft.com/fwlink/?LinkId=660708","catalog":{"buildBranch":"d15rel","buildVersion":"15.5.27130.0","id":"VisualStudio/15.5.0+27130.0","localBuild":"build-lab","manifestName":"VisualStudio","manifestType":"installer","productDisplayVersion":"15.5.0","productLine":"Dev15","productLineVersion":"2017","productMilestone":"RTW","productMilestoneIsPreRelease":"False","productName":"Visual Studio","productPatchVersion":"0","productPreReleaseMilestoneSuffix":"6.0","productRelease":"RTW","productSemanticVersion":"15.5.0+27130.0"},"properties":{"campaignId":"","channelManifestId":"VisualStudio.15.Release/15.5.0+27130.0","nickname":"","setupEngineFilePath":"C:\\Program Files (x86)\\Microsoft Visual Studio\\Installer\\vs_installershell.exe"}    }]',
				stderr: ''
			}
		);
	});
});

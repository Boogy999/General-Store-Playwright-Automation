import path from 'path';

const deviceId = process.env.UDID || process.env.DEVICE_NAME || 'a82a57a9';

export const wdioConfig = {
  hostname: process.env.APPIUM_HOST || 'localhost',
  port: parseInt(process.env.APPIUM_PORT || '4723', 10),
  path: '/',
  capabilities: {
    platformName: 'Android',
    'appium:deviceName': deviceId || 'a82a57a9',
    'appium:platformVersion': process.env.PLATFORM_VERSION || '11.0',
    'appium:app': path.resolve(__dirname, '../../apps/General-Store.apk'),
    'appium:automationName': 'UiAutomator2',
    'appium:appPackage': 'com.androidsample.generalstore',
    'appium:appActivity': 'com.androidsample.generalstore.SplashActivity',
    'appium:noReset': false,
    'appium:newCommandTimeout': 120,
    'appium:autoGrantPermissions': true,
  } as Record<string, unknown>,
};

if (deviceId) {
  (wdioConfig.capabilities as Record<string, unknown>)['appium:udid'] = deviceId;
}

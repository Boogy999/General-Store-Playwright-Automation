import { BasePage } from './BasePage';

const SELECTORS = {
  spinnerCountry: 'android=new UiSelector().resourceId("com.androidsample.generalstore:id/spinnerCountry")',
  nameField: 'android=new UiSelector().resourceId("com.androidsample.generalstore:id/nameField")',
  radioMale: 'android=new UiSelector().resourceId("com.androidsample.generalstore:id/radioMale")',
  radioFemale: 'android=new UiSelector().resourceId("com.androidsample.generalstore:id/radioFemale")',
  btnLetsShop: 'android=new UiSelector().resourceId("com.androidsample.generalstore:id/btnLetsShop")',
};

export class HomePage extends BasePage {
  constructor(driver: WebdriverIO.Browser) {
    super(driver, 'HOME');
  }

  async selectCountry(country: string): Promise<void> {
    this.pageLog('Opening country dropdown');
    await this.click(SELECTORS.spinnerCountry);
    await this.pause(2000);
    this.pageLog('Selecting country', { country });
    if (await this.tryClick('android=new UiSelector().text("' + country + '")')) return;
    if (await this.tryClick('android=new UiSelector().textContains("' + country + '")')) return;
    const scrollableText = 'android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("' + country + '"))';
    if (await this.tryClick(scrollableText)) return;
    const scrollableContains = 'android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().textContains("' + country + '"))';
    if (await this.tryClick(scrollableContains)) return;
    const scrollableList = 'android=new UiScrollable(new UiSelector().className("android.widget.ListView")).scrollIntoView(new UiSelector().text("' + country + '"))';
    if (await this.tryClick(scrollableList)) return;
    throw new Error('Could not select country "' + country + '".');
  }

  private async tryClick(selector: string): Promise<boolean> {
    try {
      const el = await this.driver.$(selector);
      await el.waitForDisplayed({ timeout: 6000 });
      await el.click();
      await this.pause(1200);
      return true;
    } catch {
      return false;
    }
  }

  async enterName(name: string): Promise<void> {
    this.pageLog('Entering name', { name });
    await this.setValue(SELECTORS.nameField, name);
    await this.hideKeyboard();
  }

  async selectGender(gender: 'Male' | 'Female'): Promise<void> {
    this.pageLog('Selecting gender', { gender });
    const sel = gender === 'Male' ? SELECTORS.radioMale : SELECTORS.radioFemale;
    await this.click(sel);
  }

  async clickLetsShop(): Promise<void> {
    this.pageLog('Clicking Lets Shop');
    await this.click(SELECTORS.btnLetsShop);
  }

  async getSelectedCountry(): Promise<string> {
    for (let i = 0; i < 3; i++) {
      try {
        const el = await this.driver.$(SELECTORS.spinnerCountry);
        if (await el.isDisplayed()) {
          const text = await el.getText();
          if (text && text.trim()) return text.trim();
        }
      } catch {
        /* retry */
      }
      await this.pause(500);
    }
    return '';
  }

  async getNameFieldValue(): Promise<string> {
    const el = await this.waitForElement(SELECTORS.nameField);
    return (await el.getAttribute('text')) || '';
  }
}

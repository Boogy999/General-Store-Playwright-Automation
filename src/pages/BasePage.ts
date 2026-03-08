import { log } from '../utils/logger';

export abstract class BasePage {
  protected driver: WebdriverIO.Browser;
  protected pageName: string;

  constructor(driver: WebdriverIO.Browser, pageName: string) {
    this.driver = driver;
    this.pageName = pageName;
  }

  async waitForElement(selector: string, timeout = 15000): Promise<WebdriverIO.Element> {
    const el = await this.driver.$(selector);
    await el.waitForDisplayed({ timeout, timeoutMsg: `Element not found: ${selector}` });
    return el;
  }

  async click(selector: string): Promise<void> {
    await this.waitForElement(selector);
    const el = await this.driver.$(selector);
    await el.click();
  }

  async setValue(selector: string, value: string): Promise<void> {
    const el = await this.waitForElement(selector);
    await el.clearValue();
    await el.setValue(value);
  }

  async getText(selector: string): Promise<string> {
    const el = await this.waitForElement(selector);
    return el.getText();
  }

  async isDisplayed(selector: string): Promise<boolean> {
    try {
      const el = await this.driver.$(selector);
      return await el.isDisplayed();
    } catch {
      return false;
    }
  }

  async pause(ms: number): Promise<void> {
    await this.driver.pause(ms);
  }

  async getElements(selector: string): Promise<WebdriverIO.Element[]> {
    const arr = await this.driver.$$(selector);
    return Array.from(arr) as WebdriverIO.Element[];
  }

  async hideKeyboard(): Promise<void> {
    try {
      await this.driver.hideKeyboard();
    } catch {
      /* ignore */
    }
  }

  protected pageLog(action: string, detail?: string | Record<string, unknown>): void {
    log(this.pageName, action, detail);
  }
}


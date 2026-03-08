import { BasePage } from './BasePage';

const SELECTORS = {
  cartItemNames: 'android=new UiSelector().resourceId("com.androidsample.generalstore:id/productName")',
  emptyCartMsg: 'android=new UiSelector().resourceId("com.androidsample.generalstore:id/noDataTV")',
};

export class CartPage extends BasePage {
  constructor(driver: WebdriverIO.Browser) {
    super(driver, 'CART');
  }

  async waitForCartToLoad(): Promise<void> {
    this.pageLog('Waiting for cart to load');
    await this.pause(2000);
  }

  async isCartEmpty(): Promise<boolean> {
    return this.isDisplayed(SELECTORS.emptyCartMsg);
  }

  async getAllCartItemNames(): Promise<string[]> {
    try {
      const elements = await this.getElements(SELECTORS.cartItemNames);
      const names: string[] = [];
      for (const el of elements) names.push(await el.getText());
      return names;
    } catch {
      return [];
    }
  }

  async isProductInCart(productName: string): Promise<boolean> {
    const needle = productName.trim().toLowerCase();
    if (!needle) return false;
    const allNames = await this.getAllCartItemNames();
    const matches = (hay: string): boolean => {
      const h = hay.trim().toLowerCase();
      if (!h) return false;
      if (h === needle || h.includes(needle) || needle.includes(h)) return true;
      const significant = needle.length >= 8 ? needle.substring(0, 8) : needle;
      if (h.includes(significant)) return true;
      const firstWords = needle.split(/\s+/).slice(0, 2).join(' ');
      if (firstWords.length >= 4 && (h.includes(firstWords) || firstWords.includes(h))) return true;
      return false;
    };
    if (allNames.some(matches)) return true;
    const parts = [needle, needle.substring(0, 20), needle.substring(0, 15), needle.split(/\s+/)[0]].filter((p) => p.length >= 4);
    for (const part of parts) {
      try {
        const el = await this.driver.$(`android=new UiSelector().textContains("${part.replace(/"/g, '\\"')}")`);
        if (await el.isDisplayed()) return true;
      } catch {
        /* try next */
      }
    }
    return false;
  }
}

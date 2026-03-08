import { BasePage } from './BasePage';

const SELECTORS = {
  productList: 'android=new UiSelector().resourceId("com.androidsample.generalstore:id/rvProductList")',
  productName: (i: number) => 'android=new UiSelector().resourceId("com.androidsample.generalstore:id/productName").instance(' + i + ')',
  addToCart: (i: number) => 'android=new UiSelector().resourceId("com.androidsample.generalstore:id/productAddCart").instance(' + i + ')',
  cartIcon: 'android=new UiSelector().resourceId("com.androidsample.generalstore:id/appbar_btn_cart")',
};

function scrollToProduct(index: number): string {
  return 'android=new UiScrollable(new UiSelector().resourceId("com.androidsample.generalstore:id/rvProductList")).scrollIntoView(new UiSelector().resourceId("com.androidsample.generalstore:id/productName").instance(' + index + '))';
}

export class ProductsPage extends BasePage {
  constructor(driver: WebdriverIO.Browser) {
    super(driver, 'PRODUCTS');
  }

  async waitForProductsToLoad(): Promise<void> {
    this.pageLog('Waiting for product list');
    await this.waitForElement(SELECTORS.productList);
    await this.pause(500);
  }

  async scrollToProductIndex(index: number): Promise<void> {
    if (index === 0) return;
    this.pageLog('Scrolling to product at index', { index });
    try {
      const el = await this.driver.$(scrollToProduct(index));
      await el.waitForDisplayed({ timeout: 10000 });
      await this.pause(400);
      return;
    } catch {
      /* fallback */
    }
    for (let i = 0; i < 15; i++) {
      if (await this.isDisplayed(SELECTORS.productName(index))) {
        await this.pause(300);
        return;
      }
      const { width, height } = await this.driver.getWindowSize();
      const x = Math.floor(width / 2);
      const startY = Math.floor(height * 0.65);
      const endY = Math.floor(height * 0.35);
      await this.driver.action('pointer', { parameters: { pointerType: 'touch' } }).move({ x, y: startY }).down().pause(100).move({ x, y: endY, duration: 350 }).up().perform();
      await this.pause(500);
    }
  }

  async addProductToCart(index: number): Promise<string> {
    await this.scrollToProductIndex(index);
    const name = (await this.getText(SELECTORS.productName(index))).trim();
    this.pageLog('Adding product to cart', { index, productName: name });
    if (!name) throw new Error('Product name at index ' + index + ' was empty');
    await this.click(SELECTORS.addToCart(index));
    await this.pause(800);
    return name;
  }

  async navigateToCart(): Promise<void> {
    this.pageLog('Navigating to cart');
    await this.click(SELECTORS.cartIcon);
  }

  async isLoaded(): Promise<boolean> {
    return this.isDisplayed(SELECTORS.productList);
  }
}

/**
 * General Store Mobile E2E – Appium + WebdriverIO + Mocha + TypeScript
 */

import { remote } from 'webdriverio';
import { expect } from 'chai';
import { wdioConfig } from '../config/appium.config';
import { HomePage } from '../pages/HomePage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { log, logStep, logAssert } from '../utils/logger';
import testData from '../data/testData.json';

const APP_PACKAGE = 'com.androidsample.generalstore';

describe('General Store – Mobile (Appium)', function () {
  this.timeout(180000);

  let driver: WebdriverIO.Browser;
  let homePage: HomePage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;

  before('Launch app', async function () {
    log('SETUP', 'Connecting to Appium');
    driver = await remote(wdioConfig);
    homePage = new HomePage(driver);
    productsPage = new ProductsPage(driver);
    cartPage = new CartPage(driver);
    log('SETUP', 'App launched', { totalTestCases: testData.testUsers.length });
  });

  after('Close session', async function () {
    if (driver) await driver.deleteSession();
    log('TEARDOWN', 'Session closed');
  });

  testData.testUsers.forEach((user) => {
    describe(user.testId + ': ' + user.name, function () {
      let addedProductName = '';

      before('Open app', async function () {
        await driver.execute('mobile: activateApp', { appId: APP_PACKAGE });
        await driver.pause(2500);
      });

      after('Close app', async function () {
        try {
          await driver.execute('mobile: terminateApp', { appId: APP_PACKAGE });
          await driver.pause(500);
        } catch {
          /* ignore */
        }
      });

      it('Step 1: Select country', async function () {
        logStep(1, 'Select country: ' + user.country, user.testId);
        await homePage.selectCountry(user.country);
        const selected = await homePage.getSelectedCountry();
        expect(selected === '' || selected.toLowerCase().includes(user.country.toLowerCase())).to.be.true;
      });

      it('Step 2: Enter name', async function () {
        logStep(2, 'Enter name: ' + user.name, user.testId);
        await homePage.enterName(user.name);
        expect(await homePage.getNameFieldValue()).to.equal(user.name);
      });

      it('Step 3: Select gender', async function () {
        logStep(3, 'Select gender: ' + user.gender, user.testId);
        await homePage.selectGender(user.gender as 'Male' | 'Female');
      });

      it('Step 4: Tap Lets Shop', async function () {
        logStep(4, 'Tap Lets Shop', user.testId);
        await homePage.clickLetsShop();
        await productsPage.waitForProductsToLoad();
        expect(await productsPage.isLoaded()).to.be.true;
      });

      it('Step 5: Add product to cart', async function () {
        logStep(5, 'Add product at index ' + user.productIndex, user.testId);
        addedProductName = await productsPage.addProductToCart(user.productIndex);
        expect(addedProductName).to.not.be.empty;
      });

      it('Step 6: Navigate to cart', async function () {
        logStep(6, 'Open cart', user.testId);
        await productsPage.navigateToCart();
        await cartPage.waitForCartToLoad();
        expect(await cartPage.isCartEmpty()).to.be.false;
      });

      it('Step 7: Assert cart has selected product', async function () {
        logStep(7, 'Assert cart has product', user.testId);
        const rightProductInCart = await cartPage.isProductInCart(addedProductName);
        logAssert('Cart has product', addedProductName, rightProductInCart);
        expect(rightProductInCart).to.be.true;
      });
    });
  });
});

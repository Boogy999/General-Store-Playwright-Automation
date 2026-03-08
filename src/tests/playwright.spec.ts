/**
 * Playwright + Mocha + TypeScript – API / browser example
 * Uses Playwright's request context for API and/or browser for web.
 */

import { expect } from 'chai';
import { chromium, request } from 'playwright';

describe('Playwright – API (Mocha)', function () {
  this.timeout(30000);

  it('GET public API returns 200', async function () {
    const context = await request.newContext();
    const res = await context.get('https://jsonplaceholder.typicode.com/posts/1');
    expect(res.status()).to.equal(200);
    const body = await res.json();
    expect(body).to.have.property('id', 1);
    expect(body).to.have.property('title');
    await context.dispose();
  });

  it('Browser: open page and get title', async function () {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://example.com');
    const title = await page.title();
    expect(title).to.include('Example');
    await browser.close();
  });
});

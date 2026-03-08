# General Store – Appium + Mocha + TypeScript

Mobile automation: **7 test steps** (main flow only).

- **Appium + WebdriverIO** – General Store APK E2E
- **Mocha** – test runner
- **TypeScript** – all code

**Flow:** Select country → Enter name → Select gender → Tap Let's Shop → Add product to cart → Open cart → Assert cart has selected product.

---

## Setup

- **Node.js** 18+
- **Appium** 2.x (`npm install -g appium` then run `appium`)
- **Android** emulator or device (`adb devices`)
- **General-Store.apk** in `apps/General-Store.apk`

```bash
cd general-store-playwright-appium
npm install
```

Set device id in `src/config/appium.config.ts` or via `UDID` / `DEVICE_NAME` env if using a real device.

---

## Run tests

```bash
npm test
```

Runs the 7-step mobile flow for each user in `src/data/testData.json`.

---

## Project layout

| Path | Purpose |
|------|--------|
| `src/config/appium.config.ts` | Appium capabilities |
| `src/pages/*.ts` | POM: Home, Products, Cart |
| `src/tests/generalStore.spec.ts` | 7-step mobile E2E |
| `src/data/testData.json` | Test users (country, name, gender, productIndex) |
| `src/utils/logger.ts` | Logging |

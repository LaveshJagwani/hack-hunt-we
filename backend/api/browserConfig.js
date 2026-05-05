/**
 * Shared Puppeteer launch options.
 * Works both locally (Windows/Mac) and on Render (Linux/Docker).
 */
const puppeteer = require('puppeteer');

async function launchBrowser() {
  const args = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--no-zygote',
  ];

  // This flag helps low-memory Linux containers, but it causes detached-frame
  // navigation crashes on local Windows Chromium.
  if (process.platform !== 'win32') {
    args.push('--single-process');
  }

  return puppeteer.launch({
    headless: true,
    protocolTimeout: 90000,
    args,
  });
}

module.exports = { launchBrowser };

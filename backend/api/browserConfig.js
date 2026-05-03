/**
 * Shared Puppeteer launch options.
 * Works both locally (Windows/Mac) and on Render (Linux/Docker).
 */
const puppeteer = require('puppeteer');

async function launchBrowser() {
  return puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--single-process',       // needed on Render free tier (low memory)
      '--no-zygote',
    ],
  });
}

module.exports = { launchBrowser };

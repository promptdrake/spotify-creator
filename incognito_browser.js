const puppeteer = require('puppeteer-extra');
const axios = require('axios');
const chalk = require('chalk');
const config = require('./config');
const userAgents = require('user-agents');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const userAgentsList = Array.from({ length: 10 }, () => new userAgents());

puppeteer.use(StealthPlugin());

async function browserspoof() {
  console.log('[Server] Starting Spoofer');
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    args: [
      `--user-agent=${userAgentsList[Math.floor(Math.random() * userAgentsList.length)].toString()}`,
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process'
    ],
  });

  console.log('[Server] Importing Setting...');
  const page = await browser.newPage();
  console.log('[Server] Launching Browser Spoofer');
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en'
  });

  const userAgent = await page.evaluate(() => {
    return navigator.userAgent;
  });

  await page.goto('https://bot.sannysoft.com');
  console.log(chalk.green(userAgent));
  browser.on('disconnected', () => {
    console.log('Browser closed\nPress Any Key to exit it');
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
  });
}

browserspoof();

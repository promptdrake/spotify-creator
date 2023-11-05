const puppeteer = require('puppeteer-extra');
const axios = require('axios');
const chalk = require('chalk');
const config = require('../config');
const userAgents = require('user-agents');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const rl = readline.createInterface({
  input: fs.createReadStream('result.txt'),
  output: process.stdout
});
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const userAgentsList = Array.from({ length: 10 }, () => new userAgents());
puppeteer.use(StealthPlugin());
function readLineFromFileAndRemove(filename) {
  const data = fs.readFileSync(filename, 'utf8').trim();
  const lines = data.split('\n');
  if (lines.length === 0) {
    return null;
  }
  const line = lines[0];
  lines.shift();
  fs.writeFileSync(filename, lines.join('\n'));
  return line;
}

async function createSpotifyAccount(line) {
  const [email, password] = line.split(' | ');

  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
    ],
  });
  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0'
  );
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en',
  });
  console.log(chalk.green('[Server] Opening Browser...'));
  await page.goto(config.offers_hongkong['3b'], { waitUntil: 'domcontentloaded' });
  console.log('[Server] Visiting 3b Link: ' + chalk.green(config.offers_hongkong['3b']));
  await page.waitForTimeout(2000);
  await page.waitForSelector('input[data-testid="login-username"]');
  await page.$eval('input[data-testid="login-username"]', (input) => input.focus());
  await page.type('input[data-testid="login-username"]', email, { delay: 50 });
  console.log(chalk.green('[Server] Inputting Email Address\n> ' + email));

  await page.waitForTimeout(500);
  await page.$eval('input[data-testid="login-password"]', (input) => input.focus());
  console.log(chalk.green('[Server] Inputing Password'));
  await page.type('input[data-testid="login-password"]', password, { delay: 50 });
  await page.waitForTimeout(500);
  await page.click('button[id="login-button"]');
  await page.waitForTimeout(3000);
  if (page.url().includes('challenge.spotify.com')) {
    console.log(chalk.yellow('[Server] ') + 'CAPTCHA challenge detected, try restarting your IP address');
    browser.close();
    return;
  }

  let retryCount = 0;
  while (retryCount < config.retry_count) {
    await page.waitForSelector('input[type="radio"][id="option-cards"]');
    await page.click(`input[type="radio"][id="option-cards"]`);
    await page.waitForTimeout(3000);
    const iframeSelector = 'iframe[title="Card form"]';
    console.log(chalk.green('[Server] Autopay Form Detected Reading from vcc.txt'));
    const iframeElement = await page.$(iframeSelector);
    const iframe = await iframeElement.contentFrame();
    await iframe.waitForSelector('input[id="cardnumber"]');
    await iframe.$eval('input[id="cardnumber"]', (input) => input.focus());
    const vccLine = readLineFromFileAndRemove('vcc.txt');
    if (vccLine) {
      const vccData = vccLine.split('|');
      if (vccData.length === 3) {
        await iframe.type('input[id="cardnumber"]', vccData[0]);
        console.log(chalk.green('[Server] Inputing CCN ' + vccData[0]));
        await iframe.waitForTimeout(1000);
        await iframe.waitForSelector('input[id="expiry-date"]');
        console.log(chalk.green('[Server] Inputing Expiry Date ' + vccData[1]));
        await iframe.type('input[id="expiry-date"]', vccData[1]);
        await iframe.waitForTimeout(1000);
        await iframe.waitForSelector('input[id="security-code"]');
        console.log(chalk.green('[Server] Inputing Cvv ' + vccData[2]));
        await iframe.type('input[id="security-code"]', vccData[2]);
        await iframe.waitForTimeout(1000);
      }
    }
    
    await page.click('button[id="checkout_submit"]');
    await page.waitForTimeout(5000);

    if (page.url().includes('spotify.com/sg-en/purchase/success')) {
      console.log(chalk.green('[Server] ') + email + ' | ' + password + ' Successfully Claimed Offer 3 Month');
      const currentDate = new Date();
      const options = { day: 'numeric', month: 'long',year: 'numeric'  };
      const locale = 'id-ID';
      const date = currentDate.toLocaleDateString(locale, options);
      const message = `(+) New Offer 3 Month\n\nEmail: \`\`${email}\`\`\nPassword: \`\`${password}\`\`\n\nCreated in ${date}`;
    
        const response = await axios.post(
          `https://api.telegram.org/bot${config.bot_token}/sendMessage`,
          {
            chat_id: config.owner_chatid,
            text: message,
            parse_mode: 'Markdown',
          }
        );
      await page.waitForTimeout(3000);
      browser.close();
      break;
    } else {
      await page.waitForTimeout(3000);
      console.log(chalk.yellow('[Server] ') + 'Failed To paying retrying...');
      retryCount++;
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(5000);
    }
  }

  if (retryCount === config.retry_count) {
    console.log(chalk.red('[Server] ') + 'Payment failed after '+ config.retry_count +' attempts. Closing browser.');
    browser.close();
  }
}

async function processEmails() {
  const emails = [];

  rl.on('line', (line) => {
    if (line.trim() !== '') {
      emails.push(line.trim());
    }
  });

  rl.on('close', async () => {
    if (emails.length === 0) {
      console.log(chalk.blue('No data Found'));
    } else {
      for (const email of emails) {
        console.log(`\n[Server] Processing: ${email}`);
        await createSpotifyAccount(email);
      }
    }
  });
}

async function askUserCount() {
  console.log(chalk.green.bold("[Server] Starting Auto Pay 3b"));
  console.log(chalk.green.bold("[Server] Reading result.txt"));
  processEmails();
}

askUserCount();

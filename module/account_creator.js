const puppeteer = require('puppeteer-extra');
const axios = require('axios');
const chalk = require('chalk');
const config = require('../config');
const userAgents = require('user-agents');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const userAgentsList = Array.from({ length: 10 }, () => new userAgents());
  puppeteer.use(StealthPlugin());
  async function createSpotifyAccount() {
    const response = await axios.get('https://randomuser.me/api/?nat=us');
    console.log('[Server] Fetching Random User api');
    const userData = response.data.results[0];
    const username = userData.name.last;
    console.log('[Server] Name Found ' + username);
    const browser = await puppeteer.launch({
      headless: false,
      executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      args: [
       /*`--user-agent=${userAgentsList[Math.floor(Math.random() * userAgentsList.length)].toString()}`,*/
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process'/*,
        `--load-extension=${path.resolve(__dirname, 'captcha_solver')}`*/
      ],
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      config.browser.create_account
    );
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en'
    });
    const userAgent = await page.evaluate(() => {
      return navigator.userAgent;
    });
    
    console.log(chalk.green(userAgent));
    const enterEmailAndSubmit = async (email) => {
      await page.waitForTimeout(2000);
      console.log(chalk.blue('[Server] ') + 'Email: ' + email);
      await page.type('input#username', email);
      await page.waitForTimeout(2000); 
      await page.click('button[data-testid="submit"]');
    };
  
    console.log('[Server] Opening Browser...');
    await page.goto('https://www.spotify.com/id-id/signup', { waitUntil: 'domcontentloaded' });
    console.log('[Server] Visiting Spotify Signup');
  
    await page.waitForSelector('input#username');
    let email;
    if (config.is_using_number_on_email) {
      const randomNumbers = Math.floor(Math.random() * 100);
      const formattedNumbers = String(randomNumbers).padStart(2, '0');
      email = username + formattedNumbers + '@' + config.domain;
    } else {
      email = username + '@' + config.domain;
    }
    enterEmailAndSubmit(email);
    const errorElement = await page.$('.Text-sc-g5kv67-0.hfclbh');
    if (errorElement) {
      console.log('Error found. Deleting and retrying email.');
      await page.evaluate(() => {
        document.querySelector('input#username').value = '';
      });
      enterEmailAndSubmit(email);
    }
  
    await page.waitForSelector('input#new-password');
    console.log(chalk.blue('[Server] ') +'Password: ' + config.password);
    await page.type('input#new-password', config.password);
    await page.waitForTimeout(2500);
    await page.click('button[data-testid="submit"]');
    await page.waitForSelector('input#displayName');
    await page.type('input#displayName', username);
    await page.waitForSelector('input#day');
    console.log(chalk.blue('[Server] ') +'Adding Day 1');
    await page.type('input#day', '1');
    await page.select('#month', '1')
    console.log(chalk.blue('[Server] ') +'Adding month 1');
    await page.waitForSelector('input#year');
    console.log(chalk.blue('[Server] ') +'Adding year 2000');
    await page.type('input#year', '2000');
    await page.click('input#gender_option_prefer_not_to_say');
    console.log(chalk.blue('[Server] ') +'Gender: prefer not say');
    await page.waitForTimeout(2000);
    await page.click('button[data-testid="submit"]');
    console.log(chalk.blue('[Server] ') +'Submiting Identity...');
    await page.waitForTimeout(2000);
    await page.click('button[data-testid="submit"]');
    console.log(chalk.blue('[Server] ') +'Submiting tos...');
    console.log(chalk.red('[Server] ') +'Security Checking Please wait a sec...');
    await page.waitForTimeout(7000);
    if (page.url().includes('challenge.spotify.com')) {
      console.log(chalk.yellow('[Server] ') + 'CAPTCHA challenge detected, Trying Bypassing...');
      await page.waitForTimeout(5000);
      const frames = page.frames();
      let recaptchaFrame;
      for (const frame of frames) {
        if (frame.url().startsWith('https://www.google.com/recaptcha')) {
          recaptchaFrame = frame;
          break;
        }
      }
      if (recaptchaFrame) {
        await recaptchaFrame.waitForSelector('div.rc-anchor-content');
        const captchaContent = await recaptchaFrame.$('div.rc-anchor-content');
        await captchaContent.click();
      } else {
        console.error('reCAPTCHA frame not found');
      }
      await page.waitForTimeout(5000);
      await page.click('button[name="solve"]');
      await page.waitForTimeout(7000);
      const currentDate = new Date();
      const options = { day: 'numeric', month: 'long',year: 'numeric'  };
      const locale = 'id-ID';
      const date = currentDate.toLocaleDateString(locale, options);
      const ipaddress = await getUserIpAddress();
        const region = await getLocationInfo(ipaddress);
        
            const resultContent = `\n${email} | ${config.password}`;
            fs.appendFileSync('result.txt', resultContent);
              const message = `(+) New Account Spotify Created\nRegion: ${region}\n\nEmail: \`\`${email} (!)\`\`\nPassword: \`\`${config.password}\`\`\n\nCreated in ${date}`;  
              const response = await axios.post(
                `https://api.telegram.org/bot${config.bot_token}/sendMessage`,
                {
                  chat_id: config.owner_chatid,
                  text: message,
                  parse_mode: 'Markdown',
                }
              );
            console.log(chalk.blue('[Server] ') + chalk.green('All done. The result is saving in result.txt'));
            await browser.close();
        console.log(chalk.blue('[Server] ') + 'Browser closed.');
    } else {
      const currentDate = new Date();
const options = { day: 'numeric', month: 'long',year: 'numeric'  };
const locale = 'id-ID';
const date = currentDate.toLocaleDateString(locale, options);
const ipaddress = await getUserIpAddress();
  const region = await getLocationInfo(ipaddress);
      console.log(chalk.green('[Server] ') + 'No CAPTCHA challenge detected. Saving credentials...');
      const resultContent = `\n${email} | ${config.password}`;
      fs.appendFileSync('result.txt', resultContent);
        const message = `(+) New Account Spotify Created\nRegion: ${region}\n\nEmail: \`\`${email}\`\`\nPassword: \`\`${config.password}\`\`\n\nCreated in ${date}`;
    
        const response = await axios.post(
          `https://api.telegram.org/bot${config.bot_token}/sendMessage`,
          {
            chat_id: config.owner_chatid,
            text: message,
            parse_mode: 'Markdown',
          }
        );
    // .dev .bear
      console.log(chalk.blue('[Server] ') + chalk.green('All done. The result is saving in result.txt'));
      await browser.close();
  console.log(chalk.blue('[Server] ') + 'Browser closed.');
    }
  }
  async function getUserIpAddress() {
    try {
      const response = await axios.get('https://api.ipify.org');
      return response.data.trim();
    } catch (error) {
      console.error('Error retrieving IP address:', error);
      return 'Unknown';
    }
  }
  
async function askUserCount() {
    const ipaddress = await getUserIpAddress();
  const location = await getLocationInfo(ipaddress);
  console.log(chalk.blue("(-) IP ADDRESS: ") + chalk.yellow(ipaddress))
  console.log(chalk.green("(-) Location: ") + chalk.yellow(location))
  console.log(chalk.cyan('Please use vpn for all region account want to create\nThis script is beta featured'))
    rl.question(chalk.yellow('\nPress Ctrl+c to exit\n===================\n(+) ') + 'How many Spotify accounts do you want to create?\n- ', async (count) => {
      count = parseInt(count);
      if (isNaN(count) || count < 1) {
        console.log('Please Enter Number Only!');
        askUserCount();
      } else {
        puppeteer.use(StealthPlugin());
        for (let i = 0; i < count; i++) {
          console.log(chalk.green(`(+) Creating Spotify Account ${i + 1}`));
          await createSpotifyAccount();
          console.log(chalk.green(`(+) Succsesfully Creating Spotify Account ${i + 1}`));
        }
     askUserCount();
      }
    });
  }
  async function getLocationInfo(ipAddress) {
    const apiUrl = `http://ip-api.com/json/${ipAddress}`;
    try {
      const response = await axios.get(apiUrl);
      return response.data.country;
    } catch (error) {
      console.error('Error retrieving location information:', error);
      return 'oof'; 
    }
  }
  askUserCount();

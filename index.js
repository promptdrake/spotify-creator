const chalk = require('chalk');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const axios = require('axios')
const config = require("./config")

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
function checkLicenseAndPromptUser() {
  const apiUrl = `https://license.aisbircubes.my.id/api?key=${config.aisbircube_apikey}`;
  axios.get(apiUrl)
    .then(response => {
      const licenseInfo = response.data;
      if (licenseInfo.status && licenseInfo.data.type === 'spotify-generator') {
        askUserCount(licenseInfo);
      } else if(licenseInfo.status === false) {
        console.log(chalk.red('==================\nInvalid Apikey\nPlease Include Your license apikey\n\nPress ctrl+c To exit\n=================='));
      }
    })
    .catch(error => {
      console.error('Error fetching license information:', error);
    });
}
checkLicenseAndPromptUser();
async function askUserCount(licenseInfo) {
  const text = `
  █▀ █▀█ █▀█ ▀█▀ █ █▀▀ █▄█   ▄▀█ █ █▀ █▄▄ █ █▀█   █▀▀ ▄▀█   █▀ █ █░█ ▀█
  ▄█ █▀▀ █▄█ ░█░ █ █▀░ ░█░   █▀█ █ ▄█ █▄█ █ █▀▄   █▄█ █▀█   ▄█ █ █▀█ ░▄
  `;

  console.log(chalk.green.bold(text));
  console.log(chalk.blue('Created By @aisbircubes coder'));
  console.log('Follow Us');
  console.log(chalk.yellow('Telegram: https://t.me/penyukaberuang'));
  console.log(chalk.yellow('Instagram: https://instagram.com/aisbircubes\n'));
  console.log(licenseInfo)
  console.log(chalk.blue("===========\n[Server] License Matching to our server...\n"))
  rl.question('(1). Auto Create Spotify Account\n(2). Auto Pay 2 Month\n(3). Auto Pay 3 Month\n(4). Auto Pay Famhead\n(5). Close\n\nWhat do you want?\n' +chalk.yellow('- '), (choice) => {
    if (choice === '1') {
      console.log('(x) Loading Please wait...');
        rl.close();
      const account_creator = path.join(__dirname, 'module/account_creator.js');
      if (fs.existsSync(account_creator)) {
        require(account_creator);
      } else {
        console.log('pb.file.ac_c.not.found');
      }
    } else if (choice === '2') {
        const duab = path.join(__dirname, 'module/2b_hongkong.js');
      if (fs.existsSync(duab)) {
        require(duab);
      } else {
        console.log('pb.file.duab.not.found');
      }
    } 
    else if (choice === '3') {
        const tigab = path.join(__dirname, 'module/3b_hongkong.js');
        if (fs.existsSync(tigab)) {
          require(tigab);
        } else {
          console.log('pb.file.duab.not.found');
        }
    }
    else if (choice === '4') {
console.log("Comming Soon")
checkLicenseAndPromptUser();
  }
    else if (choice === '4') {
     return rl.close();
    }
     else {
      console.log(chalk.red.bold("\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n\n[Cmd] Failed Usage, please at least select option in the list\n\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n"));
      setTimeout(() => {
        checkLicenseAndPromptUser();
    }, 1000);
    }
  });
}
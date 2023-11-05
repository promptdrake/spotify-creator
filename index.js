const chalk = require('chalk');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function askUserCount() {
  const text = `
  █▀ █▀█ █▀█ ▀█▀ █ █▀▀ █▄█   ▄▀█ █ █▀ █▄▄ █ █▀█   █▀▀ ▄▀█   █▀ █ █░█ ▀█
  ▄█ █▀▀ █▄█ ░█░ █ █▀░ ░█░   █▀█ █ ▄█ █▄█ █ █▀▄   █▄█ █▀█   ▄█ █ █▀█ ░▄
  `;

  console.log(chalk.green.bold(text));
  console.log('Created By @aisbircubes coder');
  console.log('Follow Us');
  console.log('Telegram: https://t.me/penyukaberuang');
  console.log('Instagram: https://instagram.com/aisbircubes\n');
  rl.question('(1). Auto Create Spotify Account\n(2). Auto Pay 2 Month\n(3). Auto Pay 3 Month\n(4). Close\n\nWhat do you want?\n' +chalk.yellow('- '), (choice) => {
    if (choice === '1') {
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
     return rl.close();
    }
     else {
      console.log(chalk.red.bold("\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n\n[Cmd] Failed Usage, please at least select option in the list\n\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n"));
      setTimeout(() => {
      askUserCount();
    }, 1000);
    }
  });
}

askUserCount();

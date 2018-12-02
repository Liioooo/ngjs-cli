const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

function generateRouterConfig(cli) {
    if(fs.existsSync(process.cwd() + '\\app\\router-config.js')) {
        console.log(chalk.default.red(`  Error: router-config already exists!`));
        process.exit();
    }

    fs.copyFileSync(path.join(__dirname, '..', '..', 'templates', 'router-config.js'), process.cwd() + '\\app\\router-config.js');

    console.log(`  Created router-config successfully!`)
}

module.exports = {generateRouterConfig};
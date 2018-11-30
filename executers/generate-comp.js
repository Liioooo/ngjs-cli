const chalk = require('chalk');

function generateComp(name, cli) {
    if(name === undefined) {
        console.log(chalk.default.red(`  Error: Component-Name was not specified!`));
        cli.showHelp(0);
    }
    console.log('comp',name);
}

module.exports = {generateComp};
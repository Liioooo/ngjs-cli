const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

function generateFilter(name, cli) {
    if(name === undefined) {
        console.log(chalk.default.red(`  Error: Filter-Name was not specified!`));
        cli.showHelp(0);
    }
    if(!fs.existsSync(process.cwd() + '\\app\\components')) {
        console.log(chalk.default.red('  Error: The current directory is not a AngularJS project!'));
        process.exit();
    }

    if(fs.existsSync(process.cwd() + '\\app\\filters\\' + name + '.filter.js')) {
        console.log(chalk.default.red(`  Error: A filter with the name: "${name}" already exists!`));
        process.exit();
    }

    const regex = new RegExp('^[a-z]([a-zA-Z0-9])+$');
    if(!regex.test(name)) {
        console.log(chalk.default.red(`  Error: Name is invalid: It has to start with a lower case letter and contain only letters and numbers.`));
        process.exit();
    }

    let template = fs.readFileSync(path.join(__dirname, '..', 'templates', 'filter.js'), 'utf8');
    template = template.replace(new RegExp('###name###', 'g'), name);

    fs.writeFileSync(process.cwd() + '\\app\\filters\\' + name + '.filter.js', template);

    console.log(`  Created Filter "${name}" successfully!`)
}

module.exports = {generateFilter};
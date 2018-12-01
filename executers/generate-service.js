const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

function generateService(name, cli) {
    if(name === undefined) {
        console.log(chalk.default.red(`  Error: Service-Name was not specified!`));
        cli.showHelp(0);
    }
    if(!fs.existsSync(process.cwd() + '\\app\\components')) {
        console.log(chalk.default.red('  Error: The current directory is not a AngularJS project!'));
        process.exit();
    }

    if(fs.existsSync(process.cwd() + '\\app\\services\\' + name + '.service.js')) {
        console.log(chalk.default.red(`  Error: A service with the name: "${name}" already exists!`));
        process.exit();
    }

    const regex = new RegExp('^[a-z]([a-zA-Z0-9])+$');
    if(!regex.test(name)) {
        console.log(chalk.default.red(`  Error: Name is invalid: It has to start with a lower case letter and contain only letters and numbers.`));
        process.exit();
    }

    let template = fs.readFileSync(path.join(__dirname, '..', 'templates', 'service.js'), 'utf8');
    template = template.replace(new RegExp('###camelCaseName###', 'g'), name);

    let upperCaseName = name.charAt(0).toUpperCase() + name.slice(1);
    template = template.replace(new RegExp('###upperCaseName###', 'g'), upperCaseName);

    fs.writeFileSync(process.cwd() + '\\app\\services\\' + name + '.service.js', template);

    console.log(`  Created Service "${name}" successfully!`)
}

module.exports = {generateService};
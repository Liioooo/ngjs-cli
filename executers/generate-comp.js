const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

function generateComp(name, cli) {
    if(name === undefined) {
        console.log(chalk.default.red(`  Error: Component-Name was not specified!`));
        cli.showHelp(0);
    }
    if(!fs.existsSync(process.cwd() + '\\app\\components')) {
        console.log(chalk.default.red('  Error: The current directory is not a AngularJS project!'));
        process.exit();
    }

    if(fs.existsSync(process.cwd() + '\\app\\components\\' + name)) {
        console.log(chalk.default.red(`  Error: A component with the name: "${name}" already exists!`));
        process.exit();
    }

    const regex = new RegExp('^[a-z]([a-zA-Z0-9\-])+$');
    if(!regex.test(name)) {
        console.log(chalk.default.red(`  Error: Name is invalid: It has to start with a lower case letter and contain only letters, numbers and -.`));
        process.exit();
    }

    let template = fs.readFileSync(path.join(__dirname, '..', 'templates', 'component.js'), 'utf8');
    template = template.replace(new RegExp("###kebabCaseName###", 'g'), name);

    let camelCaseName = name.replace(/-([a-z0-9])/g, (x, up) => up.toUpperCase());
    let upperCaseName = camelCaseName.charAt(0).toUpperCase() + camelCaseName.slice(1);

    template = template.replace(new RegExp("###upperCaseName###", 'g'), upperCaseName);
    template = template.replace(new RegExp("###lowerCaseName###", 'g'), camelCaseName);

    fs.mkdirSync(process.cwd() + '\\app\\components\\' + name);
    fs.writeFileSync(process.cwd() + '\\app\\components\\' + name + '\\' + name + '.js', template);
    fs.writeFileSync(process.cwd() + '\\app\\components\\' + name + '\\' + name + '.html', `<p>${name} works!</p>`);

    console.log(`  Created Component ${name} successfully!`)
}

module.exports = {generateComp};
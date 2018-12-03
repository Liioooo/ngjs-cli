const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
let projectName;

function createProject(name, cli) {
    projectName = name;
    const regex = new RegExp('^([a-zA-Z0-9\-])+$');
    if(!regex.test(name)) {
        console.log(chalk.default.red(`  Error: Name is invalid: It has to start with a lower case letter and contain only letters, numbers and -.`));
        process.exit();
    }

    if(fs.existsSync(process.cwd() + name)) {
        console.log(chalk.default.red('  Error: A directory with this name already exists!'));
        process.exit();
    }

    copyDirectory(path.join(__dirname, '..', '..', 'project-template'), process.cwd() + '\\' + name);

    if(cli.flags['routing']) {
        fs.copyFileSync(path.join(__dirname, '..', '..', 'templates', 'router-config.js'), process.cwd() + '\\' + name + '\\app\\router-config.js');

        let indexHTML = fs.readFileSync(process.cwd() + '\\' + name + '\\app\\index.html', 'utf8');
        let firstPart = indexHTML.substring(0, indexHTML.indexOf('</md-content>'));
        let secondPart = indexHTML.substring(indexHTML.indexOf('</md-content>'));

        const newHTML = `${firstPart}   <ui-view></ui-view>
    ${secondPart}`;

        fs.writeFileSync(process.cwd() + '\\' + name + '\\app\\index.html', newHTML);
    }

    console.log(`  Created Project "${name}" successfully!`)
}

function copyDirectory(src, dest) {
    fs.mkdirSync(dest);
    let files = fs.readdirSync(src);
    for(let file of files) {
        let current = fs.lstatSync(path.join(src, file));
        if(current.isDirectory()) {
            copyDirectory(path.join(src, file), path.join(dest, file))
        } else {
            copyFile(path.join(src, file), path.join(dest, file))
        }
    }
}

function copyFile(src, dest) {
    if(src.endsWith('package.json')) {
        let packageFile = fs.readFileSync(path.join(__dirname, '..', '..', 'project-template', 'package.json'), 'utf8');
        packageFile = packageFile.replace('###name###', projectName);
        fs.writeFileSync(path.join(process.cwd(), projectName, 'package.json'), packageFile);
        return;
    }
    fs.copyFileSync(src, dest);
}

module.exports = {createProject};
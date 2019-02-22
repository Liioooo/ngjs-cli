const Command = require('../Command');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const errors = require('../errors');

module.exports = class CreateProject extends Command {

    static get commandName() {
        return ['cp', 'create-project'];
    }

    static get helpText() {
        return "cp, create-project [name]     Creates an AngularJS-Material-Project, --routing adds routing-config to the project";
    }

    static get needArgs() {
        return true;
    }

    static run(args) {
        this.projectName = args._[1];

        const regex = new RegExp('^([a-zA-Z0-9\-])+$');
        if(!regex.test(this.projectName)) {
            throw new errors.InvalidNameErrorLNH();
        }

        if(fs.existsSync(path.join(process.cwd(), this.projectName))) {
            throw new errors.ErrorPrintableMessage('Error: A directory with this name already exists!');
        }

        if(fs.existsSync(process.cwd() + '/app/components')) {
            throw new errors.ErrorPrintableMessage('Error: The current directory already is a AngularJS project!');
        }

        this.copyDirectory(path.join(__dirname, '..', '..', 'project-template'), path.join(process.cwd(), this.projectName));

        if(args['routing']) {
            fs.copyFileSync(path.join(__dirname, '..', '..', 'templates', 'router-config.js'), path.join(process.cwd(), this.projectName, 'app', 'router-config.js'));

            let indexHTML = fs.readFileSync(path.join(process.cwd(), this.projectName, 'app', 'index.html'), 'utf8');
            let firstPart = indexHTML.substring(0, indexHTML.indexOf('</md-content>'));
            let secondPart = indexHTML.substring(indexHTML.indexOf('</md-content>'));

            const newHTML = `${firstPart}   <ui-view></ui-view>
    ${secondPart}`;

            fs.writeFileSync(path.join(process.cwd(), this.projectName, 'app', 'index.html'), newHTML);
        }

        console.log(chalk.default.green(`   Created Project "${this.projectName}" successfully!`));
    }

    static copyDirectory(src, dest) {
        fs.mkdirSync(dest);
        let files = fs.readdirSync(src);
        for(let file of files) {
            let current = fs.lstatSync(path.join(src, file));
            if(current.isDirectory()) {
                this.copyDirectory(path.join(src, file), path.join(dest, file))
            } else {
                this.copyFile(path.join(src, file), path.join(dest, file))
            }
        }
    }

    static copyFile(src, dest) {
        if(src.endsWith('package.json')) {
            let packageFile = fs.readFileSync(path.join(__dirname, '..', '..', 'project-template', 'package.json'), 'utf8');
            packageFile = packageFile.replace('###name###', this.projectName);
            fs.writeFileSync(path.join(process.cwd(), this.projectName, 'package.json'), packageFile);
            return;
        }
        fs.copyFileSync(src, dest);
    }
};

const Command = require('../Command');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const errors = require('../errors');

module.exports = class GenerateFactory extends Command {

    static get commandName() {
        return ['gfa', 'generate-factory'];
    }

    static get helpText() {
        return 'gfa, generate-factory [name]   Generates an AngularJS-Factory';
    }

    static get needArgs() {
        return true;
    }

    static run(args) {
        const name = args._[1];

        if(!fs.existsSync(process.cwd() + '\\app\\components')) {
            throw new errors.NotAProjectDirError();
        }

        const regex = new RegExp('^[A-Z]([a-zA-Z0-9])+$');
        if(!regex.test(name)) {
            throw new errors.InvalidNameErrorUC();
        }

        if(fs.existsSync(process.cwd() + '\\app\\factories\\' + name + '.factory.js')) {
            throw new errors.ErrorPrintableMessage(`  Error: A factory with the name: "${name}" already exists!`);
        }

        let template = fs.readFileSync(path.join(__dirname, '..', '..', 'templates', 'factory.js'), 'utf8');

        template = template.replace(new RegExp('###upperCaseName###', 'g'), name);

        fs.writeFileSync(process.cwd() + '\\app\\factories\\' + name + '.factory.js', template);

        console.log(chalk.default.green(`  Created Factory "${name}" successfully!`));
    }
};
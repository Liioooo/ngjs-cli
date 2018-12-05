const Command = require('../Command');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const errors = require('../errors');

module.exports = class GenerateFilter extends Command {

    static get commandName() {
        return ['gf', 'generate-filter'];
    }

    static get helpText() {
        return 'gf, generate-filter [name]    Generates an AngularJS-Filter';
    }

    static get needArgs() {
        return true;
    }

    static run(args) {
        const name = args._[1];

        if(!fs.existsSync(process.cwd() + '\\app\\components')) {
            throw new errors.NotAProjectDirError();
        }

        const regex = new RegExp('^[a-z]([a-zA-Z0-9\-])+$');
        if(!regex.test(name)) {
            throw new errors.InvalidNameErrorLNH();
        }

        if(fs.existsSync(process.cwd() + '\\app\\filters\\' + name + '.filter.js')) {
            throw new errors.ErrorPrintableMessage(`  Error: A filter with the name: "${name}" already exists!`);
        }

        let template = fs.readFileSync(path.join(__dirname, '..', '..', 'templates', 'filter.js'), 'utf8');
        template = template.replace(new RegExp('###name###', 'g'), name);

        fs.writeFileSync(process.cwd() + '\\app\\filters\\' + name + '.filter.js', template);

        console.log(chalk.default.green(`  Created Filter "${name}" successfully!`));
    }
};
const Command = require('../Command');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const errors = require('../errors');

module.exports = class GenerateService extends Command {

    static get commandName() {
        return ['gvf', 'generate-value-file'];
    }

    static get helpText() {
        return 'gvf, generate-value-file       Generates a File were you can define values';
    }

    static get needArgs() {
        return false;
    }

    static run(args) {
        if(!fs.existsSync(process.cwd() + '\\app\\components')) {
            throw new errors.NotAProjectDirError();
        }

        if(fs.existsSync(process.cwd() + '\\app\\values.js')) {
            throw new errors.ErrorPrintableMessage(`  Error: value-file already exists!`);
        }

        fs.writeFileSync(process.cwd() + '\\app\\values.js', 'app.value(\"valueName\", \"value\");');

        console.log(chalk.default.green(`  Created value.js successfully!`));
    }
};
const Command = require('../Command');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const errors = require('../errors');

module.exports = class GenerateRouterConfig extends Command {

    static get commandName() {
        return ['grc', 'generate-router-config'];
    }

    static get helpText() {
        return 'grc, generate-router-config   Generates config for the ui.router';
    }

    static get needArgs() {
        return false;
    }

    static run(args) {
        if(!fs.existsSync(process.cwd() + '\\app\\components')) {
            throw new errors.NotAProjectDirError();
        }

        if(fs.existsSync(process.cwd() + '\\app\\router-config.js')) {
            throw new errors.ErrorPrintableMessage(`  Error: router-config already exists!`);
        }

        fs.copyFileSync(path.join(__dirname, '..', '..', 'templates', 'router-config.js'), process.cwd() + '\\app\\router-config.js');

        console.log(chalk.default.green(`  Created router-config successfully!`));
    }
};
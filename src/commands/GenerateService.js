const Command = require('../Command');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const errors = require('../errors');

module.exports = class GenerateService extends Command {

    static get commandName() {
        return ['gs', 'generate-service'];
    }

    static get helpText() {
        return 'gs, generate-service [name]   Generates an AngularJS-Service';
    }

    static get needArgs() {
        return true;
    }

    static run(args) {
        const name = args._[1];

        if(!fs.existsSync(path.join(process.cwd(), 'app', 'components'))) {
            throw new errors.NotAProjectDirError();
        }

        const regex = new RegExp('^[A-Z]([a-zA-Z0-9])+$');
        if(!regex.test(name)) {
            throw new errors.InvalidNameErrorUC();
        }

        if(fs.existsSync(path.join(process.cwd(), 'app', 'services', name + '.service.js'))) {
            throw new errors.ErrorPrintableMessage(`  Error: A service with the name: "${name}" already exists!`);
        }

        let template = fs.readFileSync(path.join(__dirname, '..', '..', 'templates', 'service.js'), 'utf8');

        template = template.replace(new RegExp('###upperCaseName###', 'g'), name);

        fs.writeFileSync(path.join(process.cwd(), 'app', 'services', name + '.service.js'), template);

        console.log(chalk.default.green(`  Created Service "${name}" successfully!`));
    }
};

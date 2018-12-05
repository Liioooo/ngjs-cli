const Command = require('../Command');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const errors = require('../errors');

module.exports = class GenerateComponent extends Command {

    static get commandName() {
        return ['gc', 'generate-component'];
    }

    static get helpText() {
        return 'gc, generate-component [name] Generates an AngularJS-Component, --routing adds the component too router-config';
    }

    static get needArgs() {
        return true;
    }

    static run(args) {
        const name = args._[1];

        if(!fs.existsSync(process.cwd() + '\\app\\components')) {
            throw new errors.NotAProjectDirError();
        }

        if(fs.existsSync(process.cwd() + '\\app\\components\\' + name)) {
            throw new errors.ErrorPrintableMessage(`  Error: A component with the name: "${name}" already exists!`);
        }

        const regex = new RegExp('^[a-z]([a-zA-Z0-9\-])+$');
        if(!regex.test(name)) {
           throw new errors.InvalidNameErrorLNH();
        }

        let template = fs.readFileSync(path.join(__dirname, '..', '..', 'templates', 'component.js'), 'utf8');
        template = template.replace(new RegExp('###kebabCaseName###', 'g'), name);

        let camelCaseName = name.replace(/-([a-z0-9])/g, (x, up) => up.toUpperCase());
        let upperCaseName = camelCaseName.charAt(0).toUpperCase() + camelCaseName.slice(1);

        template = template.replace(new RegExp('###upperCaseName###', 'g'), upperCaseName);
        template = template.replace(new RegExp('###camelCaseName###', 'g'), camelCaseName);

        fs.mkdirSync(process.cwd() + '\\app\\components\\' + name);
        fs.writeFileSync(process.cwd() + '\\app\\components\\' + name + '\\' + name + '.component.js', template);
        fs.writeFileSync(process.cwd() + '\\app\\components\\' + name + '\\' + name + '.component.html', `<p>${name} works!</p>`);

        if(args['routing']) {
            if(!fs.existsSync(process.cwd() + '\\app\\router-config.js')) {
                errors.printWarning(`Warning: router-config does not exists! Run ngjs-cli grc at first!`);
            } else {
                let routerConfig = fs.readFileSync(process.cwd() + '\\app\\router-config.js', 'utf8');
                let firstPart = routerConfig.substring(0, routerConfig.indexOf('$urlRouterProvider.otherwise'));
                let secondPart = routerConfig.substring(routerConfig.indexOf('$urlRouterProvider.otherwise'));

                const newConfig = `${firstPart}$stateProvider.state({
        name: "${name}",
        url: "/${name}",
        component: "${camelCaseName}"
    });
        
    ${secondPart}`;

                fs.writeFileSync(process.cwd() + '\\app\\router-config.js', newConfig);
            }
        }

        console.log(chalk.default.green(`   Created Component "${name}" successfully!`));
    }
};
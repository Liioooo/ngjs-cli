const comp = require('./executers/generate-comp');
const service = require('./executers/generate-service');
const filter = require('./executers/generate-filter');
const routerConfig = require('./executers/generate-router-config');
const create = require('./executers/create-project');
const serve = require('./executers/serve');
const build = require('./executers/build');
const chalk = require('chalk');

const commands = [
    { command: ['gc', 'generate-component'], executor: comp.generateComp, needsParams: true },
    { command: ['gs', 'generate-service'], executor: service.generateService, needsParams: true },
    { command: ['gf', 'generate-filter'], executor: filter.generateFilter, needsParams: true },
    { command: ['grc', 'generate-router-config'], executor: routerConfig.generateRouterConfig, needsParams: false },
    { command: ['cp', 'create-project'], executor: create.createProject, needsParams: true },
    { command: ['serve'], executor: serve.serveProject, needsParams: false },
    { command: ['build'], executor: build.buildProject, needsParams: false }
];

function parseCommand(command, cli) {
    let executedCommand = false;
    commands.forEach(item => {
        if(item.command.includes(command[0])) {
            if(!item.needsParams) {
                item.executor(cli);
            } else {
                item.executor(command[1], cli);
            }
            executedCommand = true;
        }
    });
    if(!executedCommand) {
        console.log(chalk.default.red(`  Error: The Command "${command[0]}" was not found!`));
        cli.showHelp(0);
    }
}

module.exports = {parseCommand};
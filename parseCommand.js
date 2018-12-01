const comp = require('./executers/generate-comp');
const serv = require('./executers/generate-service');
const filter = require('./executers/generate-filter');
const routerConfig = require('./executers/generate-router-config');
const chalk = require('chalk');

const commands = [
    { command: ['gc', 'generate-component'], executor: comp.generateComp, needsParams: true },
    { command: ['gs', 'generate-service'], executor: serv.generateService, needsParams: true },
    { command: ['gf', 'generate-filter'], executor: filter.generateFilter, needsParams: true },
    { command: ['grc', 'generate-router-config'], executor: routerConfig.generateRouterConfig, needsParams: false }
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
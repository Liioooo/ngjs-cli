const comp = require('./executers/generate-comp');
const serv = require('./executers/generate-service');
const chalk = require('chalk');

const commands = [
    { command: ['gc', 'generate-component'], executor: comp.generateComp },
    { command: ['gs', 'generate-service'], executor: serv.generateService }
];

function parseCommand(command, cli) {
    let executedCommand = false;
    commands.forEach(item => {
        if(item.command.includes(command[0])) {
            item.executor(command[1], cli);
            executedCommand = true;
        }
    });
    if(!executedCommand) {
        console.log(chalk.default.red(`  Error: The Command "${command[0]}" was not found!`));
        cli.showHelp(0);
    }
}

module.exports = {parseCommand};
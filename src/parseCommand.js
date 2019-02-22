const HelpProvidor = require('./HelpProvidor');
const errors = require('./errors');
const chalk = require('chalk');
const path = require('path');

let commands = [];
require("fs").readdirSync(path.join(__dirname, 'commands')).forEach((file) => {
    commands.push(require("./commands/" + file));
});

function parseCommand(args) {
    for(let cmd of commands) {
        if(cmd.commandName.includes(args._[0])) {
            try {
                if(args['help'] || (args._.length === 1 && cmd.needArgs)) {
                    if((args._.length === 1 && cmd.needArgs)) {
                        console.log(chalk.default.red('   ' + 'Error: Arguments not specified!'));
                    }
                    HelpProvidor.printHelpForCommand(cmd);
                } else {
                    cmd.run(args);
                }
            } catch (e) {
                if(e instanceof errors.ErrorPrintableMessage) {
                    e.printError();
                }
            } finally {
                return;
            }
        }
    }
    console.log(chalk.default.red('   ' + 'Error: Command not found!'));
}

module.exports = {parseCommand};

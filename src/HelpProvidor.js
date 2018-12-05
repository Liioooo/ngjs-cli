const chalk = require('chalk');

module.exports = class HelpProvidor {

    static printEntireHelp() {
        console.log(`${chalk.default.magenta('Help for AngularJS-CLI by Liiioooo')}\n`);
        require("fs").readdirSync(__dirname + '\\commands').forEach((file) => {
            console.log(`   ${require("./commands/" + file).helpText}`);
        });
        console.log('\n   Flags can be shortened with:\n',
                    '     --version: --v\n',
                    '     --help: --h\n',
                    '     --routing: --r\n'
                   );

    }

    static printHelpForCommand(cmd) {
        console.log(`   ${cmd.helpText}`);
    }

};
const Command = require('../Command');
const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const errors = require('../errors');
require('../gulpfile');

module.exports = class Serve extends Command {

    static get commandName() {
        return ['serve'];
    }

    static get helpText() {
        return 'serve                         Serves the application, --proxyconfig [configFile] proxies requests';
    }

    static get needArgs() {
        return false;
    }

    static run(args) {
        if(!fs.existsSync(path.join(process.cwd(), 'app', 'components'))) {
            throw new errors.NotAProjectDirError();
        }
        delete process.env.PROXYCONFIG_FILE;
        if(args['proxyconfig']) {
            if(args['proxyconfig'] !== true) {
                process.env.PROXYCONFIG_FILE = args['proxyconfig'];
            }
        }
        console.log("   Serving Application...");
        gulp.start('watch');
    }
};

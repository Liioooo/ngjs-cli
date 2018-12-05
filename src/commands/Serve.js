const Command = require('../Command');
const gulp = require('gulp');
const fs = require('fs');
const errors = require('../errors');
require('../gulpfile');

module.exports = class Serve extends Command {

    static get commandName() {
        return ['serve'];
    }

    static get helpText() {
        return 'serve                         Serves the application';
    }

    static get needArgs() {
        return false;
    }

    static run(args) {
        if(!fs.existsSync(process.cwd() + '\\app\\components')) {
            throw new errors.NotAProjectDirError();
        }

        console.log("   Serving Application...");
        gulp.start('watch');
    }
};
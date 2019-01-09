const Command = require('../Command');
const gulp = require('gulp');
const fs = require('fs');
const errors = require('../errors');
require('../gulpfile');

module.exports = class Build extends Command {

    static get commandName() {
        return ['build'];
    }

    static get helpText() {
        return 'build                         Builds the application (You must serve the app one time before you can build it)';
    }

    static get needArgs() {
        return false;
    }

    static run(args) {
        if(!fs.existsSync(process.cwd() + '\\app\\components')) {
            throw new errors.NotAProjectDirError();
        }

        console.log("   Building Application...");
        gulp.start('build');
    }
};
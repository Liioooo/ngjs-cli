let gulp = require('gulp');
const chalk = require('chalk');
const fs = require('fs');
require('../gulpfile');

function buildProject(cli) {
    if(!fs.existsSync(process.cwd() + '\\app\\components')) {
        console.log(chalk.default.red('  Error: The current directory is not a AngularJS project!'));
        process.exit();
    }

    console.log("Building Application...");
    gulp.start('build');
}

module.exports = {buildProject};
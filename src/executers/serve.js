let gulp = require('gulp');
const chalk = require('chalk');
const fs = require('fs');
require('../gulpfile');

function serveProject(cli) {
    if(!fs.existsSync(process.cwd() + '\\app\\components')) {
        console.log(chalk.default.red('  Error: The current directory is not a AngularJS project!'));
        process.exit();
    }

    console.log("Serving Application...");
    gulp.start('watch');
}

module.exports = {serveProject};
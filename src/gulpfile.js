const gulp = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const proxy = require('http-proxy-middleware');
const fs = require('fs');
const chalk = require('chalk');

const projectPath = process.cwd();

let jsonPlaceholderProxyArray = [];
gulp.task('browserSync', function() {
    if(process.env.PROXYCONFIG_FILE) {
        let proxyconfig;
        try {
            proxyconfig = JSON.parse(fs.readFileSync(process.cwd() + '\\' + process.env.PROXYCONFIG_FILE, 'utf8'));
            Object.keys(proxyconfig).forEach(key => {
                jsonPlaceholderProxyArray.push(proxy(key, proxyconfig[key]));
            });
        } catch (e) {
            console.log(chalk.default.red('   Error: Invalid proxyconfig file!'));
            process.exit();
        }
    }
    browserSync.init({
        server: {
            baseDir: projectPath + '/app',
            index: 'index.html',
        },
        logPrefix: 'NGJS-CLI',
        middleware: jsonPlaceholderProxyArray || []
    })
});

gulp.task('concat-js-serve', function () {
    gulp.src([projectPath + '/app/**/*.js', '!' + projectPath + '/app/vendor/**', '!' + projectPath + '/app/**/*.spec.js', '!' + projectPath + '/app/bundle.js'])
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat('bundle.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(projectPath + '/app'))
        .pipe(browserSync.stream());
});

gulp.task('compile-sass-serve', function () {
   gulp.src([projectPath + '/app/app.scss'])
       .pipe(sourcemaps.init())
       .pipe(sass())
       .pipe(sourcemaps.write())
       .pipe(gulp.dest(projectPath + '/app'))
       .pipe(browserSync.stream());

});

let configObject;
gulp.task('copyFilesToVendor', function () {
    configObject = readConfigFile();
    if (!configObject.hasOwnProperty('copyToVendor')) {
        console.log(chalk.default.red('   Error: Invalid proxyconfig file!, copyFilesToVendor was not specified!'));
        process.exit();
    }
    configObject.copyToVendor.forEach(item => {
        gulp.src(projectPath + item.from)
            .pipe(gulp.dest(projectPath + '/app/vendor/' + item.to));
    });
    gulp.start('addImportsIndexHTML');
});

gulp.task('addImportsIndexHTML', function () {
    let toImport = configObject.copyToVendor
        .filter(item => item.importToIndexHTML)
        .map(item => {
            const file = `vendor${item.to}${item.from.substring(item.from.lastIndexOf('/'))}`;
            return {
                file: file,
                type: item.importToIndexHTML
            }
        });
    toImport = toImport.concat(configObject.createIndexHTMLInports);

    let toImportCSS = [], toImportScript = [];
    toImport.forEach(item => {
       if(item.type === 'css') {
           toImportCSS.push(item);
       } else {
           toImportScript.push(item);
       }
    });
    toImportCSS.push({
       file: 'app.css',
       type: 'css'
    });
    toImportScript.push({
        file: 'bundle.js',
        type: 'script'
    });
    toImport = toImportCSS.concat(toImportScript);

    let indexHTML = fs.readFileSync(`${process.cwd()}\\app\\index.html`, 'utf8');
    indexHTML = indexHTML.split('\n')
        .filter(line => !(line.includes('<script') || line.includes('<link rel="stylesheet"')));
    const startToInsert = indexHTML.findIndex(line => line.includes('<link rel="icon"'));

    //TODO: iterate backwards and append to ARRAY
});

gulp.task('watch', ['browserSync', 'copyFilesToVendor', 'concat-js-serve', 'compile-sass-serve'], function () {
    gulp.watch([projectPath + '/app/**/*.js', '!' + projectPath + '/app/vendor/**', '!' + projectPath + '/app/bundle.js', '!*spec.js'], function (ev) {
        console.log(ev.type + ' ' + ev.path);
        gulp.start('concat-js-serve');
    });
    gulp.watch([projectPath + '/app/**/*.scss', '!' + projectPath + '/app/vendor/**'], function (ev) {
        console.log(ev.type + ' ' + ev.path);
        gulp.start('compile-sass-serve');
    });
    gulp.watch([projectPath + '/app/**/*.html', '!' + projectPath + '/app/vendor/**'], function (ev) {
        console.log(ev.type + ' ' + ev.path);
        browserSync.reload();
    });
});

gulp.task('build', [], function () {
    gulp.start('concat-js-build');
    gulp.start('compile-sass-build');
    gulp.start('copyDist');

});

gulp.task('concat-js-build', function () {
    gulp.src([projectPath + '/app/**/*.js', '!' + projectPath + '/app/vendor/**', '!' + projectPath + '/app/**/*.spec.js', '!' + projectPath + '/app/bundle.js'])
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest(projectPath + '/dist/'));
});

gulp.task('compile-sass-build', function () {
    gulp.src([projectPath + '/app/app.scss'])
        .pipe(sass())
        .pipe(gulp.dest(projectPath + '/dist'))
});

gulp.task('copyDist', function () {
    gulp.src([projectPath + '/app/**/*.html', projectPath + '/app/**/*.ico'])
        .pipe(gulp.dest(projectPath + '/dist/'));
    gulp.src([projectPath + '/app/vendor/**'])
        .pipe(gulp.dest(projectPath + '/dist/vendor'));
    gulp.src([projectPath + '/app/assets/**'])
        .pipe(gulp.dest(projectPath + '/dist/assets'));
});

function readConfigFile() {
    try {
        if (!fs.existsSync(`${process.cwd()}\\ngjs-cli.config.json`)) {
            console.log(chalk.default.red('   Error: File ngjs-cli.config.json was not found!'));
            process.exit();
        }
        return JSON.parse(fs.readFileSync(`${process.cwd()}\\ngjs-cli.config.json`, 'utf8'));
    } catch (e) {
        console.log(chalk.default.red('   Error: Invalid ngjs-cli.config.json file!'));
        process.exit();
    }
}

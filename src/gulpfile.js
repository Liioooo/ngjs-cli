const gulp = require('gulp');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const proxy = require('http-proxy-middleware');
const fs = require('fs');
const chalk = require('chalk');

const projectPath = process.cwd();

const jsonPlaceholderProxy1 = proxy('/img/**', {
   target: 'http://localhost:80',
   changeOrigin: true,
});
const jsonPlaceholderProxy2 = proxy('/kek/**', {
    target: 'http://localhost:80',
    changeOrigin: true,
});

gulp.task('browserSync', function() {
    if(process.env.PROXYCONFIG_FILE) {
        let proxyconfig;
        try {
            proxyconfig = JSON.parse(fs.readFileSync(process.cwd() + '\\' + process.env.PROXYCONFIG_FILE));
        } catch (e) {
            console.log(chalk.default.red('   Error: Invalid proxyconfig file!'));
            process.exit();
        }
        //TODO: parse proxyconfig
        console.log(proxyconfig)
    }
    browserSync.init({
        server: {
            baseDir: projectPath + '/app',
            index: 'index.html',
        },
        logPrefix: 'NGJS-CLI',
        middleware: [jsonPlaceholderProxy1, jsonPlaceholderProxy2]
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

gulp.task('copyFilesToVendor', function () {
    gulp.src(projectPath + '/node_modules/angular/angular.min.js')
        .pipe(gulp.dest(projectPath + '/app/vendor/angularjs'));
    gulp.src(projectPath + '/node_modules/angular-resource/angular-resource.min.js')
        .pipe(gulp.dest(projectPath + '/app/vendor/angularjs'));
    gulp.src(projectPath + '/node_modules/angular-messages/angular-messages.min.js')
        .pipe(gulp.dest(projectPath + '/app/vendor/angularjs'));
    gulp.src(projectPath + '/node_modules/angular-sanitize/angular-sanitize.min.js')
        .pipe(gulp.dest(projectPath + '/app/vendor/angularjs'));
    gulp.src(projectPath + '/node_modules/angular-aria/angular-aria.min.js')
        .pipe(gulp.dest(projectPath + '/app/vendor/angularjs'));
    gulp.src(projectPath + '/node_modules/angular-animate/angular-animate.min.js')
        .pipe(gulp.dest(projectPath + '/app/vendor/angularjs'));
    gulp.src(projectPath + '/node_modules/angular-ui-router/release/angular-ui-router.min.js')
        .pipe(gulp.dest(projectPath + '/app/vendor/angularjs'));
    gulp.src(projectPath + '/node_modules/angular-material/angular-material.min.js')
        .pipe(gulp.dest(projectPath + '/app/vendor/angular-material'));
    gulp.src(projectPath + '/node_modules/angular-material/angular-material.min.css')
        .pipe(gulp.dest(projectPath + '/app/vendor/angular-material'));
    gulp.src(projectPath + '/node_modules/jquery/dist/jquery.min.js')
        .pipe(gulp.dest(projectPath + '/app/vendor/jquery'));
});

gulp.task('watch', ['browserSync', 'concat-js-serve', 'copyFilesToVendor'], function () {
    gulp.watch([projectPath + '/app/**/*.js', '!' + projectPath + '/app/vendor/**', '!' + projectPath + '/app/bundle.js', '!*spec.js'], function (ev) {
        console.log(ev.type + ' ' + ev.path);
        gulp.start('concat-js-serve');
    });
    gulp.watch([projectPath + '/app/**/*.html', '!' + projectPath + '/app/vendor/**'], function (ev) {
        console.log(ev.type + ' ' + ev.path);
        browserSync.reload();
    });
});

gulp.task('build', ['copyFilesToVendor', 'copyDist'], function () {
    gulp.start('concat-js-build');

});

gulp.task('concat-js-build', function () {
    gulp.src([projectPath + '/app/**/*.js', '!' + projectPath + '/app/vendor/**', '!' + projectPath + '/app/**/*.spec.js', '!' + projectPath + '/app/bundle.js'])
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest(projectPath + '/dist/'));
});

gulp.task('copyDist', function () {
    gulp.src([projectPath + '/app/**/*.html', projectPath + '/app/**/*.css', projectPath + '/app/**/*.ico'])
        .pipe(gulp.dest(projectPath + '/dist/'));
    gulp.src([projectPath + '/app/vendor/**'])
        .pipe(gulp.dest(projectPath + '/dist/vendor'));
});
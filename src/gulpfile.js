let gulp = require('gulp');
let concat = require('gulp-concat');
let sourcemaps = require('gulp-sourcemaps');
let source = require('vinyl-source-stream');
let buffer = require('vinyl-buffer');
let browserify = require('browserify');
let browserSync = require('browser-sync').create();

const projectPath = process.cwd();

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: projectPath + '/app',
            index: 'index.html'
        },
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

gulp.task('compile-js-serve', ['concat-js-serve'], function () {
    const b = browserify({
        entries: projectPath + '/app/bundle.js',
        debug: true,
    });

    b.bundle()
        .pipe(source("bundle.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(projectPath + "/app/"));
});

gulp.task('copyFilesToVendor', function () {
    gulp.src(projectPath + '/node_modules/angular-material/angular-material.min.css')
        .pipe(gulp.dest(projectPath + '/app/vendor/angular-material'));
    gulp.src(projectPath + '/node_modules/jquery/dist/jquery.min.js')
        .pipe(gulp.dest(projectPath + '/app/vendor/jquery'));
});

gulp.task('watch', ['browserSync', 'compile-js-serve', 'copyFilesToVendor'], function () {
    gulp.watch([projectPath + '/app/**/*.js', '!' + projectPath + '/app/vendor/**', '!' + projectPath + '/app/bundle.js', '!*spec.js'], function (ev) {
        console.log(ev.type + ' ' + ev.path);
        gulp.start('compile-js-serve');
    });
    gulp.watch([projectPath + '/app/**/*.html', '!' + projectPath + '/app/vendor/**'], function (ev) {
        console.log(ev.type + ' ' + ev.path);
        browserSync.reload();
    });
});

gulp.task('build', ['copyFilesToVendor', 'copyDist'], function () {
    gulp.start('compile-js-build');

});

gulp.task('compile-js-build', ['concat-js-build'], function () {
    setTimeout(() => {
        const b = browserify({
            entries: projectPath + '/dist/bundle.js',
            debug: true,
        });

        b.bundle()
            .pipe(source("bundle.js"))
            .pipe(buffer())
            .pipe(gulp.dest(projectPath + "/dist/"));

        console.log("If it failed, just try again!");
    }, 500);
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
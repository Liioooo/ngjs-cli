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

gulp.task('concat-js', function () {
    gulp.src([projectPath + '/app/**/*.js', '!' + projectPath + '/app/vendor/**', '!' + projectPath + '/app/**/*.spec.js', '!' + projectPath + '/app/bundle.js'])
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat('bundle.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(projectPath + '/app'))
        .pipe(browserSync.stream());
});

gulp.task('compile-js', ['concat-js'], function () {
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

gulp.task('copyFiles', function () {
    gulp.src(projectPath + '/node_modules/angular-material/angular-material.min.css')
        .pipe(gulp.dest(projectPath + '/app/vendor/angular-material'));
    gulp.src(projectPath + '/node_modules/jquery/dist/jquery.min.js')
        .pipe(gulp.dest(projectPath + '/app/vendor/jquery'));
});

gulp.task('watch', ['browserSync', 'compile-js', 'copyFiles'], function () {
    gulp.watch([projectPath + '/app/**/*.js', '!' + projectPath + '/app/vendor/**', '!' + projectPath + '/app/bundle.js', '!*spec.js'], function (ev) {
        console.log(ev.type + ' ' + ev.path);
        gulp.start('compile-js');
    });
    gulp.watch([projectPath + '/app/**/*.html', '!' + projectPath + '/app/vendor/**'], function (ev) {
        console.log(ev.type + ' ' + ev.path);
        browserSync.reload();
    });
});

gulp.task('build', ['copyFiles'], function () {
    gulp.src([projectPath + '/app/**/*.html', projectPath + '/app/**/*.css', projectPath + "/app/**/*.ico"])
        .pipe(gulp.dest(projectPath + '/dist'));
    gulp.src(projectPath + '/app/vendor/**')
        .pipe(gulp.dest(projectPath + '/dist/vendor'));
    gulp.src([ projectPath + '/app/**/*.js', '!' + projectPath + '/app/vendor/**', '!' + projectPath + '/app/**/*.spec.js', '!' + projectPath + '/app/bundle.js'])
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest(projectPath + '/dist/'));

    const b = browserify({
        entries: projectPath + '/dist/bundle.js',
        debug: true,
    });

    b.bundle()
        .pipe(source("bundle.js"))
        .pipe(buffer())
        .pipe(gulp.dest(projectPath + "/dist/"));
});
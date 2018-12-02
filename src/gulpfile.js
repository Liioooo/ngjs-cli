let gulp = require('gulp');
let concat = require('gulp-concat');
let sourcemaps = require('gulp-sourcemaps');
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

gulp.task('watch', ['browserSync', 'concat-js'], function () {
    gulp.watch([projectPath + '/app/**/*.js', '!' + projectPath + '/app/vendor/**', '!' + projectPath + '/app/bundle.js', '!*spec.js'], function (ev) {
        console.log(ev.type + ' ' + ev.path);
        gulp.src([projectPath + '/app/**/*.js', '!' + projectPath + '/app/vendor/**', '!' + projectPath + '/app/**/*.spec.js', '!' + projectPath + '/app/bundle.js'])
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(concat('bundle.js'))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(projectPath + '/app'))
            .pipe(browserSync.stream());
    });
    gulp.watch([projectPath + '/app/**/*.html', '!' + projectPath + '/app/vendor/**'], function (ev) {
        console.log(ev.type + ' ' + ev.path);
        browserSync.reload();
    });
});

gulp.task('build', function () {
    gulp.src([projectPath + '/app/**/*.html', projectPath + '/app/**/*.css', projectPath + "/app/**/*.ico"])
        .pipe(gulp.dest(projectPath + '/dist'));
    gulp.src(projectPath + '/app/vendor/**')
        .pipe(gulp.dest(projectPath + '/dist/vendor'));
    gulp.src([ projectPath + '/app/**/*.js', '!' + projectPath + '/app/vendor/**', '!' + projectPath + '/app/**/*.spec.js', '!' + projectPath + '/app/bundle.js'])
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest(projectPath + '/dist/'))
});
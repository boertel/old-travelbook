var gulp = require('gulp'),
    browserify = require('browserify'),
    reactify = require('reactify'),
    source = require('vinyl-source-stream'),
    package = require('./package'),
    jshint = require('gulp-jshint'),
    notify = require("gulp-notify"),
    babelify = require('babelify'),
    eslint = require('gulp-eslint');

var paths = {
    js: ['./src/**/*.js'],
    main: ['./src/main.js']
};

function handleErrors () {
    var args = Array.prototype.slice.call(arguments);
    notify.onError({
        title: "Compile Error",
        message: "<%= error.message %>",
        sound: false
    }).apply(this, args);
    this.emit('end');
}

gulp.task('js', function () {
    browserify({
        entries: paths.main,
        standalone: package.name
    })
    .transform(babelify)
    .bundle()
    .on('error', handleErrors)
    .pipe(source('travelbook.js'))
    .pipe(gulp.dest('./build/'));
});

gulp.task('lint', function() {
    return gulp.src(paths.js)
        .pipe(eslint())
        .pipe(eslint.format())
});

gulp.task('watch', function () {
    gulp.watch(paths.js, ['lint', 'js']);
});

gulp.task('default', ['watch', 'lint', 'js']);

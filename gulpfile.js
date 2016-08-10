const gulp   = require('gulp');
const concat = require('gulp-concat');
const csso   = require('gulp-csso');
const less   = require('gulp-less');

const CONST = {
  source : './src/client',
  target : './build/client'
};

gulp.task('build-cli-css', () => {
  gulp.src(`${CONST.source}/**/*.less`)
    .on('error', err => { throw err; })
    .pipe(concat('compiled.css'))
    .pipe(less())
    .on('error', err => { throw err; })
    .pipe(csso())
    .pipe(gulp.dest(CONST.target));
});

gulp.task('build-cli-js', () => {
  gulp.src(`${CONST.source}/**/*.js`)
    .pipe(gulp.dest(CONST.target));
});

gulp.task('build-cli-html', () => {
  gulp.src(`${CONST.source}/**/*.html`)
    .pipe(gulp.dest(CONST.target));
});

gulp.task('build-cli', ['build-cli-css','build-cli-js','build-cli-html'], () => {
  gulp.watch(`${CONST.source}/**/*.less`,['build-cli-css']);
  gulp.watch(`${CONST.source}/**/*.js`,['build-cli-js']);
  gulp.watch(`${CONST.source}/**/*.html`,['build-cli-html']);
});

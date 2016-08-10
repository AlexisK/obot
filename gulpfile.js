//            //
//  HARD WAY  //
//            //
const gulp   = require('gulp');
const concat = require('gulp-concat');
const csso   = require('gulp-csso');
const less   = require('gulp-less');
const gutil  = require('gulp-util');
const {SLACK_CLIENT_ID, SLACK_DOMAIN, SLACK_TEAM} = require('./settings.json');

const CONST = {
  source : './src/client',
  target : './build/client'
};

// copy-paste don't remember where from - usage line 42
function string_src(filename, string) {
  var src   = require('stream').Readable({objectMode : true});
  src._read = function () {
    this.push(new gutil.File({
      cwd      : "",
      base     : "",
      path     : filename,
      contents : new Buffer(string)
    }));
    this.push(null)
  };
  return src
}

gulp.task('build-cli-css', () => {
  gulp.src(`${CONST.source}/**/*.less`)
    .on('error', err => { throw err; })
    //.pipe(concat('compiled.css'))
    .pipe(less())
    .on('error', err => { throw err; })
    .pipe(csso())
    .pipe(gulp.dest(CONST.target));
});

gulp.task('save-keys', () => {
  // never do this! crutch to shut angular2 parsers up
  // should find better way :facepalm:
  string_src('settings.js', "exports.settings = " + JSON.stringify({SLACK_CLIENT_ID, SLACK_DOMAIN, SLACK_TEAM}))
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

gulp.task('build-cli', ['save-keys', 'build-cli-css', 'build-cli-js', 'build-cli-html'], () => {
  gulp.watch(`${CONST.source}/**/*.less`, ['build-cli-css']);
  gulp.watch(`${CONST.source}/**/*.js`, ['build-cli-js']);
  gulp.watch(`${CONST.source}/**/*.html`, ['build-cli-html']);
});

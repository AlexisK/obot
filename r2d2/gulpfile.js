
var gulp    = require('gulp');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var concat  = require('gulp-concat');
var csso    = require('gulp-csso');
var less    = require('gulp-less');
var uglify  = require('gulp-uglify');
var nodemon = require('gulp-nodemon');


gulp.task('build_css', function(done) {
    
    gulp.src(['./resources/css/config.less','./resources/css/**/*'])
    .on('error', ()=>{ console.error('css/src'); })
    .pipe(concat('compiled.css'))
    .on('error', ()=>{ console.error('css/concat'); })
    .pipe(less())
    .on('error', ()=>{ console.error('css/less'); })
    .pipe(csso())
    .on('error', ()=>{ console.error('css/csso'); })
    .pipe(gulp.dest('./build'))
    .on('error', ()=>{ console.error('css/write'); });
    
    done();
});



gulp.task('build_js', function(done) {
    
    gulp.src([
        './resources/js/wrap.js',
        './resources/js/storage.js',
        './resources/js/model/**/*',
        './resources/js/service/**/*',
        './resources/js/instances/**/*',
        './resources/js/app.js'
    ])
    .on('error', ()=>{ console.error('js/src'); })
    .pipe(concat('compiled.js'))
    .on('error', ()=>{ console.error('js/concat'); })
    //.pipe(uglify())
    //.on('error', ()=>{ console.error('js/uglify'); })
    .pipe(gulp.dest('./build'))
    .on('error', ()=>{ console.error('js/write'); });
    
    gulp.src('./resources/locale/*').pipe(gulp.dest('./build/locale'));
    
    done();
});

gulp.task('build_node_js', function(done) {
    
    gulp.src([
        './server/config.js',
        './server/wrap.js',
        './server/model/**/*',
        './server/service/**/*',
        './server/instances/**/*',
        './server/orm_schema.js',
        './server/app.js'
    ])
    .on('error', ()=>{ console.error('node_js/src'); })
    .pipe(concat('server.js'))
    .on('error', ()=>{ console.error('node_js/concat'); })
    .pipe(gulp.dest('./'))
    .on('error', ()=>{ console.error('node_js/write'); });
    
    done();
});


gulp.task('build_html', function(done) {
    
    gulp.src('./resources/index.html')
    .on('error', ()=>{ console.error('html/src'); })
    .pipe(gulp.dest('./build'))
    .on('error', ()=>{ console.error('html/write'); });
    
    done();

});


gulp.task('build', function() {
    runSequence('build_css','build_node_js','build_js','build_html');
});




gulp.task('observe', ['build'], function() {
    
    var bs1 = browserSync.create("frontend");
    
    bs1.init({
        notify: false,
        open: false,
        port: 3000,
        server: {
            baseDir: ['./build']
        }
    });
    
    gulp.watch(['./resources/**/*.less'], ['build_css', bs1.reload]);
    gulp.watch(['./resources/**/*.js']  , ['build_js', bs1.reload]);
    gulp.watch(['./resources/**/*.html'], ['build_html', bs1.reload]);
    
    
    nodemon({ script: 'server.js',
        ext: 'js',
        tasks: ['build_node_js'],
        watch: ['./server']
    })
});


gulp.task('default', ['observe']);



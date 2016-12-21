var gulp                 = require('gulp');
var connect            = require('gulp-connect');
var less                 = require('gulp-less');
var gutil                = require('gulp-util');
var concat              = require('gulp-concat');
var inject             = require('gulp-inject');
var rename             = require("gulp-rename");
var browserSync    = require('browser-sync').create();
var modRewrite     = require('connect-modrewrite');
var wiredep            = require('wiredep');
var LessAutoprefix = require('less-plugin-autoprefix');
var uglify = require('gulp-uglify');
var babel = require("gulp-babel");
var gulpif = require('gulp-if');
var addSrc = require('gulp-add-src');
var autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });

// ENV Variables
var ENVIRONMENTS = {
    local:      'local',
    develop:    'develop',
    production: 'production'
};

//----------------------------------------------------//
// Args:                                              //
//   --useMin => Minify js and css                    //
//   --maps   => Build srcmaps and link js files      //
//                                                    //
//----------------------------------------------------//

var argv = require('yargs')
    .default('environment', ENVIRONMENTS.develop).argv;
if (argv[ENVIRONMENTS.production]) {
    argv.environment = ENVIRONMENTS.production;
} else if (argv[ENVIRONMENTS.develop]){
    argv.environment = ENVIRONMENTS.develop;
} else if (argv[ENVIRONMENTS.local]){
    argv.environment = ENVIRONMENTS.local;
}


var paths = {
    js:     [
        'src/app/app.module.js',
        'src/app/app.config.js',
        'src/app/app.routes.js',
        'src/app/**/*.module.js',
        'src/app/**/*.js'
    ],
    html: ['src/index.html', 'src/app/**/*.html'],
    less: ['src/**/*.less'],
    css:  ['src/assets/css/*.css'],
    img:  ['src/assets/img/**/*.*'],
    fonts:['src/assets/fonts/**/*.*'],
    index: ['src/index.html.dist']
};

var log = function(msg) {
    return function() {
        gutil.log(msg)
    };
};

// Static Server
gulp.task('connect', function() {
    return browserSync.init({
        server: {
            baseDir: './src',
            middleware: [modRewrite(['^([^.]+)$ /index.html [L]'])]
        },
        open: false,
        port: 3000,
        notify: false
    });
});

// Inject css, js and bower dependencies into index.html file
gulp.task('inject', function() {
    var filesToInject = gulp.src(paths.js)
                            .pipe(babel())
                            .pipe(addSrc.prepend(wiredep({}).js))
                            .pipe(gulpif(argv.useMin, concat('app.main.js')))
                            .pipe(gulpif(argv.useMin, uglify()))
                            .pipe(gulp.dest('./src/dist'))
                            .pipe(addSrc(wiredep({}).css).pipe(gulpif(argv.useMin, concat('vendors.css'))).pipe(gulp.dest('src/dist')))
                            .pipe(addSrc.append(paths.css));

    return gulp
        .src(paths.index)
        .pipe(inject(filesToInject, { read: false, ignorePath: 'src' }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('src'));
});


// Compile less into CSS & auto-inject into browsers
gulp.task('less', function() {
    return gulp
        .src(['src/less/application.less'])
        .pipe(less({
                plugins: [autoprefix]
        }))
        .pipe(gulp.dest('src/assets/css'))
        .on('end', log('Compiled less files'))
        .pipe(browserSync.stream())
        .on('end', log('Reloaded by changes on css'));
});

gulp.task('less:watch', function() {
    return gulp.watch(paths.less, ['less', 'inject']);
});

gulp.task('js', function() {
    return gulp
        .src(paths.js)
        .pipe(babel())
        .pipe(gulpif(argv.maps, sourcemaps.write('./maps')))
        .pipe(connect.reload())
        .on('end', log('Reloaded by changes on js'));
});

gulp.task('js:watch', function() {
    return gulp
        .watch(paths.js, ['js', 'inject'])
        .on('change', browserSync.reload);
});

gulp.task('html', function() {
    return gulp
        .src(paths.html)
        .pipe(connect.reload())
        .on('end', log('Reloaded by changes on html'));
});

gulp.task('index:watch', function() {
    return gulp
        .watch(paths.index, ['inject'])
        .on('change', browserSync.reload);
});

gulp.task('html:watch', function() {
    return gulp
        .watch(paths.html)
        .on('change', browserSync.reload);
});

gulp.task('bower:watch', function() {
    return gulp.watch(['bower.json'], ['inject']);
});

// Main tasks
gulp.task('build', [
    'less',
    'inject'
]);

gulp.task('serve', [
    'build',
    'connect',
    'js:watch',
    'less:watch',
    'html:watch',
    'bower:watch',
    'index:watch'
]);

gulp.task('default', ['serve']);
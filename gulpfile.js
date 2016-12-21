var gulp          = require('gulp');
var connect       = require('gulp-connect');
var less          = require('gulp-less');
var gutil         = require('gulp-util');
var flatten       = require('gulp-flatten');
var concat        = require('gulp-concat');
var inject        = require('gulp-inject');
var clean         = require('gulp-clean');
var cleanCSS      = require('gulp-clean-css');
var rename        = require("gulp-rename");
var browserSync   = require('browser-sync').create();
var modRewrite    = require('connect-modrewrite');
var wiredep       = require('wiredep');
var sourcemaps    = require('gulp-sourcemaps');
var LessAutoprefix = require('less-plugin-autoprefix');
var uglify = require('gulp-uglify');
var babel = require("gulp-babel");
var gulpif = require('gulp-if');
var addSrc = require('gulp-add-src');
var runSequence = require('run-sequence');
var autoprefix = new LessAutoprefix({ browsers: ['last 3 versions'] });

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
    html: ['src/app/**/*.html'],
    less: ['src/**/*.less'],
    css:  ['dist/application.css'],
    img:  ['src/assets/img/**/*'],
    assets: ['src/assets/**/*'],
    fonts:['src/assets/fonts/**/*.*'],
    index: ['src/index.html.dist'],
    dist: './dist',
    distJs: [
        'dist/app.module.js',
        'dist/app.config.js',
        'dist/app.routes.js',
        'dist/**/*.module.js',
        'dist/**/*.js'
    ],
    distCss: ['dist/**/*.css']
};

var log = function(msg) {
    return function() {
        gutil.log(msg)
    };
};

gulp.task('clean', function() {
    return gulp.src(paths.dist + '/')
        .pipe(clean({force: true}));
});

// Static Server
gulp.task('connect', function() {
    return browserSync.init({
        server: {
            baseDir: paths.dist,
            middleware: [modRewrite(['^([^.]+)$ /index.html [L]'])]
        },
        open: false,
        port: 3000,
        notify: false
    });
});

// Inject css, js and bower dependencies into index.html file
gulp.task('inject', function() {
    var appFiles = gulp.src([].concat(paths.distCss, paths.distJs));
    var vendorJs = gulp.src(wiredep({}).js)
        .pipe(gulpif(argv.useMin, concat('vendors.js')))
        .pipe(gulpif(argv.useMin, uglify()))
        .pipe(gulp.dest(paths.dist));

    var vendorCss = gulp.src(wiredep({}).css)
        .pipe(gulpif(argv.useMin, concat('vendors.css')))
        .pipe(gulpif(argv.useMin, cleanCSS({compatibility: 'ie8'})))
        .pipe(gulp.dest(paths.dist));


    return gulp
        .src(paths.index)
        .pipe(inject(vendorJs, { read: false, ignorePath: 'dist', name: 'vendor'}))
        .pipe(inject(vendorCss, { read: false, ignorePath: 'dist', name: 'vendor'}))
        .pipe(inject(appFiles, { read: false, ignorePath: 'dist' }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('assets', ['fonts'], function () {
    gulp.src(paths.assets)
        .pipe(gulp.dest(paths.dist + '/assets'));
});

gulp.task('fonts', function () {
    var vendorFonts = [
        'vendor/**/*.eot',
        'vendor/**/*.svg',
        'vendor/**/*.ttf',
        'vendor/**/*.woff',
        'vendor/**/*.woff2'
    ];

    gulp.src(vendorFonts)
        .pipe(flatten())
        .pipe(gulp.dest(paths.dist + '/fonts'));
});


// Compile less into CSS & auto-inject into browsers
gulp.task('less', function() {
    gulp
        .src(['src/less/application.less'])
        .pipe(less({
                plugins: [autoprefix]
        }))
        .pipe(gulp.dest(paths.dist))
        .on('end', log('Compiled less files'))
        .pipe(gulpif(argv.useMin, concat('application.css')))
        .pipe(gulpif(argv.useMin, cleanCSS({compatibility: 'ie8'})))
        .pipe(gulp.dest(paths.dist))
        .pipe(connect.reload())
        .on('end', log('Reloaded by changes on css'))

});

gulp.task('less:watch', function() {
    return gulp.watch(paths.less, ['less', 'inject']);
});

gulp.task('js', function() {
    return gulp.src(paths.js)
        .pipe(babel())
        .pipe(gulpif(argv.useMin, concat('app.main.js')))
        .pipe(gulpif(argv.useMin, sourcemaps.write(paths.dist + '/maps')))
        .pipe(gulpif(argv.useMin, uglify()))
        .pipe(gulp.dest(paths.dist))
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
        .pipe(gulp.dest(paths.dist))
        .on('end', log('Reloaded by changes on html'));
});

gulp.task('index:watch', function() {
    return gulp
        .watch(paths.index, ['inject'])
        .on('change', browserSync.reload);
});

gulp.task('html:watch', function() {
    return gulp
        .watch(paths.html, ['html'])
        .on('change', browserSync.reload);
});

gulp.task('bower:watch', function() {
    return gulp.watch(['bower.json'], ['inject']);
});

// Main tasks
gulp.task('build', ['clean'], function () {
    runSequence(['js', 'less', 'html', 'assets'], 'inject');
});

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
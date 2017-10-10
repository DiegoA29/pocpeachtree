/////////////////////  SCRIPTS & STYLESHEETS TO LOAD  ////////////////////

var propietaryStylesheets = [
    "app/styles/styles.css"];

var thirdPartyStylesheets = [
    "bower_components/bootstrap/dist/css/bootstrap.min.css",
    "bower_components/bootstrap/dist/css/bootstrap-theme.min.css",
    "bower_components/sweetalert/dist/sweetalert.css"
];

var propietaryScripts = [
    "app/common/module.js",
    "app/common/services/utilsService.js",
    "app/common/filters/searchFilter.js",
    "app/transactions/module.js",
    "app/transactions/service.js",
    "app/transactions/controller.js",
    "app/app.js"
];

var thirdPartyScripts = [
    "bower_components/jquery/dist/jquery.min.js",
    "bower_components/angular/angular.min.js",
    "bower_components/bootstrap/dist/js/bootstrap.min.js",
    "bower_components/angular-ui-router/release/angular-ui-router.min.js",
    "bower_components/angular-bootstrap/ui-bootstrap.min.js",
    "bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
    "bower_components/angular-touch/angular-touch.min.js",
    "bower_components/moment/min/moment.min.js",
    "bower_components/format-as-currency/dist/format-as-currency.js",
    "bower_components/sweetalert/dist/sweetalert.min.js",
    "bower_components/ng-sweet-alert/ng-sweet-alert.js"
];

var remoteStylesheets = [
    'https://fonts.googleapis.com/css?family=Kanit'];

///////////////////  END SCRIPTS & STYLESHEETS TO LOAD  ///////////////////

/////////////////////  DEPLOYMENT  /////////////////////

var allScripts = thirdPartyScripts.concat(propietaryScripts);
var allStylesheets = thirdPartyStylesheets.concat(propietaryStylesheets);

var filesToDeploy = [
    'mock/*',
    'app/styles/icons/*',
    'app/styles/imgs/*',
    'app/transactions/*.html'
];

///////////////////  END DEPLOYMENT  ///////////////////

var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify-es').default,
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    del = require('del'),
    gulpif = require('gulp-if'),
    lazypipe = require('lazypipe'),
    streamqueue = require('streamqueue'),
    htmlreplace = require('gulp-html-replace'),
    argv = require('yargs').argv,
    debug = require('gulp-debug'),
    header = require('gulp-header'),
    stripLine = require('gulp-strip-line'),
    open = require('gulp-open'),
    gutil = require('gulp-util'),
    uglifycss = require('gulp-uglifycss');


// MAIN TASK
// Usage Example: "gulp build"
gulp.task('build', ['deploy'], function () {
    return gulp.src('').pipe(open({ uri: 'http://localhost/dist/index.html' }));
});

///////////////////  "SUB-TASKS"  ///////////////////

gulp.task('deploy', ['build-index.html'], function () {
    // the base option sets the relative root for the set of files,
    // preserving the folder structure
    return gulp.src(filesToDeploy, { base: './app' })
        .pipe(debug({ title: 'deploy:' }))
        .pipe(gulp.dest('dist/app/'));
});

gulp.task('build-index.html', ['scripts', 'css'], function () {
    var defaultReplaceOptions = {
        keepUnassigned: true,
        keepBlockTags: true,
        resolvePaths: true
    };

    return gulp.src('index.html')
        .pipe(htmlreplace({ js: 'app/js/scripts.js' }, defaultReplaceOptions))
        .pipe(htmlreplace({ remotecss: { src: remoteStylesheets, tpl: '<link rel="stylesheet" type="text/css" href="%s" />' } }, defaultReplaceOptions))
        .pipe(htmlreplace({ css: 'app/styles/css.min.css' }, defaultReplaceOptions))
        .pipe(gulp.dest('dist/'));
});

gulp.task('scripts', function () {
    var getScriptTasks = function (bundleName) {
        return lazypipe()
            .pipe(concat, bundleName)
            .pipe(gulp.dest, 'dist/app/js')();
    };

    return streamqueue({ objectMode: true },
        // third-party scripts
        gulp.src(thirdPartyScripts)
            .pipe(getScriptTasks('thirdParty.js'))
            .pipe(notify({ message: '[JS] Third party scripts generation completed. Please wait...', onLast: true }))

        ,

        // app scripts
        gulp.src(propietaryScripts)
            .pipe(getScriptTasks('main.js'))
            .pipe(notify({ message: '[JS] Propietary scripts generation completed. Please wait...', onLast: true }))

    ).pipe(concat('scripts.js' ))
        .pipe(gulp.dest('dist/app/js'))
        //.pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/app/js'))
        .pipe(gulp.dest('dist/resources'))
        .pipe(notify({ message: '[JS] Finished. All scripts generated.', onLast: true }));
});

gulp.task('css', function () {
    var getCssTasks = function (bundleName) {
        return lazypipe()
            .pipe(concat, bundleName)
            .pipe(gulp.dest, 'dist/app/styles')();
    };

    return streamqueue({ objectMode: true },
        // third-party stylesheets
        gulp.src(thirdPartyStylesheets)
            .pipe(getCssTasks('thirdParty.css'))
            .pipe(notify({ message: '[CSS] Bower css generation completed. Please wait...', onLast: true }))

        ,

        // app stylesheets
        gulp.src(propietaryStylesheets)
            .pipe(getCssTasks('main.css'))
            .pipe(notify({ message: '[CSS] Propietary css generation completed. Please wait...', onLast: true }))
    )
    .pipe(concat('css.css'))
    .pipe(gulp.dest('dist/app/styles'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglifycss())
    .pipe(gulp.dest('dist/app/styles'))
    .pipe(gulp.dest('dist/app/styles'))
    .pipe(notify({ message: '[CSS] Finished. All css generated.', onLast: true }));
});

///////////////////  END "SUB-TASKS"  ///////////////////
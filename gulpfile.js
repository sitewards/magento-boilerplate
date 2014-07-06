var gulp = require('gulp');

var less       = require('gulp-less');
var minifycss  = require('gulp-minify-css');
var bless      = require('gulp-bless');

var jshint     = require('gulp-jshint');
var concat     = require('gulp-concat');
var uglify     = require('gulp-uglify');

var notify     = require('gulp-notify');
var clean      = require('gulp-clean');
var livereload = require('gulp-livereload');

var sCustomTheme = 'xyz/';
var oPath = {
    sBasePath: "src/skin/frontend/boilerplate/",
    sDefaultTheme: "default/",
    sLess: "less/style.less",
    sJs: "js/script.js"
}

var getPath = function (sCustomTheme, sPart) {
    var sTheme = (sCustomTheme !== '') ? sCustomTheme : oPath.sDefaultTheme;
    return oPath.sBasePath + sTheme + oPath[sPart];
}

// LESS
gulp.task('less', function() {
    return gulp.src( oPath.sBasePath + oPath.sDefault + oPath.sLess)
        .pipe(less().on('error', notify.onError(function (error) {
            return 'Error compiling LESS: ' + error.message;
        })))
        .pipe(minifycss())
        .pipe(bless({
            imports: true
        }))
        .pipe(gulp.dest(oPath.sDefault + 'dist/css'))
        .pipe(livereload())
        .pipe(notify({
            message: 'Successfully compiled LESS'
        }));
});

// JavaScript
gulp.task('js', function() {
    return gulp.src([
            oPath.sDefault + oPath.sJs
        ])
        .pipe(concat('script.js'))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify())
        .pipe(gulp.dest(oPath.sDefault + 'dist/js'))
        .pipe(livereload())
        .pipe(notify({
            message: 'Successfully compiled JS'
        }));
});

// Bootstrap JavaScript
gulp.task('bootstrapJs', function() {
    return gulp.src([
            'bower_components/bootstrap/js/transition.js',
            'bower_components/bootstrap/js/collapse.js',
            'bower_components/bootstrap/js/carousel.js',
            'bower_components/bootstrap/js/dropdown.js',
            'bower_components/bootstrap/js/modal.js'
        ])
        .pipe(concat('bootstrap.js'))
        .pipe(uglify())
        .pipe(gulp.dest('src/js/bootstrap'))
        .pipe(livereload())
        .pipe(notify({
            message: 'Successfully compiled Bootstrap JS'
        }));
});

// jQuery
gulp.task('jQuery', function(){
    gulp.src('bower_components/jquery/dist/jquery.min.js')
        .pipe(gulp.dest('src/js/jquery'));
});

// Bootstrap Fonts
gulp.task('bootstrapFonts', function(){
    gulp.src('bower_components/bootstrap/fonts/*')
        .pipe(gulp.dest('src/skin/frontend/boilerplate/default/dist/fonts/bootstrap/'));

    gulp.src('bower_components/bootstrap/fonts/*')
        .pipe(gulp.dest('src/skin/frontend/boilerplate/default/dist/fonts/font-awesome/'));
});

// Task section:
// --------------------------------------

// Clean
gulp.task('clean', function() {
    return gulp.src(['dist/css', 'dist/js'], {read: false})
        .pipe(clean());
});

// Init task to have working bootstrap js parts, jquery and bootstrap fonts
gulp.task('init', ['clean'], function() {
    gulp.run('jQuery', 'bootstrapFonts', 'bootstrapJs', 'less', 'js');
});

// Watch
gulp.task('watch', function() {
    // Watch .less files
    gulp.watch('less/**/*.less', ['less']);
    // Watch .js files
    gulp.watch('js/**/*.js', ['lint', 'js']);
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.run('less', 'js', 'watch');
});
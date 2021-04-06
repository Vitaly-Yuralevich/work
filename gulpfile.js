var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    webp = require('gulp-webp'),
    svgstore = require('gulp-svgstore'),

    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    csso = require('gulp-csso'),

    posthtml = require('gulp-posthtml'),
    include = require('posthtml-include'),
    server = require("browser-sync").create(),

    minify = require('gulp-minify'),
    concat = require('gulp-concat');

del = require("del");

gulp.task('sass', function() {
    return gulp.src('www/sass/main.scss')
        .pipe(sass())
        .pipe(gulp.dest('dist/css'))
});

gulp.task('css', function() {

    return gulp.src('dist/css/main.css')
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(gulp.dest("dist/css"))
        .pipe(csso())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest('dist/css'));

});

gulp.task('images', function() {
    return gulp.src('www/images/*.{png,jpg}')
        .pipe(imagemin([
            imagemin.optipng({ optimizationLevel: 3 }),
            imagemin.mozjpeg({ progressive: true })
        ]))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('webp', function() {

    return gulp.src('www/images/*.{png,jpg}')
        .pipe(webp({ quality: 90 }))
        .pipe(gulp.dest('dist/images'));

});

gulp.task('sprite', function() {

    return gulp.src('www/images/*.svg')
        .pipe(svgstore({
            inlineSvg: true
        }))
        .pipe(rename('sprite.svg'))
        .pipe(gulp.dest('dist/images'));

});

gulp.task('html', function() {

    return gulp.src('www/*.html')
        .pipe(posthtml([
            include()
        ]))
        .pipe(gulp.dest('dist'));

});

gulp.task('server', function() {

    server.init({
        server: 'dist'
    });

    gulp.watch('www/scss/**/*.scss', gulp.series('css'));
    gulp.watch('www/js/**/*.js', gulp.series('js'));
    gulp.watch('www/images/icon-*.svg', gulp.series('sprite', 'html'));
    gulp.watch('www/*.html', gulp.series('html', 'refresh'));

});

gulp.task('copy', function() {

    return gulp.src([
            'www/fonts/**/*.{woff,woff2}',

        ], {
            base: 'www'
        })
        .pipe(gulp.dest('dist/fonts'));

});

gulp.task('clean', function() {

    return del('dist');

});

gulp.task('js', function() {

    return gulp.src('www/js/*.js')
        .pipe(concat('main.js'))
        .pipe(minify({
            ext: {
                min: '.min.js'
            },
        }))
        .pipe(gulp.dest('dist/js'));
})

gulp.task('dist', gulp.series(
    'clean',
    'copy',
    'images',
    'css',
    'sprite',
    'webp',
    'html',
    'js'));

gulp.task('start', gulp.series('dist', 'server'));

gulp.task("refresh", function(done) {

    server.reload();
    done();

});
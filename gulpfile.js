var gulp = require('gulp'),
    sass = require('gulp-sass');




gulp.task('sass', function() {
    return gulp.src('app/sass/main.scss')
        .pipe(sass())
        .pipe(gulp.dest('dist/css'))
});
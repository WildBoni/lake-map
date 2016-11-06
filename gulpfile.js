// Include Gulp
var gulp = require('gulp');

gulp.task('default', function() {
   gulp.src('./bower_components/jquery/dist/jquery.js')
   .pipe(gulp.dest('./public/js/libraries'));
   gulp.src('./bower_components/knockout/dist/knockout.js')
   .pipe(gulp.dest('./public/js/libraries'));
});

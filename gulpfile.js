const gulp = require('gulp');
const inlinesource = require('gulp-inline-source');

gulp.task('build', () => {
  return gulp.src('./src/mirador-viewer.html')
    .pipe(inlinesource())
    .pipe(gulp.dest('./'));
});

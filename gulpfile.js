const gulp = require('gulp');
const inlinesource = require('gulp-inline-source');
const processhtml = require('gulp-processhtml');

gulp.task('build', () => {
  return gulp.src('./src/mirador-viewer.html')
    .pipe(processhtml({}))
    .pipe(inlinesource())
    .pipe(gulp.dest('./'));
});

gulp.task('default', ['build']);

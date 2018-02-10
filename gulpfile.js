const gulp = require('gulp');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const notify = require('gulp-notify');
const include = require("gulp-include");
const server = require('browser-sync').create();
const browserSync = require('browser-sync');
reload = browserSync.reload;

// sass, scss compile
let processors = [
  autoprefixer({browsers: ['last 5 versions'], cascade: false})
];

gulp.task('sass', function() {
  return gulp
    .src('src/sass/*.{sass,scss}')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}))
    .on('error', notify.onError({
      title: 'Sass Error!',
      message: '<%= error.message %>'
    }))
    .pipe(postcss(processors))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build/css/'));
});

gulp.task('sass:watch', function() {
  gulp.watch('src/sass/**/*', ['sass']);
});
// html
gulp.task('html', function () {
  gulp.src('src/[^_]*.html')
    .pipe(include())
    .on('error', function(){notify("HTML include error");})
    .pipe(gulp.dest('build/'))
    .pipe(reload({stream: true}));
});

gulp.task('html:watch', function() {
  gulp.watch([
    'src/*.html'
  ], ['html']);
});

//webserver
gulp.task('server', function() {
  server.init({
    server: {
      baseDir: 'build/'
    },
    files: ['build/*.html', 'build/css/*.css', 'build/js/*.js'],
    port: 8080,
    notify: false,
    ghostMode: false,
    online: false,
    open: true
  });
});

gulp.task('watch', [
  'sass:watch',
  'html:watch'
]);

gulp.task('default', ['server', 'watch'], function() {});
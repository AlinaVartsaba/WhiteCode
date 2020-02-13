const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const concat = require('gulp-concat');
const uglify = require('gulp-uglifyjs');
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const del = require('del');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const cache = require('gulp-cache');
const autoprefixer = require('gulp-autoprefixer');
const { src, dest, parallel, series, watch } = require('gulp');

function scss() {
  return src('src/sass/**/*.scss')
    .pipe(sass())
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
      cascade: true
    }))
    .pipe(dest('src/css'))
    .pipe(browserSync.reload( {stream: true}));
}

function scripts() {
  return src('src/libs/jquery/dist/jquery.min.js', { allowEmpty: true })
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(dest('src/js'));
}

// BrowserSync
function browsersync(cb) {
  browserSync({
    server: {
      baseDir: 'src'
    },
    notify: false
  });
  cb();
}

function browserReload(cb) {
  clearCache();
  browserSync.reload();
  cb();
}

function clean() {
  return del('dist');
}

function clearCache() {
  return cache.clearAll();
}

function img() {
  return src('src/img/**')
    .pipe(cache(imagemin({
      interlaced: true,
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    })))
    .pipe(dest('dist/img'));
}

function watchFiles(cb) {
  watch(['src/sass/**/*.scss'], parallel(scss));
  watch(['src/img/**'], series(img, browserReload));
  watch(['src/*.html', 'src/js/**/*.js'], series(browserReload));
  cb();
}

const build = gulp.series(clean, gulp.parallel(scss, img, scripts));


// exports.build = building;
exports.watch = series(clean, scss, img, scripts, browsersync, watchFiles);
exports.scss = scss;
exports.build = build;

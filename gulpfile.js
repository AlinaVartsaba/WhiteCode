const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const minify = require("gulp-minify");

const htmlSrc = "./src/*.html";
const styleSrc = "./src/sass/*.scss";
const jsSrc = "./src/js/*.js";

const htmlDest = "./dist/";
const styleDest = "./dist/css/";
const jsDest = "./dist/js/";

// ############################
// Tasks
// ############################

function browser_sync() {
    browserSync.init({
        server: {
            baseDir: "./dist/"
        }
    });
}

function reload(done) {
    browserSync.reload();
    done();
}

function css() {
    return gulp
        .src(styleSrc)
        .pipe(
            sass({
                errLogToConsole: true,
                outputStyle: "compressed"
            })
        )
        .on("error", console.error.bind(console))
        .pipe(gulp.dest(styleDest))
        .pipe(browserSync.stream());
}

function html() {
    return gulp.src(htmlSrc).pipe(gulp.dest(htmlDest));
}

function js() {
    return gulp
        .src(jsSrc)
        .pipe(minify())
        .pipe(gulp.dest(jsDest));
}

function watch_files() {
    gulp.watch(styleSrc).on("change", gulp.series(css, reload));
    gulp.watch(htmlSrc).on("change", gulp.series(html, reload));
    gulp.watch(jsSrc).on("change", gulp.series(js, reload));
}

gulp.task("css", css);
gulp.task("html", html);
gulp.task("js", js);

// Default task: watch and build
gulp.task("default", gulp.parallel(css, html, js, browser_sync, watch_files));

// Build project to dist/
gulp.task("build", gulp.series(css, html, js));

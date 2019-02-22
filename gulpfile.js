const { watch, src, dest, parallel } = require("gulp");
var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");

sass.compiler = require("node-sass");

function css() {
  return src("./css/main.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(sourcemaps.write())
    .pipe(dest("./css"));
}
watch("./css/**/*.scss", css);
exports.css = css;
exports.default = parallel(css);

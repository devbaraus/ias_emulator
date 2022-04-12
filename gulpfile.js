const { src, dest, series, watch } = require('gulp');
const del = require('del');
const njk = require('gulp-nunjucks-render');
const beautify = require('gulp-beautify');
const postcss = require('gulp-postcss');
const csso = require('gulp-csso');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify');

function clean() {
  return del(['dist']);
}

function html() {
  return (
    src('src/html/pages/*.+(html|njk)')
      .pipe(
        njk({
          path: ['src/html'],
        })
      )
      .pipe(
        htmlmin({
          collapseWhitespace: true,
          removeComments: true,
        })
      )
      // .pipe(beautify.html({ indent_size: 4, preserve_newlines: false }))
      .pipe(dest('dist'))
  );
}

function js() {
  return src('./src/js/**/*.js').pipe(uglify()).pipe(dest('dist/js'));
}

function image() {
  return src('./src/img/**/*').pipe(dest('dist/img'));
}

function css() {
  return src('src/css/*.scss')
    .pipe(
      sass({
        // outputStyle: 'nested',
        precision: 10,
        includePaths: ['.'],
        onError: console.error.bind(console, 'Sass error:'),
      })
    )
    .pipe(postcss([require('tailwindcss'), require('autoprefixer')]))
    .pipe(csso())
    .pipe(dest('dist/css'));
}

function watchFiles() {
  watch('src/html/**/*', html);
  watch('src/css/*.scss', css);
  watch('src/js/*.js', js);
  watch('src/img/**/*', image);
  watch('dist/*.html', css);
}

exports.build = series(clean, image, html, js, css);
exports.default = series(clean, image, html, js, css, watchFiles);

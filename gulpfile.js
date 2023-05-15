import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgo';
import svgstore from 'gulp-svgstore';
import { stacksvg } from 'gulp-stacksvg';
import {deleteAsync} from 'del';

// Styles
const styles = () => {
  return gulp.src('source/less/style.less', { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// HTML

const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build'));
}

// Scripts

const scripts = () => {
  return gulp.src('source/js/*.js')
  .pipe(terser())
  .pipe(gulp.dest('build/js'));
}

//Images

const optimizeImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(squoosh())
  .pipe(gulp.dest('build/img'));
}

const copyImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(gulp.dest('build/img'));
}

// WebP

const createWebpIndex = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(squoosh({
    webp: {}
  }))
  .pipe(gulp.dest('build/img'));
}

//const createWebpCatalog = () => {
//  return gulp.src('source/img/catalog/*.{jpg,png}')
//  .pipe(squoosh({
//    webp: {}
//  }))
//  .pipe(gulp.dest('build/img/catalog'));
//}

//Svg
function makeSvgo() {
  return gulp.src('source/img/*svg', '!source/img/icon/*svg', '!source/img/logo/*svg')
    .pipe(svgo());
}

//stak
const { src, dest } = gulp

function makeStack () {
	return src('source/img/icons/*.svg')
    .pipe(svgo())
		.pipe(stacksvg({ output: 'stak' }))
		.pipe(dest('build/img/icons'));
}
function makeStackLogo () {
	return src('source/img/logo/*.svg')
    .pipe(svgo())
		.pipe(stacksvg({ output: 'stak' }))
		.pipe(dest('build/img/logo'));
}
//Sprite
const makeSprite = () => {
  return gulp.src('source/img/*svg')
  .pipe(svgstore({
    inLineSvg: true
  }))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img'));
}

//Copy

const copy = (done) => {
  gulp.src([
    'source/fonts/**/*.{woff2,woff}',
    'source/*.ico',
    'source/manifest.webmanifest',
    'source/img/favicons/*.{png,svg,ico}',
  ], {
    base: 'source'
  })
  .pipe(gulp.dest('build'))
  done();
}

//Clean

const clean = () => {
  return deleteAsync('build');
};
// Server


const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

//Reload
const reload = (done) => {
  browser.reload();
  done();
}
// Watcher

const watcher = () => {
  gulp.watch('source/less/**/*.less', gulp.series(styles));
  gulp.watch('source/js/script.js', gulp.series(scripts));
  gulp.watch('source/*.html', gulp.series(html, reload));
}

//Build

export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    makeSvgo,
    makeStackLogo,
    makeSprite,
    makeStack,
    createWebpIndex,
  //  createWebpCatalog
  ),
);

//Default

export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    makeSvgo,
    makeStackLogo,
    makeSprite,
    makeStack,
    createWebpIndex,
  //  createWebpCatalog
  ),
  gulp.series(
    server,
    watcher
  ));

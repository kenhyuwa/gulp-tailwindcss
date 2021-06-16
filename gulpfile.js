const { src, dest, task, watch, series, parallel } = require('gulp')
const del = require('del')
const options = require('./config')
const browserSync = require('browser-sync').create()

const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const concat = require('gulp-concat')
const uglify = require('gulp-terser')
const imagemin = require('gulp-imagemin')
const cleanCSS = require('gulp-clean-css')
const purgeCSS = require('gulp-purgecss')
const logSymbols = require('log-symbols')
const panini = require('panini')
const browserify = require('browserify')
const babelify = require('babelify')
const source = require('vinyl-source-stream')
const eslint = require('gulp-eslint')

function livePreview(done) {
  browserSync.init({
    server: {
      baseDir:
        process.env.NODE_ENV === 'production'
          ? options.paths.build.base
          : options.paths.dist.base,
    },
    port: options.config.port || 5000,
  })
  done()
}

function previewReload(done) {
  console.log('\n\t' + logSymbols.info, 'Reloading Browser Preview.\n')
  browserSync.reload()
  done()
}

function compileHTML() {
  console.log('\n\t' + logSymbols.info, 'Compiling HTML..\n')
  panini.refresh()
  return src('src/pages/**/*.html')
    .pipe(
      panini({
        root: 'src/pages/',
        layouts: 'src/layouts/',
        partials: 'src/partials/',
        helpers: 'src/helpers/',
        data: 'src/data/',
      })
    )
    .pipe(
      process.env.NODE_ENV === 'production'
        ? dest(options.paths.build.base)
        : dest(options.paths.dist.base)
    )
    .pipe(browserSync.stream())
}

function compileCSS() {
  console.log('\n\t' + logSymbols.info, 'Compiling CSS..\n')
  if (process.env.NODE_ENV === 'production') {
    return src(`${options.paths.dist.css}/**/*`)
      .pipe(
        purgeCSS({
          content: ['src/**/*.{html,js}'],
          defaultExtractor: (content) => {
            const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []
            const innerMatches =
              content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || []
            return broadMatches.concat(innerMatches)
          },
        })
      )
      .pipe(
        cleanCSS({ compatibility: 'ie8', level: { 1: { specialComments: 0 } } })
      )
      .pipe(concat({ path: 'app.css' }))
      .pipe(dest(options.paths.build.css))
  } else {
    return src(`${options.paths.src.css}/**/*.scss`)
      .pipe(sass().on('error', sass.logError))
      .pipe(dest(options.paths.src.css))
      .pipe(
        postcss([
          require('tailwindcss')(options.config.tailwindJS),
          require('autoprefixer'),
        ])
      )
      .pipe(concat({ path: 'app.css' }))
      .pipe(dest(options.paths.dist.css))
  }
}

function compileJS() {
  console.log('\n\t' + logSymbols.info, 'Compiling JS..\n')
  return browserify({
    entries: [`${options.paths.src.js}/main.js`],
    transform: [babelify.configure({ presets: ['@babel/preset-env'] })],
  })
    .bundle()
    .pipe(source('app.js'))
    .pipe(
      process.env.NODE_ENV === 'production'
        ? dest(options.paths.build.js)
        : dest(options.paths.dist.js)
    )
}

function copyIMAGES() {
  console.log('\n\t' + logSymbols.info, 'Copy Image..\n')
  if (process.env.NODE_ENV === 'production') {
    return src(`${options.paths.src.img}/**/*`)
      .pipe(imagemin())
      .pipe(dest(options.paths.build.img))
  } else {
    return src(`${options.paths.src.img}/**/*`).pipe(
      dest(options.paths.dist.img)
    )
  }
}

function copyData() {
  return src([`${options.paths.src.data}/**/*`]).pipe(
    process.env.NODE_ENV === 'production'
      ? dest(options.paths.build.data)
      : dest(options.paths.dist.data)
  )
}

function watchFiles() {
  watch(
    `${options.paths.src.base}/**/*.html`,
    series(compileHTML, compileCSS, previewReload)
  )
  watch(
    [options.config.tailwindJS, `${options.paths.src.css}/**/*.scss`],
    series(compileHTML, compileCSS, previewReload)
  )
  watch(`${options.paths.src.js}/**/*.js`, series(compileJS, previewReload))
  watch(`${options.paths.src.img}/**/*`, series(copyIMAGES, previewReload))
  watch(`${options.paths.src.data}/**/*`, series(copyData, previewReload))
  // watch('src/**/*.{js,html,scss}', lint)
  console.log('\n\t' + logSymbols.info, 'Watching for Changes..\n')
}

function clean() {
  if (process.env.NODE_ENV === 'production') {
    console.log(
      '\n\t' + logSymbols.info,
      'Cleaning build folder for fresh start.\n'
    )
    return del([options.paths.build.base])
  } else {
    console.log(
      '\n\t' + logSymbols.info,
      'Cleaning dist folder for fresh start.\n'
    )
    return del([options.paths.dist.base])
  }
}

function buildFinish(done) {
  console.log(
    '\n\t' + logSymbols.info,
    `Production build is complete. Files are located at ${options.paths.build.base}\n`
  )
  done()
}

function lint() {
  return src(['src/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
}

exports.default = series(
  clean,
  parallel(compileCSS, compileJS, copyIMAGES, compileHTML, copyData),
  livePreview,
  watchFiles
)

exports.build = series(
  clean,
  parallel(compileCSS, compileJS, copyIMAGES, compileHTML, copyData),
  buildFinish
)

exports.start = series(livePreview)

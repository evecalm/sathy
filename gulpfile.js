pkg    = require('./package.json')
gulp   = require('gulp')
util   = require('gulp-util')
coffee = require('gulp-coffee')
header = require('gulp-header')
concat = require('gulp-concat')
uglify = require('gulp-uglify')
mocha  = require('gulp-mocha-phantomjs')
wrap = require('gulp-wrap-umd')

source = [
  'src/sathy.coffee',
  'src/util.coffee',
  'src/dom.coffee',
  'src/event.coffee',
  'src/css.coffee',
  'src/exports.coffee'
]

banner = function() {
  return [
    '// Sathy.js',
    '// version: ' + pkg.version,
    '// author: ' + pkg.author,
    '// license: ' + pkg.licenses[0].type
  ].join('\n') + '\n'
}

gulp.task('default', function() {
  compiled = gulp.src(source)
    .pipe(concat('sathy.js'))
    .pipe(coffee({bare: true}).on('error', util.log))
    .pipe(wrap({
      namespace: 'Sathy',
      deps: [{name: 'window', globalName: 'window', paramName: 'root'}],
      exports: 'Sathy'
    }))
    .pipe(header(banner()))
    .pipe(gulp.dest('dist'))

  compiled.pipe(concat('sathy.min.js'))
    .pipe(uglify())
    .pipe(header(banner()))
    .pipe(gulp.dest('dist'))
})

// gulp.task('spec', function() {
//   gulp.src('spec/runner.html')
//     .pipe(mocha({reporter: 'dot'}))
// })

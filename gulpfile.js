// native
var fs = require('fs');

// 3rd party
var gulp = require('gulp');
var shell = require('shelljs');
var tv4 = require('tv4');

// convenience
var plugins = require('gulp-load-plugins')();

// DRY
var pkg = require('./package.json');
var dirs = pkg['swev-configs'].dirs;

// ------

/**
 *
 * https://github.com/gulpjs/gulp/tree/master/docs/recipes
 * http://blog.nodejitsu.com/npmawesome-9-gulp-plugins/
 *
 */

// clean dirs.dist
gulp.task('clean', function () {
  return gulp.src([
    dirs.dist + '/js',
    dirs.dist + '/json',
    dirs.dist + '/css'
  ], {read: false})
    .pipe(plugins.clean());
});

// lint scenes
gulp.task('lint:scenes', function () {
  return gulp.src([
    dirs.scenes + '/*.json',
  ]).pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(plugins.jshint.reporter('fail'));
});


// lint js files
gulp.task('lint:js', function () {
  return gulp.src([
    'gulpfile.js',
     dirs.src + 'js/*.js',
  ]).pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(plugins.jshint.reporter('fail'));
});


// validate scene data
gulp.task('validate:scenes', function () {
  var schema = JSON.parse(fs.readFileSync(dirs.scenes + '/schema/scene-schema.json', {encoding: 'utf8'}));
  var isSceneJson = function(file) {
    return (file.match(/.json$/) && !file.match('schema\.json$'));
  };
  var sceneJsonPaths = shell.find('scenes').filter(isSceneJson);

  sceneJsonPaths.forEach(function(filePath) {
    var dataString = fs.readFileSync(filePath, {encoding: 'utf8'});
    if (dataString) {
      var result = tv4.validateResult(JSON.parse(dataString), schema);
      if (result.valid === false) {
        console.log(result.error);
      }
    }
  });
});


// combine scenes
gulp.task('build:scenes', function () {
  return gulp.src([
    dirs.scenes + '/*.json'
  ]).pipe(plugins.jsoncombine('scenes.js', function(data){
    return new Buffer(JSON.stringify(data));
  })).pipe(gulp.dest(dirs.dist + '/json'));
});


// build js
gulp.task('build:js', function(){
    return gulp.src([dirs.src + '/js/*.js'])
        .pipe(plugins.concat('main.js'))
        .pipe(gulp.dest(dirs.dist + '/js'))
        .pipe(plugins.uglify())
        .pipe(plugins.rename('main.min.js'))
        .pipe(gulp.dest(dirs.dist + '/js'));
});


// copy
gulp.task('copy', function () {
    gulp.src('./src/css/**/*')
        .pipe(gulp.dest('dist/css'));
});


// add dev server
gulp.task('server', function() {
  plugins.connect.server({
    root: 'dist'
  });
});


gulp.task('default', ['clean', 'lint:js', 'lint:scenes', 'validate:scenes', 'build:scenes', 'build:js', 'copy']);

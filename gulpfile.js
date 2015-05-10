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
  var schema = JSON.parse(fs.readFileSync(dirs.scenes + '/scene-schema.json', {encoding: 'utf8'}));
  var isSceneJson = function(file) {
    return (file.match(/.json$/) && !file.match("schema\.json$"));
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


gulp.task('default', ['lint:js', 'lint:scenes', 'validate:scenes']);

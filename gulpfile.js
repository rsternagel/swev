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
 * https://github.com/gulpjs/gulp/tree/master/docs/recipes
 * http://blog.nodejitsu.com/npmawesome-9-gulp-plugins/
 */

gulp.task('clean', function () {
  return gulp.src([
    dirs.dist + '/js',
    dirs.dist + '/json',
    dirs.dist + '/css'
  ], {read: false})
    .pipe(plugins.clean());
});


gulp.task('lint:scenes', function () {
  return gulp.src([
    dirs.scenes + '/*.json',
  ]).pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(plugins.jshint.reporter('fail'));
});


gulp.task('lint:js', function () {
  return gulp.src([
    'gulpfile.js',
     dirs.src + 'js/*.js',
  ]).pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(plugins.jshint.reporter('fail'));
});


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


gulp.task('build:scenes', function () {
  return gulp.src([
    dirs.scenes + '/*.json'
  ]).pipe(plugins.jsoncombine('scenes.js', function(data){
    return new Buffer(JSON.stringify(data));
  })).pipe(gulp.dest(dirs.dist + '/json'));
});


gulp.task('build:js', function(){
    return gulp.src([dirs.src + '/js/*.js'])
        .pipe(plugins.concat('main.js'))
        .pipe(gulp.dest(dirs.dist + '/js'))
        .pipe(plugins.uglify())
        .pipe(plugins.rename('main.min.js'))
        .pipe(gulp.dest(dirs.dist + '/js'));
});


gulp.task('build:css', function () {
    return gulp.src([
      'node_modules/normalize.css/normalize.css',
      dirs.src + '/css/main.css',
      dirs.src + '/css/map.css'
    ]).pipe(plugins.concat('main.css'))
      .pipe(gulp.dest(dirs.dist + '/css'))
      .pipe(plugins.sass({outputStyle: 'compressed'}).on('error', plugins.sass.logError))
      .pipe(plugins.rename('main.min.css'))
      .pipe(gulp.dest(dirs.dist + '/css'));
});


gulp.task('server', function() {
  plugins.connect.server({
    root: 'dist'
  });
});


gulp.task('default', ['clean', 'lint:js', 'lint:scenes', 'validate:scenes', 'build:js', 'build:scenes', 'build:css']);

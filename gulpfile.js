const gulp = require('gulp');
const gulpif = require('gulp-if');
const rename = require("gulp-rename");
const preprocess = require('gulp-preprocess');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const cssSlam = require('css-slam').gulp;
const htmlMinifier = require('gulp-html-minifier');
const HtmlSplitter = require('polymer-build').HtmlSplitter;

const mergeStream = require('merge-stream');
const forkStream = require('polymer-build').forkStream;

// build
gulp.task('build:dev', () => {
  // get sources
  const unprocessedSourcesSteam = gulp.src("./src/**/*");

  // run preprocessing for ES5
  const unprocessedSourcesSteamES5 = forkStream(unprocessedSourcesSteam);
  const processedES5Sources = unprocessedSourcesSteamES5
    .pipe(preprocess(
      {
        context: { NODE_ENV: 'dev', TO_ES5: true }
      }
    ));

  // run preprocessing for ES2015
  const unprocessedSourcesSteamES2015 = forkStream(unprocessedSourcesSteam);
  const processedES2015Sources = unprocessedSourcesSteamES2015
    .pipe(preprocess(
      {
        context: { NODE_ENV: 'dev' }
      }
    ));

  // compile sources (to ES5) and optimize files (ES5)
  const sourcesHtmlSplitterES5 = new HtmlSplitter();
  const sourcesStreamES5 = processedES5Sources
    .pipe(sourcesHtmlSplitterES5.split()) // split inline JS & CSS out into individual .js & .css files
    .pipe(gulpif(/\.js$/, babel(
      {
        presets: ['es2015'],
        // plugins: [
        //   "transform-custom-element-classes",
        //   "transform-es2015-classes"
        // ]
      }
    )))
    .pipe(sourcesHtmlSplitterES5.rejoin()); // rejoins those files back into their original location

  // optimize files (ES2015)
  const sourcesHtmlSplitterES2015 = new HtmlSplitter();
  const sourcesStreamES2015 = processedES2015Sources
    .pipe(sourcesHtmlSplitterES2015.split()) // split inline JS & CSS out into individual .js & .css files
    .pipe(sourcesHtmlSplitterES2015.rejoin()); // rejoins those files back into their original location

  // place source files in build directory (ES5)
  sourcesStreamES5
    .pipe(gulp.dest('./build/es5'));

  // place demo files in build directory (ES5)
  gulp.src('./demo/**/*')
    .pipe(preprocess(
      {
        context: { NODE_ENV: 'dev', TO_ES5: true }
      }
    ))
    .pipe(gulp.dest('./build/es5/demo'));

  // place source files in build directory (ES2015)
  sourcesStreamES2015
    .pipe(gulp.dest('./build/es2015'));

  // place demo files in build directory (ES2015)
  gulp.src('./demo/**/*')
    .pipe(preprocess(
      {
        context: { NODE_ENV: 'dev' }
      }
    ))
    .pipe(gulp.dest('./build/es2015/demo'));

  // gather dependencies
  const polymerDeps = gulp.src('./bower_components/polymer/**/*');
  const webcomponentsDeps = gulp.src('./bower_components/webcomponentsjs/**/*');
  const libDeps = gulp.src('./lib/**/*');
  const otherBowerDeps = gulp.src([
    './bower_components/**/*',
    '!' + './bower_components/polymer/**/*',
    '!' + './bower_components/webcomponentsjs/**/*'
  ], { base: 'bower_components' });

  // fork streams to prepare for transpiling
  const polymerDepsES5Stream = forkStream(polymerDeps);
  const webcomponentsDepsES5Stream = forkStream(webcomponentsDeps);
  const libDepsES5Stream = forkStream(libDeps);
  const otherBowerDepsES5Stream = forkStream(otherBowerDeps);

  const babelPresetES2015 = require('babel-preset-es2015'),
	      babelPresetES2015NoModules = babelPresetES2015.buildPreset({}, {modules: false});
  const polymerDepsHtmlSplitterES5 = new HtmlSplitter();
  polymerDepsES5Stream
    .pipe(polymerDepsHtmlSplitterES5.split())
		.pipe(gulpif( /\.js$/, babel(
      {
        "presets": [ babelPresetES2015NoModules ]
      }
    )))
		.pipe(polymerDepsHtmlSplitterES5.rejoin())
		.pipe(gulp.dest('./build/es5/bower_components/polymer'));

  const webcomponentDepsHtmlSplitterES5 = new HtmlSplitter();
  webcomponentsDepsES5Stream
    .pipe(webcomponentDepsHtmlSplitterES5.split())
		// .pipe(gulpif( /\.js$/, babel(
    //   {
    //     "presets": ['es2015']
    //   }
    // )))
		.pipe(webcomponentDepsHtmlSplitterES5.rejoin())
		.pipe(gulp.dest('./build/es5/bower_components/webcomponentsjs'));

  libDepsES5Stream
    .pipe(gulp.dest('./build/es5/lib'));
  otherBowerDepsES5Stream
    .pipe(webcomponentDepsHtmlSplitterES5.split())
    // .pipe(gulpif( /\.js$/, babel(
    //   {
    //     "presets": ['es2015']
    //   }
    // )))
    .pipe(webcomponentDepsHtmlSplitterES5.rejoin())
    .pipe(gulp.dest('./build/es5/bower_components'));

  // form steams to inject to build directory (ES2015)
  const polymerDepsES2015Stream = forkStream(polymerDeps);
  const webcomponentsDepsES2015Stream = forkStream(webcomponentsDeps);
  const libDepsES2015Stream = forkStream(libDeps);
  const otherBowerDepsES2015Stream = forkStream(otherBowerDeps);
  polymerDepsES2015Stream
    .pipe(gulp.dest('./build/es2015/bower_components/polymer'));
  webcomponentsDepsES2015Stream
    .pipe(gulp.dest('./build/es2015/bower_components/webcomponentsjs'));
  libDepsES2015Stream
    .pipe(gulp.dest('./build/es2015/lib'));
  otherBowerDepsES2015Stream
    .pipe(gulp.dest('./build/es2015/bower_components'));

  return;
});

gulp.task('build:test', () => {
  // get sources
  const unprocessedSourcesSteam = gulp.src("./src/**/*");

  // run preprocessing for ES5
  const unprocessedSourcesSteamES5 = forkStream(unprocessedSourcesSteam);
  const processedES5Sources = unprocessedSourcesSteamES5
    .pipe(preprocess(
      {
        context: { NODE_ENV: 'test', TO_ES5: true }
      }
    ));

  // run preprocessing for ES2015
  const unprocessedSourcesSteamES2015 = forkStream(unprocessedSourcesSteam);
  const processedES2015Sources = unprocessedSourcesSteamES2015
    .pipe(preprocess(
      {
        context: { NODE_ENV: 'test' }
      }
    ));

  // compile sources (to ES5) and optimize files (ES5)
  const sourcesHtmlSplitterES5 = new HtmlSplitter();
  const sourcesStreamES5 = processedES5Sources
    .pipe(sourcesHtmlSplitterES5.split()) // split inline JS & CSS out into individual .js & .css files
    .pipe(gulpif(/\.js$/, babel(
      {
        presets: ['es2015'],
        // plugins: [
        //   "transform-custom-element-classes",
        //   "transform-es2015-classes"
        // ]
      }
    )))
    .pipe(sourcesHtmlSplitterES5.rejoin()); // rejoins those files back into their original location

  // optimize files (ES2015)
  const sourcesHtmlSplitterES2015 = new HtmlSplitter();
  const sourcesStreamES2015 = processedES2015Sources
    .pipe(sourcesHtmlSplitterES2015.split()) // split inline JS & CSS out into individual .js & .css files
    .pipe(sourcesHtmlSplitterES2015.rejoin()); // rejoins those files back into their original location

  // place source files in build directory (ES5)
  sourcesStreamES5
    .pipe(gulp.dest('./build/es5'));

  // place demo files in build directory (ES5)
  gulp.src('./demo/**/*')
    .pipe(preprocess(
      {
        context: { NODE_ENV: 'test', TO_ES5: true }
      }
    ))
    .pipe(gulp.dest('./build/es5/demo'));

  // place source files in build directory (ES2015)
  sourcesStreamES2015
    .pipe(gulp.dest('./build/es2015'));

  // place demo files in build directory (ES2015)
  gulp.src('./demo/**/*')
    .pipe(preprocess(
      {
        context: { NODE_ENV: 'test' }
      }
    ))
    .pipe(gulp.dest('./build/es2015/demo'));

  // gather dependencies
  const polymerDeps = gulp.src('./bower_components/polymer/**/*');
  const webcomponentsDeps = gulp.src('./bower_components/webcomponentsjs/**/*');
  const libDeps = gulp.src('./lib/**/*');
  const otherBowerDeps = gulp.src([
    './bower_components/**/*',
    '!' + './bower_components/polymer/**/*',
    '!' + './bower_components/webcomponentsjs/**/*'
  ], { base: 'bower_components' });

  // fork streams to prepare for transpiling
  const polymerDepsES5Stream = forkStream(polymerDeps);
  const webcomponentsDepsES5Stream = forkStream(webcomponentsDeps);
  const libDepsES5Stream = forkStream(libDeps);
  const otherBowerDepsES5Stream = forkStream(otherBowerDeps);

  const babelPresetES2015 = require('babel-preset-es2015'),
	      babelPresetES2015NoModules = babelPresetES2015.buildPreset({}, {modules: false});
  const polymerDepsHtmlSplitterES5 = new HtmlSplitter();
  polymerDepsES5Stream
    .pipe(polymerDepsHtmlSplitterES5.split())
		.pipe(gulpif( /\.js$/, babel(
      {
        "presets": [ babelPresetES2015NoModules ]
      }
    )))
		.pipe(polymerDepsHtmlSplitterES5.rejoin())
		.pipe(gulp.dest('./build/es5/bower_components/polymer'));

  const webcomponentDepsHtmlSplitterES5 = new HtmlSplitter();
  webcomponentsDepsES5Stream
    .pipe(webcomponentDepsHtmlSplitterES5.split())
		// .pipe(gulpif( /\.js$/, babel(
    //   {
    //     "presets": ['es2015']
    //   }
    // )))
		.pipe(webcomponentDepsHtmlSplitterES5.rejoin())
		.pipe(gulp.dest('./build/es5/bower_components/webcomponentsjs'));

  libDepsES5Stream
    .pipe(gulp.dest('./build/es5/lib'));
  otherBowerDepsES5Stream
    .pipe(webcomponentDepsHtmlSplitterES5.split())
    // .pipe(gulpif( /\.js$/, babel(
    //   {
    //     "presets": ['es2015']
    //   }
    // )))
    .pipe(webcomponentDepsHtmlSplitterES5.rejoin())
    .pipe(gulp.dest('./build/es5/bower_components'));

  // form steams to inject to build directory (ES2015)
  const polymerDepsES2015Stream = forkStream(polymerDeps);
  const webcomponentsDepsES2015Stream = forkStream(webcomponentsDeps);
  const libDepsES2015Stream = forkStream(libDeps);
  const otherBowerDepsES2015Stream = forkStream(otherBowerDeps);
  polymerDepsES2015Stream
    .pipe(gulp.dest('./build/es2015/bower_components/polymer'));
  webcomponentsDepsES2015Stream
    .pipe(gulp.dest('./build/es2015/bower_components/webcomponentsjs'));
  libDepsES2015Stream
    .pipe(gulp.dest('./build/es2015/lib'));
  otherBowerDepsES2015Stream
    .pipe(gulp.dest('./build/es2015/bower_components'));

  return;
});

gulp.task('build:production', () => {
  // get sources
  const unprocessedSourcesSteam = gulp.src("./src/**/*");

  // run preprocessing for ES5
  const unprocessedSourcesSteamES5 = forkStream(unprocessedSourcesSteam);
  const processedES5Sources = unprocessedSourcesSteamES5
    .pipe(preprocess(
      {
        context: { NODE_ENV: 'production', TO_ES5: true }
      }
    ));

  // run preprocessing for ES2015
  const unprocessedSourcesSteamES2015 = forkStream(unprocessedSourcesSteam);
  const processedES2015Sources = unprocessedSourcesSteamES2015
    .pipe(preprocess(
      {
        context: { NODE_ENV: 'production' }
      }
    ));

  // compile sources (to ES5) and optimize files (ES5)
  const sourcesHtmlSplitterES5 = new HtmlSplitter();
  const sourcesStreamES5 = processedES5Sources
    .pipe(sourcesHtmlSplitterES5.split()) // split inline JS & CSS out into individual .js & .css files
    .pipe(gulpif(/\.js$/, babel(
      {
        presets: ['es2015'],
        // plugins: [
        //   "transform-custom-element-classes",
        //   "transform-es2015-classes"
        // ]
      }
    )))
    .pipe(gulpif(/\.css$/, cssSlam()))
    .pipe(gulpif(/\.html$/, htmlMinifier()))
    .pipe(sourcesHtmlSplitterES5.rejoin()); // rejoins those files back into their original location

  // optimize files (ES2015)
  const sourcesHtmlSplitterES2015 = new HtmlSplitter();
  const sourcesStreamES2015 = processedES2015Sources
    .pipe(sourcesHtmlSplitterES2015.split()) // split inline JS & CSS out into individual .js & .css files
    .pipe(gulpif(/\.css$/, cssSlam()))
    .pipe(gulpif(/\.html$/, htmlMinifier()))
    .pipe(sourcesHtmlSplitterES2015.rejoin()); // rejoins those files back into their original location

  // place source files in build directory (ES5)
  sourcesStreamES5
    .pipe(gulp.dest('./build/es5'));

  // place demo files in build directory (ES5)
  gulp.src('./demo/**/*')
    .pipe(preprocess(
      {
        context: { NODE_ENV: 'production', TO_ES5: true }
      }
    ))
    .pipe(gulp.dest('./build/es5/demo'));

  // place source files in build directory (ES2015)
  sourcesStreamES2015
    .pipe(gulp.dest('./build/es2015'));

  // place demo files in build directory (ES2015)
  gulp.src('./demo/**/*')
    .pipe(preprocess(
      {
        context: { NODE_ENV: 'production' }
      }
    ))
    .pipe(gulp.dest('./build/es2015/demo'));

  // gather dependencies
  const polymerDeps = gulp.src('./bower_components/polymer/**/*');
  const webcomponentsDeps = gulp.src('./bower_components/webcomponentsjs/**/*');
  const libDeps = gulp.src('./lib/**/*');
  const otherBowerDeps = gulp.src([
    './bower_components/**/*',
    '!' + './bower_components/polymer/**/*',
    '!' + './bower_components/webcomponentsjs/**/*'
  ], { base: 'bower_components' });

  // fork streams to prepare for transpiling
  const polymerDepsES5Stream = forkStream(polymerDeps);
  const webcomponentsDepsES5Stream = forkStream(webcomponentsDeps);
  const libDepsES5Stream = forkStream(libDeps);
  const otherBowerDepsES5Stream = forkStream(otherBowerDeps);

  const babelPresetES2015 = require('babel-preset-es2015'),
	      babelPresetES2015NoModules = babelPresetES2015.buildPreset({}, {modules: false});
  const polymerDepsHtmlSplitterES5 = new HtmlSplitter();
  polymerDepsES5Stream
    .pipe(polymerDepsHtmlSplitterES5.split())
		.pipe(gulpif( /\.js$/, babel(
      {
        "presets": [ babelPresetES2015NoModules ]
      }
    )))
		.pipe(polymerDepsHtmlSplitterES5.rejoin())
		.pipe(gulp.dest('./build/es5/bower_components/polymer'));

  const webcomponentDepsHtmlSplitterES5 = new HtmlSplitter();
  webcomponentsDepsES5Stream
    .pipe(webcomponentDepsHtmlSplitterES5.split())
		// .pipe(gulpif( /\.js$/, babel(
    //   {
    //     "presets": ['es2015']
    //   }
    // )))
		.pipe(webcomponentDepsHtmlSplitterES5.rejoin())
		.pipe(gulp.dest('./build/es5/bower_components/webcomponentsjs'));

  libDepsES5Stream
    .pipe(gulp.dest('./build/es5/lib'));
  otherBowerDepsES5Stream
    .pipe(webcomponentDepsHtmlSplitterES5.split())
    // .pipe(gulpif( /\.js$/, babel(
    //   {
    //     "presets": ['es2015']
    //   }
    // )))
    .pipe(webcomponentDepsHtmlSplitterES5.rejoin())
    .pipe(gulp.dest('./build/es5/bower_components'));

  // form steams to inject to build directory (ES2015)
  const polymerDepsES2015Stream = forkStream(polymerDeps);
  const webcomponentsDepsES2015Stream = forkStream(webcomponentsDeps);
  const libDepsES2015Stream = forkStream(libDeps);
  const otherBowerDepsES2015Stream = forkStream(otherBowerDeps);
  polymerDepsES2015Stream
    .pipe(gulp.dest('./build/es2015/bower_components/polymer'));
  webcomponentsDepsES2015Stream
    .pipe(gulp.dest('./build/es2015/bower_components/webcomponentsjs'));
  libDepsES2015Stream
    .pipe(gulp.dest('./build/es2015/lib'));
  otherBowerDepsES2015Stream
    .pipe(gulp.dest('./build/es2015/bower_components'));

  return;
});

gulp.task('build', ['build:production']);

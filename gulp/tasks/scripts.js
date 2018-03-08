/* scripts task
   ---------------
   Bundle javascripty things!
   This task is set up to generate multiple separate bundles,
   from different sources, and to use watch when run from the default task. */

const browserSync = require( 'browser-sync' );
const config = require( '../config.js' );
const configLegacy = config.legacy;
const configScripts = config.scripts;
const fs = require( 'fs' );
const gulp = require( 'gulp' );
const gulpConcat = require( 'gulp-concat' );
const gulpModernizrBuild = require( 'gulp-modernizr-build' );
const gulpNewer = require( 'gulp-newer' );
const gulpRename = require( 'gulp-rename' );
const gulpReplace = require( 'gulp-replace' );
const gulpUglify = require( 'gulp-uglify' );
const handleErrors = require( '../utils/handle-errors' );
const vinylNamed = require( 'vinyl-named' );
const mergeStream = require( 'merge-stream' );
const paths = require( '../../config/environment' ).paths;
const webpack = require( 'webpack' );
const webpackConfig = require( '../../config/webpack-config.js' );
const webpackStream = require( 'webpack-stream' );

/**
 * Standardize webpack workflow for handling script
 * configuration, source, and destination settings.
 * @param {Object} localWebpackConfig - Settings for Webpack.
 * @param {string} src - Source URL in the unprocessed assets directory.
 * @param {string} dest - Destination URL in the processed assets directory.
 * @returns {PassThrough} A source stream.
 */
function _processScript( localWebpackConfig, src, dest ) {
  return gulp.src( paths.unprocessed + src )
    .pipe( gulpNewer( {
      dest:  paths.processed + dest,
      extra: configScripts.otherBuildTriggerFiles
    } ) )
    .pipe( vinylNamed( file => file.relative ) )
    .pipe( webpackStream( localWebpackConfig, webpack ) )
    .on( 'error', handleErrors.bind( this, { exitProcess: true } ) )
    .pipe( gulp.dest( paths.processed + dest ) )
    .pipe( browserSync.reload( {
      stream: true
    } ) );
}

/**
 * Generate modernizr polyfill bundle.
 * @returns {PassThrough} A source stream.
 */
function scriptsPolyfill() {
  return gulp.src( paths.unprocessed + '/js/routes/common.js' )
    .pipe( gulpNewer( {
      dest:  paths.processed + '/js/modernizr.min.js',
      extra: configScripts.otherBuildTriggerFiles
    } ) )

    /* csspointerevents is used by select menu in Capital Framework for IE10.
       es5 is used for ECMAScript 5 feature detection to change js CSS to no-js.
       setClasses sets detection checks as feat/no-feat CSS in html element.
       html5printshiv enables use of HTML5 sectioning elements in IE8
       See https://github.com/aFarkas/html5shiv */
    .pipe( gulpModernizrBuild( 'modernizr.min.js', {
      addFeatures: [ 'css/pointerevents', 'es5/specification' ],
      options: [ 'setClasses', 'html5printshiv' ]
    } ) )
    .pipe( gulpUglify( {
      compress: {
        properties: false
      }
    } ) )
    .on( 'error', handleErrors )
    .pipe( gulp.dest( paths.processed + '/js/' ) )
    .pipe( browserSync.reload( {
      stream: true
    } ) );
}

/**
 * Bundle scripts in unprocessed/js/routes/
 * and factor out common modules into common.js.
 * @returns {PassThrough} A source stream.
 */
function scriptsModern() {
  return _processScript(
    webpackConfig.modernConf,
    '/js/routes/**/*.js',
    '/js/routes/'
  );
}

/**
 * Bundle external site scripts.
 * @returns {PassThrough} A source stream.
 */
function scriptsExternal() {
  return _processScript(
    webpackConfig.externalConf,
    '/js/routes/external-site/index.js',
    '/js/'
  );
}

/**
 * Bundle base js for Spanish Ask CFPB pages.
 * @returns {PassThrough} A source stream.
 */
function scriptsSpanish() {
  return _processScript(
    webpackConfig.spanishConf,
    '/js/routes/es/obtener-respuestas/single.js',
    '/js/'
  );
}

/**
 * Bundle atomic header component scripts.
 * Provides a means to bundle JS for specific atomic components,
 * which then can be carried over to other projects.
 * @returns {PassThrough} A source stream.
 */
function scriptsOnDemandHeader() {
  return _processScript(
    webpackConfig.commonConf,
    '/js/routes/on-demand/header.js',
    '/js/atomic/'
  );
}

/**
 * Bundle atomic header component scripts.
 * Provides a means to bundle JS for specific atomic components,
 * which then can be carried over to other projects.
 * @returns {PassThrough} A source stream.
 */
function scriptsOnDemandFooter() {
  return _processScript(
    webpackConfig.commonConf,
    '/js/routes/on-demand/footer.js',
    '/js/atomic/'
  );
}

/**
 * Bundle atomic component scripts for non-responsive pages.
 * Provides a means to bundle JS for specific atomic components,
 * which then can be carried over to other projects.
 * @returns {PassThrough} A source stream.
 */
function scriptsNonResponsive() {
  return gulp.src( paths.unprocessed + '/js/routes/on-demand/header.js' )
    .pipe( gulpNewer( {
      dest:  paths.processed + '/js/atomic/header.nonresponsive.js',
      extra: configScripts.otherBuildTriggerFiles
    } ) )
    .pipe( webpackStream( webpackConfig.onDemandHeaderRawConf, webpack ) )
    .on( 'error', handleErrors )
    .pipe( gulpRename( 'header.nonresponsive.js' ) )
    .pipe( gulpReplace( 'breakpointState.isInDesktop()', 'true' ) )
    .pipe( gulp.dest( paths.processed + '/js/atomic/' ) )
    .pipe( browserSync.reload( {
      stream: true
    } ) );
}

/**
 * Process Nemo JS files.
 * @returns {PassThrough} A source stream.
 */
function scriptsNemo() {
  return gulp.src( configLegacy.scripts )
    .pipe( gulpNewer( {
      dest:  configLegacy.dest + '/nemo/_/js/scripts.min.js',
      extra: configScripts.otherBuildTriggerFiles
    } ) )
    .pipe( gulpConcat( 'scripts.js' ) )
    .on( 'error', handleErrors )
    .pipe( gulpUglify() )
    .pipe( gulpRename( 'scripts.min.js' ) )
    .pipe( gulp.dest( configLegacy.dest + '/nemo/_/js' ) )
    .pipe( browserSync.reload( {
      stream: true
    } ) );
}

/**
 * Bundle scripts in /apps/ & factor out shared modules into common.js for each.
 * @returns {PassThrough} A source stream.
 */
function scriptsApps() {
  // Aggregate application namespaces that appear in unprocessed/apps.
  // eslint-disable-next-line no-sync
  let apps = fs.readdirSync( `${ paths.unprocessed }/apps/` );

  // Filter out hidden directories.
  apps = apps.filter( dir => dir.charAt( 0 ) !== '.' );

  // Run each application's JS through webpack and store the gulp streams.
  const streams = [];
  apps.forEach( app => {
    /* Check if node_modules directory exists in a particular app's folder.
       If it doesn't, don't process the scripts and log the command to run. */
    const appsPath = `${ paths.unprocessed }/apps/${ app }`;
    // eslint-disable-next-line no-sync
    if ( fs.existsSync( `${ appsPath }/package.json` ) ) {
      // eslint-disable-next-line no-sync
      if ( fs.existsSync( `${ appsPath }/node_modules` ) ) {
        streams.push(
          _processScript(
            webpackConfig.appsConf,
            `/apps/${ app }/js/**/*.js`,
            `/apps/${ app }/js`
          )
        );
      } else {
        // eslint-disable-next-line no-console
        console.log(
          '\x1b[31m%s\x1b[0m',
          'App dependencies not installed, please run from project root:',
          `npm --prefix ${ appsPath } install ${ appsPath }`
        );
      }
    }
  } );

  // Return all app's gulp streams as a merged stream.
  let singleStream;

  if ( streams.length > 0 ) {
    singleStream = mergeStream( ...streams );
  } else {
    singleStream = mergeStream();
  }
  return singleStream;
}

gulp.task( 'scripts:polyfill', scriptsPolyfill );
gulp.task( 'scripts:modern', scriptsModern );
gulp.task( 'scripts:apps', scriptsApps );
gulp.task( 'scripts:external', scriptsExternal );
gulp.task( 'scripts:spanish', scriptsSpanish );
gulp.task( 'scripts:ondemand:header', scriptsOnDemandHeader );
gulp.task( 'scripts:ondemand:footer', scriptsOnDemandFooter );
gulp.task( 'scripts:ondemand:nonresponsive', scriptsNonResponsive );
gulp.task( 'scripts:ondemand', [
  'scripts:ondemand:header',
  'scripts:ondemand:footer',
  'scripts:ondemand:nonresponsive'
] );
gulp.task( 'scripts:nemo', scriptsNemo );

gulp.task( 'scripts', [
  'scripts:polyfill',
  'scripts:modern',
  'scripts:apps',
  'scripts:external',
  'scripts:nemo',
  'scripts:spanish'
] );

'use strict';
import autoprefixer from 'gulp-autoprefixer';
import browserSync from 'browser-sync';
import cache from 'gulp-cache';
import changed from 'gulp-changed';
import cssnano from 'gulp-cssnano';
import del from 'del';
import eslint from 'gulp-eslint';
import gulp from 'gulp';
import prettify from 'gulp-html-prettify';
import htmlmin from 'gulp-htmlmin';
import imagemin from 'gulp-imagemin';
import jsbeautify from 'gulp-jsbeautifier';
import notify from 'gulp-notify';
import nunjucksRender from 'gulp-nunjucks-render';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';
import runSequence from 'run-sequence';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import streamify from 'gulp-streamify';
import uglify from 'gulp-uglify';
import util from 'gulp-util';
import watchify from 'gulp-watchify';
import data from 'gulp-data';
import concat from 'gulp-concat';
import minifyjs from 'gulp-js-minify';
import shell from 'gulp-shell';
import babelify from 'babelify';
/*----------------------------------------------------------------------------*/
/* Configuration
// import requireDir from 'require-dir';
// import babelify from 'babelify';
// import minifyjs from 'gulp-js-minify';
/*----------------------------------------------------------------------------*/

const isProd = process.env.NODE_ENV === 'production';

const isMin = !!util.env.minify;

/*----------------------------------------------------------------------------*/
/* set _paths for entry and out put
/*----------------------------------------------------------------------------*/

const _paths = {
  entry: 'src', // work is done in src folder
  output: '../', // sends src to dist folder
};

/*----------------------------------------------------------------------------*/
/* set JSON path file for data
/*----------------------------------------------------------------------------*/

const dataFile = './src/data/data' + '.json';                               
/*----------------------------------------------------------------------------*/
/* set Plugin Configurations
/*----------------------------------------------------------------------------*/
const _pluginConfig = {
  autoprefixer: {
    browsers: ['last 2 versions'],
  },

  browserSync: {
    port: process.env.PORT || 3000,
    server: {
      reloadDelay: 10000,
      baseDir: `${_paths.output}`,
    },
  },
  cssnano: {
    discardComments: {
      removeAllButFirst: true,
    },
  },
  htmlmin: {
    collapseWhitespace: true,
    keepClosingSlash: true,
    minifyCSS: true,
    minifyJS: false,
    removeComments: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
  },
  imagemin: {
    interlaced: true,
    optimizationLevel: 7,
    progressive: true,
  },
  jsbeautify: {
    extra_liners: [false],
    indent_size: 2,
    max_preserve_newlines: 1,
    preserve_newlines: false,
    wrap_attributes: 2,
  },
  notify: {
    title: 'Compile Error',
    message: '<%= error.message %>',
    sound: 'Funk',
  },
  nunjucksRender: {
    path: `${_paths.entry}/`,
    data: {
      production: isProd,
    },
    envOptions: {
      autoescape: true,
      throwOnUndefined: true,
      trimBlocks: true,
      lstripBlocks: true,
      watch: false,
    },
  },
  plumber: {
    errorHandler: handleErrors,
  },
  rename: {
    suffix: '.min',
  },
  sass: {
    outputStyle: 'expand', // compressed expand
  },
};

/*----------------------------------------------------------------------------*/
/* Errors
/*----------------------------------------------------------------------------*/

function handleErrors() {
  const args = Array.prototype.slice.call(arguments);
  notify.onError(_pluginConfig.notify).apply(this, args);
  this.emit('end');
}

/*----------------------------------------------------------------------------*/
/* gulp const variables
/*----------------------------------------------------------------------------*/

const _extentions = {
  img: {
    filetype: 'gif|jpg|png|svg',
  },
  mov: {
    filetype: 'mov|mpeg|mp4',
  }, 
  doc: {
    filetype: 'pdf|doc|txt',
  },
  zip: {
    filetype: 'zip',
  },
  php: {
    filetype: 'php',
  },
};

/*----------------------------------------------------------------------------*/
/* Public
/*----------------------------------------------------------------------------*/

/*
Move public.
 */
gulp.task('public', () => (
  gulp.src(`${_paths.entry}/public/**/*`, {
    dot: true,
  })
  .pipe(isProd ? util.noop() : plumber(_pluginConfig.plumber))
  .pipe(isProd ? util.noop() : changed(_paths.output))
  .pipe(gulp.dest(_paths.output))
  .pipe(isProd ? util.noop() : browserSync.stream())
));

/*----------------------------------------------------------------------------*/
/* Pages
/*----------------------------------------------------------------------------*/

/*
Process page templates.
 */
gulp.task('pages', () => (
  gulp.src(`${_paths.entry}/pages/**/*.+(html|njk|nunjucks)`)
  .pipe(data(function(file) {
      return require(dataFile); 
      })) // sets data for template
  .pipe(nunjucksRender(_pluginConfig.nunjucksRender))
  .pipe(isProd ? util.noop() : plumber(_pluginConfig.plumber))
  .pipe(isProd && isMin ? htmlmin(_pluginConfig.htmlmin) : util.noop()) // jsbeautify(_pluginConfig.jsbeautify))
  .pipe(prettify({indent_char: ' ', indent_size: 1})) // html beutify
  .pipe(gulp.dest(_paths.output))
));

gulp.task('inc', () => (
  gulp.src(`${_paths.entry}/inc/**/*.+(html|njk|nunjucks)`)
  .pipe(data(function(file) {
      return require(dataFile); 
      })) // sets data for template
  .pipe(nunjucksRender(_pluginConfig.nunjucksRender))
  .pipe(isProd ? util.noop() : plumber(_pluginConfig.plumber))
  .pipe(isProd && isMin ? htmlmin(_pluginConfig.htmlmin) : util.noop()) // jsbeautify(_pluginConfig.jsbeautify))
  .pipe(prettify({indent_char: ' ', indent_size: 1})) // html beutify
  .pipe(gulp.dest(_paths.output))
));

/*
Hard reload.
 */
gulp.task('html', ['copy:fonts', 'pages'], browserSync.reload);

/*----------------------------------------------------------------------------*/
/* files watch and clean
/*----------------------------------------------------------------------------*/

/*
Optimize images.
 */
gulp.task('images', () => (
  gulp.src(`${_paths.entry}/assets/img/**/*.+(${_extentions.img.filetype})`)
  .pipe(isProd ? util.noop() : plumber(_pluginConfig.plumber))
  .pipe(isProd ? imagemin(_pluginConfig.imagemin) : cache(imagemin(_pluginConfig.imagemin)))
  .pipe(gulp.dest(`${_paths.output}/assets/img`))
  .pipe(isProd ? util.noop() : browserSync.stream())
));

/*
watches mov folder
 */
gulp.task('mov', () => (
  gulp.src(`${_paths.entry}/assets/mov/**/*.+(${_extentions.mov.filetype})`)
  .pipe(isProd ? util.noop() : plumber(_pluginConfig.plumber))
  .pipe(gulp.dest(`${_paths.output}/assets/mov`))
  .pipe(isProd ? util.noop() : browserSync.stream())
));

/*
watches doc folder
 */
gulp.task('doc', () => (
  gulp.src(`${_paths.entry}/assets/doc/**/*.+(${_extentions.doc.filetype})`)
  .pipe(isProd ? util.noop() : plumber(_pluginConfig.plumber))
  .pipe(gulp.dest(`${_paths.output}/assets/doc`))
  .pipe(isProd ? util.noop() : browserSync.stream())
));

/*
watches zip folder
 */
gulp.task('zip', () => (
  gulp.src(`${_paths.entry}/assets/doc/**/*.+(${_extentions.zip.filetype})`)
  .pipe(isProd ? util.noop() : plumber(_pluginConfig.plumber))
  .pipe(gulp.dest(`${_paths.output}/assets/doc`))
  .pipe(isProd ? util.noop() : browserSync.stream())
));
/*
watches php folder
 */
gulp.task('php', () => (
  gulp.src(`${_paths.entry}/pages/**/*.+(${_extentions.php.filetype})`)
  .pipe(isProd ? util.noop() : plumber(_pluginConfig.plumber))
  .pipe(gulp.dest(`${_paths.output}`))
  .pipe(isProd ? util.noop() : browserSync.stream())
));

/*----------------------------------------------------------------------------*/
/* Fonts
/*----------------------------------------------------------------------------*/

gulp.task('copy:fonts', () => (
  gulp.src(`${_paths.entry}/fonts/**/*`)
  .pipe(gulp.dest(`${_paths.output}/fonts`))
  .pipe(isProd ? util.noop() : browserSync.stream())
));

/*----------------------------------------------------------------------------*/
/* Styles
/*----------------------------------------------------------------------------*/

/*
Process non-minified css or sass files (minify if production mode).
 */
gulp.task('styles:sass', () => (
  gulp.src([
    `${_paths.entry}/scss/**/*.+(css|scss)`,
    `!${_paths.entry}/scss/*.min.css`,
    `!${_paths.entry}/scss/**/*.min.css`,
  ])
  .pipe(isProd ? util.noop() : plumber(_pluginConfig.plumber))
  .pipe(isProd ? util.noop() : changed(`${_paths.output}/css`))
  .pipe(isProd ? util.noop() : sourcemaps.init())
  .pipe(sass(_pluginConfig.sass))
  .pipe(autoprefixer(_pluginConfig.autoprefixer))
  .pipe(isProd ? util.noop() : sourcemaps.write())
  .pipe(isProd && isMin ? cssnano(_pluginConfig.cssnano) : util.noop())
  .pipe(isProd && isMin ? rename(_pluginConfig.rename) : util.noop())
  // .pipe(cssnano(_pluginConfig.cssnano))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(`${_paths.output}/css`))
  .pipe(isProd ? util.noop() : browserSync.stream())
));

/*
Move minified files.
 */

gulp.task('styles:vendor', () => (
  gulp.src(`${_paths.entry}/scss/**/*.min.css`)
  .pipe(isProd ? util.noop() : plumber(_pluginConfig.plumber))
  .pipe(isProd ? util.noop() : changed(`${_paths.output}/css`))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(`${_paths.output}/css`))
  .pipe(isProd ? util.noop() : browserSync.stream())
));

/*
Combine tasks.
 */
gulp.task('styles', ['copy:fonts', 'styles:sass', 'styles:vendor']);

/*----------------------------------------------------------------------------*/
/* Scripts
/*----------------------------------------------------------------------------*/

/*
Lint non-minified js files.
 */
gulp.task('scripts:lint', () => (
  gulp.src([
    'gulpfile.babel.js',
    `${_paths.entry}/js/main.js`,  
    // `${_paths.entry}/js/pages/*.js`,  
    // `!${_paths.entry}/js/vendors.js`,
    // `!${_paths.entry}/js/vendors/**/*.js`,    
  ])
  .pipe(plumber(_pluginConfig.plumber))
  .pipe(eslint())
  .pipe(eslint.format())  
  .pipe(browserSync.active ? eslint.failAfterError() : eslint.failOnError())
));

/*
Process non-minified js files (uglify if production mode).
*/

gulp.task('scripts:watchify', ['scripts:lint'], watchify((watchify) => (
  gulp.src([
    `${_paths.entry}/js/**/*.js`,    
    `!${_paths.entry}/js/bootstrap.bundle.min.js`,    
    `!${_paths.entry}/js/jquery.min.js`,    
    `!${_paths.entry}/js/vendors/**/*.js`,    
  ])
  .pipe(isProd ? util.noop() : plumber(_pluginConfig.plumber))
  .pipe(watchify({
    watch: !isProd,
    setup: (bundle) => bundle.transform(babelify),
  }))
  .pipe(isProd && isMin ? streamify(uglify()) : streamify(jsbeautify(_pluginConfig.jsbeautify)))
  .pipe(isProd && isMin ? streamify(rename(_pluginConfig.rename)) : util.noop())
  // .pipe(minifyjs())
  .pipe(gulp.dest(`${_paths.output}/js`))
  .pipe(isProd ? util.noop() : browserSync.stream())
)));

gulp.task('scripts:mainjsmin', () => (
  gulp.src([
    `${_paths.entry}/js/main.js`,      
  ])
  .pipe(minifyjs())
  .pipe(gulp.dest(`${_paths.output}/js`))  
));

// ////////////////////////////////////////////////
// Move minified js files.
// // /////////////////////////////////////////////

gulp.task('scripts:vendor', () => (
  gulp.src(`${_paths.entry}/js/**/.*js`)
  .pipe(isProd ? util.noop() : plumber(_pluginConfig.plumber))
  .pipe(isProd ? util.noop() : changed(`${_paths.output}/js`))
  .pipe(gulp.dest(`${_paths.output}/js/`))
));

// ////////////////////////////////////////////////
// Global Vendors Compiled
// // /////////////////////////////////////////////
var vendorGlobslList = [             
    `${_paths.entry}/js/vendors/jquery-3.3.1.min.js`,
    `${_paths.entry}/js/vendors/tether.min.js`,
    `${_paths.entry}/js/vendors/mdb.min.js`,
    `${_paths.entry}/js/vendors/bootstrap.min.js`,
    `${_paths.entry}/js/vendors/popper.min.js`];
gulp.task('scripts-global-vendors:concat', function() {
  return gulp.src(vendorGlobslList)
    .pipe(concat('vendors.js'))
    .pipe(gulp.dest(`${_paths.output}/js/vendors/`));
});







gulp.task('scripts-global-jquery:concat', function() {
  return gulp.src(`${_paths.entry}/js/jquery.min.js`)
    .pipe(concat('jquery.min.js'))
    .pipe(gulp.dest(`${_paths.output}/js/`));
});

gulp.task('scripts-global-bootstrap:concat', function() {
  return gulp.src(`${_paths.entry}/js/bootstrap.bundle.min.js`)
    .pipe(concat('bootstrap.bundle.min.js'))
    .pipe(gulp.dest(`${_paths.output}/js/`));
});
    // ////////////////////////////////////////////////
    // Home Vendors Compiled
    // // /////////////////////////////////////////////
    var vendorHomeList = [];
    gulp.task('scripts-home-vendors:concat', function() {
      return gulp.src(vendorHomeList)
        .pipe(concat('home-vendors.js'))    
        // .pipe(minifyjs())
        .pipe(gulp.dest(`${_paths.output}/js/vendors/`));
    });
    // ////////////////////////////////////////////////
    // Work Vendors Compiled
    // // /////////////////////////////////////////////
    var vendorWorkList = [];
    gulp.task('scripts-work-vendors:concat', function() {
      return gulp.src(vendorWorkList)
        .pipe(concat('work.js'))    
        .pipe(gulp.dest(`${_paths.output}/js/vendors/`));
    });
    // ////////////////////////////////////////////////
    // Services Vendors Compiled
    // // /////////////////////////////////////////////
    var vendorServicesList = [];
    gulp.task('scripts-services-vendors:concat', function() {
      return gulp.src(vendorServicesList)
        .pipe(concat('services.js'))    
        .pipe(gulp.dest(`${_paths.output}/js/vendors/`));
    });
    // ////////////////////////////////////////////////
    // Ideas Vendors Compiled
    // // /////////////////////////////////////////////
    var vendorIdeasList = [];
    gulp.task('scripts-ideas-vendors:concat', function() {
      return gulp.src(vendorIdeasList)
        .pipe(concat('ideas.js'))    
        .pipe(gulp.dest(`${_paths.output}/js/vendors/`));
    });
    // ////////////////////////////////////////////////
    // Ideas Vendors Compiled
    // // /////////////////////////////////////////////
    var vendorAboutList = [];
    gulp.task('scripts-about-vendors:concat', function() {
      return gulp.src(vendorAboutList)
        .pipe(concat('about.js'))          
        .pipe(gulp.dest(`${_paths.output}/js/vendors/`));
    });
    // ////////////////////////////////////////////////
    // Contact Vendors Compiled
    // // /////////////////////////////////////////////
    var vendorContactList = [];
    gulp.task('scripts-contact-vendors:concat', function() {
      return gulp.src(vendorContactList)
        .pipe(concat('contact.js'))    
        .pipe(gulp.dest(`${_paths.output}/js/vendors/`));
    });
/*
Hard Reload.
 */
gulp.task('scripts:vendor:watch', ['scripts:vendor'], browserSync.reload);

/*
Combine tasks.
 */
gulp.task('scripts:minify', [ 'scripts:vendor',
                              'scripts-global-jquery:concat',
                              'scripts-global-bootstrap:concat',
                              'scripts-global-vendors:concat',
                              'scripts-home-vendors:concat', 
                              'scripts-about-vendors:concat',
                              'scripts-ideas-vendors:concat',
                              'scripts-services-vendors:concat',
                              'scripts-work-vendors:concat',
                              'scripts-contact-vendors:concat']
                              );
gulp.task('scripts', ['scripts:vendor', 'scripts:minify', 'scripts:watchify']);

/*----------------------------------------------------------------------------*/
/* Serve
/*----------------------------------------------------------------------------*/

/*
Start browserSync serve.
 */
gulp.task('serve', () => browserSync.init(_pluginConfig.browserSync));

/*
Start browserSync serve.
 */
// gulp.task('bashRun', shell.task('cd dist && bash git-ftp.sh "uploaded from gulp bash task"'));

/*
Watch files for changes.
 */
gulp.task('watch', () => {
  gulp.watch(`${_paths.entry}/public/**/*`, ['public']);
  gulp.watch(`${_paths.entry}/**/*.+(html|njk|nunjucks)`, ['pages', 'html']); // bashRun
  gulp.watch(`${_paths.entry}/data/**.json`, ['pages', 'html']);
  gulp.watch(`${_paths.entry}/assets/img/**/*.+(${_extentions.img.filetype})`, ['images', 'cleanImgFiles']);
  gulp.watch(`${_paths.entry}/assets/mov/**/*.+(${_extentions.mov.filetype})`, ['mov', 'cleanMovFiles']);
  gulp.watch(`${_paths.entry}/assets/doc/**/*.+(${_extentions.doc.filetype})`, ['doc', 'cleanDocFiles']);
  gulp.watch(`${_paths.entry}/assets/zip/**/*.+(${_extentions.zip.filetype})`, ['zip', 'cleanZipFiles']);
  gulp.watch(`${_paths.entry}/pages/**/*.+(${_extentions.php.filetype})`, ['php', 'cleanPHPFiles']);
  gulp.watch([
    `${_paths.entry}/scss/**/*.+(css|scss)`,
    `!${_paths.entry}/scss/*.min.css`,
    `!${_paths.entry}/scss/**/*.min.css`,
  ], ['styles:sass']); // , 'bashRun'
 
  gulp.watch(`${_paths.entry}/styles/**/*.min.css`, ['styles:vendor']);
  gulp.watch([
    `${_paths.entry}/js/main.js`,  
    `${_paths.entry}/js/**/*.js`,  
    `${_paths.entry}/js/vendors/**`,
    // `!${_paths.entry}/js/**/*.min.js`,
    // `!${_paths.entry}/**.js`,
      ], ['scripts:watchify']); // , 'bashRun'
  gulp.watch([`${_paths.entry}/js/**/*.min.js`], ['scripts:vendor:watch']);
});

/*----------------------------------------------------------------------------*/
/* Cleanup
/*----------------------------------------------------------------------------*/

/*
Clear cache (production).
 */
gulp.task('clear', (cb) => cache.clearAll(cb));

/*
Clean entire build folder (production).
 */

gulp.task('clean', () => del([
  '.sass-cache',
  `${_paths.output}/about.html`,  
  `${_paths.output}/services.html`,
  `${_paths.output}/index.html`,
  `${_paths.output}/**/**.html`,
  `${_paths.output}/work.html`,
  `${_paths.output}/ideas.html`,
  `${_paths.output}/contact.html`,
  `${_paths.output}/style-guide.html`,
  `${_paths.output}/assets/*`,
  `${_paths.output}/js/`,  
  `${_paths.output}/css/**/**.css`,
  `${_paths.output}/css/pages/`,
  `${_paths.output}/css/vendors/`,
  `!${_paths.output}/js/vendors.css`,
  `!${_paths.output}/css/fonts/*`]));
/*
Clean entire img output folder
 */
gulp.task('cleaning', () => del(['.sass-cache', `${_paths.output}/assets/*`]));
gulp.task('cleanImgFiles', () => del(['.sass-cache', `${_paths.output}/assets/img/*`]));
gulp.task('cleanMovFiles', () => del(['.sass-cache', `${_paths.output}/assets/mov/*`]));
gulp.task('cleanDocFiles', () => del(['.sass-cache', `${_paths.output}/assets/doc/*`]));
gulp.task('cleanZipFiles', () => del(['.sass-cache', `${_paths.output}/assets/zip/*`]));
gulp.task('cleanPHPFiles', () => del(['.sass-cache', `${_paths.output}/pages/**/*.+(${_extentions.php.filetype})`]));
/*
Clean entire build folder, except for optimized images (development).
 */
gulp.task('clean:ignore-images', () => {
  del.sync([
    '.sass-cache',
    `!${_paths.output}/assets/**/*`,
  ]);
});

/*----------------------------------------------------------------------------*/
/* Build Sequences
/*----------------------------------------------------------------------------*/

gulp.task('reboot', ['clean:ignore-images'], (cb) => {
    runSequence([
        'public',
        'html',
        'images', 
        'styles',
        'scripts',
        'scripts:mainjsmin'], 'watch', cb);
  });

if (isProd) {
  /* Production. */
  gulp.task('default', ['clear', 'clean'], (cb) => {
    runSequence([
      'public',
      'html',
      'images',
      'styles',
      'mov',
      'doc',
      'zip',
      'php',
      'scripts'], cb);
  });
  } else {
  /* Development. */
  gulp.task('default', ['clean:ignore-images'], (cb) => {
    runSequence([
      'public',
      'html',
      'images',
      'styles',
      'mov',
      'doc',
      'zip',
      'php',
      'scripts'], 'serve', 'watch', cb);
  });
};

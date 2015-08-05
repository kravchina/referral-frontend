// Karma configuration
// Generated on Wed Jul 15 2015 15:39:29 GMT-0400 (Eastern Daylight Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      // TODO [ak] would be very good to autogenerate these dependencies somehow
      'http://code.jquery.com/jquery-2.1.1.min.js',
      'http://ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular.js',
      'http://ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular-mocks.js',
      'http://ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular-cookies.js',
      'http://ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular-resource.js',
      'http://angular-ui.github.io/bootstrap/ui-bootstrap-tpls-0.11.2.js',
      'http://angular-ui.github.io/ui-router/release/angular-ui-router.js',
      'js/**/*.js', // it will find our test specs there
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'], // [ak] I also tried 'spec', it's nice


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'Firefox', 'IE'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  })
}

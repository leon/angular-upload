module.exports = function(config) {

  var conf = require('./Gruntfile.conf.js');

  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',

    // list of files / patterns to load in the browser
    files: [].concat(
      'bower_components/es5-shim/es5-shim.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      conf.src,
      conf.unit
    ),

    frameworks: ['jasmine'],
    plugins: [
      'karma-growl-reporter',
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-ie-launcher'
    ],

    /**
     * How to report, by default.
     */
    reporters: ['dots', 'growl'],

    /**
     * On which port should the browser connect, on which port is the test runner
     * operating, and what is the URL path for the browser to use.
     */
    //hostname: 'leon-work.local',
    port: 9018,
    runnerPort: 9100,
    urlRoot: '/',

    /**
     * Disable file watching by default.
     */
    autoWatch: false,

    /**
     * The list of browsers to launch to test on. This includes only "Firefox" by
     * default, but other browser names include:
     * Chrome, ChromeCanary, Firefox, Opera, Safari, PhantomJS
     *
     * Note that you can also use the executable name of the browser, like "chromium"
     * or "firefox", but that these vary based on your operating system.
     *
     * You may also leave this blank and manually navigate your browser to
     * http://localhost:9018/ when you're running tests. The window/tab can be left
     * open and the tests will automatically occur there during the build. This has
     * the aesthetic advantage of not launching a browser every time you save.
     */
    browsers: [
      'Chrome'
      //'IE'
    ]
  });

};

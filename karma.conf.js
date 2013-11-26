module.exports = function(config) {

  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',

    frameworks: ['jasmine'],

    plugins: [
      'karma-growl-reporter',
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
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
    autoWatch: false
  });

};

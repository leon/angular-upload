exports.config = {

  name: 'angular-upload',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  //sauceUser: "leon",
  //sauceKey: "1234",
  specs: [conf.e2e],

  capabilities: {
    browserName: 'chrome'
  },

  baseUrl: 'http://localhost:9001',

  rootElement: 'body',

  jasmineNodeOpts: {
    onComplete: null,
    isVerbose: true,
    showColors: true,
    includeStackTrace: true,
    defaultTimeoutInterval: 30000
  }
};

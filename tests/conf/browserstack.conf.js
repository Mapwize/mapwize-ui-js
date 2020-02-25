var browserstack = require('browserstack-local');
try {
  var credentials = require('../../browserstack-credentials.json');
}
catch (e) {
  if (!process.env.CI) {
    console.error('\x1b[31m', 'Missing Browserstack credentials!...');
    process.exit(1);
  }
}

var capabilities = require('./capabilities').capabilities

if (process.env.CI) {
  capabilities = capabilities.map(capability => {
    capability.build = `mapwize-ui-js #${process.env.TRAVIS_BUILD_NUMBER}.${process.env.TRAVIS_JOB_NUMBER}`;
    return capability;
  });
}

exports.config = {
  user: process.env.BROWSERSTACK_USERNAME || credentials.user,
  key: process.env.BROWSERSTACK_ACCESS_KEY || credentials.key,

  commonCapabilities: {
    'browserstack.local': true,
    'browserstack.networkLogs': true,
    'browserstack.console': 'errors',
    'browserstack.autoWait': 0,
    'project': 'mapwize-ui-js',
    // 'browserstack.debug': true
  },
  capabilities,
  //
  // ===================
  // Test Configurations
  // ===================
  // Define all options that are relevant for the WebdriverIO instance here
  //
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  logLevel: 'warn',
  specs: ['./tests/**/*.tests.js'],
  maxInstances: 2,
  outputDir: './tests/report',

  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000
  },

  // Code to start browserstack local before start of test
  onPrepare: function (config, capabilities) {
    console.log("Connecting local");
    return new Promise(function (resolve, reject) {
      exports.bs_local = new browserstack.Local();
      exports.bs_local.start({ 'key': exports.config.key, 'force': true }, function (error) {
        if (error) return reject(error);

        console.log('Connected. Now testing...');
        resolve();
      });
    });
  },

  beforeSuite: function (suite) {
    // console.log('suite', suite);
    // exports.config.capabilities.forEach(function (caps) { // didn't work...
    //   caps.name = caps.browser + ' ' + caps.browser_version + ', ' + caps.os + ' ' + caps.os_version + ': ' + suite.name;
    // });
  },

  // Code to stop browserstack local after end of test
  onComplete: function (capabilties, specs) {
    exports.bs_local.stop(function () { });
  }
}

// Code to support common capabilities
exports.config.capabilities.forEach(function (caps) {
  for (var i in exports.config.commonCapabilities) caps[i] = caps[i] || exports.config.commonCapabilities[i];
});

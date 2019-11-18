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

var capabilities = [{
  // Latest Chrome - Mac
  'os' : 'OS X',
  'os_version' : 'Catalina',
  'browser': 'Chrome',
  'browser_version' : '78.0',
  'browserName' : 'MacOS Catalina - Chrome 78.0',
}, {
  // Oldest Chrome - Mac
  'os' : 'OS X',
  'os_version' : 'High Sierra',
  'browser': 'Chrome',
  'browser_version' : '42.0',
  'browserName' : 'MacOS High Sierra - Chrome 78.0',
}, {
  // Latest Safari - Mac
  'os' : 'OS X',
  'os_version' : 'Catalina',
  'browser': 'Safari',
  'browser_version' : '13.0',
  'browserName' : 'MacOS Catalina - Safari 13.0',
}, {
  // Oldest Safari - Mac
  'os' : 'OS X',
  'os_version' : 'Sierra',
  'browser': 'Safari',
  'browser_version' : '10.1',
  'browserName' : 'MacOS Sierra - Safari 10.1',
}, {
  // Latest Chrome - Windows
  'os' : 'Windows',
  'os_version' : '10',
  'browser': 'Chrome',
  'browser_version' : '78.0',
  'browserName' : 'Windows 10 - Chrome 78.0',
}, {
  // Oldest Chrome - Windows
  'os' : 'Windows',
  'os_version' : '8',
  'browser': 'Chrome',
  'browser_version' : '42.0',
  'browserName' : 'Windows 8 - Chrome 42.0',
}, {
  // Latest Firefox - Windows
  'os' : 'Windows',
  'os_version' : '10',
  'browser': 'Firefox',
  'browser_version' : '70.0',
  'browserName' : 'Windows 10 - Firefox 70.0',
}, {
  // Oldest Firefox - Windows
  'os' : 'Windows',
  'os_version' : '10',
  'browser': 'Firefox',
  'browser_version' : '40.0',
  'browserName' : 'Windows 10 - Firefox 40.0',
}, {
  // Latest Edge - Windows
  'os' : 'Windows',
  'os_version' : '10', 
  'browser': 'Edge',
  'browser_version' : '18.0',
  'browserName' : 'Windows 10 - Edge 18.0',
}, {
  // Oldest Edge - Windows
  'os' : 'Windows',
  'os_version' : '10',
  'browser': 'Edge',
  'browser_version' : '16.0',
  'browserName' : 'Windows 10 - Edge 16.0',
}, {
  // IE 11 - Win 10
  'os' : 'Windows',
  'os_version' : '10',
  'browser': 'IE',
  'browser_version' : '11.0',
  'browserName' : 'Windows 10 - IE 11.0',
}, {
  // IE 11 - Win 8.1
  'os' : 'Windows',
  'os_version' : '8.1',
  'browser': 'IE',
  'browser_version' : '11.0',
  'browserName' : 'Windows 8.1 - IE 11.0',
}];

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
    'project' : 'mapwize-ui-js',
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
  specs: ['./tests/**/*.test.js'],
  maxInstances: 4,
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
    return new Promise(function(resolve, reject){
      exports.bs_local = new browserstack.Local();
      exports.bs_local.start({ 'key': exports.config.key, 'force': true }, function(error) {
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
    exports.bs_local.stop(function() {});
  }
}

// Code to support common capabilities
exports.config.capabilities.forEach(function (caps) {
  for(var i in exports.config.commonCapabilities) caps[i] = caps[i] || exports.config.commonCapabilities[i];
});

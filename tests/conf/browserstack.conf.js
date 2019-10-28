var browserstack = require('browserstack-local');

exports.config = {
  user: process.env.BROWSERSTACK_USERNAME || 'mapwize1',
  key: process.env.BROWSERSTACK_ACCESS_KEY || 'vdcyK7Ra9mV8fe1b3uxM',
  
  commonCapabilities: {
    'browserstack.local': true,
    // 'browserstack.debug': true
  },
  capabilities: [{
    'os': 'OS X',
    'os_version': 'Mojave',
    'browser': 'Chrome',
    'browser_version': '77.0',
    'resolution': '1024x768',
  }, {
    'os': 'Windows',
    'os_version': '10',
    'browser': 'Chrome',
    'browser_version': '77.0',
    'resolution': '1024x768'
  }, {
    'os': 'Windows',
    'os_version': '10',
    'browser': 'IE',
    'browser_version': '11.0',
    'resolution': '1024x768'
  }],
  
  //
  // ===================
  // Test Configurations
  // ===================
  // Define all options that are relevant for the WebdriverIO instance here
  //
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  logLevel: 'warn',
  specs: ['./tests/**/*.test.js'],
  maxInstances: 8,
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
      exports.bs_local.start({'key': exports.config.key }, function(error) {
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

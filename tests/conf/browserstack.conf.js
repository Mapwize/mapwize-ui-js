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

  services: [
    ['browserstack', {
      browserstackLocal: true,
      opts: {
        force: true,
        verbose: true,
        localIdentifier: 'mapwize-ui'
      }
    }]
  ],

  commonCapabilities: {
    'browserstack.local': true,
    'browserstack.networkLogs': true,
    'browserstack.console': 'errors',
    'browserstack.autoWait': 0,
    'project': 'mapwize-ui-js',
    'browserstack.debug': true
  },
  capabilities,

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
  }
}

// Code to support common capabilities
exports.config.capabilities.forEach(function (caps) {
  for (var i in exports.config.commonCapabilities) caps[i] = caps[i] || exports.config.commonCapabilities[i];
});

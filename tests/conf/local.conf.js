exports.config = {
    runner: 'local',
    outputDir: 'all-logs',

    specs: ['./tests/**/*.tests.js'],
    exclude: [],

    maxInstances: 1,
    capabilities: [{
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: ['--headless', '--disable-gpu', '--no-sandbox']
        }
    }],

    logLevel: 'warn',
    bail: 0,

    baseUrl: 'http://localhost',

    waitforTimeout: 10000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,

    services: [
        ['chromedriver', {
            path: '/wd/hub',
            hostname: process.env.WEBDRIVER_HOSTNAME || 'localhost',
            port: 4444,
            outputDir: 'driver-logs'
        }]
    ],

    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },
}

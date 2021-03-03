module.exports = {
  capabilities: [
    {
      // Latest Chrome - Mac
      os: 'OS X',
      os_version: 'Catalina',
      browser: 'Chrome',
      browser_version: 'latest',
      browserName: 'MacOS Catalina - Chrome latest',
    },
    {
      // Oldest Chrome - Mac
      os: 'OS X',
      os_version: 'High Sierra',
      browser: 'Chrome',
      browser_version: '62.0',
      browserName: 'MacOS High Sierra - Chrome 62.0',
    },
    {
      // Latest Safari - Mac
      os: 'OS X',
      os_version: 'Catalina',
      browser: 'Safari',
      browser_version: '13.1',
      browserName: 'MacOS Catalina - Safari 13.1',
    },
    {
      // Oldest Safari - Mac
      os: 'OS X',
      os_version: 'High Sierra',
      browser: 'Safari',
      browser_version: '11.1',
      browserName: 'MacOS High Sierra - Safari 11.1',
    },
    {
      // Latest Chrome - Windows
      os: 'Windows',
      os_version: '10',
      browser: 'Chrome',
      browser_version: 'latest',
      browserName: 'Windows 10 - Chrome latest',
    },
    {
      // Oldest Chrome - Windows
      os: 'Windows',
      os_version: '8',
      browser: 'Chrome',
      browser_version: '62.0',
      browserName: 'Windows 8 - Chrome 62.0',
    },
    {
      // Latest Firefox - Windows
      os: 'Windows',
      os_version: '10',
      browser: 'Firefox',
      browser_version: 'latest',
      browserName: 'Windows 10 - Firefox latest',
    },
    {
      // Oldest Firefox - Windows
      os: 'Windows',
      os_version: '10',
      browser: 'Firefox',
      browser_version: '60.0',
      browserName: 'Windows 10 - Firefox 60.0',
      // }, { // Temporarly comment edge tests due to driver error
      //   // Latest Edge - Windows
      //   os: 'Windows',
      //   os_version: '10',
      //   browser: 'Edge',
      //   browser_version: 'latest',
      //   browserName: 'Windows 10 - Edge latest'
    },
  ],
}

exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    baseUrl: 'http://dev1.dentallinks.org',
    // baseUrl: 'http://localhost:4000',
    params: {
        login: {
            user: 'alexei@vidmich.com',
            pass: '12345678'
        }
    },
    specs: ['test/referral-frontend.js'],
    maxSessions: 1, // this is in order to make multiple browsers run sequentially
    multiCapabilities: [
        {browserName: 'firefox'},
        {browserName: 'chrome'},
        // {browserName: 'internet explorer'} // make sure to set the same Protected Mode settings for all four zones in your Internet Options
    ]
};

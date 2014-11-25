exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['test/referral-frontend.js'],
    multiCapabilities: [
        // {browserName: 'firefox'},
       {browserName: 'chrome'},
//        {browserName: 'internet explorer'}
    ]
};

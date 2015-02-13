exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    baseUrl: 'http://dev1.dentallinks.org',
    // baseUrl: 'http://localhost:4000',
    params: {
        login: {
            correct: {
                email: 'alexei@vidmich.com',
                pass: '12345678'
            },
            wrong: {
                email: 'qwerqwerqwer@qwerqwer.com',
                pass: 'qwerqwerqwer'
            }
        },
        viewReferralId: 215,
        attachmentUrlPart: 'https://referral-server.herokuapp.com/attachment/?file='
    },
    specs: ['test/e2e/MainSpec.js'],
    maxSessions: 1, // this is in order to make multiple browsers run sequentially
    multiCapabilities: [
        {browserName: 'firefox'},
        {browserName: 'chrome'},
        {browserName: 'internet explorer'} // make sure to set the same Protected Mode settings for all zones in your Internet Options
    ],
    onPrepare: function() {
        browser.getCapabilities().then(function (cc) {
            browser.currentRunBrowserName = cc.caps_.browserName;
        });
    }
};

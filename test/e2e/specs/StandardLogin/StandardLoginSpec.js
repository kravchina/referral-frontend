var commonActions = require('../../commons/CommonActions');
var commonExpects = require('../../commons/CommonExpects');

var signInPage = require('../../pages/SignInPage');
var historyPage = require('../../pages/HistoryPage');

var adminPracticeSpec = require('./Admin/AdminPracticeSpec');
var adminUsersSpec = require('./Admin/AdminUsersSpec');
var adminInviteSpec = require('./Admin/AdminInviteSpec');
var adminSubscriptionSpec = require('./Admin/AdminSubscriptionSpec');
var consolePracticeSpec = require('./Console/ConsolePracticeSpec');
var consoleReportsSpec = require('./Console/ConsoleReportsSpec');
var consoleUtilitiesSpec = require('./Console/ConsoleUtilitiesSpec');
var createReferralSpec = require('./CreateReferral/CreateReferralSpec');
var viewReferralSpec = require('./ViewReferral/ViewReferralSpec');

var StandardLoginSpec = function() {
    this.run = function() {
        describe('when user tries to log in with valid credentials', function() {
            beforeEach(function() {
                signInPage.setEmail(browser.params.login.correct.email);
                signInPage.setPass(browser.params.login.correct.pass);
                signInPage.clickLogin();
                commonExpects.expectProgressDivHidden();
            });
            
            it('shows the top menu and redirects to History page', function() {
                commonExpects.expectMenuShown();
                commonExpects.expectCurrentUrlToBe(historyPage.url);
            });
            
            adminPracticeSpec.run();
            adminUsersSpec.run();
            adminInviteSpec.run();
            adminSubscriptionSpec.run();
            consolePracticeSpec.run();
            consoleReportsSpec.run();
            consoleUtilitiesSpec.run();
            createReferralSpec.run();
            viewReferralSpec.run();
            
            afterEach(function() {
                commonActions.signOut();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectMenuHidden();
                commonExpects.expectCurrentUrlToBe(signInPage.url);
            });
        });
    };
};

module.exports = new StandardLoginSpec();

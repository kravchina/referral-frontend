var commonActions = require('../../commons/CommonActions');
var commonExpects = require('../../commons/CommonExpects');

var signInPage = require('../../pages/SignInPage');
var historyPage = require('../../pages/HistoryPage');

var consolePracticeSpec = require('./Console/ConsolePracticeSpec');
var consoleReportsSpec = require('./Console/ConsoleReportsSpec');
var consoleUtilitiesSpec = require('./Console/ConsoleUtilitiesSpec');
var consolePluginSpec = require('./Console/ConsolePluginSpec');

var SuperUserLoginSpec = function() {
    this.run = function() {
        describe('when user tries to log in with valid credentials', function() {
            beforeEach(function() {
                signInPage.setEmail(browser.params.login.super_user.email);
                signInPage.setPass(browser.params.login.super_user.pass);
                signInPage.clickLogin();
                commonExpects.expectProgressDivHidden();
            });

            it('shows the top menu and redirects to History page', function() {
                commonExpects.expectMenuShown();
                commonExpects.expectCurrentUrlToBe(historyPage.url);
            });

            consolePracticeSpec.run();
            consoleReportsSpec.run();
            consoleUtilitiesSpec.run();
            consolePluginSpec.run();

            afterEach(function() {
                commonActions.signOut();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectMenuHidden();
                commonExpects.expectCurrentUrlToBe(signInPage.url);
            });
        });
    };
};

module.exports = new SuperUserLoginSpec();

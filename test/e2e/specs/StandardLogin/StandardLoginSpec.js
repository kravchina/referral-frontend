var commonActions = require('../../commons/CommonActions');
var commonExpects = require('../../commons/CommonExpects');

var signInPage = require('../../pages/SignInPage');
var historyPage = require('../../pages/HistoryPage');

var adminPracticeSpec = require('./Admin/AdminPracticeSpec');
var adminUsersSpec = require('./Admin/AdminUsersSpec');
var adminInviteSpec = require('./Admin/AdminInviteSpec');
var adminSubscriptionSpec = require('./Admin/AdminSubscriptionSpec');
var createReferralSpec = require('./CreateReferral/CreateReferralSpec');
var viewReferralSpec = require('./ViewReferral/ViewReferralSpec');
var viewReferralDraftSpec = require('./ViewReferral/ViewReferralDraftSpec');
var historySpec = require('./History/HistorySpec');

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

            it('expect Admin Console not shown for the standart login user', function(){
                commonExpects.expectMenuShown();
                commonActions.openMenu();
                expect(element(by.css('a[ui-sref="console.practice"]')).isDisplayed()).toBe(false);
                commonActions.openMenu();
            });

            historySpec.run();
            adminPracticeSpec.run();
            adminUsersSpec.run();
            adminInviteSpec.run();
            adminSubscriptionSpec.run();
            createReferralSpec.run();
            viewReferralSpec.run();
            viewReferralDraftSpec.run();
            
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

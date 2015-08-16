var commonActions = require('./CommonActions');
var commonExpects = require('./CommonExpects');
var signInPage = require('./SignIn/SignInPage');
var historyPage = require('./History/HistoryPage');

var adminPracticeSpec = require('./Admin/AdminPracticeSpec');
var adminPracticePremiumSpec = require('./Admin/AdminPracticePremiumSpec');
var adminPracticeNonPremiumSpec = require('./Admin/AdminPracticeNonPremiumSpec');
var adminUsersSpec = require('./Admin/AdminUsersSpec');
var adminInviteSpec = require('./Admin/AdminInviteSpec');
var adminSubscriptionSpec = require('./Admin/AdminSubscriptionSpec');
var adminSubscriptionPremiumSpec = require('./Admin/adminSubscriptionPremiumSpec');

var createReferralSpec = require('./CreateReferral/CreateReferralSpec');
var viewReferralSpec = require('./ViewReferral/ViewReferralSpec');
var createReferralAndInvitationSpec = require('./Registration/CreateReferralAndInvitationSpec');

describe('when user navigates to Sign In page', function() {
    commonActions.maximizeBrowser();
    
    beforeEach(function() {
        signInPage.open();
        commonExpects.expectProgressDivHidden();
        commonExpects.expectMenuHidden();
    });
    
    it('shows Sign In page with empty fields', function() {
      expect(signInPage.getEmail()).toEqual('');
      expect(signInPage.getPass()).toEqual('');
    });
    
    describe('when user tries to log in with invalid credentials', function() {
        beforeEach(function() {
            signInPage.setEmail(browser.params.login.wrong.email);
            signInPage.setPass(browser.params.login.wrong.pass);
            signInPage.clickLogin();
            commonExpects.expectProgressDivHidden();
        });
        
        it('shows error, keeps the email and erases the password', function() {
            commonExpects.expectMenuHidden();
            commonExpects.expectCurrentUrlToBe(signInPage.url);
            expect(signInPage.getEmail()).toEqual(browser.params.login.wrong.email);
            expect(signInPage.getPass()).toEqual('');
        });
    });
    
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
        createReferralSpec.run();
        viewReferralSpec.run();
        
        afterEach(function() {
            commonActions.signOut();
            commonExpects.expectProgressDivHidden();
            commonExpects.expectMenuHidden();
            commonExpects.expectCurrentUrlToBe(signInPage.url);
        });
    });
    
   createReferralAndInvitationSpec.run();
   adminPracticePremiumSpec.run();
   adminPracticeNonPremiumSpec.run();
   adminSubscriptionPremiumSpec.run();
    
});

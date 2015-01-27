var commonActions = require('./CommonActions');
var commonExpects = require('./CommonExpects');
var signInPage = require('./SignIn/SignInPage');
var historyPage = require('./History/HistoryPage');

var adminSpec = require('./Admin/AdminSpec');
var createReferralSpec = require('./CreateReferral/CreateReferralSpec');
var viewReferralSpec = require('./ViewReferral/ViewReferralSpec');

describe('when user navigates to Sign In page', function() {
    commonActions.maximizeBrowser();
    
    beforeEach(function() {
        signInPage.open();
        commonExpects.expectProgressDivHidden();
        commonExpects.expectMenuHidden();
    });
    
    it('shows Sign In page', function() {});
    
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
        
        adminSpec.run();
        createReferralSpec.run();
        viewReferralSpec.run();
        
        afterEach(function() {
            commonActions.signOut();
            commonExpects.expectProgressDivHidden();
            commonExpects.expectMenuHidden();
            commonExpects.expectCurrentUrlToBe(signInPage.url);
        });
    });
    
});

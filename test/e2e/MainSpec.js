var commonActions = require('./CommonActions');
var commonExpects = require('./CommonExpects');
var signInPage = require('./SignIn/SignInPage');
var historyPage = require('./History/HistoryPage');

var adminSpec = require('./Admin/AdminSpec');
var createReferralSpec = require('./CreateReferral/CreateReferralSpec');

describe('when user navigates to Sign In page', function() {
    commonActions.maximizeBrowser();
    
    beforeEach(function() {
        signInPage.open();
        commonExpects.expectProgressDivHidden();
        commonExpects.expectMenuHidden();
    });
    
    it('shows Sign In page', function() {});
    
    describe('when user tries to log in with invalid credentials', function() {
        var wrongEmail = 'qwerqwerqwer';
        var wrongPass = 'qwerqwerqwer';
        
        beforeEach(function() {
            signInPage.setEmail(wrongEmail);
            signInPage.setPass(wrongPass);
            signInPage.clickLogin();
            commonExpects.expectProgressDivHidden();
        });
        
        it('shows error, keeps the email and erases the password', function() {
            commonExpects.expectMenuHidden();
            commonExpects.expectCurrentUrlToBe(signInPage.url);
            signInPage.expectError();
            // TODO [ak] uncomment when #84990710 is fixed
            // expect(signInPage.getEmail()).toEqual(wrongEmail);
            // expect(signInPage.getPass()).toEqual('');
        });
        
    });
    
    describe('when user tries to log in with valid credentials', function() {
        beforeEach(function() {
            signInPage.setEmail(browser.params.login.user);
            signInPage.setPass(browser.params.login.pass);
            signInPage.clickLogin();
            commonExpects.expectProgressDivHidden();
        });
        
        it('shows the top menu and redirects to History page', function() {
            commonExpects.expectMenuShown();
            commonExpects.expectCurrentUrlToBe(historyPage.url);
        });
        
        adminSpec.run();
        createReferralSpec.run();
        
        afterEach(function() {
            commonActions.signOut();
            commonExpects.expectProgressDivHidden();
            commonExpects.expectMenuHidden();
            commonExpects.expectCurrentUrlToBe(signInPage.url);
        });
    });
    
});
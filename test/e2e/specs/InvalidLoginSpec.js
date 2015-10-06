var commonExpects = require('../commons/CommonExpects');
var signInPage = require('../pages/SignInPage');

var InvalidLoginSpec = function() {
    this.run = function() {
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
                commonExpects.expectErrorNotificationShown();
                expect(signInPage.getEmail()).toEqual(browser.params.login.wrong.email);
                expect(signInPage.getPass()).toEqual('');
            });
        });
    };
};

module.exports = new InvalidLoginSpec();

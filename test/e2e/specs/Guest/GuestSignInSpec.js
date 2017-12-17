var commonActions = require('../../commons/CommonActions');
var commonExpects = require('../../commons/CommonExpects');
var guestPage = require('../../pages/GuestPage');

var GuestSignInSpec = function() {
    this.run = function() {
        describe('came by reference', function() {

            beforeEach(function() {
                guestPage.openSignIn();
                commonExpects.expectProgressDivHidden();
            });

            it('show continue button for guest', function() {
                commonExpects.expectMenuHidden();
                commonExpects.expectCurrentUrlToBe(guestPage.guest_sign_in_url);

                expect(guestPage.continueGuestLink().isDisplayed()).toBe(true);
            });

            it('click continue button and show create guest referral page', function() {
                commonExpects.expectMenuHidden();
                commonExpects.expectCurrentUrlToBe(guestPage.guest_sign_in_url);

                guestPage.continueGuestLink().click();
                commonExpects.expectCurrentUrlToBe(guestPage.guest_referral_url);

                commonActions.clickLogo();
                browser.wait(EC.alertIsPresent(), 10000);
                var alertDialog = browser.switchTo().alert();
                alertDialog.accept();
            });
            
            afterEach(function() {
                commonExpects.expectConsoleWithoutErrors();
            });
        });
    };
};

module.exports = new GuestSignInSpec();

var commonExpects = require('../../commons/CommonExpects');
var guestActivateReferralPage = require('../../pages/GuestActivateReferralPage');
var signInPage = require('../../pages/SignInPage');

var GuestActivationErrorSpec = function() {
    this.run = function() {
        var invalidActivationToken = "invalid_activation_token";
        describe('guest tries to use the invalid activation token', function() {
            beforeEach(function() {
                guestActivateReferralPage.open(invalidActivationToken);
                commonExpects.expectProgressDivHidden();
                commonExpects.expectMenuHidden();
            });

            it('shows an error', function() {
                expect(guestActivateReferralPage.getErrorDiv().isPresent()).toBe(true);
                browser.wait(EC.elementToBeClickable(guestActivateReferralPage.getErrorCloseButton()), 5000);
                guestActivateReferralPage.getErrorCloseButton().click();
                commonExpects.expectCurrentUrlToBe(signInPage.url);
            });
            
            afterEach(function() {
                commonExpects.expectConsoleWithoutErrors({except: ["404"]}); // returned when referral is not found
            });
        });
    };
};

module.exports = new GuestActivationErrorSpec();

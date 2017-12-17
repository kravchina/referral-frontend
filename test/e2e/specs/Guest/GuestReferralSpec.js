var commonActions = require('../../commons/CommonActions');
var commonExpects = require('../../commons/CommonExpects');
var guestPage = require('../../pages/GuestPage');
var guestActivateReferralPage = require('../../pages/GuestActivateReferralPage');
var signInPage = require('../../pages/SignInPage');

var GuestReferralSpec = function() {
    this.run = function() {
        var emailAndActivationToken = (new Date()).getTime().toString();
        var guest = {
            firstName: 'GuestFirst',
            lastName: 'GuestLast',
            email: emailAndActivationToken + '@test.com'
        };

        var patient = {
            firstName: 'Mark',
            lastName: 'Pupkin',
            phone: '1111111111',
            birthday: '2/2/1968'
        };

        var referral = {
            provider: 'Trial User',
            referralType: 'Endodontics',
            procedure: 'Trauma'
        };
        describe('guest visits guest create referral page', function() {

            beforeEach(function() {
                guestPage.openReferral();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectMenuHidden();
                commonExpects.expectCurrentUrlToBe(guestPage.guest_referral_url);
            });

            it('shows the page fields', function() {
                expect(guestPage.guestFirstNameField().isPresent()).toBe(true);
                expect(guestPage.guestLastNameField().isPresent()).toBe(true);
                expect(guestPage.guestEmailNameField().isPresent()).toBe(true);

                expect(guestPage.patientFirstNameField().isPresent()).toBe(true);
                expect(guestPage.patientLastNameField().isPresent()).toBe(true);
                expect(guestPage.patientPhoneNameField().isPresent()).toBe(true);
                expect(guestPage.patientBirthdayNameField().isPresent()).toBe(true);

                expect(guestPage.practiceField().isPresent()).toBe(true);
                expect(guestPage.practiceField().isEnabled()).toBe(false);

                expect(guestPage.addressSelectField().isPresent()).toBe(true);
                expect(guestPage.addressSelectField().isEnabled()).toBe(false);

                expect(guestPage.destProviderSelectField().isPresent()).toBe(true);
                expect(guestPage.practiceTypeSelectField().isPresent()).toBe(true);
                expect(guestPage.procedureSelectField().isPresent()).toBe(true);

                commonActions.clickLogo();
                browser.wait(EC.alertIsPresent(), 10000);
                var alertDialog = browser.switchTo().alert();
                alertDialog.accept();

            });

            it('allows to Sign&Send and activate the referral', function() {
                // fill in fields and Sign&Send
                guestPage.guestFirstNameField().sendKeys(guest.firstName);
                guestPage.guestLastNameField().sendKeys(guest.lastName);
                guestPage.guestEmailNameField().sendKeys(guest.email);

                guestPage.patientFirstNameField().sendKeys(patient.firstName);
                guestPage.patientLastNameField().sendKeys(patient.lastName);
                guestPage.patientPhoneNameField().sendKeys(patient.phone);
                guestPage.patientBirthdayNameField().sendKeys(patient.birthday);

                expect(guestPage.practiceField().isEnabled()).toBe(false);

                guestPage.destProviderSelectField().element(by.cssContainingText("option", referral.provider)).click();
                expect(guestPage.destProviderSelectField().element(by.css("option:checked")).getText()).toEqual(referral.provider);

                guestPage.practiceTypeSelectField().element(by.cssContainingText("option", referral.referralType)).click();
                expect(guestPage.practiceTypeSelectField().element(by.css("option:checked")).getText()).toEqual(referral.referralType);

                guestPage.procedureSelectField().element(by.cssContainingText("option", referral.procedure)).click();
                expect(guestPage.procedureSelectField().element(by.css("option:checked")).getText()).toEqual(referral.procedure);

                expect(guestPage.getButtonSignSendElement().isEnabled()).toBe(true);
                guestPage.getButtonSignSendElement().click();
                
                // close the modal
                expect(guestPage.getGuestReferralSuccessModal().isDisplayed()).toBe(true);
                guestPage.getSuccessModalOkButton().click();
                
                commonExpects.expectProgressDivHidden();
                commonExpects.expectMenuHidden();
                commonExpects.expectCurrentUrlToBe(signInPage.url);
                
                // activate
                guestActivateReferralPage.open(emailAndActivationToken);
                guestActivateReferralPage.getOkButton().click();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectMenuHidden();
                commonExpects.expectCurrentUrlToBe(signInPage.url);
                
                // make sure the same referral cannot be activated again
                guestActivateReferralPage.open(emailAndActivationToken);
                expect(guestActivateReferralPage.getErrorDiv().isPresent()).toBe(true);
                browser.wait(EC.elementToBeClickable(guestActivateReferralPage.getErrorCloseButton()), 5000);
                guestActivateReferralPage.getErrorCloseButton().click();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectMenuHidden();
                commonExpects.expectCurrentUrlToBe(signInPage.url);
            });

            afterEach(function() {
                commonExpects.expectConsoleWithoutErrors({except: ["422"]}); // returned when referral is already activated
            });
        });
    };
};

module.exports = new GuestReferralSpec();

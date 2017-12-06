var commonActions = require('../../commons/CommonActions');
var commonExpects = require('../../commons/CommonExpects');
var guestPage = require('../../pages/GuestPage');

var GuestReferralSpec = function() {
    this.run = function() {
        var guest = {
            firstName: 'GuestFirst',
            lastName: 'GuestLast',
            email: 'guest@test.com'
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
        describe('referral page', function() {

            beforeEach(function() {
                guestPage.openReferral();
                commonExpects.expectProgressDivHidden();
            });

            it('show referral page', function() {
                commonExpects.expectMenuHidden();
                commonExpects.expectCurrentUrlToBe(guestPage.guest_referral_url);

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

            it('fill fields and click sing & send', function() {
                commonExpects.expectMenuHidden();
                commonExpects.expectCurrentUrlToBe(guestPage.guest_referral_url);

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

                expect(guestPage.getGuestReferralSuccessModal().isDisplayed()).toBe(true);
                guestPage.getSuccessModalOkButton().click();

            });

        });
    };
};

module.exports = new GuestReferralSpec();

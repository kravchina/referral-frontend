var commonExpects = require('../../../commons/CommonExpects');
var guestReferralPage = require('../../../pages/GuestReferralPage');
var createReferralPage = require('../../../pages/CreateReferralPage');

var GuestCreateRefferalSpec = function() {
    this.run = function() {
        var referral = {
            provider: 'First Available',
            referralType: 'Dental Lab',
            procedure: 'Other',
            tooth: 23
        };
        var patient = {
            firstName: 'Homer',
            lastName: 'Simpson',
            birthday: '1/1/1968'
        };
        describe('when guest navigates to create referral page', function() {
            beforeEach(function() {
                guestReferralPage.open();
                commonExpects.expectProgressDivHidden();
            });

            it('fill fields and create referral', function() {
                createReferralPage.getPatientCreateButton().click();
                browser.wait(EC.visibilityOf(createReferralPage.getPatientCreateModal()), 5000);

                createReferralPage.getPatientFirstNameModalElement().sendKeys(patient.firstName);
                createReferralPage.getPatientLastNameModalElement().sendKeys(patient.lastName);
                createReferralPage.getPatientBirthdayModalElement().sendKeys(patient.birthday);
                expect(createReferralPage.getPatientSaveModalButton().isEnabled()).toBe(true);

                createReferralPage.getPatientSaveModalButton().click();

                browser.wait(EC.stalenessOf(createReferralPage.getPatientCreateModal()), 5000);
                expect(createReferralPage.getPatientCreateModal().isPresent()).toBe(false);

                expect(createReferralPage.getPracticeElement().isEnabled()).toBe(false);
                expect(createReferralPage.getAddressElement().isEnabled()).toBe(false);

                createReferralPage.getProviderElement().element(by.cssContainingText("option", referral.provider)).click();
                createReferralPage.getReferralTypeElement().element(by.cssContainingText("option", referral.referralType)).click();
                createReferralPage.getProcedureElement().element(by.cssContainingText("option", referral.procedure)).click();

                expect(createReferralPage.getButtonSaveElement().isDisplayed()).toBe(false);
                expect(createReferralPage.getButtonSignSendElement().isEnabled()).toBe(true);

                if (browser.currentRunBrowserName != 'internet explorer') {
                    element.all(by.css('input[ng-click="toggleTooth(item)"]')).get(referral.tooth).click();
                } else {
                    // yes, in IE we should for some reason click on label o_O
                    element.all(by.css('input[ng-click="toggleTooth(item)"] ~ label')).get(referral.tooth).click();
                }
                expect(element.all(by.css('input[ng-click="toggleTooth(item)"]')).get(referral.tooth).getAttribute("checked")).toBeTruthy();

                createReferralPage.getButtonSignSendElement().click();

                browser.wait(EC.visibilityOf(guestReferralPage.getSuccessModal()), 5000);
                expect(guestReferralPage.getSuccessModal().isDisplayed()).toBe(true);
                guestReferralPage.getSuccessModalCloseButton().click();

            });
        });

    };
};

module.exports = new GuestCreateRefferalSpec();
var commonExpects = require('../../../commons/CommonExpects');
var createReferralPage = require('../../../pages/CreateReferralPage');

var CreateReferralFrontDeskSpec = function() {
    this.run = function() {
        var referral = {
            patient: "Marty McFly (1/1/68)",
            patientPart: "Marty",
            frontDeskEmail: "frontdesk@example.com",
            referralType: "General Dentistry",
            procedure: "Follow-up Care",
            tooth: 22
        };

        // TODO [ak] consider using this description format everywhere else
        describe('front desk fields are filled in and button Save clicked', function() {
            beforeEach(function() {
                // setting patient
                expect(createReferralPage.getPatientDropDownElement().isDisplayed()).toBe(false);
                createReferralPage.getPatientElement().sendKeys(referral.patientPart);
                expect(createReferralPage.getPatientDropDownElement().isDisplayed()).toBe(true);
                createReferralPage.getPatientDropDownFirstRowElement().click();
                expect(createReferralPage.getPatientDropDownElement().isDisplayed()).toBe(false);
                expect(createReferralPage.getPatientElement().getAttribute('value')).toEqual(referral.patient);

                // creating practice/provider invitation
                createReferralPage.getInviteProviderButton().click();
                expect(createReferralPage.getProviderDialogElement().isDisplayed()).toBe(true);
                createReferralPage.getProviderDialogFrontDeskRadioButton().click();
                createReferralPage.getFrontDeskDialogEmailElement().sendKeys(referral.frontDeskEmail);
                createReferralPage.getProviderDialogSendButton().click();
                expect(createReferralPage.getProviderDialogElement().isPresent()).toBe(false);

                // practice and provider elements get auto-filled
                expect(createReferralPage.getPracticeElement().getAttribute('value')).toEqual("-- pending registration --");
                expect(createReferralPage.getInvitedProviderElement().element(by.css("option:checked")).getText()).toEqual(referral.frontDeskEmail);

                // setting referral type
                createReferralPage.getReferralTypeElement().element(by.cssContainingText("option", referral.referralType)).click();
                expect(createReferralPage.getReferralTypeElement().element(by.css("option:checked")).getText()).toEqual(referral.referralType);

                // setting procedure
                createReferralPage.getProcedureElement().element(by.cssContainingText("option", referral.procedure)).click();
                expect(createReferralPage.getProcedureElement().element(by.css("option:checked")).getText()).toEqual(referral.procedure);

                // buttons get enabled
                expect(createReferralPage.getButtonSaveElement().isEnabled()).toBe(true);
                expect(createReferralPage.getButtonSignSendElement().isEnabled()).toBe(true);

                // checking a tooth
                if (browser.currentRunBrowserName != 'internet explorer') {
                    element.all(by.css('input[ng-click="toggleTooth(item)"]')).get(referral.tooth).click();
                } else {
                    // yes, in IE we should for some reason click on label o_O
                    element.all(by.css('input[ng-click="toggleTooth(item)"] ~ label')).get(referral.tooth).click();
                }
                expect(element.all(by.css('input[ng-click="toggleTooth(item)"]')).get(referral.tooth).getAttribute("checked")).toBeTruthy();

                // clicking Save
                createReferralPage.getButtonSaveElement().click();
            });

            it('redirect is done to front desk referral draft page and fields correspond to what was filled in', function() {
                commonExpects.expectCurrentUrlToContain(createReferralPage.url);

                expect(createReferralPage.getPatientElement().getAttribute('value')).toEqual(referral.patient);
                expect(createReferralPage.getPracticeElement().getAttribute('value')).toEqual("-- pending registration --");
                expect(createReferralPage.getInvitedProviderElement().element(by.css("option:checked")).getText()).toEqual(referral.frontDeskEmail);
                expect(createReferralPage.getReferralTypeElement().element(by.css("option:checked")).getText()).toEqual(referral.referralType);
                expect(createReferralPage.getProcedureElement().element(by.css("option:checked")).getText()).toEqual(referral.procedure);
                expect(element.all(by.css('input[ng-click="toggleTooth(item)"]')).get(referral.tooth).getAttribute("checked")).toBeTruthy();
            });
        });

    };
};

module.exports = new CreateReferralFrontDeskSpec();

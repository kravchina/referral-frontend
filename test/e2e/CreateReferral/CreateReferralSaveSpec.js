var commonExpects = require('../CommonExpects');
var createReferralPage = require('./CreateReferralPage');

var CreateReferralSaveSpec = function() {
    this.run = function() {
        var referral = {
            patient: "Marty McFly (1/1/68)",
            patientPart: "Marty",
            practice: "David Wolf, DDS, PC",
            practicePart: "David",
            provider: "Doctor Another",
            referralType: "General Dentistry",
            procedure: "Follow-up Care",
            tooth: 22
        };
        
        // TODO [ak] consider using this description format everywhere else
        describe('fields are filled in and button Save clicked', function() {
            beforeEach(function() {
                // setting patient
                expect(createReferralPage.getPatientDropDownElement().isDisplayed()).toBe(false);
                createReferralPage.getPatientElement().sendKeys(referral.patientPart);
                expect(createReferralPage.getPatientDropDownElement().isDisplayed()).toBe(true);
                createReferralPage.getPatientDropDownFirstRowElement().click();
                expect(createReferralPage.getPatientDropDownElement().isDisplayed()).toBe(false);
                expect(createReferralPage.getPatientElement().getAttribute('value')).toEqual(referral.patient);
                
                // setting practice
                expect(createReferralPage.getPracticeDropDownElement().isDisplayed()).toBe(false);
                createReferralPage.getPracticeElement().sendKeys(referral.practicePart);
                expect(createReferralPage.getPracticeDropDownElement().isDisplayed()).toBe(true);
                createReferralPage.getPracticeDropDownFirstRowElement().click();
                expect(createReferralPage.getPracticeDropDownElement().isDisplayed()).toBe(false);
                expect(createReferralPage.getPracticeElement().getAttribute('value')).toEqual(referral.practice);
                // provider and procedure selects get enabled
                expect(createReferralPage.getProviderElement().isEnabled()).toBe(true);
                expect(createReferralPage.getProcedureElement().isEnabled()).toBe(true);
                
                // setting provider
                createReferralPage.getProviderElement().element(by.cssContainingText("option", referral.provider)).click();
                expect(createReferralPage.getProviderElement().element(by.css("option:checked")).getText()).toEqual(referral.provider);
                
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
            
            it('redirect is done to referral draft page and fields correspond to what was filled in', function() {
                commonExpects.expectCurrentUrlToContain(createReferralPage.url);
                
                expect(createReferralPage.getPatientElement().getAttribute('value')).toEqual(referral.patient);
                expect(createReferralPage.getPracticeElement().getAttribute('value')).toEqual(referral.practice);
                expect(createReferralPage.getProviderElement().element(by.css("option:checked")).getText()).toEqual(referral.provider);
                expect(createReferralPage.getReferralTypeElement().element(by.css("option:checked")).getText()).toEqual(referral.referralType);
                expect(createReferralPage.getProcedureElement().element(by.css("option:checked")).getText()).toEqual(referral.procedure);
                expect(element.all(by.css('input[ng-click="toggleTooth(item)"]')).get(referral.tooth).getAttribute("checked")).toBeTruthy();
            });
        });
        
    };
};

module.exports = new CreateReferralSaveSpec();

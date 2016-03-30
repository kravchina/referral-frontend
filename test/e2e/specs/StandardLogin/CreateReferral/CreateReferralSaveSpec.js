var commonExpects = require('../../../commons/CommonExpects');
var createReferralPage = require('../../../pages/CreateReferralPage');

var CreateReferralSaveSpec = function() {
    this.run = function() {
        var referral = {
            patient: "Marty McFly (1/1/68)",
            patientPart: "Marty",
            practice: "David Wolf, DDS, PC",
            practiceAddress: "Milford, MA",
            practicePart: "David",
            provider: "Doctor Another",
            referralType: "General Dentistry",
            procedure: "Follow-up Care",
            tooth: 22
        };

        var patient = {
            firstName: 'Marty',
            lastName: 'McFly',
            birthday: '1/1/1968' // important: date should match Marty's birthday above
        };

        describe('check create patient', function(){
            it('check duplicate patient modal', function(){
                createReferralPage.getPatientCreateButton().click();
                expect(createReferralPage.getPatientCreateModal().isDisplayed()).toBe(true);

                createReferralPage.getPatientFirstNameModalElement().sendKeys(patient.firstName);
                createReferralPage.getPatientLastNameModalElement().sendKeys(patient.lastName);
                createReferralPage.getPatientBirthdayModalElement().sendKeys(patient.birthday);
                expect(createReferralPage.getPatientSaveModalButton().isEnabled()).toBe(true);

                createReferralPage.getPatientSaveModalButton().click();

                expect(createReferralPage.getDedupingModal().isDisplayed()).toBe(true);

                createReferralPage.getDedupingDiscardModalButton().click();
                createReferralPage.getPatientDiscardModalButton().click();

                expect(createReferralPage.getPatientCreateModal().isPresent()).toBe(false);
                expect(createReferralPage.getDedupingModal().isPresent()).toBe(false);

            });
        });

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

                // auto seting address
                expect(createReferralPage.getAddressElement().isEnabled()).toBe(false);
                expect(createReferralPage.getAddressElement().element(by.css("option:checked")).getText()).toEqual(referral.practiceAddress);

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

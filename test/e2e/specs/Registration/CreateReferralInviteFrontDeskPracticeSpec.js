var commonActions = require('../../commons/CommonActions');
var commonExpects = require('../../commons/CommonExpects');
var signInPage = require('../../pages/SignInPage');
var createReferralPage = require('../../pages/CreateReferralPage');
var registrationPage = require('../../pages/RegistrationPage');
var historyPage = require('../../pages/HistoryPage');
var subscriptionPage = require('../../pages/ChangeSubscriptionPage');

var CreateReferralFrontDeskSpec = function() {
    this.run = function(emailAndRegistrationToken, newUser, newPractice) {
        var referral = {
            patient: "Marty McFly (1/1/68)",
            patientPart: "Marty",
            procedure: "Follow-up Care",
            tooth: 22
        };
        
        // sign in as our main user -- practice admin
        signInPage.setEmail(browser.params.login.correct.email);
        signInPage.setPass(browser.params.login.correct.pass);
        signInPage.clickLogin();
        commonExpects.expectProgressDivHidden();
        commonExpects.expectMenuShown();
        
        createReferralPage.open();
        commonExpects.expectProgressDivHidden();
        commonExpects.expectCurrentUrlToBe(createReferralPage.url);

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
        createReferralPage.getFrontDeskDialogEmailElement().sendKeys(newUser.email);
        createReferralPage.getProviderDialogSendButton().click();
        expect(createReferralPage.getProviderDialogElement().isPresent()).toBe(false);

        // practice and provider elements get auto-filled
        expect(createReferralPage.getPracticeElement().getAttribute('value')).toEqual("-- pending registration --");
        expect(createReferralPage.getInvitedProviderElement().element(by.css("option:checked")).getText()).toEqual(newUser.email);

        // setting referral type
        createReferralPage.getReferralTypeElement().element(by.cssContainingText("option", newPractice.type)).click();
        expect(createReferralPage.getReferralTypeElement().element(by.css("option:checked")).getText()).toEqual(newPractice.type);

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
        
        // redirect is done to front desk referral draft page and fields correspond to what was filled in
        commonExpects.expectCurrentUrlToContain(createReferralPage.url);

        expect(createReferralPage.getPatientElement().getAttribute('value')).toEqual(referral.patient);
        expect(createReferralPage.getPracticeElement().getAttribute('value')).toEqual("-- pending registration --");
        expect(createReferralPage.getInvitedProviderElement().element(by.css("option:checked")).getText()).toEqual(newUser.email);
        expect(createReferralPage.getReferralTypeElement().element(by.css("option:checked")).getText()).toEqual(newPractice.type);
        expect(createReferralPage.getProcedureElement().element(by.css("option:checked")).getText()).toEqual(referral.procedure);
        expect(element.all(by.css('input[ng-click="toggleTooth(item)"]')).get(referral.tooth).getAttribute("checked")).toBeTruthy();
        
        commonActions.signOut();
        commonExpects.expectProgressDivHidden();
        commonExpects.expectMenuHidden();
        commonExpects.expectCurrentUrlToBe(signInPage.url);
        
        // visit registration page as new doctor
        registrationPage.open(emailAndRegistrationToken);
        
        // email is already filled in
        expect(registrationPage.getEmailElement().getAttribute('value')).toEqual(newUser.email);
        
        registrationPage.fillUserFields(newUser, true, false);
        registrationPage.fillPracticeFields(newPractice);
        
        registrationPage.getTNCElement().click();
        
        // register!
        registrationPage.getRegisterButtonElement().click();
        
        // redirect to a subscription plan selection page
        commonExpects.expectCurrentUrlToContain(subscriptionPage.url);
    };
};

module.exports = new CreateReferralFrontDeskSpec();

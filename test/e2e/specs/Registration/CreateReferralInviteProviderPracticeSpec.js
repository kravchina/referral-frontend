var commonActions = require('../../commons/CommonActions');
var commonExpects = require('../../commons/CommonExpects');
var signInPage = require('../../pages/SignInPage');
var createReferralPage = require('../../pages/CreateReferralPage');
var viewReferralPage = require('../../pages/ViewReferralPage');
var registrationPage = require('../../pages/RegistrationPage');
var historyPage = require('../../pages/HistoryPage');
var subscriptionPage = require('../../pages/ChangeSubscriptionPage');

var CreateReferralInviteProviderPracticeSpec = function() {
    this.run = function(emailAndRegistrationToken, newUser, newPractice) {
        var teethCount = 52; // arrrrr!
        var referral = {
            // TODO [ak] put into some kind of test data service?
            patient: "Marty McFly (1/1/68)",
            patientPart: "Marty",
            // referralType == newPractice.type
            procedure: "Follow-up Care",
            selectedTooth: 22
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
        
        // TODO [ak] share the code between various CreateReferral specs. Lots of duplication
        
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
        createReferralPage.getProviderDialogFirstNameElement().sendKeys(newUser.firstName);
        createReferralPage.getProviderDialogLastNameElement().sendKeys(newUser.lastName);
        createReferralPage.getProviderDialogEmailElement().sendKeys(newUser.email);
        createReferralPage.getProviderDialogSendButton().click();
        expect(createReferralPage.getProviderDialogElement().isPresent()).toBe(false);
        // practice and provider elements get auto-filled
        expect(createReferralPage.getPracticeElement().getAttribute('value')).toEqual("-- pending registration --");
        expect(createReferralPage.getInvitedProviderElement().element(by.css("option:checked")).getText()).toEqual("Dr. " + newUser.firstName + " " + newUser.lastName);
        
        // setting referral type
        createReferralPage.getReferralTypeElement().element(by.cssContainingText("option", newPractice.type)).click();
        expect(createReferralPage.getReferralTypeElement().element(by.css("option:checked")).getText()).toEqual(newPractice.type);
        
        // procedure select gets enabled
        expect(createReferralPage.getProcedureElement().isEnabled()).toBe(true);
        
        // setting procedure
        createReferralPage.getProcedureElement().element(by.cssContainingText("option", referral.procedure)).click();
        expect(createReferralPage.getProcedureElement().element(by.css("option:checked")).getText()).toEqual(referral.procedure);
        
        // buttons get enabled
        expect(createReferralPage.getButtonSaveElement().isEnabled()).toBe(true);
        expect(createReferralPage.getButtonSignSendElement().isEnabled()).toBe(true);

        // checking a tooth
        if (browser.currentRunBrowserName != 'internet explorer') { // TODO [ak] create some constants for browser name strings
            element.all(by.css('input[ng-click="toggleTooth(item)"]')).get(referral.selectedTooth).click();
        } else {
            // yes, in IE we should for some reason click on label o_O
            element.all(by.css('input[ng-click="toggleTooth(item)"] ~ label')).get(referral.selectedTooth).click();
        }
        expect(element.all(by.css('input[ng-click="toggleTooth(item)"]')).get(referral.selectedTooth).getAttribute("checked")).toBeTruthy();
        
        // sending
        createReferralPage.getButtonSignSendElement().click();
        
        // page is reloaded to View Referral
        commonExpects.expectCurrentUrlToContain(viewReferralPage.url); // TODO [ak] get and save created referral id
        
        // close the dialog
        expect(createReferralPage.getCreationConfirmationDialogElement().isDisplayed()).toBe(true);
        createReferralPage.getCreationConfirmationDialogCloseButton().click();
        browser.wait(EC.stalenessOf(createReferralPage.getCreationConfirmationDialogElement()), 5000);
        expect(createReferralPage.getCreationConfirmationDialogElement().isPresent()).toBe(false);
        
        // TODO [ak] fields are filled with referral info
        
        commonActions.signOut();
        commonExpects.expectProgressDivHidden();
        commonExpects.expectMenuHidden();
        commonExpects.expectCurrentUrlToBe(signInPage.url);
        
        // visit registration page as new doctor
        registrationPage.open(emailAndRegistrationToken);
        
        // TODO [ak] you have 1 pending referrals
        
        expect(registrationPage.getPromoElement().isPresent()).toBe(false);
        expect(registrationPage.getEmailElement().isEnabled()).toBe(true);
        expect(registrationPage.getRoleElements().isEnabled()).toEqual([true, true]);
        
        // first, last and email are already filled in
        expect(registrationPage.getFirstNameElement().getAttribute('value')).toEqual(newUser.firstName);
        expect(registrationPage.getLastNameElement().getAttribute('value')).toEqual(newUser.lastName);
        expect(registrationPage.getEmailElement().getAttribute('value')).toEqual(newUser.email);
        
        registrationPage.fillUserFields(newUser, false, false);
        registrationPage.fillPracticeFields(newPractice);
        
        registrationPage.getTNCElement().click();
        
        // register!
        registrationPage.getRegisterButtonElement().click();
        
        // redirect to a subscription plan selection page
        commonExpects.expectCurrentUrlToContain(subscriptionPage.url);
        
        // check that the new user sees the newly sent referral
        commonActions.clickLogo();
        commonExpects.expectCurrentUrlToBe(historyPage.url);
        
        element.all(by.repeater('referral in referrals')).first().click();
        commonExpects.expectCurrentUrlToContain(viewReferralPage.url);
        
        // verifying all fields' values
        expect(viewReferralPage.getPatientValue()).toEqual(referral.patient);
        expect(viewReferralPage.getFromUserValue()).toEqual(
            browser.params.login.correct.firstName + ' ' + browser.params.login.correct.middleInitial + ' ' + browser.params.login.correct.lastName
        ); // yeah, View Referral page displays two spaces if there's no middle :)
        expect(viewReferralPage.getFromPracticeValue()).toEqual(
            browser.params.login.correct.practice.name + ' (' + browser.params.login.correct.practice.address + ', ' + browser.params.login.correct.practice.city + ', ' + browser.params.login.correct.practice.state + ')'
        );
        expect(viewReferralPage.getToUserValue()).toEqual(
            newUser.firstName + ' ' + newUser.middleInitial + ' ' + newUser.lastName
        ); // yeah, View Referral page displays two spaces if there's no middle :)
        expect(viewReferralPage.getToPracticeValue()).toEqual(newPractice.name + ' (' + newPractice.address.city + ', ' + newPractice.address.short_state + ')');
        expect(viewReferralPage.getReferralTypeValue()).toEqual(newPractice.type);
        expect(viewReferralPage.getProcedureValue()).toEqual(referral.procedure);
        for (var t = 0; t < teethCount; ++t) {
            var checked = viewReferralPage.isTeethCheckedByIndex(t);
            if (t === referral.selectedTooth) {
                expect(checked).toBeTruthy();
            } else {
                expect(checked).toBeFalsy();
            }
        }
    };
};

module.exports = new CreateReferralInviteProviderPracticeSpec();

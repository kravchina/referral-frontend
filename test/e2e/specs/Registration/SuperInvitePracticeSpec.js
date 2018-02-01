var commonActions = require('../../commons/CommonActions');
var commonExpects = require('../../commons/CommonExpects');
var signInPage = require('../../pages/SignInPage');
var registrationPage = require('../../pages/RegistrationPage');
var consolePracticePage = require('../../pages/ConsolePracticePage');
var subscriptionPage = require('../../pages/ChangeSubscriptionPage');

var SuperInvitePracticeSpec = function(emailAndRegistrationToken, newUser, newPractice) {
    this.run = function(emailAndRegistrationToken, newUser, newPractice) {
        // sign in as the superuser
        signInPage.setEmail(browser.params.login.super_user.email);
        signInPage.setPass(browser.params.login.super_user.pass);
        signInPage.clickLogin();
        commonExpects.expectProgressDivHidden();
        commonExpects.expectMenuShown();

        consolePracticePage.open();
        commonExpects.expectProgressDivHidden();
        commonExpects.expectCurrentUrlToBe(consolePracticePage.url);
        
        // find our main test practice
        expect(consolePracticePage.getPracticeDropDownElement().isDisplayed()).toBe(false);
        consolePracticePage.setPractice(browser.params.login.correct.practice.name);
        expect(consolePracticePage.getPracticeDropDownElement().isDisplayed()).toBe(true);
        consolePracticePage.getPracticeDropDownFirstRowElement().click();
        expect(consolePracticePage.getPracticeDropDownElement().isDisplayed()).toBe(false);

        // find the main test user
        consolePracticePage.getUser().click();
        expect(consolePracticePage.getUserOptionByName(browser.params.login.correct.firstName + ' ' + browser.params.login.correct.lastName).isDisplayed()).toBe(true);
        consolePracticePage.getUserOptionByName(browser.params.login.correct.firstName + ' ' + browser.params.login.correct.lastName).click();

        // invite on behalf of that user
        consolePracticePage.getInviteDialogButton().click();
        expect(consolePracticePage.getInviteDialog().isDisplayed()).toBe(true);

        consolePracticePage.getInviteDialogFirstName().sendKeys(newUser.firstName);
        consolePracticePage.getInviteDialogLastName().sendKeys(newUser.lastName);
        consolePracticePage.getInviteDialogEmail().sendKeys(newUser.email);
        consolePracticePage.getInviteDialogSendButton().click();
        browser.wait(EC.not(EC.visibilityOf(consolePracticePage.getInviteDialog(), 30000)));
        commonExpects.expectSuccessNotificationShown();
        
        commonActions.signOut();
        commonExpects.expectProgressDivHidden();
        commonExpects.expectMenuHidden();
        commonExpects.expectCurrentUrlToBe(signInPage.url);

        // visit registration page as new doctor
        registrationPage.open(emailAndRegistrationToken);

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
    };
};

module.exports = new SuperInvitePracticeSpec();

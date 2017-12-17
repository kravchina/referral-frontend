var commonActions = require('../../commons/CommonActions');
var commonExpects = require('../../commons/CommonExpects');
var signInPage = require('../../pages/SignInPage');
var registrationPage = require('../../pages/RegistrationPage');
var consolePracticePage = require('../../pages/ConsolePracticePage');
var subscriptionPage = require('../../pages/ChangeSubscriptionPage');
var historyPage = require('../../pages/HistoryPage');
var adminUsersPage = require('../../pages/AdminUsersPage');

var SuperInviteUserSpec = function(emailAndRegistrationToken, newUser, newPractice) {
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
        
        // TODO [ak] below the code for New User dialog is reused from AdminUsersPage. This test has nothing to do with that page, only dialog is reused. Put the dialog into the separate page object
        // invite new user to this practice
        adminUsersPage.getAddUserButton().click();
        browser.wait(EC.visibilityOf(adminUsersPage.getAddModal(), 30000));
        adminUsersPage.getAddModalFirstNameElement().sendKeys(newUser.firstName);
        adminUsersPage.getAddModalLastNameElement().sendKeys(newUser.lastName);
        adminUsersPage.getAddModalEmailElement().sendKeys(newUser.email);
        // TODO [ak] set or check the "invite/nologin" and roles radios
        adminUsersPage.getAddModalSendInviteButton().click();
        browser.wait(EC.not(EC.visibilityOf(adminUsersPage.getAddModal(), 30000)));
        // commonExpects.expectSuccessNotificationShown(); // strangely, no success notification here
        
        commonActions.signOut();
        commonExpects.expectProgressDivHidden();
        commonExpects.expectMenuHidden();
        commonExpects.expectCurrentUrlToBe(signInPage.url);

        // visit registration page as new doctor
        registrationPage.open(emailAndRegistrationToken);

        // first, last and email are already filled in
        expect(registrationPage.getFirstNameElement().getAttribute('value')).toEqual(newUser.firstName);
        expect(registrationPage.getLastNameElement().getAttribute('value')).toEqual(newUser.lastName);
        expect(registrationPage.getEmailElement().getAttribute('value')).toEqual(newUser.email);

        // practice details not show on this page
        expect(registrationPage.getPracticeNameElement().isPresent()).toBe(false);
        
        registrationPage.fillUserFields(newUser, false, false);
        
        registrationPage.getTNCElement().click();

        // register!
        registrationPage.getRegisterButtonElement().click();

        // closing a successful registration dialog with OK
        expect(registrationPage.getSuccessfulDialogElement().isDisplayed()).toBe(true);
        registrationPage.getSuccessfulDialogOKButtonElement().click();
        expect(registrationPage.getSuccessfulDialogElement().isPresent()).toBe(false);

        // user is automatically logged in
        commonExpects.expectCurrentUrlToBe(historyPage.url);
    };
};

module.exports = new SuperInviteUserSpec();

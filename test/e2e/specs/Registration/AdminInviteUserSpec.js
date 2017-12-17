var commonExpects = require('../../commons/CommonExpects');
var commonActions = require('../../commons/CommonActions');
var adminUsersPage = require('../../pages/AdminUsersPage');
var historyPage = require('../../pages/HistoryPage');
var signInPage = require('../../pages/SignInPage');
var registrationPage = require('../../pages/RegistrationPage');

var AdminUsersSpec = function() {
    this.run = function(emailAndRegistrationToken, newUser) {
        // sign in as our main user -- practice admin
        signInPage.setEmail(browser.params.login.correct.email);
        signInPage.setPass(browser.params.login.correct.pass);
        signInPage.clickLogin();
        commonExpects.expectProgressDivHidden();
        commonExpects.expectMenuShown();
        
        // create colleague invitation and register
        adminUsersPage.open();
        commonExpects.expectProgressDivHidden();
        commonExpects.expectCurrentUrlToBe(adminUsersPage.url);
        // show add user invitation modal
        adminUsersPage.getAddUserButton().click();
        expect(adminUsersPage.getAddModal().isDisplayed()).toBe(true);
        // creating user invitation
        adminUsersPage.getAddModalFirstNameElement().sendKeys(newUser.firstName);
        adminUsersPage.getAddModalLastNameElement().sendKeys(newUser.lastName);
        adminUsersPage.getAddModalEmailElement().sendKeys(newUser.email);
        adminUsersPage.getAddModalAdminRadioElement().click();
        //adminUsersPage.getAddModalSpecialtyElement().element(by.cssContainingText("option", newUser.specialty)).click();
        // close the dialog
        expect(adminUsersPage.getAddModalSendInviteButton().isEnabled()).toBe(true);
        adminUsersPage.getAddModalSendInviteButton().click();

        browser.wait(EC.stalenessOf(adminUsersPage.getAddModal()), 5000);
        expect(adminUsersPage.getAddModal().isPresent()).toBe(false);
        expect(adminUsersPage.getInviteUserResultModal().isPresent()).toBe(true);
        browser.wait(EC.visibilityOf(adminUsersPage.getInviteUserResultModal()), 5000);
        adminUsersPage.getInviteUserResultOkButton().click();
        browser.wait(EC.stalenessOf(adminUsersPage.getInviteUserResultModal()), 5000);
        expect(adminUsersPage.getInviteUserResultModal().isPresent()).toBe(false);

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

module.exports = new AdminUsersSpec();

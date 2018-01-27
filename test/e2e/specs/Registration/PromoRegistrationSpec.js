var commonActions = require('../../commons/CommonActions');
var commonExpects = require('../../commons/CommonExpects');
var commonMenu = require('../../commons/CommonMenu');
var signInPage = require('../../pages/SignInPage');
var registrationPage = require('../../pages/RegistrationPage');
var historyPage = require('../../pages/HistoryPage');
var consolePracticePage = require('../../pages/ConsolePracticePage');
var adminPracticePage = require('../../pages/AdminPracticePage');

var PromoRegistrationSpec = function() {
    this.run = function(newUser, newPractice) {
        // registering
        registrationPage.openPromo('getstarted');
        
        expect(registrationPage.getPromoElement().isPresent()).toBe(true);
        expect(registrationPage.getEmailElement().isEnabled()).toBe(true);
        expect(registrationPage.getRoleElements().isEnabled()).toEqual([true, true]);
        
        registrationPage.fillUserFields(newUser, true, true);
        registrationPage.fillPracticeFields(newPractice);
        registrationPage.getTNCElement().click();
        registrationPage.getPromoRegisterButtonElement().click();

        // waiting for a successful registration dialog and clicking OK
        browser.wait(EC.elementToBeClickable(registrationPage.getSuccessfulDialogOKButtonElement()), 30000);
        registrationPage.getSuccessfulDialogOKButtonElement().click();
        expect(registrationPage.getSuccessfulDialogElement().isPresent()).toBe(false);
        commonExpects.expectCurrentUrlToBe(signInPage.url);
        
        // check that new user cannot log in yet
        signInPage.setEmail(newUser.email);
        signInPage.setPass(newUser.password);
        signInPage.clickLogin();
        commonExpects.expectProgressDivHidden();
        commonExpects.expectMenuHidden();
        commonExpects.expectCurrentUrlToBe(signInPage.url);
        commonExpects.expectErrorNotificationShown();
        expect(signInPage.getEmail()).toEqual(newUser.email);
        expect(signInPage.getPass()).toEqual('');
        
        // log in as superuser
        signInPage.setEmail(browser.params.login.super_user.email);
        signInPage.setPass(browser.params.login.super_user.pass);
        signInPage.clickLogin();
        commonExpects.expectProgressDivHidden();
        commonExpects.expectMenuShown();
        commonExpects.expectCurrentUrlToBe(historyPage.url);
        
        // navigate to Practice Console
        consolePracticePage.open();
        commonExpects.expectProgressDivHidden();
        commonExpects.expectCurrentUrlToBe(consolePracticePage.url);
        
        // find the new practice and approve it
        consolePracticePage.setPractice(newPractice.name);
        consolePracticePage.getPracticeDropDownFirstRowElement().click();
        expect(consolePracticePage.getPracticeApproveButton().isDisplayed()).toBe(true);
        consolePracticePage.getPracticeApproveButton().click();
        commonExpects.expectSuccessNotificationShown();
        
        // log out
        commonActions.signOut();
        commonExpects.expectProgressDivHidden();
        commonExpects.expectMenuHidden();
        commonExpects.expectCurrentUrlToBe(signInPage.url);
        
        // log in as the new user
        signInPage.setEmail(newUser.email);
        signInPage.setPass(newUser.password);
        signInPage.clickLogin();
        commonExpects.expectProgressDivHidden();
        commonExpects.expectMenuShown();
        commonExpects.expectCurrentUrlToBe(historyPage.url);
    };
};

module.exports = new PromoRegistrationSpec();

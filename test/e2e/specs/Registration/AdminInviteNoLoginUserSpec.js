var commonExpects = require('../../commons/CommonExpects');
var commonActions = require('../../commons/CommonActions');
var adminUsersPage = require('../../pages/AdminUsersPage');
var historyPage = require('../../pages/HistoryPage');
var signInPage = require('../../pages/SignInPage');
var addPasswordPage = require('../../pages/AddPasswordPage');

var AdminInviteNoLoginUserSpec = function() {
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
        // creating a no-login user
        adminUsersPage.getAddModalFirstNameElement().sendKeys(newUser.firstName);
        adminUsersPage.getAddModalLastNameElement().sendKeys(newUser.lastName);
        adminUsersPage.getRadioNoLoginElement().click();

        // close the dialog
        expect(adminUsersPage.getAddModalSaveButton().isEnabled()).toBe(true);
        adminUsersPage.getAddModalSaveButton().click();

        browser.wait(EC.stalenessOf(adminUsersPage.getAddModal()), 5000);
        expect(adminUsersPage.getAddModal().isPresent()).toBe(false);
        
        // open the set password dialog for the no-login user
        element.all(by.xpath('//tr[td[text()="' + newUser.firstName + ' ' + newUser.middleInitial + ' ' + newUser.lastName + '"]]/td[@class="cell-created"]/div[@class="button-block btn-change-password"]')).first().click();
        browser.wait(EC.visibilityOf(adminUsersPage.getAddPasswordModalForm()), 5000);
        
        // fill in the email and save
        adminUsersPage.getAddPasswordModalEmailElement().sendKeys(newUser.email);
        adminUsersPage.getAddPasswordSaveButton().click();
        browser.wait(EC.not(EC.visibilityOf(adminUsersPage.getAddPasswordModalForm())), 5000);
        commonExpects.expectSuccessNotificationShown();
        
        // log out
        commonActions.signOut();
        commonExpects.expectProgressDivHidden();
        commonExpects.expectMenuHidden();
        commonExpects.expectCurrentUrlToBe(signInPage.url);
        
        // visit the add password page as the new user, fill in the password, submit
        addPasswordPage.open(emailAndRegistrationToken);
        commonExpects.expectProgressDivHidden();
        expect(addPasswordPage.getPasswordElement().getAttribute('value')).toEqual('');
        expect(addPasswordPage.getPasswordConfirmationElement().getAttribute('value')).toEqual('');
        addPasswordPage.fillPasswordFields(newUser.password);
        addPasswordPage.getSubmitButtonElement().click();
        
        // user gets logged in and sees History
        commonExpects.expectProgressDivHidden();
        commonExpects.expectCurrentUrlToBe(historyPage.url);
    };
};

module.exports = new AdminInviteNoLoginUserSpec();

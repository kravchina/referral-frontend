var commonExpects = require('../../../commons/CommonExpects');
var commonActions = require('../../../commons/CommonActions');
var adminUsersPage = require('../../../pages/AdminUsersPage');
var historyPage = require('../../../pages/HistoryPage');
var signInPage = require('../../../pages/SignInPage');
var registrationPage = require('../../../pages/RegistrationPage');

var AdminUsersSpec = function() {
    this.run = function() {
        describe('when user navigates to Admin Users', function() {
            beforeEach(function() {
                adminUsersPage.open();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectCurrentUrlToBe(adminUsersPage.url);
            });
            
            it('shows Users page', function() {
                expect(element(by.css('th.cell-user')).isDisplayed()).toBe(true);
            });

            it('check delete user action', function(){
                adminUsersPage.getAllDeleteButtons().each(function(item){
                    item.click();
                    expect(adminUsersPage.getAllActiveDeleteButtons().count()).toBe(1);
                });
                browser.sleep(200);
                adminUsersPage.getLastActiveNoButton().click();
                expect(adminUsersPage.getAllActiveDeleteButtons().count()).toBe(0);
            });

            it('check salutation, addresses, is_admin checkbox is present on edit user dialog', function() {
                element.all(by.css('[ng-repeat="user in practice.users.concat(invitedUsers)"]')).filter(function (item) {
                    return item.all(by.css('td')).get(1).getText().then(function (text) {
                        return text == browser.params.login.correct.email;
                    });
                }).then(function (rows) {
                    rows[0].element(by.css('.dlicons-pencil')).click();
                    element(by.css('.modal-dialog')).isDisplayed().then(function () {
                        expect(adminUsersPage.getEditModalIsAdminCheckbox()).toBeTruthy();
                        expect(adminUsersPage.getEditModalFirstAddress().isEnabled()).toBe(false);
                        expect(adminUsersPage.getEditModalFirstAddress().getAttribute('checked')).toBeTruthy();
                        expect(adminUsersPage.getEditModalSalutation().isPresent()).toBe(true);
                        adminUsersPage.getEditModalDiscardButton().click();
                    });
                });
            });

            it('opens edit other user dialog, changes email, saves it successfully and stays logged in', function(){
                element.all(by.css('[ng-repeat="user in practice.users.concat(invitedUsers)"]'))
                    .then(function (rows) {
                    rows[1].element(by.css('.dlicons-pencil')).click();
                    element(by.css('.modal-dialog')).isDisplayed().then(function () {
                        adminUsersPage.setEmail('other@update.email');
                        adminUsersPage.getEditModalSaveButton().click().then(function(){
                            commonExpects.expectSuccessNotificationShown();
                            commonExpects.expectCurrentUrlToBe(adminUsersPage.url);
                            commonActions.clickLogo();
                            commonExpects.expectCurrentUrlToBe(historyPage.url);
                        });

                    });
                });
            });

            it('create colleague invitation and register', function(){
                var emailAndRegistrationToken = (new Date()).getTime().toString();
                var newColleague = {
                    salutation: "Mr.",
                    firstName: "Smith",
                    middleInitial: "X",
                    lastName: "Brown",
                    email: emailAndRegistrationToken + "@example.com",
                    password: "12345678",
                    specialty: 'General Dentistry'
                };

                // show add user invitation modal
                adminUsersPage.getAddUserButton().click();
                expect(adminUsersPage.getAddModal().isDisplayed()).toBe(true);
                // creating user invitation
                adminUsersPage.getAddModalFirstNameElement().sendKeys(newColleague.firstName);
                adminUsersPage.getAddModalLastNameElement().sendKeys(newColleague.lastName);
                adminUsersPage.getAddModalEmailElement().sendKeys(newColleague.email);
                adminUsersPage.getAddModalAdminRadioElement().click();
                //adminUsersPage.getAddModalSpecialtyElement().element(by.cssContainingText("option", newColleague.specialty)).click();
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

                registrationPage.getSalutationElement().element(by.cssContainingText("option", newColleague.salutation)).click();

                // first and last names are already filled in
                expect(registrationPage.getFirstNameElement().getAttribute('value')).toEqual(newColleague.firstName);
                expect(registrationPage.getLastNameElement().getAttribute('value')).toEqual(newColleague.lastName);

                registrationPage.getMiddleInitialElement().sendKeys(newColleague.middleInitial);

                // email already filled in
                expect(registrationPage.getEmailElement().getAttribute('value')).toEqual(newColleague.email);

                // practice details not show on this page
                expect(registrationPage.getPracticeNameElement().isPresent()).toBe(false);

                registrationPage.getPasswordElement().sendKeys(newColleague.password);
                registrationPage.getPasswordConfirmationElement().sendKeys(newColleague.password);
                registrationPage.getTNCElement().click();

                // register!
                registrationPage.getRegisterButtonElement().click();

                // closing a successful registration dialog with OK
                expect(registrationPage.getSuccessfulDialogElement().isDisplayed()).toBe(true);
                registrationPage.getSuccessfulDialogOKButtonElement().click();
                expect(registrationPage.getSuccessfulDialogElement().isPresent()).toBe(false);

            });
        });
    };
};

module.exports = new AdminUsersSpec();
